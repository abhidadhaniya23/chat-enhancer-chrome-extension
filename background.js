console.log('Chat enhancer loaded')

// Listen for changes in the URL or other conditions that trigger an update
// and send a message to the content script to update the right sidebar
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete') {
    console.log(changeInfo)
    chrome.tabs.sendMessage(tabId, { action: 'updateRightSidebar' })
  }
})
