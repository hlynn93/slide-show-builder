/* eslint-disable */
import React, { PureComponent } from 'react';
import { CSSTransition } from 'react-transition-group'
import PropTypes from 'prop-types';
import './Transition.scss';

const DEFAULT_DURATION = 300;

const Transition = ({
  transition,
  children,
  duration,
  ...props
}) => (
  <CSSTransition
    {...props}
    timeout={duration || DEFAULT_DURATION}
    classNames={transition || 'fade'}
  >
    {children}
  </CSSTransition>
);

const Fade = props => <Transition {...props} transition='fade' />

export {
  Fade
}
