const avaliacoesUsecase = require('../usecases/avaliacoesUsecase');
const controleRepo = require('../repositories/controleRepository');

exports.list = async (req, res) => {
    try {
        const filters = { semestre_id: req.query.semestre_id, avaliado_id: req.query.avaliado_id };
        const rows = await avaliacoesUsecase.listAvaliacoes(filters);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.create = async (req, res) => {
    try {
        const { semestre_id, avaliacoes, avaliado_id, nota, comentario, membro_autor_id } = req.body;

        if (Array.isArray(avaliacoes)) {
            if (!semestre_id) return res.status(400).json({ error: 'semestre_id obrigatório para envio em lote' });
            controleRepo.hasPreenchido(semestre_id, async (err, has) => {
                if (err) return res.status(500).json({ error: err.message });
                if (has) return res.status(400).json({ error: 'Você já enviou sua avaliação neste semestre' });

                const promises = avaliacoes.map(a => avaliacoesUsecase.createAvaliacao({
                    avaliado_id: a.avaliado_id,
                    semestre_id,
                    nota: a.nota,
                    comentario: a.comentario
                }));

                try {
                    await Promise.all(promises);
                    res.status(201).json({ ok: true });
                } catch (e) {
                    res.status(500).json({ error: e.message });
                }
            });
        } else {
            // single
            const aid = avaliado_id;
            const sid = semestre_id;
            const n = nota;
            const c = comentario;
            if (!aid || !sid || n === undefined || c === undefined) {
                return res.status(400).json({ error: 'avaliado_id, semestre_id, nota e comentario são obrigatórios' });
            }
            const result = await avaliacoesUsecase.createAvaliacao({ avaliado_id: aid, semestre_id: sid, nota: n, comentario: c });
            res.status(201).json(result);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
