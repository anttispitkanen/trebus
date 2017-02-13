/* eslint-disable */

import React from 'react';
import Hotspot from './Hotspot.jsx';

const definedHotspots = [
    {
        name: 'Keskustori',
        coords: '3327691,6825408',
    },
    {
        name: 'Koti',
        coords: '3330354.500000,6824717.000000'
    },
    {
        name: 'Yliopisto',
        coords: '3328662.500000,6825009.000000'
    }
]


export default class Test extends React.Component {
    render() {
        return(
            <div>
                <p>Keskustorille:</p>
                <ul>
                    <li>I'll be there in: <span id="duration">¯\_(ツ)_/¯</span></li>
                    <li>Departure time: <span id="departure">¯\_(ツ)_/¯</span></li>
                    <li>Bus number: <span id="bus-num">¯\_(ツ)_/¯</span></li>
                    <li>From: <span id="starting-point">¯\_(ツ)_/¯</span></li>
                    <li>Arrival time: <span id="arrival">¯\_(ツ)_/¯</span></li>
                </ul>

                {definedHotspots.map(hs => {
                    return (<Hotspot name={hs.name} coords={hs.coords} key={hs.coords} />)
                })}
            </div>
        )
    }
}
