from app.core.celery_app import celery_app
from app.core.config import settings

@celery_app.task(name="test_task")
def test_task(name: str):
    return f"Hello {name}, task completed!"

# ==========================================
# Email Tasks
# ==========================================

@celery_app.task(name="send_password_reset_email")
def send_password_reset_email(email: str, token: str):
    """
    Send password reset email with token.
    TODO: Implement email sending logic (SMTP, SendGrid, AWS SES, etc.)
    """
    reset_url = f"{settings.FRONTEND_URL}/auth/reset-password?token={token}"
    
    # TODO: Send email
    # subject = "Password Reset Request"
    # body = f"""
    # Click the link below to reset your password:
    # {reset_url}
    # 
    # This link will expire in 2 hours.
    # """
    # send_email(to=email, subject=subject, body=body)
    
    return {
        "status": "success",
        "message": f"Password reset email would be sent to {email}",
        "reset_url": reset_url,
    }

@celery_app.task(name="send_temporary_password_email")
def send_temporary_password_email(email: str, temp_password: str):
    """
    Send temporary password email (for admin password reset).
    TODO: Implement email sending logic (SMTP, SendGrid, AWS SES, etc.)
    """
    login_url = f"{settings.FRONTEND_URL}/auth/login"
    
    # TODO: Send email
    # subject = "Your Temporary Password"
    # body = f"""
    # An administrator has reset your password.
    # Your temporary password is: {temp_password}
    # 
    # Please log in at {login_url} and change your password immediately.
    # """
    # send_email(to=email, subject=subject, body=body)
    
    return {
        "status": "success",
        "message": f"Temporary password email would be sent to {email}",
        "temp_password": temp_password,
    }