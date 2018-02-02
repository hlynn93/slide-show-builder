/* eslint-disable no-undef */

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import i18n from '../../utils/i18n';

const GITHUB_REPO = 'https://github.com/reactjs/redux'

export default class Explore extends Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.setInputValue(nextProps.value)
    }
  }

  getInputValue = () => {
    return this.input.value
  }

  setInputValue = (val) => {
    // Generally mutating DOM is a bad idea in React components,
    // but doing this for a single uncontrolled field is less fuss
    // than making it controlled and maintaining a state for it.
    this.input.value = val
  }

  handleKeyUp = (e) => {
    if (e.keyCode === 13) {
      this.handleGoClick()
    }
  }

  handleGoClick = () => {
    this.props.onChange(this.getInputValue())
  }

  render() {
    return (
      <div>
        <p>{i18n.t("EXPLORE.TYPE_USERNAME")}</p>
        <input size="45"
               ref={(input) => this.input = input}
               defaultValue={this.props.value}
               onKeyUp={this.handleKeyUp} />
        <button onClick={this.handleGoClick}>
          {i18n.t("EXPLORE.GO")}
        </button>
        <p>
          {i18n.t("EXPLORE.CODE_ON")} <a href={GITHUB_REPO} target="_blank" rel="noopener noreferrer">{i18n.t("COMMON.GITHUB")}</a>.
        </p>
        <p>
          {i18n.t('EXPLORE.MOVE_DEVTOOLS')}
        </p>
      </div>
    )
  }
}
