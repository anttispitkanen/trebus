'use strict';

const dotenv = require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// const MongoClient = require('mongodb').MongoClient;

const request = require('request');
const rp = require('request-promise');

const scandinavianAddresses = require('./script/scandinavianAddresses');

let db;

app.set('port', (process.env.PORT || 3001));
app.use(express.static(__dirname + '/public'));

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
}

// MongoClient.connect(process.env.MONGO_URL, (err, database) => {
//     if (err) {
//         return console.log(err);
//     }
//
//     db = database;
//     app.listen(app.get('port'), () => {
//         console.log('listening on ' + app.get('port'));
//     })
// })

app.listen(app.get('port'), () => {
    console.log('listening on ' + app.get('port'));
})

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');


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

            if (scandinavianAddresses.hasOwnProperty(jsonbody.staddress)) {
                correctStreetname = scandinavianAddresses[jsonbody.staddress];
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


/*
* Receives a route query with starting point address and destination (hotspot) coordinates
* Returns the route info as a JSON data object
*/
app.post('/find-address', (req, res) => {
    const startAddress = req.body.address;
    const destCoords = req.body.coords;

    let searchURL = parseAPIurl(startAddress);

    let coords;

    //FIXME: this is done unnecessarily for every route
    //instead do it when locating the user, return the tre-coords to client
    //and do the individual routing with those

    //first fetch the
    rp(searchURL, (error, response, body) => {
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



app.post('/find-tre-coords', (req, res) => {
    const inputAddress = req.body.address;
    const queryURL = parseAPIurl(inputAddress);

    let coords;

    request(queryURL, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            try {
                coords = JSON.parse(body)[0].coords;
            } catch (e) {
                console.log('Error syötetyn hotspotin koordinaatteja hakiessa: ' + e);
            }

            res.send({
                'coords': coords
            })
        }
    })
})
