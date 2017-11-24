import axios from 'axios'


class authApi {
    static signin(credentials) {
        return axios.get('http://' + credentials.login + ':' + credentials.password + '@0.0.0.0:5000/login/')
            .then(function(response) {
                return response;
            })
            .catch(function(error) {
                return error;
            })
    }

    static signup(credentials) {
        return axios.post('/signup/', credentials)
            .then(function(response) {
                if(response.status === 200) return response;
            })
            .catch(function(error) {
                return error;
            });
    }
}

export default authApi