#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Multi-Account Email Review via IMAP - Interactive Version
Prompts for credentials securely using getpass
"""

import sys
import io
import imaplib
import email
from email.header import decode_header
import datetime
import json
import getpass
import os
from typing import List, Dict, Any
from collections import defaultdict

# Fix Windows encoding issues
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

# Account configurations
ACCOUNTS = {
    "hotmail": {
        "email": "noemisanalex@hotmail.com",
        "server": "imap-mail.outlook.com",
        "port": 993
    },
    "aigestion": {
        "email": "admin@aigestion.net",
        "server": "imap.gmail.com",
        "port": 993
    },
    "gmail": {
        "email": "noemisanalex@gmail.com",
        "server": "imap.gmail.com",
        "port": 993
    }
}

def decode_mime_words(s):
    """Decode MIME encoded strings"""
    if not s:
        return ""
    try:
        decoded_fragments = decode_header(s)
        return ''.join(
            str(t[0], t[1] or 'utf-8') if isinstance(t[0], bytes) else str(t[0])
            for t in decoded_fragments
        )
    except:
        return str(s)

def connect_imap(server: str, port: int, email_addr: str, password: str):
    """Connect to IMAP server"""
    try:
        mail = imaplib.IMAP4_SSL(server, port)
        mail.login(email_addr, password)
        return mail
    except Exception as e:
        print(f"❌ Failed to connect to {email_addr}: {e}")
        return None

def get_recent_emails(mail, days: int = 7, max_emails: int = 50):
    """Fetch recent emails from INBOX"""
    try:
        mail.select("INBOX")
        
        # Search for emails from last N days
        since_date = (datetime.datetime.now() - datetime.timedelta(days=days)).strftime("%d-%b-%Y")
        result, data = mail.search(None, f'SINCE {since_date}')
        
        if result != 'OK':
            return []
        
        email_ids = data[0].split()
        email_ids = email_ids[-max_emails:]  # Get last N emails
        
        emails = []
        for email_id in email_ids:
            try:
                result, msg_data = mail.fetch(email_id, '(RFC822)')
                if result != 'OK':
                    continue
                
                raw_email = msg_data[0][1]
                msg = email.message_from_bytes(raw_email)
                
                # Extract key fields
                subject = decode_mime_words(msg.get('Subject', ''))
                from_addr = decode_mime_words(msg.get('From', ''))
                date_str = msg.get('Date', '')
                
                # Get body preview
                body = ""
                if msg.is_multipart():
                    for part in msg.walk():
                        if part.get_content_type() == "text/plain":
                            try:
                                body = part.get_payload(decode=True).decode('utf-8', errors='ignore')[:500]
                                break
                            except:
                                pass
                else:
                    try:
                        body = msg.get_payload(decode=True).decode('utf-8', errors='ignore')[:500]
                    except:
                        pass
                
                emails.append({
                    'id': email_id.decode(),
                    'subject': subject,
                    'from': from_addr,
                    'date': date_str,
                    'body_preview': body
                })
            except Exception as e:
                print(f"⚠️  Error processing email {email_id}: {e}")
                continue
        
        return emails
    except Exception as e:
        print(f"❌ Error fetching emails: {e}")
        return []

def categorize_email(email_data: Dict) -> str:
    """Categorize email by content"""
    subject = email_data['subject'].lower()
    from_addr = email_data['from'].lower()
    
    # Cloud/Deployment alerts
    if any(k in from_addr for k in ['google', 'cloud', 'gcp', 'github', 'vercel', 'cloudrun']):
        if any(k in subject for k in ['deploy', 'build', 'error', 'alert', 'failed', 'success']):
            return 'deployment'
        return 'cloud_service'
    
    # AIGestion related
    if 'aigestion' in from_addr or 'aigestion' in subject:
        return 'aigestion'
    
    # Personal/Family
    if any(k in from_addr for k in ['hotmail', 'gmail', 'yahoo', 'outlook']):
        return 'personal'
    
    # Notifications
    if any(k in subject for k in ['notification', 'alert', 'reminder', 'update']):
        return 'notification'
    
    return 'other'

def analyze_account(account_name: str, config: Dict, password: str = None) -> Dict[str, Any]:
    """Analyze emails for a single account"""
    print(f"\n{'='*60}")
    print(f"📧 Analyzing: {config['email']}")
    print(f"{'='*60}")
    
    # Get password if not provided
    if not password:
        password = getpass.getpass(f"Enter App Password for {config['email']} (or press Enter to skip): ")
        if not password:
            print(f"⚠️  Skipping {config['email']}")
            return {
                'account': account_name,
                'email': config['email'],
                'status': 'skipped',
                'reason': 'No password provided'
            }
    
    # Connect
    mail = connect_imap(config['server'], config['port'], config['email'], password)
    if not mail:
        return {
            'account': account_name,
            'email': config['email'],
            'status': 'failed',
            'reason': 'Connection failed'
        }
    
    # Fetch emails
    emails = get_recent_emails(mail, days=7, max_emails=50)
    mail.logout()
    
    # Categorize
    categories = defaultdict(list)
    for email_data in emails:
        category = categorize_email(email_data)
        categories[category].append(email_data)
    
    print(f"✅ Found {len(emails)} emails in last 7 days")
    for category, items in categories.items():
        print(f"   📁 {category}: {len(items)} emails")
    
    return {
        'account': account_name,
        'email': config['email'],
        'status': 'success',
        'total_emails': len(emails),
        'categories': dict(categories),
        'emails': emails
    }

def generate_report(results: List[Dict]) -> str:
    """Generate markdown report"""
    report = ["# 📧 Email Review Report", ""]
    report.append(f"**Generated:** {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    report.append(f"**Period:** Last 7 days")
    report.append("")
    
    for result in results:
        report.append(f"## {result['email']}")
        report.append("")
        
        if result['status'] != 'success':
            report.append(f"❌ **Status:** {result['status']} - {result.get('reason', 'Unknown')}")
            report.append("")
            continue
        
        report.append(f"✅ **Total Emails:** {result['total_emails']}")
        report.append("")
        
        # Category breakdown
        report.append("### 📊 Categories")
        for category, emails in result['categories'].items():
            report.append(f"- **{category.upper()}**: {len(emails)} emails")
        report.append("")
        
        # Recent highlights
        report.append("### 🔍 Recent Highlights")
        for category, emails in result['categories'].items():
            if category in ['deployment', 'aigestion', 'cloud_service']:
                report.append(f"\n#### {category.upper()}")
                for email_data in emails[:5]:  # Top 5
                    report.append(f"- **From:** {email_data['from']}")
                    report.append(f"  **Subject:** {email_data['subject']}")
                    report.append(f"  **Date:** {email_data['date']}")
                    report.append("")
        
        report.append("---")
        report.append("")
    
    return "\n".join(report)


# Credential management
CREDENTIALS_FILE = "email_credentials.json"

def load_stored_credentials():
    if os.path.exists(CREDENTIALS_FILE):
        try:
            with open(CREDENTIALS_FILE, 'r') as f:
                return json.load(f)
        except:
            return {}
    return {}

def save_credentials(creds):
    try:
        with open(CREDENTIALS_FILE, 'w') as f:
            json.dump(creds, f)
        print(f"🔒 Credentials saved to {CREDENTIALS_FILE}")
    except Exception as e:
        print(f"⚠️  Could not save credentials: {e}")

if __name__ == "__main__":
    print("🚀 Multi-Account Email Review Starting...")
    print(f"📅 Reviewing emails from last 7 days")
    
    stored_creds = load_stored_credentials()
    new_creds = stored_creds.copy()
    creds_updated = False
    
    results = []
    
    # Filter for requested accounts only (2 and 3)
    target_accounts = ["aigestion", "gmail"]
    
    for account_name in target_accounts:
        if account_name not in ACCOUNTS: continue
        
        config = ACCOUNTS[account_name]
        password = stored_creds.get(account_name)
        
        if not password:
            print(f"\n🔑 Credentials needed for {config['email']}")
            password = getpass.getpass(f"Enter App Password (or press Enter to skip): ")
            if password:
                new_creds[account_name] = password
                creds_updated = True
        
        result = analyze_account(account_name, config, password)
        results.append(result)
    
    if creds_updated:
        save = input("\n💾 Save these credentials for future runs? (y/n): ").lower()
        if save == 'y':
            save_credentials(new_creds)
    
    # Generate report
    report = generate_report(results)
    
    # Save to file
    output_file = "email_review_report.md"
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(report)
    
    print(f"\n{'='*60}")
    print(f"✅ Report saved to: {output_file}")
    print(f"{'='*60}")
    
    # Also save raw JSON
    json_file = "email_review_data.json"
    with open(json_file, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    
    print(f"📊 Raw data saved to: {json_file}")

