const membrosUsecase = require('../usecases/membrosUsecase');

exports.list = async (req, res) => {
    try {
        const rows = await membrosUsecase.listMembros();
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.create = async (req, res) => {
    try {
        const { nome, ativo = 1, categoria } = req.body;
        if (!nome || !categoria) return res.status(400).json({ error: 'nome e categoria obrigatórios' });
        const result = await membrosUsecase.createMembro({ nome, ativo, categoria });
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
