import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Input, Popover, Form, Button, Switch } from 'element-react'
import linkifyIt from 'linkify-it';
const linkify = linkifyIt();

class Link extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        title: '',
        target: '',
        newTab: false,
      }
    }
    this.onChange = this.onChange.bind(this)
    this.onAdd = this.onAdd.bind(this)
  }

  onChange(key, value) {
    this.setState({
      form: {
        ...this.state.form,
        [key]: value
      }
    });
  }

  onAdd(e) {
    e.preventDefault();
    const { title, target, newTab } = this.state.form
    const links = linkify.match(target);
    const linkifiedTarget = links && links[0] ? links[0].url : '';
    this.props.onAdd({
      title,
      target: linkifiedTarget,
      newTab }
    );
  }

  render() {
    const { toolId, tool } = this.props
    return (
      <Popover
        key={toolId}
        placement="bottom"
        width="200"
        trigger="click"
        content={(
          <div className="editor_popover_content">
            <Form className="editor_link"
              model={this.state.form}
              onSubmit={this.onAdd}>
              <Form.Item className="link_item">
                <Input
                  placeholder="Link title"
                  value={this.state.form.title}
                  onChange={this.onChange.bind(null, 'title')}
                  >
                </Input>
              </Form.Item>
              <Form.Item className="link_item">
                <Input
                  placeholder="Link target"
                  value={this.state.form.target}
                  onChange={this.onChange.bind(null, 'target')}>
                </Input>
              </Form.Item>
              <Form.Item label="Opens in new tab">
                <Switch
                  onText=""
                  offText=""
                  value={this.state.form.newTab}
                  onChange={this.onChange.bind(this, 'newTab')}
                />
              </Form.Item>
              <Form.Item>
                <Button nativeType="submit">Add</Button>
                <Button>Cancel</Button>
              </Form.Item>
            </Form>
          </div>
      )}>
        <Button className="button_icon">{tool.item.label}</Button>
      </Popover>
    );
  }
}

Link.propTypes = {
  toolId: PropTypes.string,
  tool: PropTypes.object,
  onAdd: PropTypes.func,
};

Link.defaultProps = {
  onAdd: () => {},
};

export default Link;
