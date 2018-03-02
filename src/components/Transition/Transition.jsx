/* eslint-disable */
import React, { PureComponent } from 'react';
import { CSSTransition } from 'react-transition-group'
import cx from 'classnames';
import PropTypes from 'prop-types';

import { TRANSITION, EASING } from '../../constants/builderConstants';
import './Transition.scss';
import { Fade, Bounce, Roll, Slide, Flip, Reveal, Rotate, LightSpeed, Zoom  } from "react-reveal";

const applyTransition = (type, props, children) => {
  switch (type) {

    case TRANSITION.FADE:
      return <Fade {...props}>{children}</Fade>

    case TRANSITION.BOUNCE:
      return <Bounce {...props}>{children}</Bounce>

    case TRANSITION.ROLL:
      return <Roll {...props}>{children}</Roll>

    case TRANSITION.SLIDE:
      return <Slide {...props}>{children}</Slide>

    case TRANSITION.FLIP:
      return <Flip {...props}>{children}</Flip>

    case TRANSITION.REVEAL:
      return <Reveal {...props}>{children}</Reveal>

    case TRANSITION.ROTATE:
      return <Rotate {...props}>{children}</Rotate>

    case TRANSITION.LIGHTSPEED:
      return <LightSpeed {...props}>{children}</LightSpeed>

    case TRANSITION.ZOOM:
      return <Zoom {...props}>{children}</Zoom>

    default:
      return children;
  }
}

// const DEFAULT_DURATION = 400;

const Transition = ({
  type,
  direction,
  children,
  ...props
}) => {

  const directionProp = direction ? { [direction]: true } : {}

  const processedProps = {
    ...props,
    ...directionProp,
  }

  if(!type)
    return children

  return applyTransition(type, processedProps, children)
}

Transition.propTypes = {
  type: PropTypes.string,
  direction: PropTypes.oneOf(['left', 'right', 'top', 'bottom']),
  children: PropTypes.any
}

Transition.defaultProps = {

}

export default Transition;
