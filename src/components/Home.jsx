import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import jobsApi from '../api/jobsApi'

import Panel from 'react-bootstrap/lib/Panel'
import PanelGroup  from 'react-bootstrap/lib/PanelGroup'
import Well from 'react-bootstrap/lib/Well'
import Button from 'react-bootstrap/lib/Button'
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar'
import ProgressBar from 'react-bootstrap/lib/ProgressBar'
import AddJob from './AddJob'


class Home extends Component {

    constructor() {
        super();
        this.state = {
            activeKey: '1',
            jobList: null
        };
        this.deleteJob = this.deleteJob.bind(this);
        this.getJobList = this.getJobList.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
    }

    componentWillMount() {
        if (sessionStorage.getItem('loginToken')) this.getJobList();
    }

    getJobList() {
        let self = this;
        jobsApi.getJobList()
            .then(function(response) {
                self.setState({
                    jobList: response.data !== null ?
                        response.data
                            .map((job) => <Panel key={job.id} header={job.name} eventKey={job.id}>

                                    {"Status"}
                                    <ProgressBar now={job.status} label={`${job.status}%`} />

                                    {"Source 1"}
                                    <Well bsSize='sm'>
                                        {job.source1}
                                    </Well>

                                    {"Selected field"}
                                    <Well bsSize='sm'>
                                        {job.selectedFields.source1}
                                    </Well>

                                    {"Source 2"}
                                    <Well bsSize='sm'>
                                        {job.source2}
                                    </Well>

                                    {"Selected field"}
                                    <Well bsSize='sm'>
                                        {job.selectedFields.source2}
                                    </Well>

                                    {"SelectedMetric"}
                                    <Well bsSize='sm'>
                                        {job.metric}
                                    </Well>

                                    <ButtonToolbar>
                                        <Button onClick={() => browserHistory.push('/options/' + job.id)}>
                                            Start matching
                                        </Button>
                                        <Button bsStyle="danger" onClick={() => self.deleteJob(job.id)}>
                                            Delete job
                                        </Button>
                                    </ButtonToolbar>

                                </Panel>
                            )
                        : null
                })
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    deleteJob(id) {
        let self = this;
        jobsApi.deleteJob(id)
            .then(function(response) {
                self.getJobList();
            })

    }

    handleSelect(activeKey) {
        this.state.activeKey === activeKey
            ? this.setState({ activeKey: null })
            : this.setState({ activeKey: activeKey });
    }

    render() {
        return (
            <div className="view-jobs">
                <div className="add-job">
                    <h1>List of Jobs</h1>
                    <AddJob callback={this.getJobList}/>
                </div>
                <div className="list-jobs">
                    <PanelGroup activeKey={this.state.activeKey} onSelect={this.handleSelect} accordion>
                        {this.state.jobList}
                    </PanelGroup>
                </div>
            </div>
        )
    }
}

export default Home