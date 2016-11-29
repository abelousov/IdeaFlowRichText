import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';

import './suggestionsEntryStyles.scss';

export default class SuggestionEntryComponent extends Component {

  constructor(props) {
    super(props);
    this.mouseDown = false;
  }

  componentDidUpdate() {
    this.mouseDown = false;
  }

  onMouseUp = () => {
    if (this.mouseDown) {
      this.mouseDown = false;
      this.props.onCompletionSelect(this.props.completion);
    }
  };

  onMouseDown = (event) => {
    // Note: important to avoid a content edit change
    event.preventDefault();

    this.mouseDown = true;
  };

  onMouseEnter = () => {
    this.props.onCompletionFocus(this.props.index);
  };

  render() {
    const className = this.props.isFocused ? 'suggestionsEntryFocused' : 'suggestionsEntry';

    const suggestionView = this.props.completion.renderOptionView();

    return (
      <div
        className={className}
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}
        onMouseEnter={this.onMouseEnter}
        role='option'
      >
        <span className='suggestionsEntryText'>
          {suggestionView}
        </span>
      </div>
    );
  }
}
