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
    return new RegExp(`(\\s|^)${suggestionPrefix}[^\\s]*`, 'g')
  }
}

class SuggestionComponentList extends Component {
  constructor (props) {
    super(props)

    this.state = {}
  }

  render () {
    const suggestionComponents = Object.keys(this.props.descriptorsByPrefixes).map((prefix) => this._renderSingleComponent(prefix, this.props.descriptorsByPrefixes[prefix]))

    return <div>{suggestionComponents}</div>
  }

  _renderSingleComponent (prefix, descriptor) {
    const {SuggestionComponent, allSuggestions} = descriptor

    const filteredSuggestionsStateKey = `filtered_suggestions_${prefix}`

    const onSearchChange = ({value}) => {
      this.setState({
        [filteredSuggestionsStateKey]: allSuggestions.filter((suggestion) => suggestion.fitsSearch(value)),
      });
    }

    const currentFilteredSuggestions = this.state[filteredSuggestionsStateKey] || allSuggestions;

    return <SuggestionComponent
      key={prefix}
      onSearchChange={onSearchChange}
      suggestions={currentFilteredSuggestions}
    />
  }
}