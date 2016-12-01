import React, {Component, PropTypes} from 'react';

import {List} from 'immutable'

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
    const allSuggestions = this._getCurrentSuggestions(completionDescriptors, currentSearch, editorState) || List()

    const currentSearchIsEmpty = !currentSearch || currentSearch === '';
    const currentFilteredSuggestions = currentSearchIsEmpty
      ? allSuggestions
      : allSuggestions.filter((suggestion) => suggestion.fitsSearch(currentSearch));

    return currentFilteredSuggestions;
  }

  _getCurrentSuggestions (completionDescriptors, currentSearch, editorState) {
    const textEndingWithCurrentSearchPrefix = this._getTextEndingWithCurrentSearchPrefix(currentSearch, editorState)

    let currentSuggestions

    completionDescriptors.map((descriptor) => {
      if(textEndingWithCurrentSearchPrefix.endsWith(descriptor.prefix)) {
        currentSuggestions = descriptor.suggestions
      }
    })

    return currentSuggestions
  }

  _getTextEndingWithCurrentSearchPrefix (currentSearch, editorState) {
    if (!currentSearch) {
      currentSearch = ''
    }

    const currentSelection = editorState.getSelection();

    const currentContentState = editorState.getCurrentContent()
    const currentBlock = currentContentState.getBlockForKey(currentSelection.getStartKey())

    const blockText = currentBlock.getText()

    const searchStartIndex = currentSelection.getStartOffset() - currentSearch.length

    return blockText.substring(0, searchStartIndex)
  }
}
