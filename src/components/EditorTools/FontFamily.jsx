import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
  toggleCustomInlineStyle,
  getSelectionCustomInlineStyle
} from '../../utils/rtfUtils';
import { TEXT_TOOL_TYPE } from '../../constants/builderConstants';
import { Dropdown } from './components';

class FontFamily extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      currentFontFamily: undefined
    }
    this.updateFontFamily = this.updateFontFamily.bind(this)
    this.toggleFontFamily = this.toggleFontFamily.bind(this)
  }

  componentDidMount() {
    this.updateFontFamily()
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.editorState && (nextProps.editorState !== this.props.editorState)) {
      this.updateFontFamily(nextProps.editorState)
    }
  }

  updateFontFamily(editorState) {
    const state = editorState || this.props.editorState
    if(!state) return

    const fontKey = getSelectionCustomInlineStyle(editorState, ['FONTFAMILY']).FONTFAMILY
    if(!fontKey) return

    this.setState({
      currentFontFamily: fontKey.split('-')[1]
    });
  }

  toggleFontFamily(fontFamily) {
    const { onChange, editorState } = this.props;
    return onChange(toggleCustomInlineStyle(editorState, TEXT_TOOL_TYPE.FONT_FAMILY, fontFamily))
  }

  render() {
    const { items, onBlur, onFocus } = this.props
    return (
      <Dropdown
        placeholder="Font family"
        activeId={this.state.currentFontFamily}
        items={items}
        onChange={this.toggleFontFamily}
        onBlur={onBlur}
        onFocus={onFocus}
      />
    );
  }
}

FontFamily.propTypes = {
  editorState: PropTypes.object,
  onChange: PropTypes.func,
  items: PropTypes.array,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
};

export default FontFamily;
