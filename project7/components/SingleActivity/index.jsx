import React from "react";
import axios from 'axios';
import "./styles.css";

class SingleActivity extends React.Component {

	constructor(props) {
		super(props);
		// console.log(props);
		this.state = {
			file_name: null,
			activity: props.params,
			line: "",
		}
	}
	componentDidMount() {
		// console.log("props: ", this.props);
		// console.log("state:", this.state);
		let myLine = '';
		switch(this.state.activity.activity_type) {
			case 1: 
				myLine = "User registering";
				break;
			case 2:
				myLine = "User logging in";
				break;
			case -2:
				myLine = "User logging out";
				break;
			case -3:
				myLine = "User deleted a photo";
				break;
			case -4:
				myLine = "user deleted a comment";
				break;
			case 3: 
				myLine = "A photo uploaded";
				break;
			case 4: 
				myLine = "A comment added";
				break;
			case 5:
				myLine = "User liked a photo";
				break;
			case -5: 
				myLine = "User disliked a photo";
				break;
			default: 
				myLine = "Unforeseen mistake";
				break;
		}
		if(!this.state.activity.object_id) {
			this.setState({line: myLine});
			return;
		}
		axios.get("/photo/" + this.state.activity.object_id)
		.then( (response) => {
			this.setState({line: myLine, file_name: response.data.file_name});
		})
		.catch( (err) => {
			this.setState({line: myLine+" (the photo is deleted)"});
			console.error(err);
		});
	}

	render() {
		// console.log(this.state);
		return(
			<div>
				{
					this.state.file_name ?
						<img className="photo-thumbnail" src={"../../images/" + this.state.file_name} alt="" />
					:
					""
				}
				<span>
				{this.state.line}
				</span>
			</div>
		);
	}

}

export default SingleActivity;