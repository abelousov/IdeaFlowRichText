import {Modifier, EditorState, Entity} from 'draft-js';
import constants from '../constants'
import getSearchText from './utils/getSearchText';

export default (editorState, suggestion) => {
  const currentSelectionState = editorState.getSelection();
  const { begin, end } = getSearchText(editorState, currentSelectionState);

  // get selection of the suggestion search text
  const suggestionTextSelection = currentSelectionState.merge({
    anchorOffset: begin,
    focusOffset: end,
  });

  const newContent = suggestion.getTextForEditor();

  const suggestionReplacedContent = Modifier.replaceText(
    editorState.getCurrentContent(),
    suggestionTextSelection,
    newContent
  );

  // If the suggestion is inserted at the end, a space is appended right after for
  // a smooth writing experience.
  const blockKey = suggestionTextSelection.getAnchorKey()
  const blockSize = editorState.getCurrentContent().getBlockForKey(blockKey).getLength()
  const needAddSpace = blockSize === end;

  let newTextSelection = suggestionTextSelection.merge({focusOffset: begin + newContent.length})

  const key = Entity.create(constants.ENTITY_TYPE, 'IMMUTABLE', {
    completionType: suggestion.getType()
  })

  console.log('>>>> created entity: ', suggestion, suggestion.getType());

  let entityAddedContent = Modifier.applyEntity(
    suggestionReplacedContent,
    newTextSelection,
    key
  )

  let updatedEditorState = EditorState.push(
    editorState,
    entityAddedContent,
    'insert-suggestion',
  )

  const emptySelectionAfterUpdatedText = entityAddedContent.getSelectionAfter().merge({
    anchorOffset: entityAddedContent.getSelectionAfter().getFocusOffset()
  })

  updatedEditorState = EditorState.forceSelection(updatedEditorState, emptySelectionAfterUpdatedText);

  if (needAddSpace) {
    let updatedContent = updatedEditorState.getCurrentContent();

    let contentWithTrailingSpace = Modifier.insertText(
      updatedContent,
      emptySelectionAfterUpdatedText,
      ' '
    );

    updatedEditorState = EditorState.push(
      updatedEditorState,
      contentWithTrailingSpace,
      'insert-suggestion',
    )
  }

  return updatedEditorState;

};
