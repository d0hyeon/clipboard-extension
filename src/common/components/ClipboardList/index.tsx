import styled from '@emotion/styled'
import React, { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react'
import { useRecoilValue } from 'recoil'
import useClickOuter from '~common/hooks/useClickOuter'
import { clipboardAtom, tabAtom } from '~common/lib/atoms'
import { CLIPBOARD_STORAGE_KEY } from '~common/lib/constants'
import { ClipboardData } from '~common/lib/types'
import ClipboardItem from './Item'

const WRAPPER_WIDTH = 250

const ClipboardList = () => {
  const tabState = useRecoilValue(tabAtom)
  const clipboardList = useRecoilValue(clipboardAtom)
  const [isActive, setIsActive] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0, bottom: 0, right: 0 })
  const focusElRef: MutableRefObject<Element | null> = useRef(null)
  const ref = useRef(null)
  const isClicked = useClickOuter(ref)

  const onClickItem = useCallback((text: string) => {
    if(focusElRef.current && 'value' in focusElRef.current) {
      const { current: input } = focusElRef as MutableRefObject<HTMLInputElement>
      const { selectionStart, selectionEnd, value } = input;
      const prefixText = value.substring(0, selectionStart ?? 0);
      const postfixText = value.substring(selectionEnd ?? 0, value.length);

      input.value = prefixText + text + postfixText
    }
    setIsActive(false)
  }, [focusElRef, setIsActive])

  const onDeleteItem = useCallback((id: string) => {
    chrome.storage.sync.set({
      [CLIPBOARD_STORAGE_KEY]: clipboardList.filter((item: ClipboardData) => item.id !== id)
    })
  }, [clipboardList])

  const openPopup = useCallback(() => {
    const activeElement = document.activeElement
    focusElRef.current = activeElement
    if(activeElement) {
      const { top, left, width, height } = activeElement.getBoundingClientRect()
      const { scrollY, scrollX, innerHeight, innerWidth } = window
      const absoluteTop = top + scrollY
      const absoluteLeft = left + scrollX

      const position = {
        top: absoluteTop,
        left: absoluteLeft,
        bottom: 0,
        right: 0,
      }

      if(absoluteTop > scrollY + (innerHeight / 2)) {
        position.top = 0
        position.bottom = absoluteTop + height
      }
      if(absoluteLeft > scrollX + (innerWidth / 2)) {
        position.left -= 250
      } else {
        position.left += width + 10
      }
      setPosition(position)
      setIsActive(true)
    }
  }, [focusElRef, setIsActive, setPosition])

  useEffect(() => {
    function handleKeydown (event: KeyboardEvent) {
      const { code, metaKey } = event
      if(code === 'Escape') {
        setIsActive(false)
      }
      if(metaKey && code === 'KeyB') {
        openPopup()
      }
    }
    
    document.addEventListener('keydown', handleKeydown)
    return () => {
      document.removeEventListener('keydown', handleKeydown)
    }
  }, [setIsActive, openPopup])

  useEffect(function closePop () {
    if(isClicked) {
      setIsActive(false)
    }
  }, [isClicked, setIsActive])
  
  useEffect(function closePopWhenEmpty () {
    if(isActive && clipboardList.length === 0) {
      setIsActive(false)
    }
  }, [clipboardList, isActive, setIsActive])

  useEffect(function restoreFocusing() {
    if(!isActive) {
      if(focusElRef.current) {
        (focusElRef.current as HTMLElement)?.focus()
        focusElRef.current = null
      }
    }
  }, [isActive, focusElRef])


  return (
    <>
      {isActive && (
        <StyledList ref={ref} className="clipboard-list" {...position}>
          {clipboardList.map(({ id, text, meta, }) => (
            <ClipboardItem key={id} id={id} text={text} meta={meta} onClick={onClickItem} onDelete={onDeleteItem} />
          ))}
        </StyledList>
      )}
    </>
  )
}

const StyledList = styled.ul<{ top: any, bottom: any, left: any, right: any }>`
  position: absolute;
  width: ${WRAPPER_WIDTH}px;
  margin: 0;
  padding: 0;
  max-height: 500px;
  background-color: #fff;
  border: 1px solid #333;
  z-index: 1000000;
  overflow-y: auto;
  ${({ top, bottom, left, right }) => `
    ${!!top && `top: ${top}px;`};
    ${!!bottom && `bottom: ${bottom}px;`};
    ${!!left && `left: ${left}px;`};
    ${!!right && `right: ${right}px;`};
  `}
`

export default ClipboardList