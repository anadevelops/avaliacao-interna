const semestresUsecase = require('../usecases/semestresUsecase');

exports.list = async (req, res) => {
    try {
        const rows = await semestresUsecase.listSemestres();
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.create = async (req, res) => {
    try {
        const { codigo, is_ativo = 0 } = req.body;
        if (!codigo) return res.status(400).json({ error: 'codigo obrigatório' });
        const result = await semestresUsecase.createSemestre({ codigo, is_ativo });
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
