const db = require('../../database/init-db');

module.exports = {
    list(callback) {
        db.all('SELECT id, nome, ativo, categoria FROM membros', [], callback);
    },

    create(membro, callback) {
        const stmt = db.prepare('INSERT INTO membros (nome, ativo, categoria) VALUES (?, ?, ?)');
        stmt.run([membro.nome, membro.ativo ? 1 : 0, membro.categoria], function (err) {
            if (err) return callback(err);
            callback(null, { id: this.lastID });
        });
    }
};
