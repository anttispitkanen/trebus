import React from 'react';

export default class MyLocation extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            latitude: null,
            longitude: null,
            startingAddress: null
        }
    }


    locateMe() {
        if (navigator.geolocation) {

            navigator.geolocation.getCurrentPosition(pos => {
                if (!pos) {
                    alert('no https');
                }

                console.log('lat:' + pos.coords.latitude);
                console.log('lng:' + pos.coords.longitude);

                this.setState({
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude
                })

                fetch('locate-me', {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        'latitude': this.state.latitude,
                        'longitude': this.state.longitude
                    })
                })
                .then(res => {
                    if (res.ok) { return res.json() }
                    else { throw Error('error in client promise :DD')}
                })
                .then(data => {
                    console.log(data);
                    //const street = data.street;
                    //const num = data.house;
                    //state.startingAddress = data.street + ' ' + data.house;

                    this.setState({
                        startingAddress: data.street + ' ' + data.house
                    });
                })
                .catch(e => {
                    console.log(e);
                })
            }, failure => {
                alert('something went wrong, probably with HTTPS ¯\\_(ツ)_/¯');
            })

        } else {
            alert('no geolocation available :/');

        }
    }


    componentDidMount() {
        this.locateMe();
    }

    render() {

        if (this.state.latitude === null || this.state.longitude === null) {
            return <div>Waiting for location...</div>
        }

        return(
            <div className="my-location">
                <button id="locate" onClick={this.locateMe.bind(this)}>Locate me!</button>
                <p>Location:</p>
                <ul>
                    <li>Latitude: <span id="latitude">{this.state.latitude}</span></li>
                    <li>Longitude: <span id="longitude">{this.state.longitude}</span></li>
                    <li>Address: <span id="fetched-address">{this.state.startingAddress}</span></li>
                </ul>
            </div>
        )
    }
}

    /*
    fetch('find-address', {
    method: 'post',
    headers: {
    'Content-Type': 'application/json'
    },
    body: JSON.stringify({
    'address': state.startingAddress
    })
    })
    .then(res => {
    if (res.ok) { return res.json() }
    else { throw Error('error in client promise :DD')}
    })
    .then(data => {
    if (data.error) {
    alert(data.error);
    } else {
    console.log(data[0][0]);
    //parseRouteData(data[0][0]);
    }
    })

    })
    */
