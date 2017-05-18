import React from 'react';
import ReactDOM from 'react-dom';
import App from './js/components/App/App';
import Home from './js/components/App/Home';
import Auth from './js/components/App/Auth';
import Registr from './js/components/App/Registr';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';



ReactDOM.render(
	<Router history={browserHistory}>
		<Route path='/' component={App}>
			<IndexRoute component={Home} />
			<Route path='signin' component={Auth} />
			<Route path='registr' component={Registr} />
		</Route>
	</Router>,
	document.getElementById('root')
);
