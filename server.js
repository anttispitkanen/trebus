'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const MongoClient = require('mongodb').MongoClient;
const mongoURL = require('./private.js').mongoURL;

const APIkey = require('./private.js').APIkey;
const APIpass = require('./private.js').APIpass;

const request = require('request');
const rp = require('request-promise');

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

/*
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
*/

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
    })
})

app.post('/find-address', (req, res) => {
    const searchTerm = req.body.address;

    let searchURL = parseAPIurl(searchTerm);

    let coords;

    rp(searchURL, (error, response, body) => {
        console.log('päästiin ekaan requestiin :D');
        if (!error && response.statusCode === 200) {
            try {
                coords = JSON.parse(body)[0].coords;
            } catch (e) {
                console.log(e);
            }

            return coords;
        }
    })
    .then(() => {
        console.log('coords: ' + coords)

        if (coords) {
            let mockURL = `http://api.publictransport.tampere.fi/prod/?${APIkey}&${APIpass}&request=route&from=${coords}&to=3327691,6825408&show=1&Detail=limited`;
            console.log(mockURL);

            rp(mockURL, (error, response, body) => {
                if (!error && response.statusCode === 200) {
                    console.log(body);
                    res.send(body);
                }
            })
        } else {
            res.send({error: 'something went wrong with the request ¯\\_(ツ)_/¯'})
        }

    })
    .catch(e => {
        console.log(e);
    })

})

/*
app.delete('/addresses', (req, res) => {
    db.collection('addresses').findOneAndDelete({
        name: req.body.name
    }, (err, result) => {
        if (err) {
            return res.send(500, err);
        }
        res.send({
            'error': 'deleted something :D'
        });
    })
})
*/

function parseAPIurl(from) {
    const defaultAPIurl = 'http://api.publictransport.tampere.fi/prod/?request=geocode&format=json';
    const fromPart = 'key=' + from.trim().split(' ').join('+');

    const fullAPIurl = defaultAPIurl + '&' + fromPart + '&' + APIkey + '&' + APIpass;

    return fullAPIurl;
}

/*
parseAPIurl(from, to) {
    const fromPart = from.split(' ').join('+');
    const toPart = to.split(' ').join('+');
}
*/

//let URL = 'http://api.publictransport.tampere.fi/prod/?user=anttispitkanen&pass=nysse123&request=route&from=3330354,6824717&to=3327691,6825408&show=1&Detail=limited';
/*
let URL = `http://api.publictransport.tampere.fi/prod/?${APIkey}&${APIpass}&request=route&from=3330354,6824717&to=3327691,6825408&show=1&Detail=limited`;
app.get('/joujou', (req, res) => {
    request(URL, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            //console.log(JSON.parse(body)[0][0].legs[0].locs);
            res.send(body);
        }
    })
})
*/