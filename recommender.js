require("dotenv").config();
const fs = require("fs");
require('@tensorflow/tfjs-node');
const use = require('@tensorflow-models/universal-sentence-encoder');
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

    const embeddingsRequest = await model.embed('cute little puppies.');
    const embedding = embeddingsRequest.arraySync()[0];

    const client = new pg.Client(config);
    await client.connect();
    try {
        const pgResponse = await client.query(
            `SELECT * FROM movie_plots 
            ORDER BY embedding <-> '${JSON.stringify(embedding)}'
            LIMIT 5;`
        );

        console.log(pgResponse.rows);
    } catch (error) {
        console.error(error);
    } finally {
        await client.end();
    }
});