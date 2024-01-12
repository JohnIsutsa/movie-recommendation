const express = require('express');
const bodyParser = require('body-parser');
const { getRecommendations } = require('./recommender');

const PORT = process.env.PORT || 3500;

const app = express();

app.use(bodyParser.json());

app.get('/api/recommendation', (req, res) => {
    const { search } = req.query;
    console.log(req.query);

    getRecommendations(search)
        .then(recommendations => {
            res.status(200).send(recommendations);
        }).catch(error => {
            res.status(500).send(error)
        });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
