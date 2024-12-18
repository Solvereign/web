import React from "react";
import { HashRouter, Link} from "react-router-dom";
import { AppBar, Toolbar, Typography , Grid, Button } from "@mui/material";
import "./styles.css";
import axios from 'axios';


/**
 * Define TopBar, a React component of CS142 Project 5.
 */
class TopBar extends React.Component {
  constructor(props) {
    super(props);
	this.state = {
		// version: 0,
		data: {},
		flag: false,
		addPhoto: false,
		section: this.props.params.section,
		// loggedUser: {},
	};
	// console.log(this.props.params);
	// console.log(this.state);
	

  }

  componentDidMount() {
	let v = axios.get("/test/info");
	v.then( (response) => {
		this.setState({data: response.data, flag: true});
		// console.log(response.data.__v);
	} ).catch( (error) => {
		console.log(error);
		this.setState({flag: false});
	});
	// this.props.callback();
	
  }
  
  componentDidUpdate() {

	let v = axios.get("/test/info");
	v.then( (response) => {
		if(response.data.__v !== this.state.data.__v || response.data._id !== this.state.data._id) {
			this.setState({data: response.data, flag: true});
			// console.log(response.data.__v);
		}
	} ).catch( (error) => {
		console.log(error);
		this.setState({flag: false});
	});
  }


//   detail() {
// 	if(sessionStorage.getItem("isLoggedIn")) {
// 		if(this.state.section) {
// 			return this.state.section + " of " + this.props.params.fname + " "  + this.props.params.lname;
// 		}
// 		else return "";
// 	}
// 	else {
// 		return "Please Login"
// 	}
//   }

  getDetail() {
	if(!sessionStorage.getItem("isLoggedIn")) return '';
	if(this.props.params.section === "Activities") return "Activities";
	if(this.props.params.section) {
		return this.props.params.section + " of " + this.props.params.fname + " "  + this.props.params.lname 
	} 
	else return "";
  }

  handleButtonClick = () => {
	// e.preventDefault();
	if(!this.state.addPhoto) {
		this.setState({addPhoto: true});
		return;
	}
	if (this.uploadInput.files.length > 0) {
		// Create a DOM form and add the file to it under the name uploadedphoto
		const domForm = new FormData();
		domForm.append('uploadedphoto', this.uploadInput.files[0]);
		axios.post('/photos/new', domForm)
		  .then((res) => {
			// console.log(res);
			// window.location.assign
			this.setState({addPhoto: false});
			
		  })
		  .catch(err => console.log(`POST ERR: ${err}`));
	  }
	  else {
		this.setState({addPhoto: false});
	  }

  };

//   handleLogout = () => {
  handleLogout = function() {
	// console.log("Hello2");
	// sessionStorage.clear();
	let logout = axios.post("/admin/logout");
	logout.then(() => {
		sessionStorage.clear();
		window.location.reload();
		// console.log(this.state);
	})
	.catch( (err) => console.log(err));

  };

  handleDeleteUser = function () {
	if(confirm("will you delete your account?")) {
		// axios.delete("/delete/user")
		// .then(() => {
		// 	sessionStorage.clear();
		// 	window.location.reload();
		// })
		// .catch( (err) => console.log(err));
		console.log("tried to delete user account");

	}
  }
  render() {
	// console.log(this.props.params);

	// console.log(this.props.params.lname);
    return (
		// console.log(this.p)
      <AppBar className="cs142-topbar-appBar" position="absolute">
        <Toolbar>
			<Grid item xs={3}>
				<Typography variant="h5" color="inherit">
					{this.state.flag? `By Bayarjavkhlan (version: ${this.state.data.__v})` : "By Bayarjavkhlan"}
					
				</Typography>
			</Grid>
			<Grid item xs={1}>
				{sessionStorage.getItem("first_name") ?
					"Hi " + sessionStorage.getItem("first_name")
					:
					""} 
			</Grid>
			<Grid item xs={1}>
				{sessionStorage.getItem("isLoggedIn") && this.props.params.section !== "Activities" ?
					<HashRouter>
					<Link className="userList-item" to={"/activities"}>
					<Button variant="contained">Activities</Button>
					</Link>
					</HashRouter>
					:
					""} 
			</Grid>
			<Grid item xs={2}>
				{/* {sessionStorage.getItem("isLoggedIn") ? 
					this.state.section === "Details" || this.state.section=== "Photos" ? 
						 this.state.section + " of " + this.props.params.fname + " "  + this.props.params.lname 
						 : 
						 	""
					: "Please login"} */}
					{this.getDetail()}
			</Grid>
			<Grid item xs={2} >
				{this.state.addPhoto ?
				<input type="file" accept="image/*" ref={(domFileRef) => { this.uploadInput = domFileRef; }} />
				:
				""}
			</Grid>
			<Grid item xs={1} >
				{sessionStorage.getItem("isLoggedIn") && this.props.params.section === "Details" && this.props.params.id === sessionStorage.getItem("_id") ? (
    <Button variant="contained" onClick={this.handleButtonClick}>
					Add Photo
				</Button>
  )
				:
				""}
			</Grid>
			<Grid item xs={1} >
				{sessionStorage.getItem("isLoggedIn") ? (
    <Button variant="contained" onClick={this.handleLogout}>
					Logout
				</Button>
  )
				:
				""}
			</Grid>
			<Grid item xs={1} >
				{sessionStorage.getItem("isLoggedIn") ? (
    <Button variant="contained" onClick={this.handleDeleteUser}>
					Del acc
				</Button>
  )
				:
				""}
			</Grid>
        </Toolbar>
      </AppBar>
    );
  }
}

export default TopBar;
