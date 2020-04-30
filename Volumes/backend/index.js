const keys = require('./keys');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const redis = require('redis');
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort
});

const { Pool } = require('pg');
const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort
});

pgClient.on('error', () => console.log('No connection to PG DB'));

console.log(keys);

const initPG = () => {
    pgClient.connect().then(() => {
        pgClient.query('CREATE TABLE IF NOT EXISTS volume (a INT, b INT, h INT, result INT')
            .catch((err) => {
                console.log(err);
            });
    }).catch(() => {
        setTimeout(() => {
            connect();
        }, 1000);
    });
}

initPG();

const calcVolume = (a, b, h) => {
    let result = a * b * h;
    return result;
}

const addResult = (a, b, h, res) => {
    return new Promise((resolve, reject) => {
        pgClient
            .query(
                "INSERT INTO volume (a, b, h, result) VALUES ($1, $2, $3, $4)",
                [a, b, h, res]
            )
            .then(() => {
                resolve();
            })
            .catch((err) => {
                reject(err);
            });
    })
}

app.get("/results", (req, res) => {
    pgClient
        .query("SELECT DISTINCT * FROM volume")
        .then((data) => {
            return res.json(data.rows);
        })
        .catch((err) => {
            console.log(err);
            return res.status(500);
        });
});

app.post("/results", (req, resp) => {
    const a = parseInt(req.body.a) || 0;
    const b = parseInt(req.body.b) || 0;
    const h = parseInt(req.body.h) || 0;
    if (a < 1 || b < 1 || c < 1) {
        return res.status(422).json('Podano niepoprawne dane bryły.');
    }
    const key = `${a},${b},${h}`;
    redisClient.get(key, async(err, value) => {
        try {
            if (value !== null){
                return res.json(value);
            }
            const volume = calcVolume(a, b, h);
            redisClient.set(key, volume);
            await addResult(a, b, h, volume);
            return res.json(volume);
        } catch (err) {
            console.log(err);
            return res.status(500);
        }
    });
});

app.listen(4000, () => {
    console.log('Server listening on port 4000');
})