import React, {Component, PropTypes} from 'react';

export default function SuggestionComponentList (props) {
  const descriptorsByPrefixes = props.descriptorsByPrefixes;
  const prefixes = Object.keys(descriptorsByPrefixes);

  return (
    <div>
      {
        prefixes.map((currentPrefix) => {
          const {SuggestionComponent, allSuggestions} = descriptorsByPrefixes[currentPrefix]

          return <SuggestionComponentWrapper
            key={currentPrefix}
            allSuggestions={allSuggestions}
            SuggestionComponent={SuggestionComponent}
          />
        })
      }
    </div>
  )
}

class SuggestionComponentWrapper extends Component {
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
    const {SuggestionComponent, allSuggestions} = this.props

    const currentSearch = this.state.currentSearch;

    const currentSearchIsEmpty = !currentSearch || currentSearch === '';
    const currentFilteredSuggestions = currentSearchIsEmpty
      ? allSuggestions
      : allSuggestions.filter((suggestion) => suggestion.fitsSearch(currentSearch));

    return <SuggestionComponent
      onSearchChange={this.onSearchChange}
      suggestions={currentFilteredSuggestions}
    />
  }
}
