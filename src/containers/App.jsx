/* eslint-disable no-undef */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import i18n from '../utils/i18n'
import Explore from '../components/app/Explore'
import LanguageSwitcher from '../components/app/LanguageSwitcher'
import { resetErrorMessage, setLanguage } from '../actions/helpers'

class App extends Component {
  static propTypes = {
    // Injected by React Redux
    errorMessage: PropTypes.string,
    resetErrorMessage: PropTypes.func.isRequired,
    setLanguage: PropTypes.func.isRequired,
    inputValue: PropTypes.string.isRequired,
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

  handleDismissClick = e => {
    this.props.resetErrorMessage()
    e.preventDefault()
  }

  handleChange = nextValue => {
    this.props.history.push(`/${nextValue}`)
  }

  renderErrorMessage() {
    const { errorMessage } = this.props
    if (!errorMessage) {
      return null
    }

    return (
      <p style={{ backgroundColor: '#e99', padding: 10 }}>
        <b>{errorMessage}</b>
        {' '}
        <button onClick={this.handleDismissClick}>
          Dismiss
        </button>
      </p>
    )
  }

  render() {
    // Chilren, in this case comes from React Router components (See Root.dev.jsx or Root.prod.jsx)
    const { children, inputValue, setLanguage } = this.props
    return (
      <div>
        <Explore value={inputValue}
          onChange={this.handleChange}
        />
        <LanguageSwitcher
          setLanguage={setLanguage}
        />
        <hr />
        {this.renderErrorMessage()}
        {children}
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  errorMessage: state.error,
  inputValue: ownProps.location.pathname.substring(1),
  language: state.utils.lng
})

export default withRouter(connect(mapStateToProps, {
  resetErrorMessage,
  setLanguage
})(App))
