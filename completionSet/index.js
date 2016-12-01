import createSuggestionPlugin from './createSuggestionPlugin'
import React, {Component, PropTypes} from 'react';
import SuggestionComponentWrapper from './SuggestionComponentWrapper'
import constants from '../constants'
import {Entity} from 'draft-js';

export default {
  create (completionDescriptors, editorState) {
    const completionPlugin = createSuggestionPlugin({
      suggestionRegex: _getSuggestionRegex(completionDescriptors)
    })

    const decorators = completionDescriptors.map((descriptor) => _createDecorator(descriptor.type))

    const renderedSuggestionComponent = _renderSuggestionComponent(completionDescriptors, editorState)
    return {
      decorators,
      plugins: [completionPlugin],
      renderedSuggestionComponent
    }
  }
}

function _getSuggestionRegex(completionDescriptors) {
  const allPrefixes = completionDescriptors.map(descriptor => descriptor.prefix)

  const prefixesUnionGroup = `(${allPrefixes.join('|')})`

  return new RegExp(`\\B${prefixesUnionGroup}.*`, 'g')
}

function _renderSuggestionComponent(completionDescriptors, editorState) {
  return <SuggestionComponentWrapper
    completionDescriptors={completionDescriptors}
    editorState={editorState}
  />
}

function _createDecorator (completionType) {
  return {
    strategy: (contentBlock, callback) => {
      contentBlock.findEntityRanges(
        (character) => {
          const entityKey = character.getEntity();
          if (entityKey === null) {
            return false;
          }
          const entity = Entity.get(entityKey);

          const entityData = entity.getData();
          return entity.getType() === constants.ENTITY_TYPE && entityData.completionType === completionType;
        },
        callback
      );
    },

    component: (props) => {
      return <span className={completionType.toLowerCase()}>{props.children}</span>
    }
  }
}
