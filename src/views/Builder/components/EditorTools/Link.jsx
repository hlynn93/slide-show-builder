import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Input, Popover, Form, Switch, Button } from 'element-react'
import { EditorState , Modifier, RichUtils } from 'draft-js';
import {
  getEntityRange,
  getSelectionText,
  getSelectionEntity,
} from 'draftjs-utils';
import { IconButton, ButtonGroup } from '../../../../components/Button';

import './EditorTools.scss';

import linkifyIt from 'linkify-it';
const linkify = linkifyIt();

const LinkPopover = ({
  form,
  onSubmit,
  onChange,
  onFocus,
  onBlur,
  children
}) => {
  return (
    <Popover
          placement="bottom"
          width="200"
          trigger="click"
          content={(
            <div className="editor_popover_content">
              <Form className="editor_link"
                model={form}
                onSubmit={onSubmit}>
                <Form.Item className="link_item">
                  <Input
                    placeholder="Link title"
                    value={form.title}
                    onChange={onChange.bind(null, 'title')}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    >
                  </Input>
                </Form.Item>
                <Form.Item className="link_item">
                  <Input
                    placeholder="Link target"
                    value={form.target}
                    onChange={onChange.bind(null, 'target')}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    >
                  </Input>
                </Form.Item>
                <Form.Item label="Opens in new tab">
                  <Switch
                    onText=""
                    offText=""
                    value={form.newTab}
                    onChange={onChange.bind(this, 'newTab')}
                  />
                </Form.Item>
                <Form.Item>
                  <Button nativeType="submit">Add</Button>
                </Form.Item>
              </Form>
            </div>
        )}>
          {children}
        </Popover>
  )
}

LinkPopover.propTypes = {
  form: PropTypes.object,
  onSubmit: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  children: PropTypes.any
}

LinkPopover.defaultProps = {
  form: {},
  onSubmit: () => {},
  onChange: () => {},
  onFocus: () => {},
  onBlur: () => {},
}

const DEFAULT_STATE = {
  form: {
    title: '',
    target: '',
    newTab: false,
  },
}

class Link extends PureComponent {
  constructor(props) {
    super(props);
    this.state = DEFAULT_STATE

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
    const links = linkify.match(target);
    const linkifiedTarget = links && links[0] ? links[0].url : '';
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
        url: linkifiedTarget,
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

    this.setState( ...DEFAULT_STATE, () => {
      this.props.onChange(EditorState.push(newEditorState, contentState, 'insert-characters'));
    });
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
    const { items, onBlur, onFocus } = this.props
    const { form } = this.state

    if(items.length < 2)
      throw "Link element needs at least two items"

    return (
      <ButtonGroup>
        <LinkPopover
          form={form}
          onSubmit={this.handleAdd}
          onChange={this.handleChange}
          onFocus={onFocus}
          onBlur={onBlur}
          >
          <IconButton
            item={items[0]}
            onClick={this.onPromptPopover}/>
        </LinkPopover>
        <IconButton
          item={items[1]}
          onClick={this.handleRemove}/>
      </ButtonGroup>
    );
  }
}

Link.propTypes = {
  items: PropTypes.array,
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
