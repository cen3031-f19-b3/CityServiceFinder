import React, { useState } from 'react';
import { Route, Switch, Redirect, BrowserRouter as Router } from 'react-router-dom';
import NotFound from "./views/NotFound"
import Header from "./components/Header/Header"
import CategoryView from "./views/Category/CategoryView"
import MapPage from "./components/MapPage"
import ServicePage from "./components/servicePage"

import SidePane from "./components/SidePane/SidePane"
import LoginPane from "./components/SidePane/LoginPane"
import UserPane from "./components/SidePane/UserPane"

import { GetUser } from "./util/Auth"

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'


const App = () => {
  const [side_pane_contents, set_side_pane_contents] = useState(null)
  const [current_user, set_current_user] = useState(null)

  const login_pane = <LoginPane
    login_success_callback={() => {
      set_side_pane_contents(null)
      set_current_user(GetUser())
    }}
  />

  const user_pane = <UserPane
    user={current_user}
    logout_success_callback={() => {
      set_side_pane_contents(null)
      set_current_user(null)
    }}
  />

  return (
    <Router>

      {/* Header to be shown at the top of each page. */}
      <Header
        login_clicked_callback={() => {
          if(current_user){
            set_side_pane_contents(user_pane)
          }else{
            set_side_pane_contents(login_pane)
          }
        }}
      />

      {/* Side pane is sometimes used to show additional options/content */}
      <SidePane
        child_element={side_pane_contents}
        close_callback={() => set_side_pane_contents(null)}
      />

      {/* Main page content depends on URL */}
      <Switch>

        {/* Display category page at root URL */}
        <Route exact path="/" render={(props) => {
          return <CategoryView user={current_user} {...props} />
        }} />

        {/* Redirect old "/cat" links to base URL */}
        <Route exact path="/cat">
          <Redirect to="/" />
        </Route>

        {/* Individual category links go to a MapPage */}
				<Route path="/cat/:category" render={(props) => {
          return <MapPage 
            cat={props.match.params.category}
            user={current_user}
            {...props}
          />
        }} />

        {/* Individual service links go to a service-info page */}
        <Route path="/service/:name" render={(props) => {
          return <ServicePage
            name={props.match.params.name}
            user={current_user}
            {...props}
          />
        }} />

        {/* Otherwise, show "Not Found" page */ }
        <Route component={NotFound}/>

      </Switch>
    </Router>
  );
}

export default App;
