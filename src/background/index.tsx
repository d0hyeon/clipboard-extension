class BackgroundApplication {
  public currentActiveTabId: number | null = null

  constructor () {
    this.initialize()
  }

  public sendMessageOfTabState(tabId: number) {
    if(this.currentActiveTabId) {
      chrome.tabs.sendMessage(this.currentActiveTabId, { active: false }) 
    }
    chrome.tabs.sendMessage(tabId, { active: true })
    this.currentActiveTabId = tabId
  }

  public initialize () {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      const [currentTab] = tabs
      console.log('tabs', tabs)
      if(currentTab.id) {
        this.sendMessageOfTabState(currentTab.id)
      }
    })
    this.registeEventListeners()
  }

  public registeEventListeners() {
    chrome.tabs.onActivated.addListener((activeInfo) => {
      this.sendMessageOfTabState(activeInfo.tabId)
    })
  }
}



chrome.runtime.onInstalled.addListener(() => {
  const backgroundApp =  new BackgroundApplication()
  // @ts-ignore
  globalThis.backgroundApp = backgroundApp
});