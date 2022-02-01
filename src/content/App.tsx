import { nanoid } from 'nanoid';
import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { clipboardAtom } from '~common/lib/atoms';
import { CLIPBOARD_STORAGE_KEY } from '~common/lib/constants';
import { getSelectionText } from '~common/lib/getSelectionText';
import { ClipboardData } from '~common/lib/types';

function App() {
  const [clipboardState, setClipboardState] = useRecoilState(clipboardAtom)

  useEffect(function initializeChromeStorage () {
    chrome.storage.sync.get(CLIPBOARD_STORAGE_KEY, (dataMap) => {
      const data = dataMap[CLIPBOARD_STORAGE_KEY]
      if(data && data instanceof Array) {
        setClipboardState(data)
      } else {
        chrome.storage.sync.set({
          [CLIPBOARD_STORAGE_KEY]: []
        })
      }
    })
  }, [setClipboardState])

  useEffect(function subscribeChromeStorageChange() {
    chrome.storage.onChanged.addListener((dataMap) => {
      const data = dataMap[CLIPBOARD_STORAGE_KEY]
      if(data.newValue) {
        setClipboardState(data.newValue)
      }
    })
  }, [setClipboardState])

  useEffect(function registeHandlerToCopyEvent() {
    const handler = () => {
      const selection = document.getSelection()
      if(selection) {
        const id = nanoid()
        const text = getSelectionText(selection)
        const clipboardData: ClipboardData = {
          id,
          text,
          meta: {
            url: window.location.href,
            title: document.title
          }
        }
        chrome.storage.sync.get(CLIPBOARD_STORAGE_KEY, (dataMap) => {
          const data = dataMap[CLIPBOARD_STORAGE_KEY]
          if(data instanceof Array) {
            chrome.storage.sync.set({
              [CLIPBOARD_STORAGE_KEY]: [
                clipboardData,
                ...data
              ]
            })
          }
        })
      }
    }

    document.addEventListener('copy', handler)
    return () => {
      document.removeEventListener('copy', handler)
    }
  }, [setClipboardState])

  return (
    <>
      <div />
    </>
  )
}

export default App;
