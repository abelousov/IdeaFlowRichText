import React from 'react';

export default {
  createForTag ({name, prefix}) {
    return new TagSuggestion(name, prefix)
  },

  createForMention ({nickname, fullName, avatarUrl, prefix}) {
    return new MentionSuggestion(nickname, fullName, avatarUrl, prefix)
  }
}

class TagSuggestion {
  constructor(name, prefix) {
    this.name = name;
    this.prefix = prefix;
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
    return this.getPrefix() + this.name
  }

  getPrefix () {
    return this.prefix
  }
}

class MentionSuggestion {
  constructor(nickname, fullName, avatarUrl, prefix) {
    this.nickname = nickname;
    this.fullName = fullName;
    this.avatarUrl = avatarUrl;
    this.prefix = prefix;
  }

  fitsSearch (searchValue) {
    return this.nickname.startsWith(searchValue.toLowerCase());
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
    return this.getPrefix() + this.nickname
  }

  getPrefix () {
    return this.prefix
  }
}
