import React from 'react';
import ReactDOM from 'react-dom';
import './utils/rem'
import './assets/style/reset.scss'
import {BrowserRouter as Router} from 'react-router-dom'
import Layout from './layout';
import 'antd-mobile/dist/antd-mobile.css'
import store from './store'
import {Provider} from  'react-redux'
import './utils/cookie'




ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Layout></Layout>
    </Router>
  </Provider>,
  document.getElementById('root')
)

