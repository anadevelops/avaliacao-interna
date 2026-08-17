const semestresRepo = require('../repositories/semestresRepository');

module.exports = {
    listSemestres() {
        return new Promise((resolve, reject) => {
            semestresRepo.list((err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },

    createSemestre(data) {
        return new Promise((resolve, reject) => {
            semestresRepo.create(data, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }
};
