import axios from 'axios';

//const url 


//Templates jobs
//---------------------------------------------------
const job1 = {
    id : "1",
    name: "Job 1",
    source1: "first",
    source2: "second",
    selected_fields: {},
    metric: "selected_metric"
}

const job2 = {
    id : "2",
    name: "Job 2",
    source1: "first",
    source2: "second",
    selected_fields: {},
    metric: "selected_metric"
}

let list = [job1, job2];

let metrics = ["metric 1", "metric 2"];
//-----------------------------------------------------


let getJobsName = function() {
    return list.jobs.map((job) => job.name);
}

let getJobsList = function() {
    //TODO: AJAX post to server
    /*axios.get(url)
        .then(function(response) {
            return response. //field
        })*/
    return list;
};

let getMetrics = function() {
    //TODO: AJAX post to server
    return metrics;
};

let sendJob = function(json, self) {
    // AJAX post
    /*axios.post(url, json)
        .then(function(response) {
            self.setState({isLoading: false})
        })*/
    setTimeout(() => {
        self.setState({ isLoading: false });
    }, 2000);

};


export default {getJobsList, getMetrics, getJobsName, sendJob};

