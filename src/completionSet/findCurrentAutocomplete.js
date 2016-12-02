export default function createFinder (possiblePrefixes) {
  return function (editorState) {
    return findCurrentAutocomplete (editorState, possiblePrefixes)
  }
}

function findCurrentAutocomplete (editorState, possiblePrefixes) {

  const currentSelection = editorState.getSelection();

  const currentContentState = editorState.getCurrentContent()
  const currentBlock = currentContentState.getBlockForKey(currentSelection.getStartKey())

  const blockText = currentBlock.getText()

  const selectionStart = currentSelection.getStartOffset();
  const textEndingWithSelection = blockText.substring(0, selectionStart)

  let lastPrefixBeforeCurrentSelection = null
  let lastPrefixIndex = null

  possiblePrefixes.map((currentPrefix) => {
    let currentPrefixIndex = textEndingWithSelection.lastIndexOf(currentPrefix)

    if (currentPrefixIndex >= 0) {
      if (lastPrefixIndex === null || lastPrefixIndex < currentPrefixIndex) {
        lastPrefixIndex = currentPrefixIndex
        lastPrefixBeforeCurrentSelection = currentPrefix
      }
    }
  })

  let textAfterLastPrefix = lastPrefixBeforeCurrentSelection
    ? textEndingWithSelection.substring(lastPrefixIndex + lastPrefixBeforeCurrentSelection.length)
    : null


  return lastPrefixBeforeCurrentSelection
    ? {
      prefix: lastPrefixBeforeCurrentSelection,
      searchValueWithoutPrefix: textAfterLastPrefix,
      selection: currentSelection.merge({
        anchorOffset: lastPrefixIndex,
        focusOffset: selectionStart
      })
    }
    : null
}
