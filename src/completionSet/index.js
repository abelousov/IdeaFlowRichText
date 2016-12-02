import getSuggestionPluginSingleton from './getSuggestionPluginSingleton'
import React, {Component, PropTypes} from 'react';
import SuggestionComponentWrapper from './SuggestionComponentWrapper'
import constants from '../constants'
import {Entity} from 'draft-js';
import createAutocompleteFinder from './findCurrentAutocomplete'

export default {
  create (completionDescriptors, editorState) {
    const prefixes = completionDescriptors.map((descriptor) => descriptor.prefix)

    const findCurrentAutocomplete = createAutocompleteFinder(prefixes)

    const completionPlugin = getSuggestionPluginSingleton({
      suggestionRegex: _getSuggestionRegex(completionDescriptors),
      findCurrentAutocomplete
    })

    const decorators = completionDescriptors.map((descriptor) => _createDecorator(descriptor.type))

    const renderedSuggestionComponent = _renderSuggestionComponent(
      completionDescriptors,
      completionPlugin.CompletionSuggestions,
      editorState,
      findCurrentAutocomplete
    )

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

  return new RegExp(`(\\W|^)${prefixesUnionGroup}(\\w|\\s)*(?!${prefixesUnionGroup})`, 'g')
}

function _renderSuggestionComponent(completionDescriptors, SuggestionComponent, editorState, findCurrentAutocomplete) {
  return <SuggestionComponentWrapper
    completionDescriptors={completionDescriptors}
    SuggestionComponent={SuggestionComponent}
    editorState={editorState}
    findCurrentAutocomplete={findCurrentAutocomplete}
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
