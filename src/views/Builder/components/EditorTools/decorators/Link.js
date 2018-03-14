import React, { Component } from 'react';
import PropTypes from 'prop-types';

const findLinkEntities = (contentBlock, callback, contentState) => {
  contentBlock.findEntityRanges(
    (character) => {
      const entityKey = character.getEntity();
      return (
        entityKey !== null &&
        contentState.getEntity(entityKey).getType() === 'LINK'
      );
    },
    callback,
  );
}

export const getLinkComponent = () => {
  return class Link extends Component {
    static propTypes = {
      entityKey: PropTypes.string.isRequired,
      children: PropTypes.array,
      contentState: PropTypes.object,
    };

    state: Object = {
      showPopOver: false,
    };

    render() {
      const { children, entityKey, contentState } = this.props;
      const { url, targetOption } = contentState.getEntity(entityKey).getData();
      return (
        <a href={url}
          target={targetOption}>
          {children}
        </a>
      );
    }
  };
}

export default config => ({
  strategy: findLinkEntities,
  component: getLinkComponent(config),
});
