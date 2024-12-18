import React from "react";
import {Link} from "react-router-dom";
import "./styles.css";
import axios from 'axios';
import {
	List,
	ListItem,
	Grid,
  } from "@mui/material";

class Comment extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			comment: props.comment,
			// flag: true,
			photo_id: props.photo_id,
		}
	}

	// componentDidMount() {
	// 	if(this.props.comment.user._id != sessionStorage.getItem("_id")){
	// 		this.setState({flag: false});
	// 		console.log("hello world");
	// 	}
	// }

	// componentDidUpdate() {
	// 	if(this.state.comment.user._id == sessionStorage.getItem("_id") && !this.state.flag)
	// 		this.setState({flag: true});
	// }
	onDeleteComment = () => {
		// console.log(this.props.comment);
		if(this.state.comment.user._id === sessionStorage.getItem("_id")) {
			this.props.callback(this.state.comment._id, this.state.comment.user._id);
			// const comment = this.state.comment;
			// console.log(comment._id);
			// axios.post("/delete/comment/" + comment._id, {
			// 	comment_id: comment._id,
			// 	photo_id: this.state.photo_id,
			// })
			// .then((response) => {
			// 	// this.render();
			// 	window.location.reload();
			// })
			// .catch((err) => console.log(err));

		}
	}

	getDate() {
		return new Date(this.state.comment.date_time).toUTCString().slice(0, -4);
		// return a.
	}

	render() {
		// ene yagaad suuld oruulsan comment-n state ni undefined gej haruulaad baina?
		// console.log(this.state.comment.user._id, sessionStorage.getItem("_id"));
		const comment = this.state.comment;
		const user_id = comment.user._id;
		const flag = user_id === sessionStorage.getItem("_id");
		// console.log(user_id);
		return(
			// <div className="comment">

			<Grid container spacing={1} >
				<Grid item xs={11}>
					<p className="comment-para">
						<span className="comment-user">
						<Link to={"/users/" + comment.user._id}>
							{ comment.user.first_name + " " +  comment.user.last_name + " "}
						</Link>
						</span>
						<span className="comment-text">
							{comment.comment}
						</span>
						<span className="comment-date">
							{" (" + this.getDate() + ")"}
						</span>
					</p>	
				</Grid>
				<Grid item xs={1}>
					{flag ?
						<button onClick={this.onDeleteComment}>X</button>
					: "" }
				</Grid>
			</Grid>
			// </div>
		);
	}
}

  // neg zurgiig durselj uzuuldeg
class UserPhoto extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			photo: props.photo,
			comment: "",
			likedByMe: props.photo.likedBy.includes(sessionStorage.getItem("_id")),
		};
		// console.log(this.state);
		// this.handleNewComment = this.handleNewComment.bind(this);
	}

	getPath() {
		return "../../images/" + this.state.photo.file_name;
	}
	getDate() {
		return new Date(this.state.photo.date_time).toUTCString().slice(0, -4);
		// return a.
	}
	handleLikeDislike = () => {
		const like = axios.post("/likeDislike/" + this.state.photo._id, {photo_id: this.state.photo._id, like: !this.state.likedByMe});
		like.then((response) => {
			let tempPhoto = this.state.photo;
			// console.log("tempPhoto anh: ", tempPhoto);
			if(!this.state.likedByMe){
				// tempPhoto.likedBy = tempPhoto.likedBy.push(sessionStorage.getItem("_id").toString());
				tempPhoto.likedBy[tempPhoto.likedBy.length] = sessionStorage.getItem("_id");
			} 
			else {
				tempPhoto.likedBy = tempPhoto.likedBy.filter((_id) => _id != sessionStorage.getItem("_id"));
			}
			// console.log("tempPhoto daraa ni: ", tempPhoto);
			this.setState({photo: tempPhoto, likedByMe: !this.state.likedByMe});
		})
		.catch((err) => {console.log(err);});

		// if(this.state.likedByMe) {
		// }	
	};

	onDeletePhoto = () => {
		if(this.state.photo.user_id == sessionStorage.getItem("_id")) {
			this.props.callback(this.state.photo._id, this.state.photo.user_id);
		}
	}

	getComments() {
		const comments = this.state.photo.comments;
		if(!comments) return "";
		return(
			<List>
				{comments.map(
					(comment) => (
						<ListItem key={comment._id}>
							<Comment comment={comment} photo_id={this.state.photo._id} callback={this.deleteComment} />

						</ListItem>
)				
				)}
			</List>
		);
	}

	handleCommentChange = (event) => {
		this.setState({comment: event.target.value});
	};
	handleKeyDown = (event) => {
		if(event.key === "Enter") {
			event.preventDefault();
			this.handleNewComment();
		}
	};
	handleNewComment = () => {
		let newComment = axios.post("/commentsOfPhoto/" + this.state.photo._id, {comment: this.state.comment});
		newComment.then((response) => {
			let tempPhoto = this.state.photo;
			tempPhoto.comments.push(response.data.comment);
			this.setState({comment: "", photo: tempPhoto});
			// window.history.back();
			// window.location.reload();
		})
		.catch((err) => {console.log(err);});
	};

	deleteComment = (comment_id, user_id) => {
		axios.post("/delete/comment/" + comment_id, {
			photo_id: this.state.photo._id,
			comment_id: comment_id,
			user_id: user_id,
		})
		.then((response) => {
			let photo = this.state.photo;
			const a = photo.comments.length;
			photo.comments = photo.comments.filter((comment) => comment._id != comment_id);
			this.setState({photo: photo});
		})
		.catch((err) => console.log(err));
	}

	render() {
		const flag = this.state.photo.user_id == sessionStorage.getItem("_id");
		return(
			<div className="photo-container" >
				{
					flag &&
					<button onClick={this.onDeletePhoto}>X</button>

				}
				<img src={this.getPath()} alt={this.state.photo._id} />
				<p className="photo-date">{this.getDate()}</p>
				{/* <p className="photo-like-count">{`this photo is liked by ${this.state.photo.likedBy.length} users`}</p> */}
				<button onClick={this.handleLikeDislike}>{this.state.likedByMe ? "liked" : "like"}</button>
				{`  this photo is liked by ${this.state.photo.likedBy.length} users`}
				<div className="comments">
					{this.getComments()}
					<textarea className="comment-input" value={this.state.comment} onChange={this.handleCommentChange} onKeyDown={this.handleKeyDown} cols="66" rows="2"></textarea>
					<button className="comment-submit" onClick={this.handleNewComment} >{">"}</button>
				</div>
			</div>
		);
	}

	// render() {
	// 	return(
	// 		<div className="photo-container" >
	// 			<img src={this.getPath()} alt={this.state.photo._id} />
	// 			<p className="photo-date">{this.state.photo.date_time}</p>
	// 			<div className="comments">
	// 				{this.getComments()}
	// 			</div>
	// 		</div>
	// 	);
	// }
}

export default UserPhoto;