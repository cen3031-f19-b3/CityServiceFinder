import React from 'react';
import { Route, Switch, Redirect, BrowserRouter as Router, useParams } from 'react-router-dom';
import NotFound from "./views/NotFound"
import Header from "./components/Header/Header"
import CategoryPage from "./components/CategoryPage"
import MapPage from "./components/MapPage"
import ServicePage from "./components/servicePage"
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'


const App = () => {
  return (
    <Router>
      <Header />
      <Switch>
        <Route exact path="/" component={CategoryPage} />
        <Route exact path="/cat">
          <Redirect to="/" />
        </Route>
				<Route path="/cat/:category" component={MapPageWrapper} />
        <Route path="/service/:name" component={ServicePageWrapper} />
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

function ServicePageWrapper(){
  return(
    <ServicePage name={useParams().name} />
  )
}

export default App;
