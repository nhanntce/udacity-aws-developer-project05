import React, { Component } from 'react'
import { Link, Route, Router, Switch } from 'react-router-dom'
import { Grid, Menu, Segment } from 'semantic-ui-react'

import Auth from './auth/Auth'
import { EditCourse } from './components/EditCourse'
import { LogIn } from './components/LogIn'
import { NotFound } from './components/NotFound'
import { Todos } from './components/Courses'
import { CreateCourse } from './components/CreateCourse'

export interface AppProps {}

export interface AppProps {
  auth: Auth
  history: any
}

export interface AppState {}

export default class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props)

    this.handleLogin = this.handleLogin.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
  }

  handleLogin() {
    this.props.auth.login()
  }

  handleLogout() {
    this.props.auth.logout()
  }

  render() {
    return (
      <div>
        <Segment style={{ padding: '4em 0em' }} vertical>
          <Grid container stackable verticalAlign="middle">
            <Grid.Row>
              {this.generateAppIntro()}
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={16}>
                <Router history={this.props.history}>
                  {this.generateMenu()}

                  {this.generateCurrentPage()}
                </Router>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      </div>
    )
  }


  generateAppIntro() {
    return (
      <h2>Welcome to course management application</h2>
    )
  }

  generateMenu() {
    return (
      <Menu inverted>
          <Menu.Item
            name='home'>
            <Link to="/">Home</Link>
          </Menu.Item>

          {this.generateAddCourseButton()}

          <Menu.Menu position='right'>
            {this.logInLogOutButton()}
          </Menu.Menu>
        </Menu>
    )
  }

  generateAddCourseButton() {
    if (this.props.auth.isAuthenticated()) {
      return (
        <Menu.Item name="createcourse">
          <Link to="/create-course">Create Course</Link>
        </Menu.Item>
      )
    }
    return '';
  }

  logInLogOutButton() {
    if (this.props.auth.isAuthenticated()) {
      return (
        <Menu.Item name="logout" onClick={this.handleLogout}>
          Log Out
        </Menu.Item>
      )
    } else {
      return (
        <Menu.Item name="login" onClick={this.handleLogin}>
          Log In
        </Menu.Item>
      )
    }
  }

  generateCurrentPage() {
    if (!this.props.auth.isAuthenticated()) {
      return <LogIn auth={this.props.auth} />
    }

    return (
      <Switch>
        <Route
          path="/"
          exact
          render={props => {
            return <Todos {...props} auth={this.props.auth} />
          }}
        />

        <Route
          path="/courses/:courseId/edit"
          exact
          render={props => {
            return <EditCourse {...props} auth={this.props.auth} />
          }}
        />
        
        <Route
          path="/create-course"
          exact
          render={props => {
            return <CreateCourse {...props} auth={this.props.auth} />
          }}
        />

        <Route component={NotFound} />
      </Switch>
    )
  }
}
