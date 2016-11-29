# Rich text editor for IdeaFlow

The editor allows to use @mentions and #tags and is a modified version of https://github.com/mjrussell/draft-js-autocomplete-plugin-creator/tree/master/examples/issue

To view demo (the code is in `demo/app.js`):

1. `npm install`
2. `npm start` 
3. Browse to http://localhost:8080

## TODO:

### Features
* insert non-editable styled html instead of editable plain text
* add styling
* ? hashtag - autocomplete with space

### Code
* add PropTypes to components
* remove duplication in plugin creation
* declare peer dependencies
* fix React's warning about unknown props on div in https://github.com/mjrussell/draft-js-autocomplete-plugin-creator/blob/master/src/CompletionSuggestions/index.js

### Tests
* add tests
