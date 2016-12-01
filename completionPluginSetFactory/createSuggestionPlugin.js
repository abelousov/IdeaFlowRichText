import completionPluginCreator from 'draft-js-autocomplete-plugin-creator'

import suggestionInserter from './suggestionInserter'
import SuggestionEntryComponent from './SuggestionEntryComponent'
import findWithRegex from 'find-with-regex'

import './suggestionsEntryStyles.scss'
import './suggestionsStyles.scss'

const themeKey = 'suggestions'

const createSuggestionPlugin = ({suggestionRegex}) => {


  //this looks like a strategy to check for start of autocompleted entities
  const completionSuggestionStrategy = (contentBlock, callback) => {
    findWithRegex(suggestionRegex, contentBlock, callback);
  };

  const completionPluginFactory = completionPluginCreator(
    completionSuggestionStrategy,
    suggestionInserter,
    SuggestionEntryComponent,
    themeKey
  )

  return completionPluginFactory({
    theme: {
      [themeKey]: themeKey
    }
  })
};

export default createSuggestionPlugin
