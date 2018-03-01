/* eslint-disable */
import React, { PureComponent } from 'react';
import { CSSTransition } from 'react-transition-group'
import cx from 'classnames';
import PropTypes from 'prop-types';

import { TRANSITION, EASING } from '../../constants/builderConstants';
import './Transition.scss';

const DEFAULT_DURATION = 400;

export const Transition = ({
  type,
  easing,
  children,
  duration,
  className,
  style,
  ...props
}) => {

  // This passes the style prop to the children
  // const childrenWithStyle = React.Children.map(children, child =>
  const childWithStyle = React.cloneElement(children, {
    style: {
      ...style,
      animationDuration: duration ? `${duration}ms` : `${DEFAULT_DRUATION}ms`
    }
  });

  return (<CSSTransition
    {...props}
    timeout={400}
    unmountOnExit
    classNames={cx(
      type,
      className,
    )}
  >
    {childWithStyle}
  </CSSTransition>)
}
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
