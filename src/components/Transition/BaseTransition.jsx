/* eslint-disable */
import React, { PureComponent } from 'react';
// import { CSSTransition } from 'react-transition-group'
import Transition from 'react-transition-group/Transition';
import cx from 'classnames';
import PropTypes from 'prop-types';

import { TRANSITION, EASING } from '../../constants/builderConstants';
import './Transition.scss';

const DEFAULT_DURATION = 200;

const getBaseStyle = (duration, easing) => ({
  transition: `opacity ${duration}ms ${easing}`,
  opacity: 0,
  position: 'absolute',
})

const transitionStyles = {
  entering: {
    opacity: 0,
  },
  entered:  {
    opacity: 1
  },
};

export const BaseTransition = ({
  type,
  easing,
  children,
  duration,
  className,
  inProp,
  ...props
}) => (
  <Transition
    in={inProp}
    timeout={duration}>
    {(state) => (
      <div style={{
        ...getBaseStyle(duration, easing),
        ...transitionStyles[state]
      }}>
        {children}
      </div>
    )}
  </Transition>
);

BaseTransition.propTypes = {
  type: PropTypes.string,
  easing: PropTypes.string,
  duration: PropTypes.number,
  className: PropTypes.string,
  children: PropTypes.any
}

BaseTransition.defaultProps = {
  type: TRANSITION.FADE_LEFT,
  easing: EASING.EASE_IN,
  duration: DEFAULT_DURATION,
}
