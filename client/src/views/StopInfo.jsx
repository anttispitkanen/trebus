import React from 'react';


export default class StopInfo extends React.Component {

    render() {

        if (this.props.justWalk) {
            return null;
        }

        return(
            <li>From: <a href={this.props.linkToLissu} target="_blank">{this.props.departStop}</a></li>
        )
    }
}
