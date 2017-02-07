'use strict';

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

fetch('joujou', {
    method: 'get',
    headers: {
        'Content-Type': 'application/json'
    }
}).then(res => {
    if (res.ok) { return res.json() }
}).then(data => {
    console.log(data[0][0]);
    document.getElementById('duration').innerHTML += secondsToMinutes(data[0][0].duration) + ' minutes';
    document.getElementById('starting-point').innerHTML += data[0][0].legs[0].locs.slice(-1).pop().name;
    var arrival = data[0][0].legs.slice(-1).pop().locs.slice(-1).pop().arrTime;
    arrival = arrival.substr(8, 2) + '.' + arrival.substr(10, 2);
    document.getElementById('arrival').innerHTML += arrival;
})

function secondsToMinutes(seconds) {
    return seconds/60;
}
