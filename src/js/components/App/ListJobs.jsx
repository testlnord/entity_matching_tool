import React, { Component } from 'react';
import Panel from 'react-bootstrap/lib/Panel';
import PanelGroup  from 'react-bootstrap/lib/PanelGroup';
import Well from 'react-bootstrap/lib/Well';
import axios from 'axios';
    
    
class ListJobs extends Component {

    constructor(props) {
        super();
        this.state = {
            activeKey: '1',
            listJobs: null
        };
        this.handleSelect = this.handleSelect.bind(this);
    };

    componentWillMount() {
        let self = this;
        axios.get('/joblist')
            .then(function(response) {            
                self.setState({
                    listJobs: response.data != null ?
                                response.data
                                    .map((job) => 
                                        <Panel key={job.id} header={job.name} eventKey={job.name}>
                                            {"Source 1"}
                                            <Well>
                                                {job.source1}
                                            </Well>
                                        
                                            {"Source 2"}
                                            <Well>
                                                {job.source2}
                                            </Well>
                                        </Panel>
                                    ) 
                                : null
                });
            })
        
    };

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