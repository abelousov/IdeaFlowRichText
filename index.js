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

export default class IdeaFlowRichText extends React.Component {
  constructor (props) {
    super(props);

    const contentState = ContentState.createFromText(this.props.initialContents);
    const editorState = EditorState.createWithContent(contentState);

    this.state = {
      editorState
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
    const completionSet = completionSet.create(this._getCompletionDescriptors(), this.state.editorState);

    const focusEditor = () => this.refs.editor.focus();

    return (
      <div>
        <div className='editor' onClick={focusEditor}>
          <Editor
            editorState={this.state.editorState}
            onChange={this.onEditorChange}
            plugins={completionSet.plugins}
            decorators={completionSet.decorators}
            spellCheck
            stripPastedStyles
            ref='editor'
          />
        </div>
        {completionSet.renderedSuggestionComponent}
      </div>
    );
  }
}
