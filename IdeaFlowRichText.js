import React from 'react';
import {EditorState, ContentState} from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import {List} from 'immutable';
import findWithRegex from 'find-with-regex'

import createSuggestionPlugin from './plugin'
import suggestionFactory from './plugin/suggestionFactory'

import './styles/IdeaFlowRichText.scss';
import './styles/Draft.scss';

const TAG_PREFIX = '#';
const MENTION_PREFIX = '@';

//TODO: remove duplication in plugin definitions
const MENTION_REGEX = new RegExp(`${MENTION_PREFIX}(\\w|\\d|_|-|\\.)+`, 'g');
const TAG_REGEX = new RegExp(`${TAG_PREFIX}(\\w|\\d|_|-|\\.)+`, 'g');

const tagSuggestionPlugin = createSuggestionPlugin({suggestionPrefix: TAG_PREFIX});
const TagSuggestionsComponent = tagSuggestionPlugin.CompletionSuggestions;

const mentionSuggestionPlugin = createSuggestionPlugin({suggestionPrefix: MENTION_PREFIX});
const MentionSuggestionsComponent = mentionSuggestionPlugin.CompletionSuggestions;

const plugins = [tagSuggestionPlugin, mentionSuggestionPlugin];

export default class IdeaFlowRichText extends React.Component {
  constructor (props) {
    super(props);

    const contentState = ContentState.createFromText(this.props.initialContents);
    this.state = {
      editorState: EditorState.createWithContent(contentState),
      tagSuggestions: List(),
      mentionSuggestions: List(),
    };
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

  getPlainTextFromEditorState = (editorState) => editorState.getCurrentContent().getPlainText()

  focus = () => this.refs.editor.focus();

  render () {
    const decorators = [
      {
        strategy: (contentBlock, callback) => {
          findWithRegex(MENTION_REGEX, contentBlock, callback);
        },

        component: (props) => {
          return <span className='mention'>{props.children}</span>
        }
      },

      {
        strategy: (contentBlock, callback) => {
          findWithRegex(TAG_REGEX, contentBlock, callback);
        },

        component: (props) => {
          return <span className='tag'>{props.children}</span>
        }
      },
    ];

    const allTagSuggestions = this.props.tags.map((tagName) => suggestionFactory.createForTag({
      name: tagName,
      prefix: TAG_PREFIX
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
      prefix: MENTION_PREFIX
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
            // draft-js-plugins-editor requires decorators to be passed this way, or they will be lost -
            // https://github.com/draft-js-plugins/draft-js-plugins/blob/master/FAQ.md#how-can-i-use-custom-decorators-with-the-plugin-editor
            decorators={decorators}
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
