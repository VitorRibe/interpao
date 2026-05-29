from src.auth.repositories.auth_repository import AuthRepository
from src.auth.repositories.setor_repository import SetorRepository
from src.auth.services.service import AuthService
from src.auth.services.registration_service import RegistrationService

class RegisterUseCase:
    def __init__(self, auth_repository: AuthRepository, setor_repository: SetorRepository, auth_service: AuthService):
        self.auth_repository = auth_repository
        self.setor_repository = setor_repository
        self.registration_service = RegistrationService(auth_repository, setor_repository, auth_service)

    async def execute_register(
        self,
        email: str,
        password: str,
        name: str,
        id_setor,
        phone: str | None = None,
    ):
        """Execute user registration."""
        user = await self.registration_service.register_user(
            email=email,
            password=password,
            name=name,
            id_setor=id_setor,
            phone=phone,
        )
        return user
