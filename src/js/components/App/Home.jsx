import React, { Component } from 'react';
import AddJob from './AddJob';
import ListJobs from './ListJobs';


class Home extends Component {
	render() {
		return (
			<div className="view-jobs">
                <div className="add-job">
                    <h1>Jobs list</h1>
                    <AddJob/>
                </div>
                <div className="list-jobs">
                    <ListJobs/>
                </div>
            </div>
        );
	}
}

export default Home;