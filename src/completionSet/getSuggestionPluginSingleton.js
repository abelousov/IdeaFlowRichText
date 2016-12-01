import completionPluginCreator from 'draft-js-autocomplete-plugin-creator'

import suggestionInserter from './suggestionInserter'
import SuggestionEntryComponent from './SuggestionEntryComponent'
import findWithRegex from 'find-with-regex'

import './suggestionsEntryStyles.scss'
import './suggestionsStyles.scss'

const themeKey = 'suggestions'

// singleton is a workaround - somehow if several instances of the plugin are created,
// it stops working - looks like it uses some global stat
// TODO: post a bug to 'draft-js-autocomplete-plugin-creator' and add link here
export default ({suggestionRegex}) => {
  if(!pluginSingleton) {
    pluginSingleton = createSuggestionPlugin()
  }

  regexSingleton = suggestionRegex

  return pluginSingleton
}


let pluginSingleton
let regexSingleton

const createSuggestionPlugin = () => {
  //this looks like a strategy to check for start of autocompleted entities
  const completionSuggestionStrategy = (contentBlock, callback) => {
    findWithRegex(regexSingleton, contentBlock, callback);
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
}
