import React from 'react';

export default {
  createForTag ({name}) {
    return new TagSuggestion(name)
  },

  createForMention ({fullName, avatarUrl}) {
    return new MentionSuggestion(fullName, avatarUrl)
  }
}

class TagSuggestion {
  constructor(name) {
    this.name = name;
  }

  fitsSearch (searchValue) {
    return this.name.startsWith(searchValue.toLowerCase());
  }

  renderOptionView () {
    return (
      <span>{this.name}</span>
    )
  }

  getTextForEditor () {
    return this.name
  }
}

class MentionSuggestion {
  constructor(fullName, avatarUrl) {
    this.fullName = fullName;
    this.avatarUrl = avatarUrl;
  }

  fitsSearch (searchValue) {
    return this.fullName.toLowerCase().startsWith(searchValue.toLowerCase());
  }

  renderOptionView () {
    return (
      <span>
        <img src={this.avatarUrl}/>
        {this.getTextForEditor()}
      </span>
    )
  }

  getTextForEditor () {
    return this.fullName
  }
}
