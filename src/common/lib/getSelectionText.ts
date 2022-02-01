export function getSelectionText (selection: Selection): string {  
  const { anchorOffset, anchorNode, focusOffset, focusNode } = selection
  const range = selection.getRangeAt(0)
  const position = anchorNode?.compareDocumentPosition(focusNode ?? new Node()) 
  const isReverse = position === 2
  
  const [startNode, endNode] = isReverse ? [focusNode, anchorNode] : [anchorNode, focusNode]
  const [startOffset, endOffset] = isReverse ? [focusOffset, anchorOffset] : [anchorOffset, focusOffset]
  
  function parseText (node: Node, completedNodes: Node[]) {
    let text = ''
    
    if(node.nodeName === '#text' && !completedNodes.includes(node)) {
      if(selection.containsNode(node)) {
        completedNodes.push(node)
        const { textContent = '' } = node         
        if(startNode === node) {
          if(endNode === node) {
            text += textContent?.substring(startOffset, endOffset)
          } else {
            text += textContent?.substring(startOffset, textContent!.length)
          }
        } else if(endNode === node) {
          text += textContent!.substring(0, endOffset)
        } else {
          text += textContent
        }
      }
    }
    if(node.childNodes.length) {
      node.childNodes.forEach((node) => {
        text += parseText(node, completedNodes)
      })
    }
    if(node.nextSibling) {
      text += parseText(node.nextSibling, completedNodes)
    }

    return text
  } 

  return parseText(range.commonAncestorContainer, [])
}
