from src.auth.repositories.auth_repository import AuthRepository
from src.auth.repositories.setor_repository import SetorRepository
from src.auth.services.service import AuthService
from src.auth.services.registration_service import RegistrationService

class PasswordResetRequestUseCase:
    def __init__(self, auth_repository: AuthRepository, setor_repository: SetorRepository, auth_service: AuthService):
        self.auth_repository = auth_repository
        self.setor_repository = setor_repository
        self.registration_service = RegistrationService(auth_repository, setor_repository, auth_service)

    async def execute_request(self, email: str):
        """Execute password reset request."""
        token, expires_at = await self.registration_service.request_password_reset(email)
        # TODO: Send email with reset link
        # await send_password_reset_email(email, token)
        return token, expires_at


class PasswordResetConfirmUseCase:
    def __init__(self, auth_repository: AuthRepository, setor_repository: SetorRepository, auth_service: AuthService):
        self.auth_repository = auth_repository
        self.setor_repository = setor_repository
        self.registration_service = RegistrationService(auth_repository, setor_repository, auth_service)

    async def execute_confirm(self, token: str, new_password: str):
        """Execute password reset confirmation."""
        user = await self.registration_service.confirm_password_reset(token, new_password)
        return user
