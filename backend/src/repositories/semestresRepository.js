const db = require('../../database/init-db');

module.exports = {
    list(callback) {
        db.all('SELECT id, codigo, is_ativo FROM semestres', [], callback);
    },

    create(semestre, callback) {
        const stmt = db.prepare('INSERT INTO semestres (codigo, is_ativo) VALUES (?, ?)');
        stmt.run([semestre.codigo, semestre.is_ativo ? 1 : 0], function (err) {
            if (err) return callback(err);
            callback(null, { id: this.lastID });
        });
    }
    ,
    getActive(callback) {
        db.get('SELECT id, codigo, is_ativo FROM semestres WHERE is_ativo = 1 LIMIT 1', [], callback);
    }
};
