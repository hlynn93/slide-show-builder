/* eslint-disable no-undef */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import 'element-theme-default';
import 'draft-js/dist/Draft.css';

import i18n from '../utils/i18n'
import LanguageSwitcher from './LanguageSwitcher'
// import Header from '../components/Header';
// import Sidebar from '../components/Sidebar';
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
          throw `something went wrong loading: ${err}`;
        else
          this.forceUpdate()
      });
    }
  }

  render() {
    // Chilren, in this case comes from React Router components (See Root.dev.jsx or Root.prod.jsx)
    const { children, setLanguage } = this.props
    return (
      <div className="app">
        <div className="main">
          {children}
          <LanguageSwitcher
            setLanguage={setLanguage}
          />
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
