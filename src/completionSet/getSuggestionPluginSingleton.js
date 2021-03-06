// use local coppoy of autocomplete-creator until we turn it into a fork
// import completionPluginCreator from 'draft-js-autocomplete-plugin-creator'
import completionPluginCreator from '../autocomplete-creator'

import createSuggestionInserter from './suggestionInserter'
import SuggestionEntryComponent from './SuggestionEntryComponent'
import findWithRegex from 'find-with-regex'

import './suggestionsEntryStyles.scss'
import './suggestionsStyles.scss'

const themeKey = 'suggestions'

// singleton is a workaround - somehow if several instances of the plugin are created,
// it stops working - looks like it uses some global stat
// TODO: post a bug to 'draft-js-autocomplete-plugin-creator' and add link here
export default ({suggestionRegex, findCurrentAutocomplete}) => {
  if(!pluginSingleton) {
    pluginSingleton = createSuggestionPlugin()
  }

  currentRegex = suggestionRegex
  currentAutocompleteFinder = findCurrentAutocomplete

  return pluginSingleton
}

let pluginSingleton
let currentRegex
let currentAutocompleteFinder

const createSuggestionPlugin = () => {
  //this looks like a strategy to check for start of autocompleted entities
  const completionSuggestionStrategy = (contentBlock, callback) => {
    findWithRegex(currentRegex, contentBlock, callback);
  };

  const findCurrentAutocomplete = (editorState) => currentAutocompleteFinder(editorState)

  const completionPluginFactory = completionPluginCreator(
    completionSuggestionStrategy,
    createSuggestionInserter(findCurrentAutocomplete),
    SuggestionEntryComponent,
    themeKey
  )

  return completionPluginFactory({
    theme: {
      [themeKey]: themeKey
    }
  })
}
