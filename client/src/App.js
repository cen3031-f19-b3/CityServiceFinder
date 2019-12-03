import React, { useState } from 'react';
import { Route, Switch, Redirect, BrowserRouter as Router } from 'react-router-dom';
import NotFound from "./views/NotFound"
import Header from "./components/Header/Header"
import CategoryView from "./views/Category/CategoryView"
import UserListView from "./views/User/UserListView"
import MapView from "./views/Map/MapView"
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
          return <CategoryView 
            user={current_user} 
            side_pane_open_callback={set_side_pane_contents}
            {...props} 
          />
        }} />

        {/* Redirect old "/cat" links to base URL */}
        <Route exact path="/cat">
          <Redirect to="/" />
        </Route>

        {/* Individual category links go to a MapView */}
				<Route exact path="/cat/:category" render={(props) => {
          return <MapView 
            cat_id={props.match.params.category}
            user={current_user}
            {...props}
          />
        }} />

        {/* Subcategory links also go to a MapView */}
        <Route exact path="/cat/:category/:subcategory" render={(props) => {
          return <MapView
            cat_id={props.match.params.subcategory}
            parent_id={props.match.params.category}
            user={current_user}
            {...props}
          />
        }} />

        {/* Individual service links go to a service-info page */}
        <Route path="/service/:category" render={(props) => {
          return <ServicePage
            cat_id={props.match.params.category}
            user={current_user}
            {...props}
          />
        }} />

        {/* User administration */}
        <Route path="/users" render={(props) => {
          return <UserListView
            logged_in_user={current_user}
            side_pane_open_callback={set_side_pane_contents}
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
