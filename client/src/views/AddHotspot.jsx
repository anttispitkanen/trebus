import React from 'react';


const storage = window.localStorage;


export default class AddHotspot extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            formOpen: false
        }
    }

    openForm() {
        this.setState({
            formOpen: true
        })
    }


    addHotspot(event) {
        event.preventDefault();

        this.saveHotspot();

        this.resetForm();

        this.setState({
            formOpen: false
        })
    }

    saveHotspot() {
        let name = document.getElementById('add-hotspot-name').value;
        let address = document.getElementById('add-hotspot-address').value;
        let coords = null;

        fetch('find-tre-coords', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'address': address
            })
        })
        .then(res => {
            if (res.ok) { return res.json() }
            else { throw Error('error in client promise when fetching hotspot tre-coords')}
        })
        .then(data => {
            //console.log(data);

            //magic happens here
            if (data.coords) {
                coords = data.coords;
                this.addToLocalstorage(name, address, coords);

            } else {
                alert('No such address found in Tampere');
            }

        })
        .catch(e => {
            console.log(e);
        })
    }

    addToLocalstorage(name, address, coords) {

        let addresses = JSON.parse(storage.getItem('addresses'));

        let newNumOfHotspots = addresses.length + 1;

        addresses.push({
            name: name,
            address: address,
            coords: coords
        })
        
        storage.setItem('addresses', JSON.stringify(addresses));

        this.props.countHotspots(newNumOfHotspots);
    }

    cancel() {
        this.resetForm();
        this.setState({
            formOpen: false
        })
    }

    resetForm() {
        document.getElementById('add-hotspot-name').value = '';
        document.getElementById('add-hotspot-address').value = '';
    }


    render() {

        if (!this.state.formOpen) {
            return(
                <div className="single-hotspot add-hotspot">
                    <div className="plus-sign" onClick={this.openForm.bind(this)}>+</div>
                </div>
            )
        }


        if (this.state.formOpen) {
            return(
                <div className="single-hotspot add-hotspot-form">
                    <form onSubmit={this.addHotspot.bind(this)}>
                        <input id="add-hotspot-name" type="text" placeholder="Hotspot name"></input><br />
                        <input id="add-hotspot-address" type="text" placeholder="Address"></input><br />
                        <input type="submit" value="Add" className="button"></input>
                        <input type="button" value="Cancel" className="button cancel" onClick={this.cancel.bind(this)}></input>
                    </form>
                </div>
            )
        }

    }

}
