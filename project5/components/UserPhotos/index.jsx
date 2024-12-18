import React from "react";
// import { Typography } from "@mui/material";
// import images from "../../images";
import {
	List,
	ListItem,
} from "@mui/material";
import "./styles.css";
import UserPhoto from "../UserPhoto";
import fetchModel from "../../lib/fetchModelData";
  
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
	const u = fetchModel("/photosOfUser/" + userId);
	u.then( (response) => {
		// this.props.callback(userId);
		this.setState({photos: response.data}, () => {
			const a = fetchModel("/user/" + userId);
			a.then( (response) => {
				this.props.callback("Photos", response.data.first_name, response.data.last_name, response.data._id);
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
