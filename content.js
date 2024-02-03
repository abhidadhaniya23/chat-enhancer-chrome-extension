console.log('content.js')

window.onload = () => {
  const chat = document.querySelector('body>div>div>div:nth-child(2)')
  chat.className = 'chatBody'
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'addRightSidebar') {
    clearRightSidebar()
    addRightSidebarOnLoad()
  }
})

// Listen for messages to update the right sidebar
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'updateRightSidebar') {
    clearRightSidebar()
    addRightSidebarOnLoad()
  }
})

// Function to clear existing right sidebar content
function clearRightSidebar() {
  const existingSidebar = document.getElementById('rightSidebar')
  if (existingSidebar) {
    existingSidebar.remove()
  }
}

// Function to add right sidebar on chat body load
function addRightSidebarOnLoad() {
  // Check if the chat body is loaded
  const chatBodyObserver = new MutationObserver((mutationsList) => {
    mutationsList.forEach((mutation) => {
      console.log(mutation.target)
      // if (mutation.target.matches('div.flex-1.overflow-hidden') || mutation.target.matches('main')) {
      if (mutation.target.matches('div.flex-1.overflow-hidden')) {
        console.log('stopped')
        chatBodyObserver.disconnect() // Disconnect the observer once chat body is loaded
        addRightSidebar()
      }
    })
  })
  console.log(chatBodyObserver)
  const chatBodyObserverConfig = { childList: true, subtree: true }
  // chatBodyObserver.observe(document.querySelector('body>div>div'), chatBodyObserverConfig)
  chatBodyObserver.observe(document.body, chatBodyObserverConfig)
}

// Function to add or refresh the right sidebar content
function addRightSidebar() {
  const userPrompts = document.querySelectorAll(`[data-message-author-role='user']`)

  // Create and populate the right sidebar
  const rightSidebar = document.createElement('div')
  rightSidebar.id = 'rightSidebar'
  rightSidebar.style.cssText = `
    // width: 260px;
    height: 100%;
    overflow-y: auto;
    color: #ECECF1;
    background: black !important;
    padding: 10px 8px;
  `

  userPrompts.forEach((prompt, index) => {
    const promptContent = prompt.querySelector('div').innerText

    const promptElement = document.createElement('div')
    promptElement.innerText = `${index + 1}: ${truncateText(promptContent, 40)}`
    promptElement.title = promptContent // Add full text as title attribute
    promptElement.style.cssText = `
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 8px;
      transition: background-color 0.3s ease; 
      margin-bottom: 2px;
    `

    // Add hover effect
    promptElement.addEventListener('mouseover', () => {
      promptElement.style.backgroundColor = '#202123' // Change background color on hover
    })

    promptElement.addEventListener('mouseout', () => {
      promptElement.style.backgroundColor = '' // Reset background color on mouseout
    })

    // Add click event to scroll to the clicked prompt
    promptElement.addEventListener('click', () => {
      prompt.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })

    rightSidebar.appendChild(promptElement)
  })

  // Add toggle button to extend/close the sidebar
  const toggleButton = document.createElement('button')
  toggleButton.innerText = 'Toggle Sidebar'
  toggleButton.style.marginTop = '10px'
  toggleButton.addEventListener('click', () => {
    rightSidebar.classList.toggle('extended')
  })

  rightSidebar.appendChild(toggleButton)

  document.querySelectorAll('div')[1].append(rightSidebar) // Adjust the selector accordingly
}

// Helper function to truncate text
function truncateText(text, maxLength) {
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text
}

// // Listen for messages from the background script
// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   if (request.action === 'addRightSidebar') {
//     if (document.getElementById('rightSidebar')) clearRightSidebar()
//     else addRightSidebarOnLoad()
//   }
// })

// // Listen for messages to update the right sidebar
// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   if (request.action === 'updateRightSidebar') {
//     if (document.getElementById('rightSidebar')) clearRightSidebar()
//     else addRightSidebarOnLoad()
//   }
// })

// // Function to clear existing right sidebar content
// function clearRightSidebar() {
//   const existingSidebar = document.getElementById('rightSidebar')
//   if (existingSidebar) {
//     existingSidebar.remove()
//   }
// }

// // Function to add right sidebar on chat body load
// function addRightSidebarOnLoad() {
//   // Check if the chat body is loaded
//   const chatBody = document.querySelector('body>div>div:nth-child(2)>div:nth-child(2)') // Replace with your actual selector
//   console.log(chatBody)
//   if (chatBody) {
//     addRightSidebar()
//   } else {
//     // If chat body is not loaded, set up an observer to wait for it
//     const observer = new MutationObserver(function (mutationsList) {
//       mutationsList.forEach((mutation) => {
//         console.log(mutation)
//         if (mutation.target.matches('body>div>div:nth-child(2)>div:nth-child(2)')) {
//           // Replace with your actual selector
//           observer.disconnect() // Disconnect the observer once chat body is loaded
//           addRightSidebar()
//         }
//       })
//     })

//     const observerConfig = { childList: true, subtree: true }
//     observer.observe(document.body, observerConfig)
//   }
// }

// // Function to add or refresh the right sidebar content
// function addRightSidebar() {
//   const userPrompts = document.querySelectorAll(`[data-message-author-role='user']`)
//   console.log('userPrompts', userPrompts)
//   // Create and populate the right sidebar
//   const rightSidebar = document.createElement('div')
//   rightSidebar.id = 'rightSidebar'
//   rightSidebar.style.cssText = `
//     width: 260px;
//     height: 100%;
//     overflow-y: auto;
//     color: #ECECF1;
//     background: black !important;
//     padding: 10px 8px;
//   `

