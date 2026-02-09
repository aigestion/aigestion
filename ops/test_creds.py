import imaplib
import sys


def check_creds(email, password, server):
    try:
        mail = imaplib.IMAP4_SSL(server)
        mail.login(email, password)
        print(f"SUCCESS:{email}")
        mail.logout()
    except Exception as e:
        print(f"FAIL:{email}:{e}")


check_creds("admin@aigestion.net", "PROD_AIGESTION_2024_SECURE_PASS", "imap.gmail.com")
check_creds("noemisanalex@gmail.com", "Danieli.8374$$$", "imap.gmail.com")
