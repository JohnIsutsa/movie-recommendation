const fs = require("fs");
require('@tensorflow/tfjs-node');
const use = require('@tensorflow-models/universal-sentence-encoder');
const moviePlots = require("./movie-plots.json");


use.load().then(async model => {
    const sampleMoviewPlot = moviePlots[0];
    console.log(sampleMoviewPlot);

    const embeddings = await model.embed(sampleMoviewPlot["Plot"]);
    console.log(embeddings.arraySync());
})