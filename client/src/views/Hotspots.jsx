/* eslint-disable */

import React from 'react';
import Hotspot from './Hotspot.jsx';

const definedHotspots = [
    {
        name: 'Koti',
        coords: '3330354.500000,6824717.000000'
    },
    {
        name: 'Keskustori',
        coords: '3327691,6825408',
    },
    {
        name: 'Yliopisto',
        coords: '3328662.500000,6825009.000000'
    },
    {
        name: 'TTY',
        coords: '3332742.500000,6819846.000000'
    }
]


export default class Test extends React.Component {

    render() {
        return(
            <div>
                {definedHotspots.map(hs => {
                    return (<Hotspot name={hs.name} coords={hs.coords} startingAddress={this.props.startingAddress} key={hs.coords} />)
                })}
            </div>
        )
    }
}
