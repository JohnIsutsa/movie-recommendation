require("dotenv").config();
const fs = require("fs");
require('@tensorflow/tfjs-node');
const use = require('@tensorflow-models/universal-sentence-encoder');
const moviePlots = require("./movie-plots.json");
const pg = require("pg");

const config = {
    user: process.env.PG_NAME,
    password: process.env.PG_PASSWORD,
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    database: "defaultdb",
    ssl: {
        rejectUnauthorized: true,
        ca: fs.readFileSync('./ca.pem').toString(),
    },
};

use.load().then(async model => {
    // const sampleMoviePlot = moviePlots[0];
    // console.log(sampleMoviePlot);

    // const embeddings = await model.embed(sampleMoviePlot["Plot"]);
    // console.log(embeddings.arraySync());

    const client = new pg.Client(config);
    await client.connect();

    try {
        const pgResponse = await client.query(
            `SELECT count(*) FROM movie_plots`
        );
        console.log('PG RESPONSE', pgResponse.rows);
    } catch (err) {
        console.log(err);
    } finally {
        await client.end();
    }
});