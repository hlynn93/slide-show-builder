import React from 'react';
import PropTypes from 'prop-types';
import objectify from './objectify';
import { Editor, RichUtils } from 'draft-js';
import { getCustomStyleMap } from '../../../../utils/rtfUtils';

import './CanvasObject.scss';

const blockStyleFn = contentBlock => {
  const type = contentBlock.getType();
  switch (type) {
    case 'blockquote': return 'dnr_blockquote'
    case 'code-block': return 'dnr_precode'
    default:
      break;
  }
}

let editorRef;
let disableEdit = true;

const Text = ({
  onTextChange,
  editorState,
  textAlign,
  onFocus,
  onBlur,
  readOnly,
  isActive,
  ...props
}) => {

  const handleTextKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      onTextChange(newState);
      return 'handled';
    }
    return 'not-handled';
  }

  const handleBlur = () => {
    disableEdit = true;
    onBlur();
  }

  return (
    <div
      className={"canvas_text"}
      onDoubleClick={() => {
        if(!editorRef) return;
        onFocus();
        editorRef.focus()
        disableEdit = false;
      }}
      >
      <Editor
        { ...props }
        onBlur={handleBlur}
        ref={ref => {
          /* assign a ref variable to the active textbox */
          if(isActive) editorRef = ref
        }}
        readOnly={readOnly || disableEdit}
        handleKeyCommand={handleTextKeyCommand}
        editorState={editorState}
        onChange={onTextChange}
        customStyleMap={getCustomStyleMap()}
        blockStyleFn={blockStyleFn}
        textAlignment={textAlign}
      />
    </div>
  );
};

Text.propTypes = {
  isActive: PropTypes.bool,
  className: PropTypes.string,
  onTextChange: PropTypes.func,
  editorState: PropTypes.any,
  placeholder: PropTypes.string,
  readOnly: PropTypes.bool,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  textAlign: PropTypes.oneOf(['left', 'right', 'center', 'justify'])
};

Text.defaultProps = {
  placeholder: "Write something...",
  readOnly: false,
  isActive: false,
  onBlur: () => {},
  onChange: () => {}
};

export default objectify(Text);
