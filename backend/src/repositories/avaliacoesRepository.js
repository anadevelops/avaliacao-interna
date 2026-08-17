const db = require('../../database/init-db');

module.exports = {
    list(filters, callback) {
        let sql = `SELECT a.id, a.avaliado_id, a.semestre_id, a.nota, a.comentario, m.nome as avaliado_nome
                   FROM avaliacoes a JOIN membros m ON a.avaliado_id = m.id`;
        const params = [];
        const parts = [];
        if (filters.semestre_id) { parts.push('a.semestre_id = ?'); params.push(filters.semestre_id); }
        if (filters.avaliado_id) { parts.push('a.avaliado_id = ?'); params.push(filters.avaliado_id); }
        if (parts.length) sql += ' WHERE ' + parts.join(' AND ');
        db.all(sql, params, callback);
    },

    create(avaliacao, callback) {
        const stmt = db.prepare('INSERT INTO avaliacoes (avaliado_id, semestre_id, nota, comentario) VALUES (?, ?, ?, ?)');
        stmt.run([avaliacao.avaliado_id, avaliacao.semestre_id, avaliacao.nota, avaliacao.comentario], function (err) {
            if (err) return callback(err);
            // registro controle preenchimento
            if (avaliacao.membro_autor_id) {
                const insertControle = db.prepare('INSERT OR IGNORE INTO controle_preenchimento (membro_id, semestre_id) VALUES (?, ?)');
                insertControle.run([avaliacao.membro_autor_id, avaliacao.semestre_id]);
            }
            callback(null, { id: this.lastID });
        });
    }
};
