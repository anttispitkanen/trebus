const fs = require('fs');
const request = require('request');

const url = 'http://opendata.navici.com/tampere/opendata/ows?service=WFS&version=2.0.0&request=GetFeature&typeName=opendata:ONK_NMR_MVIEW&outputFormat=json';

let scandinavianStreetnames = [];

request(url, (error, response, body) => {
    if (!error && response.statusCode === 200) {
        const features = JSON.parse(body).features;

        features.map((feature) => {
            const KADUNNIMI = feature.properties.KADUNNIMI;

            if (scandinavianStreetnames.indexOf(KADUNNIMI) === -1) {
                if (KADUNNIMI.match(/[ÅåÄäÖö]/)) {
                    scandinavianStreetnames.push(KADUNNIMI);
                }
            }
        })

        //console.log(scandinavianStreetnames);

        scandinavianStreetnames.map((street) => {
            streetName = street + '\n'
            fs.writeFile('output.txt', streetName, {flag: 'a'}, (err) => {
                if (err) console.error(err);
                console.log(street + ' saved!');
            })
        })

    }
})
