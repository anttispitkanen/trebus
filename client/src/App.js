import React, { Component } from 'react';
import './App.css';
import Headline from './views/Headline.jsx';
import MyLocation from './views/MyLocation.jsx';


class App extends Component {
    render() {
        return (
            <div className="App">
                <Headline />
                <MyLocation />
            </div>
        );
    }
}

export default App;
