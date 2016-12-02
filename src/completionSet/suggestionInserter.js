import {Modifier, EditorState, Entity} from 'draft-js';
import constants from '../constants'

const createInserter = (findCurrentAutocomplete) =>
  (editorState, suggestion) => insertSuggestion(editorState, suggestion, findCurrentAutocomplete)

export default createInserter

function insertSuggestion (editorState, suggestion, findCurrentAutocomplete) {

  const currentAutocomplete = findCurrentAutocomplete(editorState)

  // get selection of the suggestion search text
  const suggestionTextSelection = currentAutocomplete.selection

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
  const needAddSpace = blockSize === suggestionTextSelection.getFocusOffset();

  let newTextSelection = suggestionTextSelection.merge({focusOffset: suggestionTextSelection.getAnchorOffset() + newContent.length})

  const key = Entity.create(constants.ENTITY_TYPE, 'IMMUTABLE', {
    completionType: suggestion.getType()
  })

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

}
