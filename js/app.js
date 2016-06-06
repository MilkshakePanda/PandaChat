// Establish connection with the socket server
const connection = new WebSocket("ws://localhost:1337", ['echo-protocol'])
const form       = document.forms[0]
const pageTitle  = document.querySelector("#title")
const chatContainer = document.querySelector("#chatContainer")

// On open
connection.onopen = () => pageTitle.innerHTML = "Connection Established"
    
// On error
connection.onerror = (error) => console.log("There was an error of type " + error + " please try again shortly") 

// On Message
connection.onmessage = (event) => displayMessage(event.data)

// When the user submits the form
form.onsubmit = (event) => sendMessage(event)

const sendMessage = (event) => {
    event.preventDefault()
    const message = form.elements["user_message"]
    connection.send(message.value)
    message.value = ""
}

const displayMessage = (message) => {
    console.log(message)
    const messageElement = document.createElement("P") // create an html element
    messageElement.innerHTML = message 
    chatContainer.appendChild(messageElement)        // append the fucker to the container
}
        

