const avaliacoesRepo = require('../repositories/avaliacoesRepository');

module.exports = {
    listAvaliacoes(filters = {}) {
        return new Promise((resolve, reject) => {
            avaliacoesRepo.list(filters, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },

    createAvaliacao(data) {
        return new Promise((resolve, reject) => {
            avaliacoesRepo.create(data, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }
};

