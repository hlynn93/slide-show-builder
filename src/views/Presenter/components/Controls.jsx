import React, { PureComponent } from 'react';
import { Button, Progress } from 'element-react';
import PropTypes from 'prop-types';

import './Controls.scss';

class Controls extends PureComponent {
  constructor(props) {
    super(props);
    this.renderControls = this.renderControls.bind(this)
  }

  renderControls(controls) {
    const controlBtns = controls.map((c,i) => (
      <Button
        key={i}
        type="primary"
        icon={c.icon}
        onClick={c.onClick}>
        {c.text}
      </Button>
    ))

    return (
      <Button.Group>
        {controlBtns}
      </Button.Group>
    )
  }

  render() {

    const {
      index,
      length,
      onNext,
      onPrev,
      onExit,
    } = this.props

    const playerControls = [
      {
        type: 'button',
        icon: 'arrow-left',
        onClick: onPrev,
      },
      {
        type: 'button',
        icon: 'arrow-right',
        onClick: onNext,
      },
    ]

    const miscControls = [
      {
        type: 'button',
        onClick: onExit,
        text: 'Exit'
      },
    ]


    return (
      <div className="controls">
        { this.renderControls(playerControls) }
        <div className="controls_progress">
          <Progress
            strokeWidth={18}
            percentage={Math.round(( (index+1)/length) * 100)}
            textInside
          />
        </div>
        { this.renderControls(miscControls) }
      </div>
    );
  }
}

Controls.propTypes = {
  index: PropTypes.number,
  length: PropTypes.number,
  onNext: PropTypes.func,
  onPrev: PropTypes.func,
  onExit: PropTypes.func,
};

Controls.defaultProps = {
  onNext: () => {},
  onPrev: () => {},
  onExit: () => {},
};

export default Controls;
