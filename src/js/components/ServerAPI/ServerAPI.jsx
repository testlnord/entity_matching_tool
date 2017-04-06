import axios from 'axios';

//Templates jobs
//---------------------------------------------------
const job1 = {
	name: "Job 1",
	request: "Tesla",
	response: "Tesla tech."
}

const job2 = {
	name: "Job 2",
	request: "Lala",
	response: "Lalala"
}

let list = {
	jobs: [job1, job2],
	length: 2
}

let metrics = ["metric 1", "metric 2"];
//-----------------------------------------------------


let getNameJobs = function() {
	return list.jobs.map((job) => job.name);
}

let	getListJobs = function() {
	//TODO: AJAX post to server
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
    	self.setState({isLoading: false});
	}, 2000);

};


export default {getListJobs, getMetrics, getNameJobs, sendJob};

