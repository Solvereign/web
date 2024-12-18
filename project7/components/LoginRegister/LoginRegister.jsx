import React from "react";
// import Button from "@mui/material";
import { HashRouter, Link} from "react-router-dom";
import axios from 'axios';
import "./LoginRegister.css";
// const {axios} = require("axios");
class LoginRegister extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			login_name: "",
			password: "",
			error: -1,
			// -1 baiwal yu ch uzuulehgui
			// 1 baiwal username hooson
			// 2 baiwal password hooson
			// 4 baiwal newterch chadaagui
		};
		// eniig ashiglah, arrow function ashiglah ylgaatai yu:
		// this.handleLoginNameChange = this.handleLoginNameChange.bind(this);
		// this.handlePasswordChange = this.handlePasswordChange.bind(this);
	}

	componentDidMount() {
		const req = axios.get("/logged");
		req.then( (response) => {
			sessionStorage.setItem("isLoggedIn", true);
			sessionStorage.setItem("first_name", response.data.first_name);
			sessionStorage.setItem("last_name", response.data.last_name);
			sessionStorage.setItem("_id", response.data._id);
			let userProfile = "http://localhost:3000/photo-share.html#/users/" + response.data._id;
			window.location.assign(userProfile);
			window.location.reload();
		}) 	
		.catch( (err) => {
			console.log("please log in");
		});
	}

	getError() {
		switch(this.state.error) {
			case -1: return "";
			case 1: return "username can't be empty";
			case 2: return "password can't be empty";
			case 4: return "username, passwordoo shalgana uu";
			default: return "bruh";
		}
	}

	handleLoginNameChange = (event) => {
		this.setState({login_name: event.target.value});
	};

	handlePasswordChange = (event) =>  {
		this.setState({password: event.target.value});
	};

	handleSubmit = (event) => {
		// event.preventDefault();
		// const username = event.target.username.value;
		// const password = event.target.password.value;


		if(this.state.login_name !== ""){
			if(this.state.password !== "") {
				const login = axios.post("/admin/login", {
					login_name: this.state.login_name,
					password: this.state.password
				});

				login.then( (response) => {
					// console.log(response);
					// console.log("bru");
					sessionStorage.setItem("isLoggedIn", true);
					sessionStorage.setItem("first_name", response.data.first_name);
					sessionStorage.setItem("last_name", response.data.last_name);
					sessionStorage.setItem("_id", response.data._id);
					// this.render();
					let userProfile = "http://localhost:3000/photo-share.html#/users/" + response.data._id;
					window.location.assign(userProfile);
					window.location.reload();
					console.log(userProfile, sessionStorage.getItem("isLoggedIn"));
				})
				.catch( (err) => {
					console.log(err);
					this.setState({error: 4});
					// console.log(JSON.stringify(err));
				});
			}
			else {
				console.log("password alga");
				this.setState({error: 2});
			}
		} 
		else {
			console.log("login_name alga");
			this.setState({error: 1});
		}
		event.preventDefault();
	};

	render() {
		return(
			<div>
				<form onSubmit={ this.handleSubmit}>
					<p className="error">
						{this.getError()}
					</p>
					<label>Login Name: </label> <br />
					<input type="text" value={this.state.login_name} onChange={this.handleLoginNameChange} />
					<br /> <br />
					
					<label>Password: </label> <br />
					<input type="password" value={this.state.password} onChange={this.handlePasswordChange} />
					<br /> <br />
					<button type="submit" className="btn" >Login</button>
					{/* <button >hello</button> */}
					<HashRouter>
						<Link to={"/register"}>
							<button className="btn">Register</button>
						</Link>
					</HashRouter>
					{/* <button onClick={this.handleRegister}>Register</button> */}
				</form>
				{/* <br /> */}
			</div>
		);
	}
}

export default LoginRegister;