'use strict';

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
/* UPDATE */

/*
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
*/
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
/*
    })
})
*/

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
/*
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
*/

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
/* INPUT ADDRESS HANDLING */

var addressFromForm = document.getElementById('address-from-form');
var addressFrom = document.getElementById('address-from');

addressFromForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (addressFrom.value.length > 0) {
        var mockData = `<li>${addressFrom.value}</li>`;
        document.getElementById('added-addresses').innerHTML = mockData;

        fetch('find-address', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify({
                'address': addressFrom.value
            })
        })
        .then(res => {
            if (res.ok) {
                return res.json();
            } else {
                throw Error('error in client promise :DD');
                return 'tuli mutka matkaan :/';
            }
        })
        .then(data => {
            if (data.error) {
                alert(data.error);
            } else {
                console.log(data[0][0]);
                parseRouteData(data[0][0]);
            }
        })
        .catch(e => {
            console.log(e);
        })
    }



    //clear the input field at the end
    document.getElementById('address-from').value = '';
})

//var addressFromButton = document.getElementById('address-from-button');


//addressFromButton.addEventListener('su')

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
/* TESTING FETCHING CONTENT */
/*
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
})
*/

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
/* HELPER FUNCTIONS */

//helper function parses and renders route info
function parseRouteData(routeDataObject) {
    document.getElementById('departure').innerHTML = parseDeparture(routeDataObject);
    document.getElementById('bus-num').innerHTML = parseLineNum(routeDataObject);
    document.getElementById('arrival').innerHTML = parseArrival(routeDataObject);
    document.getElementById('starting-point').innerHTML = parseStartingPoint(routeDataObject);
    document.getElementById('duration').innerHTML = parseMinsToArrival(routeDataObject);
}

//separate functions for each data item
function parseMinsToArrival(routeDataObject) {
    var dateNow = new Date();

    //current time as minutes (from 0:00)
    var timeNow = 60 * dateNow.getHours() + dateNow.getMinutes();

    var arrival;
    arrival = '' + routeDataObject.legs.slice(-1).pop().locs.slice(-1).pop().arrTime;
    arrival = parseInt(arrival.substr(8, 4)); //arrival time as int hhmm
    var arrHours = Math.floor(arrival/100);
    var arrMinutes = arrival % 100;

    //arrival time as minutes from 0:00
    var arrAsMinutes = arrHours * 60 + arrMinutes;

    var duration = arrAsMinutes - timeNow; //duration in minutes

    if (duration < 0) {
        duration += 1440; //stupid hack to counter problems with date change at midnight
    }
    if (duration <= 60) {
        return duration + ' minutes';
    } else {
        var hours = Math.floor(duration / 60);
        var mins = duration%60;
        if (mins < 10) {
            mins = '0' + mins;
        }
        return hours + 'h ' + mins + ' minutes';
    }
}

function parseStartingPoint(routeDataObject) {
    var startingPoint;
    if (routeDataObject.legs[0].locs.slice(-1).pop().name) {
        startingPoint = routeDataObject.legs[0].locs.slice(-1).pop().name;
    } else {
        return 'Just walk, alright :DD';
    }

    var startingPointQueryString = startingPoint.split(' ').join('+');
    var linkToLissu = `http://lissu.tampere.fi/?mobile=1&key=${startingPointQueryString}`;
    return `<a href="${linkToLissu}" target="_blank">${startingPoint}</a>`
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
        if (routeDataObject.legs.length > 1) {
            departure = routeDataObject.legs[1].locs[0].depTime;
        } else {
            return 'Just walk, alright :DD';
        }

    } else {
        departure = routeDataObject.legs[0].locs[0].depTime;
    }

    return departure.substr(8, 2) + '.' + departure.substr(10, 2);
}

function parseLineNum(routeDataObject) {
    var lineNum;

    if (routeDataObject.legs[0].type === 'walk') {
        if (routeDataObject.legs.length > 1) {
            lineNum = routeDataObject.legs[1].code;
        } else {
            lineNum = 'Just walk, alright :DD';
        }
    } else if (routeDataObject.legs[0].code == 1) {
        lineNum = routeDataObject.legs[0].code;
    } else {
        lineNum = 'Just walk, alright :DD';
    }

    return lineNum;
}

function secondsToMinutes(seconds) {
    return seconds/60;
}



document.getElementById('locate').addEventListener('click', () => {

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
            if (!pos) {
                alert('no https');
            }
            let latitude = pos.coords.latitude;
            let longitude = pos.coords.longitude;
            //alert(latitude + ', ' + longitude);
            document.getElementById('latitude').innerHTML = latitude;
            document.getElementById('longitude').innerHTML = longitude;

            fetch('locate-me', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'latitude': latitude,
                    'longitude': longitude
                })
            })
            .then(res => {
                if (res.ok) { return res.json() }
                else { throw Error('error in client promise :DD')}
            })
            .then(data => {
                console.log(data);
                const street = data.street;
                const num = data.house;
                document.getElementById('fetched-address').innerHTML = street + ' ' + num;
            })

        }, failure => {
            alert('something went wrong, probably with HTTPS ¯\\_(ツ)_/¯');
        })
    } else {
        alert('no geolocation available :/');
    }

})
