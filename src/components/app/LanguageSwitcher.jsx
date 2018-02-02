/* eslint-disable no-undef */

import React from 'react'
import PropTypes from 'prop-types'
import { LANGUAGES } from '../../constants/appConstants';

const LanguageSwitcher = ({ setLanguage }) => {
  return (
    <div>
      {
        Object.keys(LANGUAGES).map(k => (
          <button
            key={k}
            onClick={setLanguage.bind(null, LANGUAGES[k])}
          >
            {k}
          </button>
        ))
      }
    </div>
  )
}

LanguageSwitcher.propTypes = {
  setLanguage: PropTypes.func.isRequired
}

export default LanguageSwitcher
