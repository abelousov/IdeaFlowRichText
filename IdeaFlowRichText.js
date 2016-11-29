import React from 'react';
import {EditorState, ContentState} from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import {List} from 'immutable';

import createSuggestionPlugin from './plugin'
import suggestionFactory from './plugin/suggestionFactory'

import './styles/IdeaFlowRichText.scss';
import './styles/Draft.scss';

const tagPrefix = '#';
const mentionPrefix = '@';

//TODO: remove duplication in plugin definitions
const tagSuggestionPlugin = createSuggestionPlugin({suggestionPrefix: tagPrefix});
const TagSuggestionsComponent = tagSuggestionPlugin.CompletionSuggestions;

const mentionSuggestionPlugin = createSuggestionPlugin({suggestionPrefix: mentionPrefix});
const MentionSuggestionsComponent = mentionSuggestionPlugin.CompletionSuggestions;

const plugins = [tagSuggestionPlugin, mentionSuggestionPlugin];

export default class IdeaFlowRichText extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      editorState: EditorState.createWithContent(ContentState.createFromText(this.props.initialContents)),
      tagSuggestions: List(),
      mentionSuggestions: List(),
    };
  }

  onEditorChange = (newEditorState) => {
    const currentContents = this.getPlainTextFromEditorState(this.state.editorState)
    const newContents = this.getPlainTextFromEditorState(newEditorState)

    let needNorifyParent = currentContents != newContents;

    //parent cares only about text changes
    if (needNorifyParent) {
      this.props.onChange(newContents);
    }

    //we maintain state on our own, as it's more than just plain text contents
    this.setState({editorState: newEditorState})
  }

  getPlainTextFromEditorState = (editorState) => editorState.getCurrentContent().getPlainText()

  focus = () => this.refs.editor.focus();

  render () {
    const allTagSuggestions = this.props.tags.map((tagName) => suggestionFactory.createForTag({
      name: tagName,
      prefix: tagPrefix
    }))

    const onTagSearchChange = ({value}) => {
      this.setState({
        tagSuggestions: allTagSuggestions.filter((tagSuggestion) => tagSuggestion.fitsSearch(value)),
      });
    }

    const allMentionSuggestions = this.props.mentions.map((mention) => suggestionFactory.createForMention({
      nickname: mention.get('nickname'),
      fullName: mention.get('fullName'),
      avatarUrl: mention.get('avatarUrl'),
      prefix: mentionPrefix
    }))

    const onMentionSearchChange = ({value}) => {
      this.setState({
        mentionSuggestions: allMentionSuggestions.filter((mentionSuggestion) => mentionSuggestion.fitsSearch(value)),
      });
    }

    return (
      <div>
        <div className='editor' onClick={this.focus}>
          <Editor
            editorState={this.state.editorState}
            onChange={this.onEditorChange}
            plugins={plugins}
            spellCheck
            stripPastedStyles
            ref='editor'
          />
        </div>
        <TagSuggestionsComponent
          onSearchChange={onTagSearchChange}
          suggestions={this.state.tagSuggestions}
        />
        <MentionSuggestionsComponent
          onSearchChange={onMentionSearchChange}
          suggestions={this.state.mentionSuggestions}
        />
      </div>
    );
  }
}
