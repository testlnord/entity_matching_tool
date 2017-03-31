import React, { Component } from 'react';
import Grid  from 'react-bootstrap/lib/Grid';
import Nav from 'react-bootstrap/lib/Nav';
import Navbar from 'react-bootstrap/lib/Navbar';
import NavItem  from 'react-bootstrap/lib/NavItem';
import AddJob from './AddJob';
import ListJobs from './ListJobs';
import ServerAPI from '../ServerAPI';
import './bootstrap.css';


class App extends Component {
  constructor() {
    super();
    this.state = {
      jobs: ServerAPI.getListJobs(),
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
          <div className="view-jobs">
            <div className="add-job">
              <h1>Jobs list</h1>
              <AddJob/>
            </div>
            <div className="list-jobs">
                <ListJobs
                  length={this.state.jobs.length}
                />
            </div>
          </div>
        </Grid>
      </div>
      
    );
  }
}

export default App;