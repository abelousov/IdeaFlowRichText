import React, {Component, PropTypes} from 'react';

import {List} from 'immutable'

export default class SuggestionComponentWrapper extends Component {
  constructor (props) {
    super(props)

    this.state = {
      currentSearch: null,
      currentPrefix: null
    }
  }

  onSearchChange = ({value, prefix}) => {
    this.setState({
      currentSearch: value,
      currentPrefix: prefix
    });
  }

  render () {
    const {SuggestionComponent, findCurrentAutocomplete} = this.props

    return <SuggestionComponent
      findCurrentAutocomplete={findCurrentAutocomplete}
      onSearchChange={this.onSearchChange}
      suggestions={this._getFilteredSuggestions()}
    />
  }

  _getFilteredSuggestions () {
    const currentDescriptor = this._getCurrentDescriptor();

    console.log('>>>> current descriptor: ', currentDescriptor);
    const allSuggestions = currentDescriptor ? currentDescriptor.suggestions : List()

    const currentSearch = this.state.currentSearch

    const currentSearchIsEmpty = !currentSearch || currentSearch === '';
    const currentFilteredSuggestions = currentSearchIsEmpty
      ? allSuggestions
      : allSuggestions.filter((suggestion) => suggestion.fitsSearch(currentSearch));

    return currentFilteredSuggestions;
  }

  _getCurrentDescriptor () {
    return this.props.completionDescriptors.filter((descriptor) => descriptor.prefix === this.state.currentPrefix)[0]
  }
}
