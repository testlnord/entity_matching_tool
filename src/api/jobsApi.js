import axios from 'axios'


class jobsApi {
    static deleteJob(id) {
        return axios.delete('http://' + sessionStorage.getItem('loginToken') + ':@0.0.0.0:5000' + '/jobs/?jobId=' + id)
            .then(function(response) {
                return response;
            })
            .catch(function(error) {
                return error;
            })
    }

    static getJobList() {
        return axios.get('http://' + sessionStorage.getItem('loginToken') + ':@0.0.0.0:5000' + '/joblist/')
            .then(function(response) {
                return response;
            })
            .catch(function(error) {
                return error;
            });
    }
}

export default jobsApi