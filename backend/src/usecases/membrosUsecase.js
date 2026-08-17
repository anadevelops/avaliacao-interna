const membrosRepo = require('../repositories/membrosRepository');

module.exports = {
    listMembros() {
        return new Promise((resolve, reject) => {
            membrosRepo.list((err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },

    createMembro(data) {
        return new Promise((resolve, reject) => {
            membrosRepo.create(data, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }
};
