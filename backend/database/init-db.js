const db = require('./database');

db.run('PRAGMA foreign_keys = ON;');

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS membros (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            ativo INTEGER DEFAULT 1,
            categoria TEXT NOT NULL
        );
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS comissoes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            membro_id INTEGER,
            nome TEXT NOT NULL,
            FOREIGN KEY (membro_id) REFERENCES membros(id)
        );
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS semestres (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            codigo TEXT NOT NULL UNIQUE,
            is_ativo INTEGER DEFAULT 0
        );
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS controle_preenchimento (
            membro_id INTEGER NOT NULL,
            semestre_id INTEGER NOT NULL,
            data_envio DATETIME DEFAULT (datetime('now')),
            PRIMARY KEY (membro_id, semestre_id),
            FOREIGN KEY (membro_id) REFERENCES membros(id) ON DELETE RESTRICT,
            FOREIGN KEY (semestre_id) REFERENCES semestres(id) ON DELETE RESTRICT
        );
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS avaliacoes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            avaliado_id INTEGER NOT NULL,
            semestre_id INTEGER NOT NULL,
            nota INTEGER NOT NULL CHECK (nota >= 0 AND nota <= 10),
            comentario TEXT NOT NULL,
            FOREIGN KEY (avaliado_id) REFERENCES membros(id) ON DELETE RESTRICT,
            FOREIGN KEY (semestre_id) REFERENCES semestres(id) ON DELETE RESTRICT
        );
    `);
});

module.exports = db;