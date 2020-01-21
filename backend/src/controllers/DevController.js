const axios = require('axios');
const Dev = require('../models/Dev');
const stringParse = require('../utils/parseStringArray');
const { findConnections, sendMessage } = require('../websocket');

// index, show, update, destroy, store

module.exports = {
	async index(req, res) {
		const devs = await Dev.find();

		return res.json(devs);
	},

	async store(req, res) {
		const { github_username, techs, latitude, longitude } = req.body;

		const api_response = await axios.default.get(
			`https://api.github.com/users/${github_username}`
		);

		let dev = await Dev.findOne({ github_username });

		if (!dev) {
			const { name = login, bio, avatar_url } = api_response.data;

			const techsArray = stringParse(techs);

			const location = {
				type: 'Point',
				coordinates: [ longitude, latitude ]
			};

			dev = await Dev.create({
				github_username,
				techs: techsArray,
				name,
				bio,
				avatar_url,
				location
			});

			// Filtrar as conexões que estão a no máximo 10km de distancia
			// e que o novo dev tenha pelo menos uma das tecnologias filtradas

			const sendSocketMessageTo = findConnections(
				{ latitude, longitude },
				techsArray
			); // retorna uma conexao dentro dos parametros selecionados

			sendMessage(sendSocketMessageTo, 'new-dev', dev);
		}

		return res.json(dev);
	},

	async update(req, res) {
		const { github_username, name, techs, bio, avatar_url } = req.body;
		const dev = await Dev.findOne({ github_username });
		if (dev) {
			name ? (dev.name = name) : dev.name;
			techs ? (dev.techs = techs) : dev.techs;
			bio ? (dev.bio = bio) : dev.bio;
			avatar_url ? (dev.avatar_url = avatar_url) : dev.avatar_url;
			await dev.save();
			return res.json(dev);
		}
		return res.status(400).json({ error: 'User not found' });
	},

	async destroy(req, res) {
		const { github_username } = req.body;

		const result = await Dev.deleteOne({ github_username }, (err) => {
			// console.log(err);
			if (err) return res.status(400).json(err);
		});

		return res.json(result);
	}
};
