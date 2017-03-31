//Templates jobs
//---------------------------------------------------
const job1 = {
	request: "Tesla",
	response: "Tesla tech."
}

const job2 = {
	request: "Lala",
	response: "Lalala"
}

let list = {
	jobs: [job1, job2],
	length: 2
}
//-----------------------------------------------------


let	getListJobs = function() {
	//TODO: AJAX post to server
	return list;
};

let sendJob = function(self, json) {
	//TODO: AJAX post
	setTimeout(() => {
    	self.setState({isLoading: false});
	}, 2000);

};


export default {getListJobs, sendJob};

