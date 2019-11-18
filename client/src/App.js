import React from 'react';
import { Route, Switch, Redirect, BrowserRouter as Router, useParams } from 'react-router-dom';
import NotFound from "./views/NotFound"
import Header from "./components/Header/Header"
import CategoryPage from "./components/CategoryPage"
import MapPage from "./components/MapPage"
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'


const App = () => {
  return (
    <Router>
      <Header />
      <Switch>
        <Route exact path="/cat" component={CategoryPage} />
        <Route exact path="/">
          <Redirect to="/cat" />
        </Route>
				<Route path="/cat/:category" component={MapPageWrapper} />
        <Route component={NotFound}/>
      </Switch>
    </Router>
  );
}

function MapPageWrapper() {
	return (
		<MapPage cat={useParams().category} />
	)
}

export default App;
