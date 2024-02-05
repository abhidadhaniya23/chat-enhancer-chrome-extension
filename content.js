// Function to add or refresh the right sidebar content
function addRightSidebar() {
  const userPrompts = document.querySelectorAll(`[data-message-author-role='user']`)
  console.log(userPrompts)
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

  // Create and populate the right sidebar

  // Add toggle button to extend/close the sidebar
  // const toggleButton = document.createElement('button')
  // toggleButton.innerText = 'Toggle Sidebar'
  // toggleButton.style.marginTop = '10px'
  // toggleButton.addEventListener('click', () => {
  //   rightSidebar.classList.toggle('extended')
  // })

  // rightSidebar.appendChild(toggleButton)

  document.querySelectorAll('div')[1].append(rightSidebar) // Adjust the selector accordingly
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'addRightSidebar') {
    clearRightSidebar()
    addRightSidebar()
  }
})

// Function to clear existing right sidebar content
function clearRightSidebar() {
  const existingSidebar = document.getElementById('rightSidebar')
  if (existingSidebar) {
    existingSidebar.remove()
  }
}

// Function to handle URL change and trigger right sidebar update
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'updateRightSidebar') {
    // Handle URL change
    clearRightSidebar()
    addRightSidebar()
  }
})

// Listen for the popstate event to detect URL changes
// window.addEventListener('popstate', () => {
// This will only fire when going back to history -> UNDO / REDO
// console.log('URL Changed')
// })

// Helper function to truncate text
function truncateText(text, maxLength) {
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text
}
