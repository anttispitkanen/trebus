import React from 'react';
import Hotspots from './Hotspots.jsx';

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

                //console.log('lat:' + pos.coords.latitude);
                //console.log('lng:' + pos.coords.longitude);

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
                    //console.log(data);

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
            //console.log('no coordinates yet');
            return <div>Waiting for location...</div>
        }

        if (this.state.startingAddress === null) {
            //console.log('no address yet');
            return(
                <div>
                    <div className="my-location">
                        <p>Location:</p>
                        <ul>
                            <li>Latitude: {this.state.latitude}</li>
                            <li>Longitude: {this.state.longitude}</li>
                            <li>Address: Fetching address...</li>
                        </ul>
                    </div>

                </div>
            )
        }

        return(

            <div>
                <div className="my-location">
                    <p>Location:</p>
                    <ul>
                        <li>Latitude: {this.state.latitude}</li>
                        <li>Longitude: {this.state.longitude}</li>
                        <li>Address: {this.state.startingAddress}</li>
                    </ul>
                    <button onClick={this.locateMe.bind(this)}>Locate me!</button>
                </div>

                <div>
                    <Hotspots startingAddress={this.state.startingAddress} />
                </div>
            </div>
        )
    }
}
