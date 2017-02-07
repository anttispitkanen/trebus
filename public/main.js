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
test.addEventListener('click', () => {
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
