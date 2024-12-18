import React from "react";
// import {Typography } from "@mui/material";
// import { Grid, Paper } from "@mui/material";
import fetchModel from "../../lib/fetchModelData";
import "./styles.css";

class Info extends React.Component {
	constructor(props) {
		super(props);
		// console.log(props.match.params.section);
		// console.log(props.match.params.userId);
		if(props.match.params.userId) {this.state = {
				// section: props.match.params.section,
				section: "",
				user: {},
				// version: -1,
			};}
		// else {this.state = {
		// 		section: props.match.params.section, 
		// 		version: 0,
		// 	};}
	}

	componentDidMount() {
		let userId = this.props.match.params.userId;
		// let v = fetchModel("/test/info");
		let u = fetchModel("/user/" + userId);
		u.then( (response) => {
			this.setState({user: response.data, section: this.props.match.params.section});
		}).catch( (e) => console.log(e));

	}
	
	componentDidUpdate(prev) {

		if(this.props.match.params.section !== prev.match.params.section ||
			this.props.match.params.userId !== prev.match.params.userId) {

			let userId = this.props.match.params.userId;
			let u = fetchModel("/user/" + userId);
			u.then( (response) => {
				this.setState({user: response.data, section: this.props.match.params.section});
			}).catch( (e) => console.log(e));
				// this.setState({user: window.cs142models.userModel(this.props.match.params.userId),section: this.props.match.params.section})
			}
	}
	getText() {

			if(this.state.section === "users") return "Details of user " + this.state.user.first_name + " " + this.state.user.last_name;
			else if(this.state.section === "photos") return "Photos of " + this.state.user.first_name + " " + this.state.user.last_name;
			else return "Buruu l gazraa irchihlee dee";
	}

	render() {
		return(
			// <Typography variant="body1">
				<div>
				<p className="topbar-text">{this.getText()}</p>
				</div>
			// </Typography>
		);
	}
}

export default Info;
