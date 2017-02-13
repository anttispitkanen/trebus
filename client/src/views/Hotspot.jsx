import React from 'react';

export default class Hotspot extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount() {
        this.setState({

        })
    }

    render() {
        return(
            <div className="single-hotspot">
                <h3>{this.props.name}</h3>
                <p>Tre-coordinates: {this.props.coords}</p>
            </div>
        )
    }
}
