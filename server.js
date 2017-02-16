'use strict';

const dotenv = require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const MongoClient = require('mongodb').MongoClient;
//const mongoURL = require('./private.js').mongoURL;

//const APIkey = require('./private.js').APIkey;
//const APIpass = require('./private.js').APIpass;

const request = require('request');
const rp = require('request-promise');

const streetnames = require('./streetnames.js');

let db;

app.set('port', (process.env.PORT || 3001));
app.use(express.static(__dirname + '/public'));

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
}

MongoClient.connect(process.env.MONGO_URL, (err, database) => {
    if (err) {
        return console.log(err);
    }

    db = database;
    app.listen(app.get('port'), () => {
        console.log('listening on ' + app.get('port'));
    })
})

app.use(bodyParser.urlencoded({ extended: true }));
//app.use(express.static('public'));
app.use(bodyParser.json());

app.set('view engine', 'ejs');

/*
app.get('/', (req, res) => {
    db.collection('addresses').find().toArray((err, results) => {

        if (err) {
            return console.log(err);
        }
        //else render
        res.render('index.ejs', { addresses: results });
    });
})
*/

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

/*
app.post('/addresses', (req, res) => {

    db.collection('addresses').save(req.body, (err, result) => {
        if (err) {
            return console.log(err);
        }

        console.log('saved to database');
        res.redirect('/');
    })
})
*/

/*
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
*/

app.post('/locate-me', (req, res) => {
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;

    //console.log('lat: ' + latitude);
    //console.log('lng: ' + longitude);

    const defaultAPIurl = 'https://geocode.xyz/';
    const queryUrl = `${defaultAPIurl}${latitude},${longitude}?json=1`;
    //console.log('queryUrl: ' + queryUrl);

    request(queryUrl, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            //console.log(body);
            const jsonbody = JSON.parse(body);
            let correctStreetname;

            if (streetnames.hasOwnProperty(jsonbody.staddress)) {
                correctStreetname = streetnames[jsonbody.staddress];
            } else {
                correctStreetname = jsonbody.staddress;
            }

            //console.log('street: ' + correctStreetname);
            //console.log('house: ' + jsonbody.stnumber);
            res.send({
                'street': correctStreetname,
                'house': jsonbody.stnumber
            })
        }
    })

})


app.post('/find-address', (req, res) => {
    const startAddress = req.body.address;
    const destCoords = req.body.coords;

    let searchURL = parseAPIurl(startAddress);

    let coords;

    rp(searchURL, (error, response, body) => {
        //console.log('päästiin ekaan requestiin :D');
        if (!error && response.statusCode === 200) {
            try {
                coords = JSON.parse(body)[0].coords;
            } catch (e) {
                console.log('Error ensimmäisessä request-promisessa: ' + e);
            }

            return coords;
        }
    })
    .then(() => {

        if (coords) {
            let queryURL = `http://api.publictransport.tampere.fi/prod/?${process.env.API_KEY}&${process.env.API_PASS}&request=route&from=${coords}&to=${destCoords}&show=1&Detail=limited`;

            rp(queryURL, (error, response, body) => {
                if (!error && response.statusCode === 200) {
                    res.send(body);
                }
            })
        } else {
            res.send({error: 'something went wrong with the request on server ¯\\_(ツ)_/¯'})
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

function parseAPIurl(address) {
    const defaultAPIurl = 'http://api.publictransport.tampere.fi/prod/?request=geocode&format=json&cities=tampere';

    //manually encoding address to url suitable
    // ä to %C3%A4
    // ö to %C3%B6
    // å to %C3%A5
    let encodedAddress = address.toLowerCase().split('').map(letter => {
        if (letter === 'ä') {
            return '%C3%A4';
        } else if (letter === 'ö') {
            return '%C3%B6';
        } else if (letter === 'å') {
            return '%C3%A5';
        } else {
            return letter; //if no encoding needed for the character
        }
    }).join('');

    let fromPart = 'key=' + encodedAddress.trim().split(' ').join('+');
    const fullAPIurl = defaultAPIurl + '&' + process.env.API_KEY + '&' + process.env.API_PASS + '&' + fromPart ;
    //console.log(fullAPIurl);
    return fullAPIurl;
}
