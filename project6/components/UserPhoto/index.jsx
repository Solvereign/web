import React from "react";
import { Link } from "react-router-dom";
import "./styles.css";
import {
	List,
	ListItem,
} from "@mui/material";
// neg zurgiig durselj uzuuldeg
class UserPhoto extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			photo: props.photo,
		};
	}

	getPath() {
		return "../../images/" + this.state.photo.file_name;
	}

	// static singleComment(comment) {
	// 	return(
	// 		<p className="comment-para">
	// 			<span className="comment-user">
	// 			<Link to={"/users/" + comment.user._id}>
	// 				{ comment.user.first_name + " " +  comment.user.last_name + " "}
	// 			</Link>
	// 			</span>
	// 			<span className="comment-text">
	// 				{comment.comment}
	// 			</span>
	// 			<span className="comment-date">
	// 				{" (" + comment.date_time + ")"}
	// 			</span>
	// 		</p>
	// 	);
	// }

	getComments() {
		const comments = this.state.photo.comments;
		if (!comments) return <div></div>;
		return (
			<List>
				{comments.map(
					(comment) => (
						<ListItem key={comment._id}>
							{/* {UserPhoto.singleComment(comment)} */}
							<p className="comment-para">
								<span className="comment-user">
									<Link to={"/users/" + comment.user._id}>
										{comment.user.first_name + " " + comment.user.last_name + " "}
									</Link>
								</span>
								<span className="comment-text">
									{comment.comment}
								</span>
								<span className="comment-date">
									{" (" + comment.date_time + ")"}
								</span>
							</p>
						</ListItem>
					)
				)}
			</List>
		);
	}

	render() {
		return (
			<div className="photo-container" >
				<img src={this.getPath()} alt={this.state.photo._id} />
				<p className="photo-date">{this.state.photo.date_time}</p>
				<div className="comments">
					{this.getComments()}
				</div>
			</div>
		);
	}
}

export default UserPhoto;