import React, { Component } from "react";
import { Grid, Header, Label, Container, Segment, Tab } from 'semantic-ui-react';
import Tile from '../../Common/projectTiles';
import Navbar from "../../Common/navbar";
import './dashboard.css';
import axios from 'axios';
import moment from 'moment';

class Dashboard extends Component {

  state = {
    dataLoaded: false,
    userID: this.props.auth
  }

  componentDidMount() {
    // console.log('State before fetch:', this.state);
    this.fetchProjects()
    .then(() => {
      this.setState({dataLoaded: true});
      // console.log('State after fetch:',this.state);
    })
    .catch(error => console.log('Error during setup:', error))
  }

  //change to favorited-members
  fetchProjects = () => {
    return axios.get('/api/projects').then(res => {
      const userProjects = res.data.filter(p => {
        const curUser = this.state.userID.user.github.login;
        return p.fav_users && p.done_users.find(m => m.github.login === curUser || p.owner_id.github.login === curUser)
      })
      this.setState({
        savedProjects: userProjects.filter(p => p.status == "required"),
        doneProjects: userProjects.filter(p => p.status === "recommended")
      });
      return userProjects;
    }).catch(error => {
      console.log('Catching Error while fetching projects:', error);
    });
  }

  // Designed for generating 3 columns in semantic-ui grid format. Pass remainder value of 0, 1, and 2.
  renderTiles = (remainder, type) => {
    return this.state[type]
    .filter((project, index) => index % 3 === remainder)
    .map(project => <Tile {...project} renderTechTags={this.renderTechTags}/>);
  }

  renderTechTags = tech_tags => tech_tags.slice(0, 6).map(tech_tag => (
    <Label className='tileTags'>
      {tech_tag}
    </Label>
  ));

  formatDate = date => moment(date).format('MM/DD/YYYY');

  renderPanes = () => {
    return (
      [{ menuItem: 'Saved Projects', render: () =>
          <Tab.Pane className='tabPane' attached={false}>
            {this.state.savedProjects.length > 0 ?
            <Grid stackable container columns={3}>
              <Grid.Row>
                <Grid.Column>
                  {this.renderTiles(0, 'savedProjects')}
                </Grid.Column>
                <Grid.Column>
                  {this.renderTiles(1, 'savedProjects')}
                </Grid.Column>
                <Grid.Column>
                  {this.renderTiles(2, 'savedProjects')}
                </Grid.Column>
              </Grid.Row>
            </Grid> :
            <div>
              <p className='dashboardEmptyStateHeader'>
              No projects yet!
              </p>
              <p className='dashboardEmptyStateText'>
              Join or create your own project to get started. 
            </p> 
            </div>}
          </Tab.Pane>

      },
      { menuItem: 'Used Projects', render: () =>
        <Tab.Pane className='tabPane' attached={false}>
          {this.state.doneProjects.length > 0 ?
          <Grid stackable container columns={3}>
            <Grid.Row>
              <Grid.Column>
                {this.renderTiles(0, 'doneProjects')}
              </Grid.Column>
              <Grid.Column>
                {this.renderTiles(1, 'doneProjects')}
              </Grid.Column>
              <Grid.Column>
                {this.renderTiles(2, 'doneProjects')}
              </Grid.Column>
            </Grid.Row>
          </Grid> :
          <div>
            <p className='dashboardEmptyStateHeader'>
            No projects yet!
            </p>
            <p className='dashboardEmptyStateText'>
            Keep up the good work and check back when you've completed your first project. 
          </p> 
          </div>}
        </Tab.Pane>
      }
    ])
  }

  render(props) {
    return (
      <div>
        {this.state.dataLoaded ?
        <div>
          <Navbar currentPage='dashboard' cohort={this.props.match.params.cohort} 
          username={this.state.userID.user.github.login} 
          avatar={this.state.userID.user.github.avatar_url}/>
          <div className='dashboardBackground'>
            <Segment textAlign='center' vertical className='dashboardBanner'>
              <Container text>
              <Header as='h1' className='dashboardTitle'>
                DASHBOARD
              </Header><br/><br/><br/>
              </Container>
            </Segment>
            <br/><br/>
            <Container>
              <Tab className='tabMenu' menu={{ secondary: true, pointing: true }} panes={this.renderPanes()}/>
            </Container>
          </div>
        </div>
        : '' }
      </div>
    );
  }
}

export default Dashboard
