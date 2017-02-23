/* eslint-disable */

import React from 'react';
import Hotspot from './Hotspot.jsx';
import AddHotspot from './AddHotspot.jsx';


const storage = window.localStorage;


export default class Test extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            unrenderedChanges: false
        }
    }


    triggerRender() {
        this.setState({
            unrenderedChanges: !this.state.unrenderedChanges
        })
    }


    render() {

        let addresses = JSON.parse(storage.getItem('addresses'));

        if (!addresses) {
            storage.setItem('addresses', JSON.stringify([]));

            return(
                <div className="hotspots">
                    <AddHotspot triggerRender={this.triggerRender.bind(this)}/>
                </div>
            )
        }

        return(
            <div className="hotspots">

                {addresses.map(address => {
                    return (
                        <Hotspot name={address.name}
                                coords={address.coords}
                                startingAddress={this.props.startingAddress}
                                key={address.coords}
                                triggerRender={this.triggerRender.bind(this)} />
                    )
                })}

                <AddHotspot triggerRender={this.triggerRender.bind(this)}/>
            </div>
        )
    }
}
