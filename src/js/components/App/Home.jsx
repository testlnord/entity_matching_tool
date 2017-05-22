import React, { Component } from 'react';
import AddJob from './AddJob';
import ListJobs from './ListJobs';


class Home extends Component {
	constructor() {
		super();
		this.state = {
			check: false
		}
		this.updateListJobs = this.updateListJobs.bind(this);
	}

	updateListJobs() {
		this.setState({
			check: !this.state.check 
		});
	}

	render() {
		return (
			<div className="view-jobs">
                <div className="add-job">
                    <h1>Jobs list</h1>
                    <AddJob callback={this.updateListJobs}/>
                </div>
                <div className="list-jobs">
                    <ListJobs callback={this.state.check}/>
                </div>
            </div>
        );
	}
}

export default Home;