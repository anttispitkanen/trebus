import React from 'react';
import Helpers from '../Helpers.js';

let storage = window.localStorage;

export default class Hotspot extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            thereIn: null, //this will be the durationTimeObject with fields for hoursNum, hoursText, minsNum, minsText
            departureTime: null,
            busNumber: null,
            departAddress: null,
            arrivalTime: null
        }
    }

    componentDidMount() {
        fetch('find-address', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'address': this.props.startingAddress,
                'coords': this.props.coords
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
                //console.log(data[0][0]);
                let routeData = data[0][0];

                //here we have the route data that we need to parse and insert into state
                this.setState({
                    thereIn: Helpers.parseMinsToArrival(routeData),
                    departureTime: Helpers.parseDeparture(routeData),
                    busNumber: Helpers.parseLineNum(routeData),
                    departAddress: Helpers.parseStartingPoint(routeData),
                    arrivalTime: Helpers.parseArrival(routeData)
                })

            }
        })
    }

    deleteHotspot() {
        //only delete after confiming
        if (confirm(`Delete ${this.props.name}?`)) {
            console.log('deleting ' + this.props.name + '! :DD');

            let addresses = JSON.parse(storage.getItem('addresses'));

            let indexOfHotspotToRemove = null;

            addresses.forEach((obj, i) => {
                if (obj.name === this.props.name) {
                    indexOfHotspotToRemove = i;
                }
            })

            addresses.splice(indexOfHotspotToRemove, 1);

            let newNumOfHotspots = addresses.length;

            storage.setItem('addresses', JSON.stringify(addresses));

            this.props.countHotspots(newNumOfHotspots);
        }
    }



    render() {
        if (this.state.thereIn === null || this.state.departureTime === null
            || this.state.busNumber === null || this.state.departAddress === null
            || this.state.arrivalTime === null) {
            return(
                <div className="single-hotspot">
                    <h3>{this.props.name}</h3>
                    <p>Fetching route...</p>
                    <img src="wheel.svg" alt="loading wheel"></img>
                </div>
            )
        }

        const hoursNum = this.state.thereIn.hoursNum;
        const hours = this.state.thereIn.hoursText;
        const minsNum = this.state.thereIn.minsNum;
        const mins = this.state.thereIn.minsText;

        if (!this.state.departAddress.infoLink) {
            return(
                <div className="single-hotspot">
                    <h3>{this.props.name}</h3>
                        <i className="fa fa-times delete-hotspot" onClick={this.deleteHotspot.bind(this)}></i>
                        <ul>
                            <li>
                                <span>{hoursNum}</span> {hours} <span>{minsNum}</span> {mins}
                            </li>
                            <li>Departure time: {this.state.departureTime}</li>
                            <li>Bus number: {this.state.busNumber}</li>
                            <li>From: {this.state.departAddress}</li>
                            <li>Arrival time: {this.state.arrivalTime}</li>
                        </ul>
                </div>
            )
        }

        return(
            <div className="single-hotspot">
                <h3>{this.props.name}</h3>
                    <i className="fa fa-times delete-hotspot" onClick={this.deleteHotspot.bind(this)}></i>
                    <ul>
                        <li>
                            <span>{hoursNum}</span> {hours} <span>{minsNum}</span> {mins}
                        </li>
                        <li>Departure time: {this.state.departureTime}</li>
                        <li>Bus number: {this.state.busNumber}</li>
                        <li>From: <a href={this.state.departAddress.infoLink} target="_blank">
                                    {this.state.departAddress.departStop}
                                </a>
                        </li>
                        <li>Arrival time: {this.state.arrivalTime}</li>
                    </ul>
            </div>
        )
    }
}
