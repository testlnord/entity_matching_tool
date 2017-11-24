export default {
    auth: {
        loggedIn: !!sessionStorage.getItem('loginToken'),
        status: null,
        errorMassage: null
    }
}