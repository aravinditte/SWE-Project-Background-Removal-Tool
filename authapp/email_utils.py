from django.conf import settings
from simplegmail import Gmail

gmail = Gmail()

sender_email = "mahendraimpfiles@gmail.com"

def send_email(recipient, subject, message):
    message = message.replace("\n", "<br>")
    params = {
        "to": recipient,
        "sender": sender_email,
        "subject": subject,
        "msg_html": message,
        "signature": True
    }

    message = gmail.send_message(**params)
    print("Message sent successfully")
