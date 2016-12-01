import createSuggestionPlugin from './plugin'
import React, {Component, PropTypes} from 'react';

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

  formatCompletions (editorState) {
    return editorState
  }

  _getSuggestionRegexForPrefix (suggestionPrefix) {
    return new RegExp(`\\B${suggestionPrefix}.*`, 'g')
  }
}

class SuggestionComponentList extends Component {
  constructor (props) {
    super(props)

    this.state = {}

    this._iterateSuggestionComponents((prefix, descriptor) => this.state[this._getFilteredSuggestionsStateKey(prefix)] = descriptor.allSuggestions)
  }

  render () {
    const suggestionComponents = this._iterateSuggestionComponents((prefix, descriptor) => this._renderSingleComponent(prefix, descriptor))
    return <div>{suggestionComponents}</div>
  }

  _iterateSuggestionComponents (callback) {
    const descriptorsByPrefixes = this.props.descriptorsByPrefixes;
    return Object.keys(descriptorsByPrefixes).map((prefix) => callback(prefix, descriptorsByPrefixes[prefix]))
  }

  _renderSingleComponent (prefix, descriptor) {
    const {SuggestionComponent, allSuggestions} = descriptor

    const filteredSuggestionsStateKey = this._getFilteredSuggestionsStateKey(prefix)

    const onSearchChange = ({value}) => {
      this.setState({
        [filteredSuggestionsStateKey]: allSuggestions.filter((suggestion) => suggestion.fitsSearch(value)),
      });
    }

    return <SuggestionComponent
      key={prefix}
      onSearchChange={onSearchChange}
      suggestions={this.state[filteredSuggestionsStateKey]}
    />
  }

  _getFilteredSuggestionsStateKey (prefix) {
    return `filtered_suggestions_${prefix}`;
  }
}
