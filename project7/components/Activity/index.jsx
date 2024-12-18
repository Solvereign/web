import React from "react";
// import Button from "@mui/material";
import { HashRouter, Link} from "react-router-dom";
import axios from 'axios';
import {Button, List, ListItem} from "@mui/material";
import SingleActivity from "../SingleActivity";
import "./styles.css";


class Activity extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			activities: [],
		};
	}

	componentDidMount() {
		const activities = axios.get("/activities");
		activities.then((response) => {
			this.setState({activities: response.data.activities}, () => {
				// this.props()
				const a = axios.get("/user/" + sessionStorage.getItem("_id"));
				a.then( (response1) => {
					this.props.callback("Activities", response1.data.first_name, response1.data.last_name, response1.data._id);
				}).catch( (error) => console.log(error));
			});
		})
		.catch((err) => console.log(err));
	}

	getPath(file_name) {
		return "../../images/" + file_name;
	}


	getActivity(activity) {
		let line;
		switch(activity.activity_type) {
			case 1: 
				return "User registering";
			case 2:
				return "User logging in";
			case -2:
				return "User logging out";
			case -3:
				return "User deleted a photo";
			case -4:
				return "user deleted a comment";
			case 3: 
				line = "A photo uploaded";
				break;
			case 4: 
				line = "A comment added";
				break;
			case 5:
				line = "User liked a photo";
				break;
			case -5: 
				line = "User disliked a photo";
				break;
			default: break;
		}
		if(!line) return "unforeseen error";
		axios.get("/photo/" + activity.object_id)
		.then( (response) => {
			return <div>
					hello
					<img className="photo-thumbnail" src={"../../images/" + response.data.file_name} alt={response.data.file_name} />
				</div>
			;
		})
		.catch((err) => {
			line += " (photo is deleted)";
			console.log(err);
			return line;
		})
		return line;
	}
	
	refresh = () => {
		// window.location.reload();
		this.componentDidMount();
	}

	render() {
		// console.log(this.state.activities);
		return(
			<div>
				<Button onClick={this.refresh} >Refresh</Button>
				<List className="activity-list" component="div">
					{
						this.state.activities.map( (activity) => 
							<ListItem className="activity-listItem" key={activity._id}>
							{/* <div key={activity._id}> */}
								{/* {this.getActivity(activity)} */}
								<SingleActivity params={activity}/>
							</ListItem> 
							// </div> 
						)
						
					}
				</List>

			</div>
		);
	}
}



export default Activity;