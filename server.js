'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const MongoClient = require('mongodb').MongoClient;
const mongoURL = require('./private.js').mongoURL;

//const http = require('http');
const request = require('request');

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
app.use(express.static('public'));
app.use(bodyParser.json());

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    db.collection('addresses').find().toArray((err, results) => {

        if (err) {
            return console.log(err);
        }
        //else render
        res.render('index.ejs', { addresses: results });
    });
})

let testURL = 'http://data.itsfactory.fi/journeys/api/1/stop-points/0001';
app.get('/test', (req, res) => {
    request(testURL, (error, response, body) => {

        if (error) { console.log(error) }

        if (!error && response.statusCode === 200) {

            //check if array containing body is empty
            if (JSON.parse(body).body.length < 1) {
                res.send({
                    'error': 'No data received from API ¯\\_(ツ)_/¯'
                });
            } else {

                //if body is not empty, send it to client
                res.send(body);
            }
        } else {
            console.log('something went wrong');
        }
    })
})


app.post('/addresses', (req, res) => {

    db.collection('addresses').save(req.body, (err, result) => {
        if (err) {
            return console.log(err);
        }

        console.log('saved to database');
        res.redirect('/');
    })
})

app.put('/addresses', (req, res) => {
    db.collection('addresses').findOneAndUpdate({
        name: 'Rautatieasema'
    }, {
        $set: {
            name: req.body.name,
            address: req.body.address
        }
    }, {
        upsert: true
    }, (err, result) => {
        if (err) {
            return res.send(err);
        }
        res.send(result);
    }
)
})
