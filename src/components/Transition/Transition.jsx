import React, { PureComponent } from 'react';
import TransitionGroup from 'react-addons-transition-group';
import { TweenMax } from "gsap";
import PropTypes from 'prop-types';

class Transition extends PureComponent {
  componentWillEnter (callback) {
    TweenMax.fromTo(this.container, 0.3, {y: 100, opacity: 0}, {y: 0, opacity: 1, onComplete: callback});
  }

  componentWillLeave (callback) {
    TweenMax.fromTo(this.container, 0.3, {y: 0, opacity: 1}, {y: -100, opacity: 0, onComplete: callback});
  }
  render() {
    return (
      <TransitionGroup>
        <div ref={ref => this.container = ref}>
          {this.props.children}
        </div>
      </TransitionGroup>
    )
  }
}

Transition.propTypes = {
  children: PropTypes.any
};

export default Transition
