'use strict';



const dotenv = require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const request = require('request');
const rp = require('request-promise');
const axios = require('axios');

const scandinavianAddresses = require('./script/scandinavianAddresses');

app.set('port', (process.env.PORT || 3001));
app.use(express.static(__dirname + '/public'));

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
}


app.listen(app.get('port'), () => {
    console.log('listening on ' + app.get('port'));
})

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');



app.post('/route', async (req, res) => {
    // const startAddress = req.body.address;
    // const startCoords = req.body.startingTreCoords;
    const startCoords = req.body.startCoords;
    const destCoords = req.body.coords;
    let queryURL = `http://api.publictransport.tampere.fi/prod/?${process.env.API_KEY}&${process.env.API_PASS}&request=route&from=${startCoords}&to=${destCoords}&show=1&Detail=limited&epsg_in=wgs84`;

    try {
        const response = await axios.get(queryURL);
        res.send(response.data);
    } catch (e) {
        console.log(e);
    }

})



app.post('/locate-me', async (req, res) => {
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;

    const defaultAPIurl = 'https://geocode.xyz/';
    const queryUrl = `${defaultAPIurl}${latitude},${longitude}?json=1`;

    try {
        const response = await axios.get(queryUrl);
        const data = response.data;

        let correctStreetname;

        if (scandinavianAddresses.hasOwnProperty(data.staddress)) {
            correctStreetname = scandinavianAddresses[data.staddress];
        } else {
            correctStreetname = data.staddress;
        }

        const address = correctStreetname + ' ' + data.stnumber;
        const searchURL = parseAPIurl(address);

        try {
            const treCoordsResponse = await axios.get(searchURL);
            // console.log('treCoords: ' + treCoordsResponse.data[0].coords);
            const treCoords = treCoordsResponse.data[0].coords;

            if (treCoords) {
                res.send({
                    'street': correctStreetname,
                    'house': data.stnumber,
                    'treCoords': treCoords
                })
            } else {
                res.send({
                    'street': correctStreetname,
                    'house': data.stnumber,
                    'error': 'Could not locate you'
                })
            }
        } catch (e) {
            console.log('lol ei onnistunut noilla koordinaateilla');
        }



    } catch (e) {
        console.log('************* ERROR *************');
        // console.log(e);
        res.send({
            'error': 'Could not locate you'
        })
    }

})


// function parseAPIurl(address) {
//     const defaultAPIurl = 'http://api.publictransport.tampere.fi/prod/?request=geocode&format=json&cities=tampere';
//     let fromPart = 'key=' + encodeURIComponent(address);
//     const fullAPIurl = defaultAPIurl + '&' + process.env.API_KEY + '&' + process.env.API_PASS + '&' + fromPart;
//     //console.log(fullAPIurl);
//     return fullAPIurl;
// }

function parseAPIurl(address) {
    const defaultAPIurl = 'http://api.publictransport.tampere.fi/prod/?request=geocode&format=json&cities=tampere&epsg_out=wgs84';
    let fromPart = 'key=' + encodeURIComponent(address);
    const fullAPIurl = defaultAPIurl + '&' + process.env.API_KEY + '&' + process.env.API_PASS + '&' + fromPart;
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
