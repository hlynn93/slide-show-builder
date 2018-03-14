import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { ButtonGroup } from '../../../../components/Button';

/**
 * This component doesn't need its own state
 * since it's controlled by the object's attribute `textAlign` instead of relying on the editorState
 */
class TextAlign extends PureComponent {
  constructor(props) {
    super(props);
    this.toggleTextAlign = this.toggleTextAlign.bind(this)
  }

  toggleTextAlign(alignment) {
    return this.props.onChange(alignment)
  }

  render() {

    const { items, textAlign } = this.props;
    return (
      <ButtonGroup
        onClick={this.toggleTextAlign}
        items={items}
        activeIds={{ [textAlign]: true }}
        />
    );
  }
}

TextAlign.propTypes = {
  items: PropTypes.array,
  textAlign: PropTypes.string,
  onChange: PropTypes.func,
};

TextAlign.defaultProps = {
  items: [],
  onChange: () => {},
};

export default TextAlign;
