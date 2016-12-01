import React, {Component, PropTypes} from 'react';

export default class SuggestionComponentList extends Component {
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
      console.log('>>>> value: ', value);
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
/**
 * Created by anton on 01/12/16.
 */
