import React from "react";
import { HashRouter, Link} from "react-router-dom";
import {
  List,
  ListItem,
  Typography,
} from "@mui/material";
import fetchModel from "../../lib/fetchModelData";


import "./styles.css";

/**
 * Define UserList, a React component of CS142 Project 5.
 */
class UserList extends React.Component {
  constructor(props) {
    super(props);
	// console.log(window.cs142models.userListModel());
	
	this.state = {
		users: [],
	};
  }
  
  componentDidMount() {
	let u = fetchModel("/user/list");
	
	u.then( (response) => {
		// console.log(response.data);
		// this.setState({users: JSON.parse(response.data)});
		this.setState({users: response.data});
		// return response.data;	
	}).catch((e) => console.log(e));

	// console.log(this.state.users);
	// console.log(u);
  }

  render() {
	// console.log(typeof this.states.users);
    return (
      <div>
        <Typography variant="body1">
          List of users:
        </Typography>
        <List component="nav">

		  {/* {window.cs142models.userListModel().map((val) => { */}
		  {this.state.users.map((val) => {
			return (
			
			<div key={val._id}>
				<ListItem divider>
					<HashRouter>
					<Link className="userList-item" to={"/users/" + val._id}>{ val.first_name + " " +  val.last_name}</Link>
					</HashRouter>
				</ListItem>
				{/* <Divider/> */}
			</div>
			);
			
  			})}
        </List>

      </div>
    );
  }
}

export default UserList;
