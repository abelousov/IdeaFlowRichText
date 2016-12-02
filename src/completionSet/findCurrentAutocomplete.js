export default function createFinder (possiblePrefixes) {
  return function (editorState) {
    return findCurrentAutocomplete(editorState, possiblePrefixes)
  }
}

function findCurrentAutocomplete (editorState, possiblePrefixes) {

  const currentSelection = editorState.getSelection();

  const currentContentState = editorState.getCurrentContent()
  const currentBlock = currentContentState.getBlockForKey(currentSelection.getStartKey())

  const wholeText = currentBlock.getText()

  const selectionStartIndex = currentSelection.getStartOffset();
  const textBeforeSelectionStart = wholeText.substring(0, selectionStartIndex)

  let lastPrefixBeforeCurrentSelection = null
  let lastPrefixStartIndex = null

  possiblePrefixes.map((currentPrefix) => {
    const currentPrefixIndex = textBeforeSelectionStart.lastIndexOf(currentPrefix)

    if (currentPrefixIndex >= 0) {
      if (lastPrefixStartIndex === null || lastPrefixStartIndex < currentPrefixIndex) {
        lastPrefixStartIndex = currentPrefixIndex
        lastPrefixBeforeCurrentSelection = currentPrefix
      }
    }
  })

  if (!lastPrefixBeforeCurrentSelection) {
    return null
  }

  const lastPrefixEndIndex = lastPrefixStartIndex + lastPrefixBeforeCurrentSelection.length;
  const textBetweenLastPrefixAndSelectionStart = textBeforeSelectionStart.substring(lastPrefixEndIndex)

  const textAfterSelectionStart = wholeText.substring(selectionStartIndex)
  const wordPartAfterSelectionStart = textAfterSelectionStart.match(/^\w*/)[0]
  const wordPartBeforeSelectionStart = textBeforeSelectionStart.match(/\w*$/)[0]

  const selectionStartIsInsideWord = wordPartBeforeSelectionStart.length > 0 && wordPartAfterSelectionStart.length > 0

  const autocompleteStartIndex = lastPrefixEndIndex
  let autocompleteEndIndex = selectionStartIndex

  if (selectionStartIsInsideWord) {
    autocompleteEndIndex += wordPartAfterSelectionStart.length
  }

  const autocompleteValue = wholeText.substring(autocompleteStartIndex, autocompleteEndIndex)

  return {
    prefix: lastPrefixBeforeCurrentSelection,
    searchValueWithoutPrefix: autocompleteValue,
    selection: currentSelection.merge({
      anchorOffset: autocompleteStartIndex,
      focusOffset: autocompleteEndIndex
    })
  }
}
