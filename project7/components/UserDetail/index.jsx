import React from "react";
// import { Typography } from "@mui/material";
import { HashRouter, Link} from "react-router-dom";
import {Button, Grid} from "@mui/material";
import axios from 'axios';
import "./styles.css";
// import fetchModel from "../../lib/fetchModelData";

/**
 * Define UserDetail, a React component of CS142 Project 5.
 */
class UserDetail extends React.Component {
  constructor(props) {
    super(props);

	this.state = {
		user: {},
	};
	
  }

  componentDidMount() {
	let userId = this.props.match.params.userId;
	let u = axios.get("/user/" + userId);
	u.then( (response) => {
		this.setState({user: response.data});
		this.props.callback("Details", this.state.user.first_name, this.state.user.last_name, this.state.user._id);
	}).catch( (e) => console.log(e));

  }

  componentDidUpdate() {

	if(this.state.user._id !== this.props.match.params.userId) {
		let userId = this.props.match.params.userId;
		let u = axios.get("/user/" + userId);
		u.then( (response) => {
			this.setState({user: response.data});
			this.props.callback("Details", this.state.user.first_name, this.state.user.last_name, this.state.user._id);
		}).catch( (e) => console.log(e));
	}

  }

  render() {
    return (
	  <Grid container spacing={2}>
		<Grid item xs={8} >
			{/* <Typography variant="body1" className="myContainer">
				User Id: {this.state.user._id} <br/>
				Name: {this.state.user.first_name + " " + this.state.user.last_name} <br/>
				Location: {this.state.user.location} <br/>
				Description: {this.state.user.description} <br/>
				Occupation: {this.state.user.occupation} <br/>
			</Typography> */}
			<p>User Id: {this.state.user._id}</p>
			<p>Name: {this.state.user.first_name + " " + this.state.user.last_name}</p>
			<p>Location: {this.state.user.location}</p>
			<p>Description: {this.state.user.description}</p>
			<p>Occupation: {this.state.user.occupation}</p>
			<HashRouter>
				<Link to={"/photos/"+this.state.user._id}>
					<Button>User photos</Button>
					{/* View user photos */}
				</Link>
			</HashRouter>
		</Grid>
	  </Grid>
    );
  }
}

export default UserDetail;
