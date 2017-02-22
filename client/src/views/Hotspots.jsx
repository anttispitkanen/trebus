/* eslint-disable */

import React from 'react';
import Hotspot from './Hotspot.jsx';
import AddHotspot from './AddHotspot.jsx';

let fakeState = require('../FakeState.js');

/*
const definedHotspots = [
    {
        name: 'Home',
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
*/


const storage = window.localStorage;


export default class Test extends React.Component {



    render() {

        let addresses = JSON.parse(storage.getItem('addresses'));

        if (!addresses) {
            storage.setItem('addresses', JSON.stringify([]));

            return(
                <div className="hotspots">
                    <AddHotspot />
                </div>
            )
        }

        return(
            <div className="hotspots">

                {addresses.map(address => {
                    return (<Hotspot name={address.name} coords={address.coords} startingAddress={this.props.startingAddress} key={address.coords}/>)
                })}

                <AddHotspot />
            </div>
        )
    }
}

/*
storage.setItem('addresses', JSON.stringify([{
    name: 'Rautatieasema',
    address: 'Testiosoite 1',
    coords: '3328298.500000,6825379.000000'
},
{
    name: 'TAMK',
    address: 'Teiskontie 33',
    coords: '3330322.500000,6825786.500000'
}]))

let addresses = JSON.parse(storage.getItem('addresses'));

console.log('as JSON:');
console.log(addresses);
*/

/*{definedHotspots.map(hs => {
    return (<Hotspot name={hs.name} coords={hs.coords} startingAddress={this.props.startingAddress} key={hs.coords} />)
})}*/
