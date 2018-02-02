/* eslint-disable no-undef */

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import i18n from '../../utils/i18n';

export default class List extends Component {
  static propTypes = {
    loadingLabel: PropTypes.string.isRequired,
    renderItem: PropTypes.func.isRequired,
    items: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    isFetching: true,
    loadingLabel: i18n.t("COMMON.LOADING")
  }

  render() {
    const {
      isFetching,
      items, renderItem, loadingLabel
    } = this.props

    const isEmpty = items.length === 0
    if (isEmpty && isFetching) {
      return <h2><i>{loadingLabel}</i></h2>
    }

    if (isEmpty) {
      return <h1><i>{i18n.t("COMMON.NOTHING_HERE")}</i></h1>
    }

    return (
      <div>
        {items.map(renderItem)}
      </div>
    )
  }
}
