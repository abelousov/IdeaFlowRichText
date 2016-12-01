import React from 'react';
import {EditorState, ContentState, SelectionState} from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import constants from './constants'

import completionSet from './completionSet'

import suggestionFactory from './suggestionFactory'

import './styles/IdeaFlowRichText.scss';
import './styles/Draft.scss';

const TAG_PREFIX = '#';
const MENTION_PREFIX = '@';

import createIssueSuggestionPlugin, {defaultSuggestionsFilter} from './issue/plugin';
const issueSuggestionPlugin = createIssueSuggestionPlugin();
const {CompletionSuggestions} = issueSuggestionPlugin;
const issuePlugins = [issueSuggestionPlugin];
import {List, fromJS} from 'immutable';


export default class IdeaFlowRichText extends React.Component {
  constructor (props) {
    super(props);

    const contentState = ContentState.createFromText(this.props.initialContents);
    const editorState = EditorState.createWithContent(contentState);

    // this.state = {
    //   editorState
    // };

    this.state = {
      editorState,
      suggestions: List()
    };
  }

  _getCompletionDescriptors () {
    return [
      {
        prefix: TAG_PREFIX,
        suggestions: this.props.tags.map((tagName) => suggestionFactory.createForTag({
          name: tagName
        })),
        type: constants.TAG
      },
      {
        prefix: MENTION_PREFIX,
        suggestions: this.props.mentions.map((mentionData) => suggestionFactory.createForMention({
          fullName: mentionData.get('fullName'),
          avatarUrl: mentionData.get('avatarUrl')
        })),
        type: constants.MENTION
      }
    ]
  }

  onIssueSearchChange = ({value}) => {
    const suggestions = fromJS([
      {
        id: 1,
        subject: 'New Cool Feature',
      },
      {
        id: 2,
        subject: 'Bug',
      },
      {
        id: 3,
        subject: 'Improve Documentation',
      },
    ]);

    this.setState({
      suggestions: defaultSuggestionsFilter(value, suggestions),
    });
  };


  onEditorChange = (newEditorState) => {
    const currentContents = this._getPlainTextFromEditorState(this.state.editorState)
    const newContents = this._getPlainTextFromEditorState(newEditorState)

    let needNotifyParent = currentContents != newContents;

    //parent cares only about text changes
    if (needNotifyParent) {
      this.props.onChange(newContents);
    }

    //we maintain state on our own, as it's more than just plain text contents
    this.setState({editorState: newEditorState})
  }

  _getPlainTextFromEditorState = (editorState) => {
    //TODO: clean completion entities
    return editorState.getCurrentContent().getPlainText()
  }

  render () {
    const currentCompletionSet = completionSet.create(this._getCompletionDescriptors(), this.state.editorState);

    const focusEditor = () => this.refs.editor.focus();

    return (
      // <div>
      //   <div className='editor' onClick={focusEditor}>
      //     <Editor
      //       editorState={this.state.editorState}
      //       onChange={this.onEditorChange}
      //       plugins={currentCompletionSet.plugins}
      //       decorators={currentCompletionSet.decorators}
      //       spellCheck
      //       stripPastedStyles
      //       ref='editor'
      //     />
      //   </div>
      //   {currentCompletionSet.renderedSuggestionComponent}
      // </div>
      <div>
        <div className='editor' onClick={focusEditor}>
          <Editor
            editorState={this.state.editorState}
            onChange={this.onEditorChange}
            plugins={issuePlugins}
            decorators={currentCompletionSet.decorators}
            spellCheck
            stripPastedStyles
            placeholder='Enter some text, with a # to see the issue autocompletion'
            ref='editor'
          />
        </div>
        <CompletionSuggestions
          onSearchChange={this.onIssueSearchChange}
          suggestions={this.state.suggestions}
        />
      </div>
    );
  }
}
