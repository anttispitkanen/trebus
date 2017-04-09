import React from 'react';
import Hotspots from './Hotspots.jsx';

export default class MyLocation extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            latitude: null,
            longitude: null,
            startingAddress: null,
            locatingFailed: false
        }
    }


    locateMe() {
        if (navigator.geolocation) {

            this.setState({
                latitude: null,
                longitude: null,
                startingAddress: null,
                locatingFailed: false
            })

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

                //this one for debugging: set the address manually
                this.setState({ locatingFailed: true })

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
                    this.setState({
                        startingAddress: data.street + ' ' + data.house
                    });
                })
                .catch(e => {
                    console.log(e);
                })
            }, failure => {
                console.log(failure.message);
                this.setState({
                    locatingFailed: true
                })
            })

        } else {
            alert('no geolocation available :/');

        }
    }


    manualAddress(event) {
        event.preventDefault();

        if (document.getElementById('address-from').value.length >= 3) {
            this.setState({
                startingAddress: document.getElementById('address-from').value,
                locatingFailed: false
            })

            document.getElementById('address-from').value = '';
        }
    }


    componentDidMount() {
        this.locateMe();
    }


    render() {

        if (this.state.locatingFailed) {
            return(
                <div>
                    <div className="my-location">
                        <i className="location-marker fa fa-map-marker" aria-hidden="true"></i>
                        <ul>
                            <li>Can't seem to locate you.</li>
                            <li>Wanna tell me where you are?</li>
                            <li>
                                <form className="starting-address-form" onSubmit={this.manualAddress.bind(this)}>
                                    <input className="address-from" id="address-from" type="text" placeholder="Your address"></input>
                                    <input type="submit" value="Done" className="button" />
                                </form>
                            </li>
                        </ul>

                    </div>

                </div>
            )
        }

        if (this.state.startingAddress && (this.state.latitude === null || this.state.longitude === null)) {
            return(

                <div>
                    <div className="my-location">
                        <i className="location-marker fa fa-map-marker" aria-hidden="true"></i>
                        <ul>
                            <li>Address: {this.state.startingAddress}</li>
                        </ul>
                        <div className="button" onClick={this.locateMe.bind(this)}>Locate me!</div>
                    </div>

                    <div>
                        <Hotspots startingAddress={this.state.startingAddress} />
                    </div>
                </div>
            )
        }

        if (this.state.latitude === null || this.state.longitude === null) {
            return (
                <div className="my-location">
                    <i className="location-marker location-spin fa fa-map-marker" aria-hidden="true"></i>
                    <p>Locating you...</p>
                </div>
            )
        }

        if (this.state.startingAddress === null) {
            return(
                <div>
                    <div className="my-location">
                        <i className="location-marker location-spin fa fa-map-marker" aria-hidden="true"></i>
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
                    <i className="location-marker fa fa-map-marker" aria-hidden="true"></i>
                    <ul>
                        <li>Latitude: {this.state.latitude}</li>
                        <li>Longitude: {this.state.longitude}</li>
                        <li>Address: {this.state.startingAddress}</li>
                    </ul>
                    <div className="button" onClick={this.locateMe.bind(this)}>Locate me!</div>
                </div>

                <div>
                    <Hotspots startingAddress={this.state.startingAddress} />
                </div>
            </div>
        )
    }
}
