import React from "react";
import States from "../States";
import Example from "../Example";

class Dynamic extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			current: "Example",
			next: "States",
		};
	}

	handleButtonClick = () => {
		// [this.state.current, this.state.next] = [this.state.next, this.state.current];
		// this.setState({count: this.state.count + 1});
		this.setState({
			current: this.state.next,
			next: this.state.current,
		});
	};

	render() {
		return(
		<div>
			<button onClick={this.handleButtonClick}>
				Switch to {this.state.next}
			</button>
			{
				this.state.current === "Example" ? <Example /> : <States />
			}
		</div>
	);}

}

export default Dynamic;