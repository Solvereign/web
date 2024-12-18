import React from "react";

class Counter extends React.Component {
    constructor(props){
        super(props);
        console.log(props);
        this.state = {
            counter: props.counter
        }
    }
    componentDidMount(){
        const incFunc = ()=>{
            this.setState({counter: this.state.counter + 1})
            this.props.callback(this.state.counter);
        };
        this.timerID = setInterval(incFunc, 2000);
    }


    componentWillUnmount(){
        clearInterval(this.timerID);
    }

    componentDidUpdate(){
        // this.props.callback(this.state.counter);
    }
	
    render(){
        return (
            <div>{this.state.counter}</div>
        );
    }
}
export default Counter;