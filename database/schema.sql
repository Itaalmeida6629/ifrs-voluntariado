CREATE DATABASE IF NOT EXISTS voluntariados_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE voluntariados_db;

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    role ENUM('admin', 'voluntario') NOT NULL DEFAULT 'voluntario',
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS eventos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    descricao VARCHAR(200),
    local VARCHAR(100) NOT NULL,
    data_inicio DATETIME NOT NULL,
    data_fim DATETIME NOT NULL,
    limite_voluntarios INT NOT NULL DEFAULT 20,
    status ENUM('agendado', 'finalizado') NOT NULL DEFAULT 'agendado',
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_eventos_titulo_data_inicio UNIQUE (titulo, data_inicio),
    CONSTRAINT chk_eventos_limite_voluntarios CHECK (limite_voluntarios > 0)
);

CREATE TABLE IF NOT EXISTS evento_voluntarios (
    evento_id INT NOT NULL,
    usuario_id INT NOT NULL,
    inscrito_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (evento_id, usuario_id),
    CONSTRAINT fk_evento_voluntarios_evento
        FOREIGN KEY (evento_id) REFERENCES eventos(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_evento_voluntarios_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

DELIMITER $$

CREATE TRIGGER trg_eventos_antes_inserir
BEFORE INSERT ON eventos
FOR EACH ROW
BEGIN
    IF NEW.data_fim <= NEW.data_inicio THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'A data de termino deve ser posterior ao inicio';
    END IF;
END$$

CREATE TRIGGER trg_eventos_antes_atualizar
BEFORE UPDATE ON eventos
FOR EACH ROW
BEGIN
    IF NEW.data_fim <= NEW.data_inicio THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'A data de termino deve ser posterior ao inicio';
    END IF;
END$$

CREATE TRIGGER trg_evento_voluntarios_antes_inserir
BEFORE INSERT ON evento_voluntarios
FOR EACH ROW
BEGIN
    DECLARE limite INT;
    DECLARE total_inscritos INT;

    SELECT limite_voluntarios
      INTO limite
      FROM eventos
     WHERE id = NEW.evento_id;

    SELECT COUNT(*)
      INTO total_inscritos
      FROM evento_voluntarios
     WHERE evento_id = NEW.evento_id;

    IF total_inscritos >= limite THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'O limite de voluntarios para este evento foi atingido';
    END IF;
END$$

DELIMITER ;

INSERT INTO usuarios (nome, email, senha_hash, telefone, role)
VALUES
    (
        'Ana Souza',
        'ana.souza@ifrs.edu.br',
        '$2b$10$HCajla3KjpVT7Vwh0LcR8OvGl6AAU3Jf1MuFIHRaq8OZBtMfA59va',
        '(54) 99999-1001',
        'voluntario'
    ),
    (
        'Bruno Lima',
        'bruno.lima@ifrs.edu.br',
        '$2b$10$p75ldrHDfbANdZgDSygP4ugrtNsOJZi.tVVucFbEn90n/yExSEoou',
        '(54) 99999-1002',
        'voluntario'
    ),
    (
        'Carla Mendes',
        'carla.mendes@ifrs.edu.br',
        '$2b$10$Nx28JlCxG7eDQnCD8pnc6OIR8JCSiLvVB6sSA3cN6SG9CDAeu/9ka',
        '(54) 99999-1003',
        'voluntario'
    );

INSERT INTO eventos
    (titulo, descricao, local, data_inicio, data_fim, limite_voluntarios, status)
VALUES
    (
        'Campanha de doacao de sangue',
        'Acao voluntaria em parceria com o hemocentro regional.',
        'Hemocentro Regional',
        '2026-11-07 08:00:00',
        '2026-11-07 12:00:00',
        30,
        'agendado'
    ),
    (
        'Arrecadacao de alimentos',
        'Coleta de alimentos nao pereciveis para familias da regiao.',
        'Campus Bento Goncalves',
        '2026-11-21 09:00:00',
        '2026-11-21 16:00:00',
        20,
        'agendado'
    ),
    (
        'Mutirao ambiental',
        'Limpeza e revitalizacao de uma area verde do municipio.',
        'Parque Municipal',
        '2026-09-12 08:00:00',
        '2026-09-12 13:00:00',
        10,
        'finalizado'
    );

INSERT INTO evento_voluntarios (evento_id, usuario_id)
VALUES
    (1, 1),
    (1, 2),
    (3, 3);
