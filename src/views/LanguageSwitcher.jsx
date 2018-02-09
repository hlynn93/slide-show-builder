/* eslint-disable no-undef */

import React from 'react'
import PropTypes from 'prop-types'
import { Button } from 'element-react';
import { LANGUAGES } from '../constants/appConstants';

const LanguageSwitcher = ({ setLanguage }) => {
  return (
    <div className="lang_switcher">
      {
        Object.keys(LANGUAGES).map(k => (
          <Button
            key={k}
            onClick={setLanguage.bind(null, LANGUAGES[k])}
            plain
            type="success"
          >
          {k}
          </Button>
        ))
      }
    </div>
  )
}

LanguageSwitcher.propTypes = {
  setLanguage: PropTypes.func.isRequired
}

export default LanguageSwitcher
