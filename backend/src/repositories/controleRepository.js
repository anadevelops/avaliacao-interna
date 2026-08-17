const db = require('../../database/init-db');

module.exports = {
    hasPreenchido(membro_id, semestre_id, callback) {
        db.get('SELECT 1 FROM controle_preenchimento WHERE membro_id = ? AND semestre_id = ? LIMIT 1', [membro_id, semestre_id], (err, row) => {
            if (err) return callback(err);
            callback(null, !!row);
        });
    },

    createControle(membro_id, semestre_id, callback) {
        const stmt = db.prepare('INSERT OR IGNORE INTO controle_preenchimento (membro_id, semestre_id) VALUES (?, ?)');
        stmt.run([membro_id, semestre_id], function (err) {
            if (err) return callback(err);
            callback(null, { affected: this.changes });
        });
    }
};
