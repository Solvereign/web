import React from "react";
import { AppBar, Toolbar, Typography , Grid } from "@mui/material";
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
	};

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


  render() {
	// console.log(this.props);
	// console.log(this.props.params.lname);
    return (
      <AppBar className="cs142-topbar-appBar" position="absolute">
        <Toolbar>
			<Grid item xs={6}>
				<Typography variant="h5" color="inherit">
					{this.state.flag? `By Bayarjavkhlan (version: ${this.state.data.__v})` : "By Bayarjavkhlan"}
					
				</Typography>
			</Grid>
			<Grid item xs={6}>
				
				{/* <HashRouter>
					<Switch>
					<Route path="/:section/:userId" render={(props) => <Info {...props} />} />
					</Switch>
				</HashRouter> */}
				{this.props.params.section ? this.props.params.section + " of " + this.props.params.fname + " "  + this.props.params.lname : ""}
			</Grid>
        </Toolbar>
      </AppBar>
    );
  }
}

export default TopBar;
