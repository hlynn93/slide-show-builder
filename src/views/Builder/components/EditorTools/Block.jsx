import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { RichUtils } from 'draft-js';

import { getSelectedBlocksType } from 'draftjs-utils';
import { Dropdown } from '../../../../components/Form';

class Block extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentStyle: 'unstyled',
    }
    this.updateStyle = this.updateStyle.bind(this)
    this.toggleStyle = this.toggleStyle.bind(this)
  }

  componentDidMount() {
    this.updateStyle()
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.editorState && (nextProps.editorState !== this.props.editorState)) {
      this.updateStyle(nextProps.editorState)
    }
  }

  updateStyle(editorState) {
    const state = editorState || this.props.editorState
    if(!state) return

    this.setState({
      currentStyle: getSelectedBlocksType(state)
    });
  }

  toggleStyle(style) {
   return this.props.onChange(RichUtils.toggleBlockType(this.props.editorState, style));
  }

  render() {
    const { items } = this.props;
    return (
      <Dropdown
        placeholder="Text Type"
        activeId={this.state.currentStyle}
        items={items}
        onChange={this.toggleStyle}
        />
    );
  }

}

Block.propTypes = {
  items: PropTypes.array,
  editorState: PropTypes.object,
  onChange: PropTypes.func,
};

export default Block;
