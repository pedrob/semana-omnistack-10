const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const cors = require('cors');

const app = express();

mongoose
	.connect(
		'mongodb+srv://Pedro:admin@cluster0-k4roi.mongodb.net/omni10?retryWrites=true&w=majority',
		{
			useNewUrlParser: true,
			useUnifiedTopology: true
		}
	)
	.then(() => {
		console.log('Database connected');
	})
	.catch((err) => {
		console.error('Database connection failed, err:', err);
	});
mongoose.set('useCreateIndex', true);

app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(8888, () => {
	console.log('Server running on port 8888');
});
