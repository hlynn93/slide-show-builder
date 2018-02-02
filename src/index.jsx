import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Root from './views/Root';
import configureStore from './store/configureStore';
import './styles/utils/normalize.scss';
import './styles/main.scss';

const store = configureStore();

render(
  <Router>
    <Root store={store} />
  </Router>,
  document.getElementById('root'),
);
