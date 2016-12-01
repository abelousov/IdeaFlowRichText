import React, {Component, PropTypes} from 'react';

export default class SuggestionComponentWrapper extends Component {
  constructor (props) {
    super(props)

    this.state = {
      currentSearch: null
    }
  }

  onSearchChange = ({value}) => {
    this.setState({
      currentSearch: value
    });
  }

  render () {
    const {SuggestionComponent, completionDescriptors, editorState} = this.props

    const currentSearch = this.state.currentSearch;

    return <SuggestionComponent
      onSearchChange={this.onSearchChange}
      suggestions={this._getFilteredSuggestions(currentSearch, completionDescriptors, editorState)}
    />
  }

  _getFilteredSuggestions (currentSearch, completionDescriptors, editorState) {
    // TODO: define current suggestion type using editorState
    const allSuggestions = completionDescriptors[0].suggestions;

    const currentSearchIsEmpty = !currentSearch || currentSearch === '';
    const currentFilteredSuggestions = currentSearchIsEmpty
      ? allSuggestions
      : allSuggestions.filter((suggestion) => suggestion.fitsSearch(currentSearch));

    console.log('>>>> filtered suggestions: ', currentSearch, allSuggestions, currentFilteredSuggestions);
    return currentFilteredSuggestions;
  }
}
