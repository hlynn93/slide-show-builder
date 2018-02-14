import React, { PureComponent } from 'react';
import { Button } from 'element-react';
import { RichUtils } from 'draft-js';
import PropTypes from 'prop-types';

import Panel from '../../../components/Panel';
import { textToolTypes, textEditorConfig } from '../../../constants/appConstants';


import './TextEditor.scss'

class TextEditor extends PureComponent {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this)
  }


  onClick(type, style) {
    console.warn(type, style);

    const { onClick, editorState, id } = this.props

    const typeMapping = {
      [textToolTypes.INLINE_STYLE_BUTTONS]: RichUtils.toggleInlineStyle,
      [textToolTypes.BLOCK_TYPE_BUTTONS]: RichUtils.toggleBlockType,
    }

    onClick(
      id,
      typeMapping[type](
        editorState, style
      )
    )
  }

  render() {
    const buttonGroups = Object.values(textToolTypes).map(type => (
      <Button.Group
        key={type}
        className="button_group"
        >
        {
          textEditorConfig[type].map(t => (
            <Button
              key={t.label}
              className="button_icon"
              onClick={this.onClick.bind(null, type, t.style)}
              >{t.label}</Button>
          ))
        }
      </Button.Group>
    ))

    return (
      <Panel
        className="text_editor"
        minimize={!this.props.visible}
        >
        <div className="text_editor_inner">
          { buttonGroups }
        </div>
      </Panel>
    );
  }
}

TextEditor.propTypes = {
  onClick: PropTypes.func,
  editorState: PropTypes.object,
  id: PropTypes.string,
  visible: PropTypes.bool,
};

export default TextEditor;
