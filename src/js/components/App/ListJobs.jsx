import React, { Component } from 'react';
import Panel from 'react-bootstrap/lib/Panel';
import PanelGroup  from 'react-bootstrap/lib/PanelGroup';
import Well from 'react-bootstrap/lib/Well';
import Button from 'react-bootstrap/lib/Button';
import axios from 'axios';
    
    
class ListJobs extends Component {

    constructor(props) {
        super();
        this.state = {
            activeKey: '1',
            listJobs: null,
            url: localStorage.getItem('loginToken') ? 'http://' + localStorage.getItem('loginToken') + ':@localhost:5000' : null
        };
        this.handleSelect = this.handleSelect.bind(this);
    };

    componentWillMount() {
        let self = this;
        if(localStorage.getItem('loginToken')){
            /*this.setState({
                url:  'http://' + localStorage.getItem('loginToken') + ':@localhost:5000'
            })*/
            axios.get(this.state.url + '/joblist/')
                .then(function(response) {    
                    self.setState({
                        listJobs: response.data != null ?
                                    response.data
                                        .map((job) => 
                                            <Panel key={job.id} header={job.name} eventKey={job.id}>
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
                                                <Button bsStyle="danger" onClick={() => self.deleteJob(job.id)}> Delete job </Button>
                                            </Panel>
                                        ) 
                                    : null
                    });
                })
        }
    };

    deleteJob(id) {
        axios.delete(this.state.url + '/jobs/?id=' + id)
            .then(function(response) {
                console.log(response);
            })
    }

    handleSelect(activeKey) {
        this.state.activeKey === activeKey ? 
            this.setState({ activeKey: null}) : this.setState({ activeKey: activeKey });
    };

    render() {
        return (
            <PanelGroup activeKey={this.state.activeKey} 
                onSelect={this.handleSelect} accordion>
                {this.state.listJobs}
            </PanelGroup>
        );
    };
};

export default ListJobs;