//   userPrompts.forEach((prompt, index) => {
//     const promptContent = prompt.querySelector('div').innerText

//     const promptElement = document.createElement('div')
//     promptElement.innerText = `${index + 1}: ${truncateText(promptContent, 40)}`
//     promptElement.title = promptContent // Add full text as title attribute
//     promptElement.style.cssText = `
//       cursor: pointer;
//       padding: 4px 8px;
//       border-radius: 8px;
//       transition: background-color 0.3s ease;
//       margin-bottom: 2px;
//     `

//     // Add hover effect
//     promptElement.addEventListener('mouseover', () => {
//       promptElement.style.backgroundColor = '#202123' // Change background color on hover
//     })

//     promptElement.addEventListener('mouseout', () => {
//       promptElement.style.backgroundColor = '' // Reset background color on mouseout
//     })

//     // Add click event to scroll to the clicked prompt
//     promptElement.addEventListener('click', () => {
//       prompt.scrollIntoView({ behavior: 'smooth', block: 'start' })
//     })

//     rightSidebar.appendChild(promptElement)
//   })

//   // Add toggle button to extend/close the sidebar
//   const toggleButton = document.createElement('button')
//   toggleButton.innerText = 'Toggle Sidebar'
//   toggleButton.style.marginTop = '10px'
//   toggleButton.addEventListener('click', () => {
//     rightSidebar.classList.toggle('extended')
//   })

//   rightSidebar.appendChild(toggleButton)

//   document.querySelectorAll('div')[1].append(rightSidebar) // Adjust the selector accordingly
// }

// // Helper function to truncate text
// function truncateText(text, maxLength) {
//   return text.length > maxLength ? text.slice(0, maxLength) + '...' : text
// }

// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   if (request.action === 'addRightSidebar') {
//     addRightSidebar()
//   }
// })

// console.log('Content.js loaded')

// // Initialize MutationObserver
// // const observer = new MutationObserver(function (mutationsList) {
// //   // Check if the mutations include changes to the user prompts
// //   const userPromptChanges = mutationsList.some((mutation) =>
// //     Array.from(mutation.addedNodes).some((node) => node.matches && node.matches('[data-message-author-role="user"]'))
// //   )
// //   console.log(mutationsList)
// //   console.log(userPromptChanges)

// //   // If there are changes to user prompts, update the right sidebar
// //   if (userPromptChanges) {
// //     clearRightSidebar()
// //     addRightSidebar()
// //   }
// // })

// // Configure and start the observer
// // const observerConfig = { childList: true, subtree: true }
// // observer.observe(document.body, observerConfig)

// // Listen for messages from the background script
// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   if (request.action === 'updateRightSidebar') {
//     console.log(request.action, document.querySelectorAll(`[data-message-author-role='user']`).length)
//     clearRightSidebar()
//     setTimeout(() => {
//       if (document.querySelectorAll(`[data-message-author-role='user']`).length > 0) addRightSidebar()
//     }, 4000)
//   }
// })

// // Function to clear existing right sidebar content
// function clearRightSidebar() {
//   const existingSidebar = document.getElementById('rightSidebar')
//   if (existingSidebar) {
//     existingSidebar.remove()
//     // existingSidebar.innerHTML = '' // Clear the content
//   }
// }

// // Updated addRightSidebar function
// function addRightSidebar() {
//   // const userPrompts = document.querySelectorAll('.text-message')
//   const userPrompts = document.querySelectorAll(`[data-message-author-role='user']`)

//   // Check if the sidebar already exists, if yes, remove it
//   const existingSidebar = document.getElementById('rightSidebar')
//   if (existingSidebar) {
//     existingSidebar.remove()
//     return // Exit the function if the sidebar is removed
//   }

//   // Create and populate the right sidebar
//   const rightSidebar = document.createElement('div')
//   rightSidebar.id = 'rightSidebar'
//   rightSidebar.style.cssText = `
//     width: 260px;
//     height: 100%;
//     overflow-y: auto;
//     color: #ECECF1;
//     background: black !important;
//     padding: 10px 20px;
//     `

//   userPrompts.forEach((prompt, index) => {
//     const promptContent = prompt.querySelector('div').innerText

//     const promptElement = document.createElement('div')
//     promptElement.innerText = `${index + 1}: ${truncateText(promptContent, 40)}`
//     promptElement.title = promptContent // Add full text as title attribute
//     promptElement.style.cssText = `
//     cursor: pointer;
//     padding: 4px 4px;
//     `

//     // Add click event to scroll to the clicked prompt
//     promptElement.addEventListener('click', () => {
//       prompt.scrollIntoView({ behavior: 'smooth', block: 'start' })
//     })

//     rightSidebar.appendChild(promptElement)
//   })

//   // Add toggle button to extend/close the sidebar
//   const toggleButton = document.createElement('button')
//   toggleButton.innerText = 'Toggle Sidebar'
//   toggleButton.style.marginTop = '10px'
//   toggleButton.addEventListener('click', () => {
//     rightSidebar.classList.toggle('extended')
//   })

//   rightSidebar.appendChild(toggleButton)

//   document.querySelectorAll('div')[1].append(rightSidebar)
// }

// // Helper function to truncate text
// function truncateText(text, maxLength) {
//   return text.length > maxLength ? text.slice(0, maxLength) + '...' : text
// }
