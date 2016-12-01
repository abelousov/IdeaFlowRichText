import completionPluginCreator from 'draft-js-autocomplete-plugin-creator'

import suggestionInserter from './suggestionInserter'
import SuggestionEntryComponent from './SuggestionEntryComponent'
import findWithRegex from 'find-with-regex'

import './suggestionsEntryStyles.scss'
import './suggestionsStyles.scss'

const themeKey = 'suggestions'

const createIssueSuggestionPlugin = ({suggestionPrefix}) => {

  const SUGGESTION_PREFIX_REGEX = new RegExp(`(\\s|^)${suggestionPrefix}[^\\s]*`, 'g')

  //this looks like a strategy to check for start of autocompleted entities
  const completionSuggestionStrategy = (contentBlock, callback) => {
    findWithRegex(SUGGESTION_PREFIX_REGEX, contentBlock, callback);
  };

  const completionPluginFactory = completionPluginCreator(
    completionSuggestionStrategy,
    suggestionInserter,
    SuggestionEntryComponent,
    themeKey
  )

  const pluginInstance = completionPluginFactory({
    theme: {
      [themeKey]: themeKey
    }
  })

  return {
    pluginInstance
  }
};

export default createIssueSuggestionPlugin
