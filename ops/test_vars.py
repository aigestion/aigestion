import imaplib


def test(email, password):
    try:
        mail = imaplib.IMAP4_SSL("imap.gmail.com")
        mail.login(email, password)
        print(f"SUCCESS:{email}:{password}")
        mail.logout()
        return True
    except Exception as e:
        print(f"FAIL:{email}:{password}:{str(e)}")
        return False


creds = ["Iris.8374", "Danieli.8374$$$", "Danieli.8374app"]
accounts = ["admin@aigestion.net", "noemisanalex@gmail.com"]

for acc in accounts:
    for pwd in creds:
        if test(acc, pwd):
            break
