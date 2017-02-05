'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const MongoClient = require('mongodb').MongoClient;
const mongoURL = require('./private.js').mongoURL;

let db;

MongoClient.connect(mongoURL, (err, database) => {
    if (err) {
        return console.log(err);
    }

    db = database;
    app.listen(3000, () => {
        console.log('listening on 3000');
    })
})

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})


app.post('/addresses', (req, res) => {
    //console.log(req.body);
    db.collection('addresses').save(req.body, (err, result) => {
        if (err) {
            return console.log(err);
        }

        console.log('saved to database');
        res.redirect('/');
    })
})
