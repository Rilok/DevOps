const express = require('express');
const bodyParser = require('body-parser')

const app = express();
app.use(bodyParser.json());

const rand = Math.random();

app.get("/", (req, resp) => {
    return resp.json(rand);
});

app.listen(4000, () => {
    console.log('Server listening on port 4000');
});