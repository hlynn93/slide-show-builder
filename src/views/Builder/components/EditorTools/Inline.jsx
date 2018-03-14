import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { RichUtils, EditorState, Modifier } from 'draft-js';

import { getSelectionInlineStyle } from '../../../../utils/rtfUtils';
import { ButtonGroup } from '../../../../components/Button';

class Inline extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentStyles: {}
    }
    this.updateStyles = this.updateStyles.bind(this)
    this.toggleStyle = this.toggleStyle.bind(this)
  }

  componentDidMount() {
    this.updateStyles()
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.editorState && this.props.editorState !== nextProps.editorState) {
      this.updateStyles(nextProps.editorState)
    }
  }

  updateStyles(editorState) {
    const state = editorState || this.props.editorState
    if(!state) return

    const style = getSelectionInlineStyle(state)
    if(!style) return

    const currentStyles = {}
    Object.keys(style).map(k => {
      currentStyles[k] = style[k]
    })

    this.setState({ currentStyles });
  }

  toggleStyle(style) {
    const { editorState, onChange } = this.props;
    if(!editorState) return

    let newState = RichUtils.toggleInlineStyle(editorState, style)

    if(style === 'SUBSCRIPT' || style === 'SUPERSCRIPT') {
      const removeStyle = style === 'SUBSCRIPT' ? 'SUPERSCRIPT' : 'SUBSCRIPT';
      const contentState = Modifier.removeInlineStyle(
        newState.getCurrentContent(),
        newState.getSelection(),
        removeStyle,
      )
      newState = EditorState.push(newState, contentState, 'change-inline-style')
    }
    onChange(newState);
  }

  render() {

    const { items } = this.props;
    return (
      <ButtonGroup
        onClick={this.toggleStyle}
        items={items}
        activeIds={this.state.currentStyles}
        />
    );
  }
}

Inline.propTypes = {
  items: PropTypes.array,
  editorState: PropTypes.object,
  onChange: PropTypes.func,
};

Inline.defaultProps = {
  onChange: () => {},
};

export default Inline;
