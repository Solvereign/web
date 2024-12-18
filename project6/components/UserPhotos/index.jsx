import React from "react";
// import { Typography } from "@mui/material";
// import images from "../../images";
import {
	List,
	ListItem,
} from "@mui/material";
import "./styles.css";
import axios from 'axios';
import UserPhoto from "../UserPhoto";
// import fetchModel from "../../lib/fetchModelData";
  
/**
 * Define UserPhotos, a React component of CS142 Project 5.
 */
class UserPhotos extends React.Component {
  constructor(props) {
    super(props);
	this.state = {
		// photos: window.cs142models.photoOfUserModel(props.match.params.userId),
		photos: [],
	};
  }

  componentDidMount() {
	const userId = this.props.match.params.userId;
	const u = axios.get("/photosOfUser/" + userId);
	u.then( (response) => {
		// this.props.callback(userId);
		this.setState({photos: response.data}, () => {
			const a = axios.get("/user/" + userId);
			a.then( (response1) => {
				this.props.callback("Photos", response1.data.first_name, response1.data.last_name, response1.data._id);
			}).catch( (error) => console.log(error)); 
		});
	}).catch( (error) => console.log(error));
  }
// barag hereg bolohgui ym bna daa
//   componentDidUpdate() {

//   }

  render() {
    return (
      <List className="user-photos" component="div">
		{
			this.state.photos.map( (photo) => (
    <ListItem key={photo._id}>
					<UserPhoto photo={photo}/> 
				</ListItem>
  )
			)
		}
      </List>
    );
  }
}

export default UserPhotos;
