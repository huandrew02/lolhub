const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");

let userMessage = null; // Variable to store user's message
const API_KEY = "sk-proj-3kSj7gFlHwWeiGJIjzyPT3BlbkFJnikEwGq0XEMLALOLAuNG";
const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (message, className) => {
    // Create a chat <li> element with passed message and className
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", `${className}`);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi; // return chat <li> element
}

const generateResponse = (chatElement) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement = chatElement.querySelector("p");

    // Define the properties and message for the API request
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{role: "user", content: userMessage}],
        })
    }

    // Send POST request to API, get response and set the reponse as paragraph text
    fetch(API_URL, requestOptions).then(res => res.json()).then(data => {
        messageElement.textContent = data.choices[0].message.content.trim();
    }).catch(() => {
        messageElement.classList.add("error");
        messageElement.textContent = "Oops! Something went wrong. Please try again.";
    }).finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
}

const handleChat = () => {
    userMessage = chatInput.value.trim(); // Get user entered message and remove extra whitespace
    if(!userMessage) return;

    // Clear the input textarea and set its height to default
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    // Append the user's message to the chatbox
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);
    
    setTimeout(() => {
        // Display "Thinking..." message while waiting for the response
        const incomingChatLi = createChatLi("Thinking...", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);
}

chatInput.addEventListener("input", () => {
    // Adjust the height of the input textarea based on its content
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    // If Enter key is pressed without Shift key and the window 
    // width is greater than 800px, handle the chat
    if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});

sendChatBtn.addEventListener("click", handleChat);
closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));

// Assuming patchData is your array of patch notes loaded from the JSON file
document.addEventListener('DOMContentLoaded', function() {
    fetch('../patchNotes.json')
        .then(response => response.json())
        .then(data => {
            // Sort patch notes by date in descending order
            const sortedPatches = data.sort((a, b) => new Date(b.date) - new Date(a.date));
            // Get the latest two patch notes
            const latestPatches = sortedPatches.slice(0, 2);
            displayLatestPatches(latestPatches); // Function to display the latest two patches
        })
        .catch(error => console.error('Error loading patch notes:', error));
});

function displayLatestPatches(patches) {
    const latestNewsSection = document.getElementById('latestNews');
    // Remove the line that clears innerHTML to preserve existing elements like your <h2> tag
    
    // Now create a container for the patches to keep them separate from your <h2>
    const patchesContainer = document.createElement('div');
    patchesContainer.className = 'patches-container';

    patches.forEach(patch => {
        const patchCard = document.createElement('div');
        patchCard.className = 'patch-note-card';
        patchCard.innerHTML = `
            <div class="patch-note-info">
                <a href="${patch.url}" target="_blank"><h3>Patch ${patch.version} Notes</h3></a>
                <p>${patch.summary}</p>
            </div>
        `;
        patchesContainer.appendChild(patchCard);
    });

    // Append the new container to the latestNewsSection
    latestNewsSection.appendChild(patchesContainer);
}

/*Udemy Day 20 Button Ripple affect*/
const buttons = document.querySelectorAll('.ripple')

buttons.forEach(button=>{
    button.addEventListener('click',function(e){
        const x = e.clientX
        const y = e.clientY

        const buttonTop=e.target.offsetTop
        const buttonLeft=e.target.offsetLeft

        const xInside= x - buttonLeft
        const yInside= y - buttonTop

        const circle = document.createElement('span')
        circle.classList.add('circle')
     circle.style.top = yInside + 'px'
     circle.style.left = xInside + 'px'

     this.appendChild(circle)

    setTimeout(() => circle.remove(), 500)

    })
})