import React from "react";
import ReactDOM from "react-dom";
import { Grid, Typography, Paper } from "@mui/material";
import { HashRouter, Route, Switch } from "react-router-dom";

import "./styles/main.css";
import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";

class PhotoShare extends React.Component {
  constructor(props) {
    super(props);
	this.state = {
		section: "",
		first_name: "",
		last_name: "",
		id: "",
	}
  }

  parentCallback = (section, fname, lname, id) => {
	
		if(this.state.section !== section ||  this.state.id !== id)
		// if(this.state.id != id)
			this.setState({section: section, first_name: fname, last_name: lname, id: id});
  }

//   parentCallback2 = (fname, lname, id) => {
// 	if(this.state.section != "Photos" || this.state.id !== id)
// 		this.setState({section: "Photos", first_name: fname, last_name: lname, id: id});
//   }

//   parentCallback2 = () => {
// 	if(this.state.section != "Photos")
// 		this.setState({section: "Photos"});
//   }

  render() {
    return (
      <HashRouter>
        <div>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TopBar params={{section: this.state.section, fname: this.state.first_name, lname: this.state.last_name}} />
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
                  <Route
                    exact
                    path="/"
                    render={() => (
                      <Typography variant="body1">
                        {/* Welcome to your photosharing app! This{" "}
                        <a href="https://mui.com/components/paper/">Paper</a>{" "}
                        component displays the main content of the application.
                        The {"sm={9}"} prop in the{" "}
                        <a href="https://mui.com/components/grid/">Grid</a> item
                        component makes it responsively display 9/12 of the
                        window. The Switch component enables us to conditionally
                        render different components to this part of the screen.
                        You don&apos;t need to display anything here on the
                        homepage, so you should delete this Route component once
                        you get started. */}
						Welcome to my photosharing app! End bichih ym oldoogui tul hooson orhiloo
                      </Typography>
                    )}
                  />
                  <Route
                    path="/users/:userId"
                    render={(props) => <UserDetail {...props} callback={this.parentCallback} />}
                  />
                  <Route
                    path="/photos/:userId"
                    render={(props) => <UserPhotos {...props} callback = {this.parentCallback} />}
                  />
                  <Route path="/users" component={UserList} />
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
