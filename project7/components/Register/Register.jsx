import React from "react";

import axios from 'axios';

class Register extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			login_name: "", // 1
			password1: "", // 2
			password2: "", // 4 (6 baiwal pass not match)
			first_name: "", // 8
			last_name: "", // 16
			location: "",
			description: "",
			occupation: "",
			error: -1,
		};
	}

handleLoginNameChange = (event) => {
	this.setState({login_name: event.target.value});
};
handlePasswordChange1 = (event) => {
	this.setState({password1: event.target.value});
};
handlePasswordChange2 = (event) => {
	this.setState({password2: event.target.value});
};
handleFirstNameChange = (event) => {
	this.setState({first_name: event.target.value});
};
handleLastNameChange = (event) => {
	this.setState({last_name: event.target.value});
};
handleLocationChange = (event) => {
	this.setState({location: event.target.value});
};
handleDescriptionChange = (event) => {
	this.setState({description: event.target.value});
};
handleOccupationChange = (event) => {
	this.setState({occupation: event.target.value});
};

getError() {
	switch(this.state.error) {
		case -1: return "";
		case 1: return "login name must not be empty";
		case 2: return "password1 must not be empty";
		case 4: return "password2 must not be empty";
		case 6: return "passwords does not match";
		case 8: return "first name must not be empty";
		case 16: return "last name must not be empty";
		case 32: return "choose different login name";
		default: return "hha";
	}
}
handleRegister = (event) => {
	event.preventDefault();
	console.log("tried to register");
	if(this.state.login_name === "") {
		this.setState({error: 1});
		return;
	}
	if(this.state.password1 === "") {
		this.setState({error: 2});
		return;
	}	
	if(this.state.password2 === "") {
		this.setState({error: 4});
		return;
	}
	if(this.state.password1 !== this.state.password2) {
		this.setState({error: 6});
		return;
	}
	if(this.state.first_name === "") {
	this.setState({error: 8});
	return;
	}
	if(this.state.last_name === "") {
	this.setState({error: 16});
	return;
	}
	
	const register = axios.post("/user", {
		login_name: this.state.login_name,
		password: this.state.password1,
		first_name: this.state.first_name,
		last_name: this.state.last_name,
		location: this.state.location,
		description: this.state.description,
		occupation: this.state.occupation,
	});
	register.then( (response) => {
		sessionStorage.setItem("isLoggedIn", true);
		sessionStorage.setItem("_id", response.data._id);
		sessionStorage.setItem("first_name", this.state.first_name);
		sessionStorage.setItem("last_name", this.state.last_name);
		let userProfile = "http://localhost:3000/photo-share.html#/users/" + response.data._id;
		window.location.assign(userProfile);
		window.location.reload();

	})
	.catch((err) => {
		console.log(err);
		this.setState({error: 32});
	});

};
	render() {
		return(
			<div>
				<form onSubmit={this.handleRegister}>
					<p className="error">
						{this.getError()}
					</p>
					
					<label>Login name: </label> <br/>
					<input type="text" value={this.state.login_name} onChange={this.handleLoginNameChange}/>
					<br /><br />
					
					<label>Password1: </label> <br />
					<input type="password" value={this.state.password1} onChange={this.handlePasswordChange1}/>
					<br /><br />
					
					<label>Password2: </label> <br/>
					<input type="password" value={this.state.password2} onChange={this.handlePasswordChange2}/>
					<br /><br />

					<label>First Name: </label> <br/>
					<input type="text" value={this.state.first_name} onChange={this.handleFirstNameChange}/>
					<br /><br />

					<label>Last Name: </label> <br/>
					<input type="text" value={this.state.last_name} onChange={this.handleLastNameChange}/>
					<br /><br />

					<label>Location: </label> <br/>
					<input type="text" value={this.state.location} onChange={this.handleLocationChange}/>
					<br /><br />

					<label>Description: </label> <br/>
					{/* <input type="text" onChange={this.handleDescriptionChange}/> */}
					<textarea cols="30" rows="5" value={this.state.description} onChange={this.handleDescriptionChange}></textarea>
					<br /><br />

					<label>Occupation: </label> <br/>
					<textarea cols="30" rows="5" value={this.state.occupation} onChange={this.handleOccupationChange}></textarea>
					{/* <input type="text" onChange={this.handleOccupationChange}/> */}
					<br/><br />

					<button type="submit">
						Register
					</button>
				</form>

			</div>
		);
	}
}

export default Register;