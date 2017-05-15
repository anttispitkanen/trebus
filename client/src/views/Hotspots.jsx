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


    moveUp(index) {
        if (index > 0) {
            let addresses = JSON.parse(storage.getItem('addresses'));
            let address = addresses.splice(index, 1)[0];
            addresses.splice(index - 1, 0, address);
            storage.setItem('addresses', JSON.stringify(addresses));

            //hack to force re-render
            this.setState({
                numHotspots: this.state.numHotspots
            })
        }
    }

    moveDown(index) {
        if (index < JSON.parse(storage.getItem('addresses')).length - 1) {
            let addresses = JSON.parse(storage.getItem('addresses'));
            let address = addresses.splice(index, 1)[0];
            addresses.splice(index + 1, 0, address);
            storage.setItem('addresses', JSON.stringify(addresses));

            //hack to force re-render
            this.setState({
                numHotspots: this.state.numHotspots
            })
        }
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
                                    countHotspots={this.countHotspots.bind(this)}
                                    moveUp={this.moveUp.bind(this)}
                                    moveDown={this.moveDown.bind(this)}
                            />
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
                                    countHotspots={this.countHotspots.bind(this)}
                                    moveUp={this.moveUp.bind(this)}
                                    moveDown={this.moveDown.bind(this)}
                             />
                        )
                    })}
                </div>
            )
        }


    }
}
