import createSuggestionPlugin from './createSuggestionPlugin'
import React, {Component, PropTypes} from 'react';
import SuggestionComponentList from './SuggestionComponentList'
import constants from '../constants'
import {Entity} from 'draft-js';

export default {
  create (completionDescriptions) {
    return new CompletionSet(completionDescriptions)
  }
}

class CompletionSet {
  constructor (completionDescriptors) {
    this._createCompletionPlugins(completionDescriptors);
  }

  _createCompletionPlugins (completionDescriptors) {
    this._completionDescriptorsByPrefixes = {}
    this._pluginInstances = []
    this._decorators = []

    completionDescriptors.map((description) => {
      const suggestionPrefix = description.prefix;

      const pluginInstance = createSuggestionPlugin({suggestionRegex: this._getSuggestionRegexForPrefix(suggestionPrefix)});
      this._pluginInstances.push(pluginInstance)

      this._decorators.push(this._createDecorator(description.type))

      this._completionDescriptorsByPrefixes[suggestionPrefix] = {
        SuggestionComponent: pluginInstance.CompletionSuggestions,
        allSuggestions: description.suggestions,
      }
    })
  }

  renderSuggestionComponents () {
    return <SuggestionComponentList
      descriptorsByPrefixes={this._completionDescriptorsByPrefixes}
    />
  }

  getEditorPluginInsances () {
    return this._pluginInstances
  }

  getDecorators () {
    return this._decorators
  }

  _getSuggestionRegexForPrefix (suggestionPrefix) {
    return new RegExp(`\\B${suggestionPrefix}.*`, 'g')
  }

  _createDecorator (completionType) {
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
}
