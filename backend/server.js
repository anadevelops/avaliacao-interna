const express = require('express');
const cors = require('cors');
const db = require('./database/init-db');

const app = express();

app.use(cors());
app.use(express.json());

// --- Rotas usando Clean Architecture (controllers -> usecases -> repositories)
const membrosController = require('./src/controllers/membrosController');
const semestresController = require('./src/controllers/semestresController');
const avaliacoesController = require('./src/controllers/avaliacoesController');

app.get('/membros', membrosController.list);
app.post('/membros', membrosController.create);

app.get('/semestres', semestresController.list);
app.post('/semestres', semestresController.create);

app.get('/avaliacoes', avaliacoesController.list);
app.post('/avaliacoes', avaliacoesController.create);

// Endpoint esperado pelo frontend: dados iniciais (membros + semestre ativo)
app.get('/dados-iniciais', async (req, res) => {
	try {
		const membros = await (require('./src/usecases/membrosUsecase').listMembros());
		const semestresUsecase = require('./src/usecases/semestresUsecase');
		const semActive = await new Promise((resolve, reject) => {
			require('./src/repositories/semestresRepository').getActive((err, row) => {
				if (err) return reject(err);
				resolve(row || null);
			});
		});
		res.json({ membros, semestreAtivo: semActive });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// Endpoint para verificar se um membro já preencheu no semestre
app.get('/status/:membroId/:semestreId', (req, res) => {
	const { membroId, semestreId } = req.params;
	const controle = require('./src/repositories/controleRepository');
	controle.hasPreenchido(membroId, semestreId, (err, has) => {
		if (err) return res.status(500).json({ error: err.message });
		res.json({ jaVotou: !!has });
	});
});

// Health
app.get('/health', (req, res) => res.json({ ok: true }));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server rodando na porta ${PORT}`));
