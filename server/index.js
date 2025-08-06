const keys = require('./keys');

// Express App setup
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express(); // new express application, listen to requests
app.use(cors()); // allow request from diferent domains
app.use(bodyParser.json()); // parse incoming request with json request

// Postgres client setup
const { Pool } = require('pg');
const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort,
    ssl: process.env.NODE_ENV !== 'production' ? false : { rejectUnauthorized: false }
});

pgClient.on('error', () => console.log('Lost PG connection')); //if error remove this line

pgClient.on("connect", (client) => {
    client
        .query("CREATE TABLE IF NOT EXISTS values (number INT)")
        .catch((err) => console.error(err));
});
