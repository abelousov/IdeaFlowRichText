import { Modifier, EditorState } from 'draft-js';

import getSearchText from './utils/getSearchText';

export default (editorState, suggestion) => {
  const currentSelectionState = editorState.getSelection();
  const { begin, end } = getSearchText(editorState, currentSelectionState);

  // get selection of the suggestion search text
  const suggestionTextSelection = currentSelectionState.merge({
    anchorOffset: begin,
    focusOffset: end,
  });

  let suggestionReplacedContent = Modifier.replaceText(
    editorState.getCurrentContent(),
    suggestionTextSelection,
    suggestion.getTextForEditor()
  );

  // If the suggestion is inserted at the end, a space is appended right after for
  // a smooth writing experience.
  const blockKey = suggestionTextSelection.getAnchorKey();
  const blockSize = editorState.getCurrentContent().getBlockForKey(blockKey).getLength();
  if (blockSize === end) {
    suggestionReplacedContent = Modifier.insertText(
      suggestionReplacedContent,
      suggestionReplacedContent.getSelectionAfter(),
      ' ',
    );
  }

  const newEditorState = EditorState.push(
    editorState,
    suggestionReplacedContent,
    'insert-suggestion',
  );
  return EditorState.forceSelection(newEditorState, suggestionReplacedContent.getSelectionAfter());
};
