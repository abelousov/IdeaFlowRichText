import React from 'react'
import ReactDOM from 'react-dom'

import {fromJS} from 'immutable';

import IdeaFlowRichText from '../IdeaFlowRichText'

const AppRoot = () => {
  const initialRichTextContents = "Hello user! try typing '@' and '#' to use auto-completion"

  const tags = fromJS(['idea', 'ideal', 'deal']);

  const mentions = fromJS([
    {
      nickname: 'jacob',
      fullName: 'Jacob Cole',
      avatarUrl: 'https://scontent-frt3-1.xx.fbcdn.net/v/t1.0-1/p64x64/15203382_10157793560775023_2549521399764329245_n.jpg?oh=f81fe5623267e7c5380a54d131cb4268&oe=58F7B8AF'
    },

    {
      nickname: 'anton',
      fullName: 'Anton Belousov',
      avatarUrl: 'https://scontent-frt3-1.xx.fbcdn.net/v/t1.0-1/p64x64/1236863_10202961295489376_3520782659964337326_n.jpg?oh=5d6bba02be22c70386cef65b22960daa&oe=58C6DDE4'
    }
  ]);

  const onRichTextChange = (changedRichTextContents) => {
    console.log('>>>> changed contents in rich text: ', changedRichTextContents);
  }

  return (
    <div className='root' style={{textAlign: 'center', padding: '40px'}}>
      <h2>IdeaFlowRichText demo</h2>
      <IdeaFlowRichText
        initialContents={initialRichTextContents}
        tags={tags}
        mentions={mentions}
        onChange={onRichTextChange}
      />
    </div>
  )
}

ReactDOM.render(
  <AppRoot/>,
  document.getElementById('mount')
)
