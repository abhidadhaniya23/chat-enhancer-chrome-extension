console.log('Chat enhancer loaded')

// Listen for messages from external sources
chrome.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
  // Respond to messages from external sources if needed
  sendResponse({ received: true })
})

// Listen for clicks on the extension icon
chrome.action.onClicked.addListener((tab) => {
  // Execute content script on the active tab
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['content.js'],
  })
})

// Listen for changes in tab history state
// https://developer.chrome.com/docs/extensions/reference/api/webNavigation
chrome.webNavigation.onHistoryStateUpdated.addListener(function (details) {
  // Define a listener function to handle web request responses
  const listener = (details) => {
    // Check if the response status is OK (200)
    if (details.statusCode === 200) {
      // Send a message to the content script to update the right sidebar
      // Wait for the DOM to be updated before sending the message
      setTimeout(() => {
        chrome.tabs.sendMessage(details.tabId, { action: 'updateRightSidebar' })
      }, 1000)
    } else {
      // Send a message to the content script indicating failure to load
      chrome.tabs.sendMessage(details.tabId, { action: 'failedToLoad' })
    }
  }

  // Add a listener for completed web requests
  chrome.webRequest.onCompleted.addListener(listener, {
    // Define the URLs to listen for responses on
    urls: [
      `https://chat.openai.com/backend-api/conversation/${details.url.split('/c/')[1]}`,
      // TODO: Add other URLs for custom GPTs
      // `https://chat.openai.com/backend-api/conversation/${details.url.split('/g/')[1]}`,
      // 'https://chat.openai.com/ces/v1/t',
    ],
    // Specify the types of requests to listen for
    types: ['xmlhttprequest'],
  })

  // Add a listener for when new prompts are added in the chat
  chrome.webRequest.onCompleted.addListener(
    (listener) => {
      // Send a message to the content script to update the right sidebar
      chrome.tabs.sendMessage(listener.tabId, { action: 'updateRightSidebar' })
    },
    {
      // Define the URLs to listen for responses on
      urls: [
        // Update the sidebar after response completed, but the last request (/ces/v1/t) will handle all types
        // 'https://chat.openai.com/backend-api/lat/r',
        `https://chat.openai.com/backend-api/conversation`,
        // To update the prompts while changing the thread
        'https://chat.openai.com/ces/v1/t',
      ],
      // Specify the types of requests to listen for
      types: ['xmlhttprequest'],
    }
  )

  // Handle special case when the user is on the home page
  if (details.url === 'https://chat.openai.com/') {
    chrome.tabs.sendMessage(details.tabId, { action: 'clearRightSidebar' })
  }
})
