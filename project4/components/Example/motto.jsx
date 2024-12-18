import React from 'react';

class Motto extends React.Component {
	constructor(props) {
		super(props);
		// this.state = {motto:"Disco Inferno"};
		this.state = {motto:"audio, video, disco"};
	}

	handleChange = (event) => {
		this.setState({motto: event.target.value});
	};

	render() {
		return(
			<div>
				<p>{this.state.motto}</p>
				<input 
					type="text"
					value = {this.state.motto}
					onChange = {this.handleChange}
				/>				
			</div>
		);
	}
}

export default Motto;