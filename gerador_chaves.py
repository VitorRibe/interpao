import hmac
import hashlib
import base64
import json

# ==========================================
# 1. INSIRA SUA SECRET_KEY AQUI
# (A mesma que você colocou no arquivo .env)
# ==========================================
SECRET_KEY = "daef297c0d326e3b6262ddb8f586bcf1c720cca3e1c03f595032e2b73b99b706"

def generate_jwt(role: str) -> str:
    """Gera um JWT assinado com a SECRET_KEY e payload específico para o Supabase."""
    
    # Header: Define o algoritmo HS256
    header_dict = {"alg": "HS256", "typ": "JWT"}
    header = base64.urlsafe_b64encode(json.dumps(header_dict).encode()).decode().rstrip("=")
    
    # Payload: Define a role e uma data de expiração longa (ano 2065)
    payload_dict = {
        "role": role, 
        "iss": "supabase", 
        "iat": 1600000000, 
        "exp": 3000000000
    }
    payload = base64.urlsafe_b64encode(json.dumps(payload_dict).encode()).decode().rstrip("=")
    
    # Signature: Assina o token usando HMAC-SHA256 e a SECRET_KEY
    signature_bytes = hmac.new(
        SECRET_KEY.encode(), 
        f"{header}.{payload}".encode(), 
        hashlib.sha256
    ).digest()
    signature = base64.urlsafe_b64encode(signature_bytes).decode().rstrip("=")
    
    return f"{header}.{payload}.{signature}"

if __name__ == "__main__":
    anon_jwt = generate_jwt("anon")
    service_jwt = generate_jwt("service_role")
    
    print("\n--- COPIE E COLE ESTES VALORES NO SEU .ENV ---\n")
    print(f"SUPABASE_ANON_KEY={anon_jwt}\n")
    print(f"SUPABASE_SERVICE_KEY={service_jwt}\n")
    print(f"SUPABASE_KEY={service_jwt}")
    print("\n----------------------------------------------\n")