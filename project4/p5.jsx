import React from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route, Link} from "react-router-dom";

import Header from "./components/Header";
import Example from "./components/Example";
import States from "./components/States";
import "./styles/main.css";
ReactDOM.render(

	<div className="container">
		<HashRouter>
			<div>
				<Header/>
				<Link to="/states">States</Link> <br />
				<Link to="/example">Example</Link>
				<Route path="/states" component={States} />
				<Route path="/example" component={Example} />
			</div>
		</HashRouter>
	</div>,
	document.getElementById("reactapp")
);