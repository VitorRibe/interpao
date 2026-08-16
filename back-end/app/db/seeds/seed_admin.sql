CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Insere os setores apenas se eles ainda não existirem (sem depender de constraint unique)
INSERT INTO setor (nome) 
SELECT nome FROM (
    VALUES 
        ('Atendimento'),
        ('Produção'),
        ('Escritório'),
        ('Geral'),
        ('Administrador')
) AS v(nome)
WHERE NOT EXISTS (
    SELECT 1 FROM setor s WHERE s.nome = v.nome
);

-- Insere o Administrador se o e-mail ainda não estiver cadastrado
INSERT INTO "user" (
    id, 
    email, 
    hashed_password, 
    name, 
    is_active, 
    is_admin, 
    is_superuser,
    id_setor
) 
SELECT 
    gen_random_uuid(),
    'admin@interpao.com.br',
    crypt('admin123', gen_salt('bf')),
    'Administrador do Sistema',
    true,
    true,
    true,
    (SELECT id_setor FROM setor WHERE nome = 'Administrador' LIMIT 1)
WHERE NOT EXISTS (
    SELECT 1 FROM "user" WHERE email = 'admin@interpao.com.br'
);