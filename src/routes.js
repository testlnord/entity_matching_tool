import React from 'react'
import { Route, IndexRoute } from 'react-router'

import App from './components/App'
import Home from './components/Home'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import Matching from './components/Matching'


function requireAuth(nextState, replace) {
    if (!sessionStorage.getItem('loginToken')) {
        replace({
            pathname: '/signin',
            state: { nextPathname: nextState.location.pathname }
        })
    }
}

export default (
      <Route exact path='/' component={App}>
          <IndexRoute component={Home} onEnter={requireAuth} />
          <Route path='signin' component={SignIn} />
          <Route path='signup' component={SignUp} />
          <Route path='options/:id' component={Matching} />
      </Route>
  )