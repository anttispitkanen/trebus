import React, { Component } from 'react';
import './App.css';
import Hotspots from './views/Hotspots.jsx';
import Headline from './views/Headline.jsx';
import MyLocation from './views/MyLocation.jsx';


class App extends Component {
    render() {
        return (
            <div className="App">
                <Headline />
                <MyLocation />
                <Hotspots />
            </div>
        );
    }
}

export default App;
