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
                <p className="copyright">© 2017 <a href="https://github.com/anttispitkanen" target="_blank">Antti Pitkänen</a></p>
            </div>
        );
    }
}

export default App;
