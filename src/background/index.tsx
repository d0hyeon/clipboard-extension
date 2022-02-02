export type MessageData<P = any> = {
  type: string;
  payload: P
}

class BackgroundApplication {
  public currentActiveTabId: number | null = null

  constructor () {
    this.initialize()
  }

  public sendMessage(tabId: number) {
    if(this.currentActiveTabId) {
      chrome.tabs.sendMessage(this.currentActiveTabId, { type: 'tabState', payload: false } as MessageData<boolean>) 
    }
    chrome.tabs.sendMessage(tabId, { type: 'tabState', payload: true } as MessageData<boolean>)
    this.currentActiveTabId = tabId
  }

  public initialize () {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      const [currentTab] = tabs
      console.log('tabs', tabs)
      if(currentTab.id) {
        this.sendMessage(currentTab.id)
      }
    })
    this.registeEventListeners()
  }

  public registeEventListeners() {
    chrome.tabs.onActivated.addListener((activeInfo) => {
      this.sendMessage(activeInfo.tabId)
    })
  }
}



chrome.runtime.onInstalled.addListener(() => {
  const backgroundApp =  new BackgroundApplication()
  // @ts-ignore
  globalThis.backgroundApp = backgroundApp
});