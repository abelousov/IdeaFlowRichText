import createSuggestionPlugin from './plugin/createSuggestionPlugin'
import React, {Component, PropTypes} from 'react';
import SuggestionComponentList from './SuggestionComponentList'
export default {
  create (completionDescriptions) {
    return new CompletionPluginSet(completionDescriptions)
  }
}

class CompletionPluginSet {
  constructor (completionDescriptors) {
    this._createCompletionPlugins(completionDescriptors);
  }

  _createCompletionPlugins (completionDescriptors) {
    this._completionDescriptorsByPrefixes = {}
    this._pluginInstances = []

    completionDescriptors.map((description) => {
      const suggestionPrefix = description.prefix;

      const pluginInstance = createSuggestionPlugin({suggestionRegex: this._getSuggestionRegexForPrefix(suggestionPrefix)});
      this._pluginInstances.push(pluginInstance)

      this._completionDescriptorsByPrefixes[suggestionPrefix] = {
        SuggestionComponent: pluginInstance.CompletionSuggestions,
        allSuggestions: description.suggestions
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

  _getSuggestionRegexForPrefix (suggestionPrefix) {
    return new RegExp(`\\B${suggestionPrefix}.*`, 'g')
  }
}
