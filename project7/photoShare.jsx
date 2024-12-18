import React from "react";
import ReactDOM from "react-dom";
import { Grid, Typography, Paper } from "@mui/material";
import { HashRouter, Route, Switch , Redirect} from "react-router-dom";

import "./styles/main.css";
import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import LoginRegister from "./components/LoginRegister/LoginRegister";
import Register from "./components/Register/Register";
// import Activity from "./components/Activity";
import Activity from "./components/Activity";

class PhotoShare extends React.Component {
  constructor(props) {
    super(props);
	this.state = {
		section: "",
		first_name: "",
		last_name: "",
		id: "",
		// isLoggedIn: false,
	};
  }

  parentCallback = (section, fname, lname, id) => {
	
		if(this.state.section !== section ||  this.state.id !== id)
		// if(this.state.id != id)
			{this.setState({section: section, first_name: fname, last_name: lname, id: id});}
  };

  render() {
    return (
      <HashRouter>
        <div>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TopBar params={{section: this.state.section, fname: this.state.first_name, lname: this.state.last_name, id: this.state.id}} />
            </Grid>
            <div className="cs142-main-topbar-buffer" />
            <Grid item sm={3}>
              <Paper className="cs142-main-grid-item">
                <UserList />
              </Paper>
            </Grid>
            <Grid item sm={9}>
              <Paper className="cs142-main-grid-item">
                <Switch>
					{
						!sessionStorage.getItem("isLoggedIn") ?
							<Route path="/login-register" component={LoginRegister} />
						:
							<Redirect path="/login-register" to="/" />
					}

					{
						!sessionStorage.getItem("isLoggedIn") ?
							<Route path="/register" component={Register} />	
						:
							<Redirect path="/register" to="/"/>
					}
				{
					sessionStorage.getItem("isLoggedIn") ? (
      <Route
							exact
							path="/"
							render={() => (
								<Typography variant="body1">

									Welcome to my photosharing app! End bichih ym oldoogui tul hooson orhiloo
								</Typography>
							)}
						/>
    )
					:
						<Redirect path='/' to='/login-register'/>		
				}

				{
					sessionStorage.getItem("isLoggedIn") ? (
      <Route
							path="/users/:userId"
							render={(props) => <UserDetail {...props} callback={this.parentCallback} />}
						/>
    )
					:
						<Redirect path="/users/:userId" to="/login-register" />
				}

				{
					sessionStorage.getItem("isLoggedIn") ? (
      <Route
							path="/photos/:userId"
							render={(props) => <UserPhotos {...props} callback = {this.parentCallback} />}
						/>
    )
					:
						<Redirect path="/photos/:userId" to="/login-register" />
				}

				{
					sessionStorage.getItem("isLoggedIn") ?
						<Route path="/users" component={UserList} />
					:
						<Redirect path="/users" to="/login-register" />
				}
                 
                  
				{
					sessionStorage.getItem("isLoggedIn") ?
						<Route path="/activities" render={(props) => <Activity {...props} callback={this.parentCallback} />} />
					:
						<Redirect path="/activites" to="/login-register" />
				}
                 
                  
                  
                  
                </Switch>
              </Paper>
            </Grid>
          </Grid>
        </div>
      </HashRouter>
    );
  }
}

ReactDOM.render(<PhotoShare />, document.getElementById("photoshareapp"));
