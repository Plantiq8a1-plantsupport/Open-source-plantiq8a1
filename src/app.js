const chatBody = document.getElementById('chat-body');
const sendButton = document.getElementById('enter');
const userInput = document.getElementById('user-input');
const imageInput = document.getElementById('image-input');

class LRUCache {
    constructor(limit = 50) {
      this.limit = limit;
      this.cache = new Map();
    }
    get(key) {
      if (!this.cache.has(key)) return null;
      const value = this.cache.get(key);
      this.cache.delete(key);
      this.cache.set(key, value);
      return value;
    }
    set(key, value) {
      if (this.cache.has(key)) {
        this.cache.delete(key);
      } else if (this.cache.size === this.limit) {
        const firstKey = this.cache.keys().next().value;
        this.cache.delete(firstKey);
      }
      this.cache.set(key, value);
    }
  }
  
  const responseCache = new LRUCache(100);

function displayMessage(message, sender) {
    const messageElement = document.createElement('div');
    messageElement.innerHTML = `<strong>${sender === 'ai' ? 'AI' : 'Bạn'}:</strong> ${message.replace(/\n/g, "<br>")}`;
    messageElement.classList.add('message', sender);
    chatBody.appendChild(messageElement);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function displayImage(imageSrc, sender) {
    const imageElement = document.createElement('img');
    imageElement.src = imageSrc;
    imageElement.classList.add('message', sender, 'image-message');
    imageElement.style.maxWidth = '80%';
    imageElement.style.borderRadius = '8px';
    imageElement.style.marginTop = '5px';
    chatBody.appendChild(imageElement);
    chatBody.scrollTop = chatBody.scrollHeight;
}

async function sendMessage() {

    let isBlocked = false;
    let requestCount = 0;

    if (isBlocked) {
        displayMessage("AI đang bị quá tải. Hãy đợi 1h30m59s", 'ai');
        return;
    }

    requestCount++;
    if (requestCount > 200) {
        isBlocked = true;
        setTimeout(() => {
            isBlocked = false;
            requestCount = 0;
        }, 90 * 60 * 1000); // 1h 30p
        return;
    }

    const userMessage = userInput.value.trim();
    const imageFile = imageInput.files[0]; 

    if (!userMessage && !imageFile) return; 

    if (userMessage) {
        displayMessage(userMessage, 'user');
    }

    if (imageFile) {
        const reader = new FileReader();
        reader.onload = (event) => {
            displayImage(event.target.result, 'user');
        };
        reader.readAsDataURL(imageFile);
    }

    userInput.value = '';
    imageInput.value = ''; 


    const loadingElement = document.createElement('div');
    loadingElement.textContent = "AI đang suy nghĩ...";
    loadingElement.classList.add('message', 'ai', 'loading-message');
    chatBody.appendChild(loadingElement);
    chatBody.scrollTop = chatBody.scrollHeight;

    if (userMessage) { 
      try {
          const aiResponse = await getAIResponse(userMessage);
          chatBody.removeChild(loadingElement);
          displayMessage(aiResponse, 'ai');
          
      } catch (error) {
          console.error('Error:', error);
          displayMessage("AI: đang gặp sự ccos.", 'ai'); 
      }
    }
}

window.onload = () => {
    displayMessage("Chào Bạn! Bạn cần tôi giúp gì về cây cối hôm nay?", 'ai');
};



async function getAIResponse(message) {
    if (responseCache[message]) return responseCache[message];

    const apiUrl = "https://plantiq8a1.vercel.app/log/apichatlite.json"; // v1: https://plantiq8a1.vercel.app/log/apichatv1.json
    const apiKey = process.env.OPENAI_API_KEY; 


    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "plantiq-8a1-deepthink-lite", //  plantiq-deepthink-v1
                messages: [
                    {
                        role: "system",
                        content: " You are a Tree care expert/assistant named 'Chuyên gia chăm sóc cây'. You call yourself 'Tôi' and call your user 'Bạn'. You are always diagnosing sick plants, caring for plants, finding information about plants and planting plants. You do not answer questions unrelated to the topic trees." // You are a Tree care expert/assistant named 'Chuyên gia chăm sóc cây'. You call yourself 'Tôi' and call your user 'Bạn'. You are always diagnosing sick plants, caring for plants, finding information about plants and planting plants. You do not answer questions unrelated to the topic trees.
                    },
                    { role: "user", content: message }
                ],
                max_tokens: 2048, 
                temperature: 1.0, 
                top_p: 1.0      
            })
        });

        if (!response.ok) {
            const errorData = await response.json(); 
            const errorMessage = errorData.error?.message || `API Error: ${response.status}`;
            throw new Error(errorMessage); 
        }

        const data = await response.json();
        const aiResponse = data.choices?.[0]?.message?.content || "CHào?."; 
        responseCache[message] = aiResponse;
        return aiResponse;
    } catch (error) {
        console.error("Error fetching AI response:", error);
        return "AI: tôi đang gặp dự ccos."; 
    }
}

sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

function exitChat() {
    alert("...");
}

function clearChat() {
    chatBody.innerHTML = "";
}

function toggleTheme() {
    document.body.classList.toggle("dark-mode");
}


//8 a1
