console.log('Chat enhancer loaded')

// Listen for changes in the URL or other conditions that trigger an update
// and send a message to the content script to update the right sidebar
// chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
//   if (changeInfo.status === 'complete') {
//     chrome.tabs.sendMessage(tabId, { action: 'updateRightSidebar' })
//   }
// })

chrome.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
  // console.log('Received message from ' + sender + ': ', request)
  sendResponse({ received: true }) //respond however you like
})

chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['content.js'],
  })
})

// https://developer.chrome.com/docs/extensions/reference/api/webNavigation
chrome.webNavigation.onHistoryStateUpdated.addListener(function (details) {
  // console.log('outer details', details)
  // Create a listener for web requests
  const listener = (details) => {
    // console.log('listener details', details)
    if (details.statusCode === 200)
      // Send a message to the content script indicating the URL change
      // Wait till dom will be updated
      setTimeout(() => {
        chrome.tabs.sendMessage(details.tabId, { action: 'updateRightSidebar' })
      }, 1000)
    else chrome.tabs.sendMessage(details.tabId, { action: 'failedToLoad' })
  }

  // Add the listener for completed web requests
  // https://developer.chrome.com/docs/extensions/reference/api/webRequest
  chrome.webRequest.onCompleted.addListener(listener, {
    urls: [
      `https://chat.openai.com/backend-api/conversation/${details.url.split('/c/')[1]}`,
      // TODO: Add other URLs for custom GPTs
      // `https://chat.openai.com/backend-api/conversation/${details.url.split('/g/')[1]}`,
      // 'https://chat.openai.com/ces/v1/t',
    ],
    types: ['xmlhttprequest'],
  })

  // When new prompt is added in chat
  chrome.webRequest.onCompleted.addListener(
    (listener) => {
      chrome.tabs.sendMessage(listener.tabId, { action: 'updateRightSidebar' })
    },
    {
      urls: [
        // Update the sidebar after response completed but last req (/ces/v1/t) will handle all type
        // 'https://chat.openai.com/backend-api/lat/r',
        `https://chat.openai.com/backend-api/conversation`,
        // To update the prompts while changing the thread
        'https://chat.openai.com/ces/v1/t',
      ],
      types: ['xmlhttprequest'],
    }
  )
  if (details.url === 'https://chat.openai.com/')
    chrome.tabs.sendMessage(details.tabId, { action: 'clearRightSidebar' })

  // New chat -> prompt -> (/ url will be converted to -> /c/:chatId)
  // else chrome.tabs.sendMessage(details.tabId, { action: 'addRIghtSidebar' })
})
