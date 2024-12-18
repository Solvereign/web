import React from "react";
import "./styles.css";

/**
 * Define States, a React component of CS142 Project 4, Problem 2. The model
 * data for this view (the state names) is available at
 * window.cs142models.statesModel().
 */
class States extends React.Component {
  constructor(props) {
    super(props);
    console.log(
      "window.cs142models.statesModel()",
      window.cs142models.statesModel()
    );
	this.state = {
		allStates: window.cs142models.statesModel(),
		states: window.cs142models.statesModel(),
		input: "",
	};
  }

  handleChange = (event) => {

	this.setState({input: event.target.value});
	this.setState({states: this.state.allStates.filter(
		(val) => val.toUpperCase().includes(event.target.value.toUpperCase())
		)});

  };

  render() {
	// const myStates = this.state.states;
    return( 
	<div>
		<input 
			className="cs142-states-input"
			type="text" 
			value = {this.state.input}
			onChange = {this.handleChange}
		/>		
		{this.state.states == 0 ? <p>haisan utga oldsongui</p> : <ul className="cs142-states-list">{this.state.states.map( (s) => <li key={s}>{s}</li>)}</ul>}
	</div>
	);
  }
}

export default States;
