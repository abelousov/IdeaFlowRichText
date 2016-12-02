export default function createFinder (possiblePrefixes) {
  return function (editorState) {
    return findCurrentAutocomplete(editorState, possiblePrefixes)
  }
}

function findCurrentAutocomplete (editorState, possiblePrefixes) {
  const {textBeforeSelectionStart, textAfterSelectionStart} = _getCurrentTextSplitBySelectionStart(editorState)

  const {autocompleteStart, prefix, valuePartBeforeSelectionStart} = _extractCurrentPrefix(textBeforeSelectionStart, possiblePrefixes)

  if (!prefix) {
    return null
  }

  const valuePartAfterSelectionStart = _extractValuePartAfterSelectionStart(textBeforeSelectionStart, textAfterSelectionStart)

  const value = valuePartBeforeSelectionStart + valuePartAfterSelectionStart

  const wholeAutocomplete = prefix + value

  return {
    prefix,
    searchValueWithoutPrefix: value,
    selection: _getSelectionForString({editorState, startIndex: autocompleteStart, str: wholeAutocomplete})
  }
}

function _getCurrentTextSplitBySelectionStart (editorState) {
  const currentSelection = editorState.getSelection();

  const currentContentState = editorState.getCurrentContent()
  const currentBlock = currentContentState.getBlockForKey(currentSelection.getStartKey())

  const wholeText = currentBlock.getText()

  const selectionStart = currentSelection.getStartOffset();

  return {
    textBeforeSelectionStart: wholeText.substring(0, selectionStart),
    textAfterSelectionStart: wholeText.substring(selectionStart)
  }
}

function _extractCurrentPrefix (textBeforeSelectionStart, possiblePrefixes) {
  let lastPrefixBeforeSelection = null
  let lastPrefixStart = null

  possiblePrefixes.map((currentPrefix) => {
    const currentPrefixStart = textBeforeSelectionStart.lastIndexOf(currentPrefix)

    if (currentPrefixStart >= 0) {
      if (lastPrefixStart === null || lastPrefixStart < currentPrefixStart) {
        lastPrefixStart = currentPrefixStart
        lastPrefixBeforeSelection = currentPrefix
      }
    }
  })

  const [prefix, autocompleteStart] = [lastPrefixBeforeSelection, lastPrefixStart]

  if (!prefix) {
    return {}
  }

  const valuePartBeforeSelectionStart = textBeforeSelectionStart.substring(autocompleteStart + prefix.length)

  return {
    prefix,
    valuePartBeforeSelectionStart,
    autocompleteStart
  }
}

function _extractValuePartAfterSelectionStart (textBeforeSelectionStart, textAfterSelectionStart) {
  const wordPartAfterSelectionStart = textAfterSelectionStart.match(/^\w*/)[0]
  const wordPartBeforeSelectionStart = textBeforeSelectionStart.match(/\w*$/)[0]

  const selectionStartIsInsideWord = wordPartBeforeSelectionStart.length > 0 && wordPartAfterSelectionStart.length > 0

  return selectionStartIsInsideWord ? wordPartAfterSelectionStart : ''
}

function _getSelectionForString ({editorState, startIndex, str}) {
  return editorState.getSelection().merge({
    anchorOffset: startIndex,
    focusOffset: startIndex + str.length
  })

}
