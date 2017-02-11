const react = window.React;
const reactDOM = window.ReactDOM;

class Test extends React.Component {

    jee() {
        alert('JEEE :DD');
    }

    render() {
        return(
            <p onClick={this.jee}>Jee klikkaa mua :DD</p>
        )
    }
}

ReactDOM.render(
    <Test />,
    document.getElementById('react-target')
)
