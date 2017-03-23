import React, { Component } from 'react';
import Grid  from 'react-bootstrap/lib/Grid';
import Nav from 'react-bootstrap/lib/Nav';
import Navbar from 'react-bootstrap/lib/Navbar';
import NavItem  from 'react-bootstrap/lib/NavItem';
import ListJobs from './ListJobs'
import ServerAPi from '../ServerAPI';
import './bootstrap.css';


class App extends Component {
  constructor() {
    super();
    this.state = {
      jobs: ServerAPi.getListJobs(),
    };
  };
  
  render() {
    return (
      <div>
        <Navbar>
          <Navbar.Header>
            <Navbar.Brand>
              <span>Entity Matching Tool</span>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
           </Navbar.Collapse>
        </Navbar>
        <Grid>
          <div className="list-jobs">
            <ListJobs
              length={this.state.jobs.length}
            />
          </div>
        </Grid>
      </div>
      
    );
  }
}

export default App;