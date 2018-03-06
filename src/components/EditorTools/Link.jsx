import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Input, Popover, Form, Button, Switch } from 'element-react'
// import linkifyIt from 'linkify-it';
import { EditorState , Modifier, RichUtils } from 'draft-js';
import {
  getEntityRange,
  getSelectionText,
  getSelectionEntity,
} from 'draftjs-utils';
// const linkify = linkifyIt();

class Link extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        title: '',
        target: '',
        newTab: false,
      },
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleAdd = this.handleAdd.bind(this)
    this.handleRemove = this.handleRemove.bind(this)
    this.onPromptPopover = this.onPromptPopover.bind(this)
    this.getCurrentValues = this.getCurrentValues.bind(this)
  }


  componentWillMount() {
    const { editorState } = this.props;
    if (editorState) {
      this.setState({
        currentEntity: getSelectionEntity(editorState),
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.editorState &&
      this.props.editorState !== nextProps.editorState) {
      const currentEntity = getSelectionEntity(nextProps.editorState);
      this.setState({ currentEntity });
    }
  }


  getCurrentValues = () => {
    const { editorState } = this.props;
    const { currentEntity } = this.state;
    const contentState = editorState.getCurrentContent();
    const currentValues = {};
    if (currentEntity && (contentState.getEntity(currentEntity).get('type') === 'LINK')) {
      currentValues.link = {};
      const entityRange = currentEntity && getEntityRange(editorState, currentEntity);
      currentValues.link.target = currentEntity && contentState.getEntity(currentEntity).get('data').url;
      currentValues.link.targetOption = currentEntity && contentState.getEntity(currentEntity).get('data').targetOption;
      currentValues.link.title = (entityRange && entityRange.text);
    }
    currentValues.selectionText = getSelectionText(editorState);
    return currentValues;
  }

  handleChange(key, value) {
    this.setState({
      form: {
        ...this.state.form,
        [key]: value
      },
    });
  }

  handleRemove () {
    const { editorState } = this.props;
    const { currentEntity } = this.state;
    let selection = editorState.getSelection();
    if (currentEntity) {
      const entityRange = getEntityRange(editorState, currentEntity);
      selection = selection.merge({
        anchorOffset: entityRange.start,
        focusOffset: entityRange.end,
      });
      this.props.onChange(RichUtils.toggleLink(editorState, selection, null));
    }
  }

  handleAdd(e) {
    e.preventDefault();
    const { editorState } = this.props;
    const { title, target, newTab } = this.state.form;
    const { currentEntity } = this.state;
    let selection = editorState.getSelection();

    if (currentEntity) {
      const entityRange = getEntityRange(editorState, currentEntity);
      selection = selection.merge({
        anchorOffset: entityRange.start,
        focusOffset: entityRange.end,
      });
    }

    const entityKey = editorState
      .getCurrentContent()
      .createEntity('LINK', 'MUTABLE', {
        url: target,
        targetOption: newTab ? '_blank' : '_self'
      })
      .getLastCreatedEntityKey();

    let contentState = Modifier.replaceText(
      editorState.getCurrentContent(),
      selection,
      `${title}`,
      editorState.getCurrentInlineStyle(),
      entityKey,
    );

    let newEditorState = EditorState.push(editorState, contentState, 'insert-characters');

    selection = newEditorState.getSelection().merge({
      anchorOffset: selection.get('anchorOffset') + title.length,
      focusOffset: selection.get('anchorOffset') + title.length,
    });
    newEditorState = EditorState.acceptSelection(newEditorState, selection);
    contentState = Modifier.insertText(
      newEditorState.getCurrentContent(),
      selection,
      ' ',
      newEditorState.getCurrentInlineStyle(),
      undefined,
    );
    this.props.onChange(EditorState.push(newEditorState, contentState, 'insert-characters'));
  }

  onPromptPopover() {
    const { link, selectionText } = this.getCurrentValues();
    this.setState({
      form: {
        ...this.state.form,
        title: selectionText,
        target: link
      }
    });
  }

  render() {
    const { toolId, tool, onBlur, onFocus } = this.props

    return (
      <div>
        <Popover
          key={toolId}
          placement="bottom"
          width="200"
          trigger="click"
          content={(
            <div className="editor_popover_content">
              <Form className="editor_link"
                model={this.state.form}
                onSubmit={this.handleAdd}>
                <Form.Item className="link_item">
                  <Input
                    placeholder="Link title"
                    value={this.state.form.title}
                    onChange={this.handleChange.bind(null, 'title')}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    >
                  </Input>
                </Form.Item>
                <Form.Item className="link_item">
                  <Input
                    placeholder="Link target"
                    value={this.state.form.target}
                    onChange={this.handleChange.bind(null, 'target')}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    >
                  </Input>
                </Form.Item>
                <Form.Item label="Opens in new tab">
                  <Switch
                    onText=""
                    offText=""
                    value={this.state.form.newTab}
                    onChange={this.handleChange.bind(this, 'newTab')}
                  />
                </Form.Item>
                <Form.Item>
                  <Button nativeType="submit">Add</Button>
                  <Button>Cancel</Button>
                </Form.Item>
              </Form>
            </div>
        )}>
          <Button onClick={this.onPromptPopover} className="button_icon">{tool.link.label}</Button>
        </Popover>
          <Button onClick={this.handleRemove} className="button_icon">{tool.unlink.label}</Button>
      </div>
    );
  }
}

Link.propTypes = {
  toolId: PropTypes.string,
  tool: PropTypes.object,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  editorState: PropTypes.object,
};

Link.defaultProps = {
  onChange: () => {},
  onBlur: () => {},
  onFocus: () => {},
};

export default Link;
