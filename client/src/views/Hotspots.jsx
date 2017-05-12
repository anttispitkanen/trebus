/* eslint-disable */

import React from 'react';
import Hotspot from './Hotspot.jsx';
import AddHotspot from './AddHotspot.jsx';


const storage = window.localStorage;


export default class Test extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            numHotspots: null
        }
    }

    //if no addresses in storage, init empty storage
    //count the number of hotspots
    componentWillMount() {
        let addresses = JSON.parse(storage.getItem('addresses'));

        if (!addresses) {
            //if no addresses, init with empty array
            storage.setItem('addresses', JSON.stringify([]));
        }

        let numHotspots = JSON.parse(storage.getItem('addresses')).length;

        this.setState({
            numHotspots: numHotspots
        })
    }

    countHotspots(newNum) {
        this.setState({
            numHotspots: newNum
        })
    }


    render() {

        let addresses = JSON.parse(storage.getItem('addresses'));

        if (this.state.numHotspots < 8) {
            return(
                <div className="hotspots">

                    {addresses.map(address => {
                        return (
                            <Hotspot name={address.name}
                                    coords={address.coords}
                                    startingAddress={this.props.startingAddress}
                                    startingTreCoords={this.props.startingTreCoords}
                                    key={address.coords}
                                    countHotspots={this.countHotspots.bind(this)} />
                        )
                    })}

                    <AddHotspot countHotspots={this.countHotspots.bind(this)}/>
                </div>
            )

        } else {
            return(
                <div className="hotspots">

                    {addresses.map(address => {
                        return (
                            <Hotspot name={address.name}
                                    coords={address.coords}
                                    startingAddress={this.props.startingAddress}
                                    startingTreCoords={this.props.startingTreCoords}
                                    key={address.coords}
                                    countHotspots={this.countHotspots.bind(this)} />
                        )
                    })}
                </div>
            )
        }


    }
}
