const express = require('express');
const redis = require('redis');
const app = express();
const process = require('process');

const client = redis.createClient({
    host: 'redis-server',
    port: 6379
});

var gcd = require ('gcd');

app.get('/', (req, res) => {
    var n1 = parseInt(req.query.n1);
    var n2 = parseInt(req.query.n2);

    if (isNaN(n1) || isNaN(n2)) {
        res.send('Sth is not a number!\n');
        return 1;
    }

    numbers = [n1, n2]
    key = numbers.sort().toString()
    var n3 = gcd(n1, n2)

    client.get(key, (err, data_value) => {
        var result = 0;
        if (data_value) {
            result = data_value;
            console.log("Result in database.\n");
        } else {
            result = gcd(n1, n2)
            client.set(key, result);
        }
        res.send("NWD = " + result + "\n");
    });
});

app.listen(8080, () => {
    console.log('Server listening on 8080.');
});