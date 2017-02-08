'use strict';

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
/* UPDATE */

var update = document.getElementById('update');

update.addEventListener('click', function() {
    fetch('addresses', {
        method: 'put',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: 'TTY',
            address: 'Rautatienkatu 25'
        })
    }).then((res) => {
        if (res.ok) {
            return res.json();
        }
    }).then((data) => {
        console.log(data);
        window.location.reload(true);

        /*
        if (data.value) {
            var name = data.value.name;
            var address = data.value.address;
            var newHTML = '<li>' +
                            '<span>' + name + '</span> ' +
                            '<span>' + address + '</span>' +
                            '</li>'
            document.getElementById('addresses').innerHTML += newHTML;
        }
        */
    })
})


/*
var testButton = document.getElementById('test');
testButton.addEventListener('click', () => {
    fetch('test', {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((res) => {
        if (res.ok) { return res.json() }
    }).then((data) => {

        if (data.error) {
            alert(data.error);
        } else {
            console.log(data);
        }
    })
})
*/


///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
/* DELETE */

var deleteButton = document.getElementById('delete-latest');
deleteButton.addEventListener('click', () => {
    fetch('addresses', {
        method: 'delete',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'name': 'TTY'
        })
    }).then(res => {
        if (res.ok) {
            return res.json();
        }
    }).then(data => {
        console.log(data);
        window.location.reload();
    })
});


///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
/* TESTING FETCHING CONTENT */

fetch('joujou', {
    method: 'get',
    headers: {
        'Content-Type': 'application/json'
    }
}).then(res => {
    if (res.ok) { return res.json() }
}).then(data => {
    console.log(data[0][0]);

    //helper function parses and renders route info
    parseRouteData(data[0][0]);

    //KORJAA: tämä on matkan kesto, ei minuutit perille pääsyyn tästä hetkestä
    //pitäisi siis olla ennemmin arrivalin ja nykyhetken eroitus
    document.getElementById('duration').innerHTML += secondsToMinutes(data[0][0].duration) + ' minutes';

    //document.getElementById('starting-point').innerHTML += data[0][0].legs[0].locs.slice(-1).pop().name;
    //var arrival = data[0][0].legs.slice(-1).pop().locs.slice(-1).pop().arrTime;
    //arrival = arrival.substr(8, 2) + '.' + arrival.substr(10, 2);
    //document.getElementById('arrival').innerHTML += arrival;
})


///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
/* HELPER FUNCTIONS */

//helper function parses and renders route info
function parseRouteData(routeDataObject) {
    document.getElementById('departure').innerHTML += parseDeparture(routeDataObject);
    document.getElementById('bus-num').innerHTML += parseLineNum(routeDataObject);
    document.getElementById('arrival').innerHTML += parseArrival(routeDataObject);
    document.getElementById('starting-point').innerHTML += parseStartingPoint(routeDataObject);
}

//separate functions for each data item
function parseStartingPoint(routeDataObject) {
    var startingPoint;
    startingPoint = routeDataObject.legs[0].locs.slice(-1).pop().name;
    return startingPoint;
}

function parseArrival(routeDataObject) {
    var arrival;
    arrival = routeDataObject.legs.slice(-1).pop().locs.slice(-1).pop().arrTime;
    arrival = arrival.substr(8, 2) + '.' + arrival.substr(10, 2);
    return arrival;
}

function parseDeparture(routeDataObject) {
    var departure;

    if (routeDataObject.legs[0].type === 'walk') {
        departure = routeDataObject.legs[1].locs[0].depTime;
    } else {
        departure = routeDataObject.legs[0].locs[0].depTime;
    }

    return departure.substr(8, 2) + '.' + departure.substr(10, 2);
}

function parseLineNum(routeDataObject) {
    var lineNum;

    if (routeDataObject.legs[0].type === 'walk') {
        lineNum = routeDataObject.legs[1].code;
    } else {
        lineNum = routeDataObject.legs[0].code;
    }

    return lineNum;
}

function secondsToMinutes(seconds) {
    return seconds/60;
}
