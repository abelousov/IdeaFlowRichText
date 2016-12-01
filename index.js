import React from 'react';
import {EditorState, ContentState, SelectionState} from 'draft-js';
import Editor from 'draft-js-plugins-editor';

import completionPluginSetFactory from './completionPluginSetFactory'

import suggestionFactory from './plugin/suggestionFactory'

import './styles/IdeaFlowRichText.scss';
import './styles/Draft.scss';

const TAG_PREFIX = '#';
const MENTION_PREFIX = '@';

export default class IdeaFlowRichText extends React.Component {
  constructor (props) {
    super(props);

    this._completionPluginSet = completionPluginSetFactory.create(this._getCompletionDescriptors());

    const contentState = ContentState.createFromText(this.props.initialContents);

    this.state = {
      editorState: EditorState.createWithContent(contentState),
    };
  }

  _getCompletionDescriptors () {
    return [
      {
        prefix: TAG_PREFIX,
        suggestions: this.props.tags.map((tagName) => suggestionFactory.createForTag({
          name: tagName
        }))
      },
      {
        prefix: MENTION_PREFIX,
        suggestions: this.props.mentions.map((mentionData) => suggestionFactory.createForMention({
          nickname: mentionData.get('nickname'),
          fullName: mentionData.get('fullName'),
          avatarUrl: mentionData.get('avatarUrl')
        }))
      }
    ]
  }

  onEditorChange = (newEditorState) => {
    const currentContents = this.getPlainTextFromEditorState(this.state.editorState)
    const newContents = this.getPlainTextFromEditorState(newEditorState)

    let needNotifyParent = currentContents != newContents;

    //parent cares only about text changes
    if (needNotifyParent) {
      this.props.onChange(newContents);
    }

    //we maintain state on our own, as it's more than just plain text contents
    this.setState({editorState: newEditorState})
  }

  getPlainTextFromEditorState = (editorState) => {
    //TODO: clean completion entities
    return editorState.getCurrentContent().getPlainText()
  }

  render () {
    const focusEditor = () => this.refs.editor.focus();

    return (
      <div>
        <div className='editor' onClick={focusEditor}>
          <Editor
            editorState={this.state.editorState}
            onChange={this.onEditorChange}
            plugins={this._completionPluginSet.getEditorPluginInsances()}
            spellCheck
            stripPastedStyles
            ref='editor'
          />
        </div>
        {this._completionPluginSet.renderSuggestionComponents()}
      </div>
    );
  }
}
