import React from 'react'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'
import { Route, Switch, BrowserRouter } from 'react-router-dom'
import App from './App'
import Header from './../components/Header'
import Sidebar from './../components/Sidebar'
import Builder from './Builder'
import Presenter from './Presenter'

const Root = ({ store }) => (
  <Provider store={store}>
    <BrowserRouter basename="/vignetsnewversion">
      <div className="routes">
        <Header />
        <Sidebar />
        <Switch>
          <Route exact path="/" component={App} />
          <Route path="/builder" component={Builder} />
          <Route path="/present" component={Presenter} />
        </Switch>
      </div>
    </BrowserRouter>
  </Provider>
)

Root.propTypes = {
  store: PropTypes.object.isRequired,
}
export default Root
