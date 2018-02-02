/* eslint-disable no-undef */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import i18n from '../utils/i18n'
import LanguageSwitcher from './LanguageSwitcher'
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { setLanguage } from '../actions/helpers'

class App extends Component {
  static propTypes = {
    // Injected by React Redux
    setLanguage: PropTypes.func.isRequired,
    // Injected by React Router
    children: PropTypes.node,
    history: PropTypes.object,
    language: PropTypes.string,
  }

  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {
    const { language } = nextProps
    if(this.props.language != language) {
      i18n.changeLanguage(language, err => {
        if (err)
          return console.error('something went wrong loading', err);
        this.forceUpdate()
      });
    }
  }

  render() {
    // Chilren, in this case comes from React Router components (See Root.dev.jsx or Root.prod.jsx)
    const { children, setLanguage } = this.props
    return (
      <div className="body">
        <Header />
        <Sidebar />
        <div className="main-content">
          <LanguageSwitcher
            setLanguage={setLanguage}
          />
          {children}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  language: state.utils.lng
})

export default withRouter(connect(mapStateToProps, {
  setLanguage
})(App))
