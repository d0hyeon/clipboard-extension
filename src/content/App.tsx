import { nanoid } from 'nanoid';
import React, { useCallback, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import ClipboardList from '~common/components/ClipboardList';
import { clipboardAtom } from '~common/lib/atoms';
import { CLIPBOARD_STORAGE_KEY } from '~common/lib/constants';
import { ClipboardData } from '~common/lib/types';

function App() {
  const [clipboardState, setClipboardState] = useRecoilState(clipboardAtom)

  const pushClipboard = useCallback((text: string) => {
    const id = nanoid()
    const clipboardData: ClipboardData = {
      id,
      text,
      meta: {
        url: window.location.href,
        title: document.title
      }
    }

    chrome.storage.sync.set({
      [CLIPBOARD_STORAGE_KEY]: [
        clipboardData,
        ...clipboardState.filter((item: ClipboardData) => item.text !== text)
      ]
    })
  }, [clipboardState])

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
    function handler(dataMap: {[key: string]: chrome.storage.StorageChange}) {
      const data = dataMap[CLIPBOARD_STORAGE_KEY]
      if(data.newValue) {
        setClipboardState(data.newValue)
      }
    }

    chrome.storage.onChanged.addListener(handler)
    return () => chrome.storage.onChanged.removeListener(handler)
  }, [setClipboardState])

  useEffect(function registeHandlerOfCopyEvent() {
    const handler = (event: ClipboardEvent) => {
      try {
        if((event.target as HTMLInputElement).nodeName === 'INPUT' || (event.target as HTMLTextAreaElement).nodeName === 'TEXTAREA') {
          return pushClipboard((event.target as HTMLTextAreaElement).value)
        }
        const selection = document.getSelection()
        if(selection) {
          return pushClipboard(selection.toString())
        }
      } catch(e) {
        console.log(e)
      }
    }

    document.addEventListener('copy', handler)
    return () => {
      document.removeEventListener('copy', handler)
    }
  }, [pushClipboard, setClipboardState])

  return (
    <ClipboardList />
  )
}

export default App;
