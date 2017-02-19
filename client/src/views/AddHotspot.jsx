import React from 'react';


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

        console.log(document.getElementById('add-hotspot-name').value);
        console.log(document.getElementById('add-hotspot-address').value);

        document.getElementById('add-hotspot-name').value = '';
        document.getElementById('add-hotspot-address').value = '';

        this.setState({
            formOpen: false
        })
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
                    </form>
                </div>
            )
        }

    }

}
