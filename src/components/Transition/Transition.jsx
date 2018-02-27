/* eslint-disable */
import React, { PureComponent } from 'react';
import { CSSTransition } from 'react-transition-group'
import cx from 'classnames';
import PropTypes from 'prop-types';

import { TRANSITION, EASING } from '../../constants/builderConstants';
import './Transition.scss';

const DEFAULT_DURATION = 200;

export const Transition = ({
  type,
  easing,
  children,
  duration,
  className,
  ...props
}) => (
  <CSSTransition
    {...props}
    timeout={duration}
    classNames={cx(
      type,
      className,
    )}
  >
    {children}
  </CSSTransition>
);

Transition.propTypes = {
  type: PropTypes.string,
  easing: PropTypes.string,
  duration: PropTypes.number,
  className: PropTypes.string,
  children: PropTypes.any
}

Transition.defaultProps = {
  type: TRANSITION.FADE_LEFT,
  easing: EASING.EASE_IN,
  duration: DEFAULT_DURATION,
}

export const Slide = props => <Transition {...props} transition='slide' />
export const Fade = props => <Transition {...props} transition='fade' />
