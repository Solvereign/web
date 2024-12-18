import React from 'react';
import Counter from './Counter';
import CounterFunction from './CounterFunction';
class ReactAppView extends React.Component {
    constructor(props) {
        super(props);
        this.state = { yourName: "asdaf", counter:0 };
        // this.handleChange = this.handleChange.bind(this);
    }

    // handleChange(event) {
    //         this.setState({ yourName: event.target.value });
    //     }
    handleChange = (event) => {
        this.setState({ yourName: event.target.value });
    };

    handleCounter = (counter) => {
        this.setState({ counter: counter });
    }

    // render() {
    //         let label = React.createElement('label', null, 'Name: ');
    //         let input = React.createElement('input', {
    //             type: 'text',
    //             value: this.state.yourName,
    //             onChange: (event) => this.handleChange(event)
    //         });
    //         let h1 = React.createElement('h1', null,
    //             'Hello ', this.state.yourName, '!');
    //         return React.createElement('div', null, label, input, h1);
    //     }
        // render() {
        //     return React.createElement('div', null, React.createElement('label', null, 'Name: '), React.createElement('input', { type: 'text', value: this.state.yourName, onChange: (event) => this.handleChange(event) }),
        //         React.createElement('h1', null,
        //             'Hello ', this.state.yourName, '!')
        //     );
        // }

    render() {
        return ( 
            <div>
                <label>Нэр:</label>
                <input 
                    type="text"
                    value={this.state.yourName}
                    onChange={this.handleChange}
                />
                <h1>Hello {this.state.yourName}</h1>
                <p>This comes from child: {this.state.counter}</p>
                <Counter counter={10} callback={this.handleCounter}/>
                <CounterFunction count={20}></CounterFunction>
            </div>  
        );
    }

}
export default ReactAppView;