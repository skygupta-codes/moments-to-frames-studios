/* Moments to Frames Studio - AI Client Concierge */

(function () {
    // -------------------------------------------------------------
    // Chatbot Configuration & Knowledge Base
    // -------------------------------------------------------------

    const config = {
        bookingLink: "https://bookings.momentstoframes.com/public/66db64b848ac7d001979fac4",
        studioName: "Moments to Frames Studio",
        studioLocation: "Barrhaven, Ottawa"
    };

    // Pre-defined responses based on make.md rules
    const responses = {
        greeting: "Hi there! I'm Maya, the personal studio assistant for Moments to Frames. I'm so excited to help you plan your perfect session! Please fill out our contact form to get started, or ask me any questions you have:<br><br><a href='https://www.honeybook.com/widget/moments_to_frames_234688/cf_id/699f375b9ea96e0039c52bd9' class='chat-action-btn' target='_blank'>Open Contact Form</a>",

        maternity: "Our Maternity Sessions are designed to celebrate the magic of the wait. We focus on elegant, timeless styling to help you feel confident and soft. These sessions are best scheduled between 28–34 weeks.<br><br>Would you like to learn about pricing or look into securing a date?",

        family: "Our Family Portrait Sessions are a relaxed, guided experience focused on capturing natural connection and family bonds. We aim to create heirloom-quality imagery that you'll cherish forever.<br><br>Are you interested in viewing our availability?",

        booking_intent: `That's wonderful — we would be honored to capture this special season for you.<br><br>To secure your session, please follow this link:<br><a href="${config.bookingLink}" class="chat-action-btn" target="_blank">Book Your Session</a><br><br>Steps:<br>1. Choose your preferred session type.<br>2. Select your available date.<br>3. Complete the inquiry form.<br>4. The studio team will confirm availability and guide you through next steps.<br><br>Spots are limited each month to maintain a personalized experience, so booking early is recommended.`,

        escalate: `For detailed and personalized information—such as custom packages, specific availability, or pricing breakdowns—the studio team will be happy to assist you directly. Please use the booking link below so they can provide accurate guidance.<br><a href="${config.bookingLink}" class="chat-action-btn" target="_blank">Contact Studio Team</a>`,

        fallback: `I'd love to make sure you receive the most accurate details. Let me connect you directly with the studio team.<br><a href="${config.bookingLink}" class="chat-action-btn" target="_blank">Contact Studio Team</a>`
    };

    // Quick replies for initial greeting
    const initialQuickReplies = [
        { label: "Maternity Portraits", action: "maternity" },
        { label: "Family Portraits", action: "family" },
        { label: "Book a Session", action: "book" }
    ];

    // -------------------------------------------------------------
    // UI Injection
    // -------------------------------------------------------------

    function injectChatbot() {
        // Chatbot HTML Structure
        const chatbotHTML = `
            <!-- Chatbot Toggle Button -->
            <button id="chatbot-toggle-btn" aria-label="Open Chat">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
                    <path d="M7 9h10v2H7zm0-3h10v2H7zm0 6h7v2H7z"/>
                </svg>
            </button>

            <!-- Chatbot Window -->
            <div id="chatbot-container">
                <div id="chatbot-header">
                    <h3>Maya - Studio Assistant</h3>
                    <button id="chatbot-close-btn" aria-label="Close Chat">&times;</button>
                </div>
                <div id="chatbot-messages">
                    <!-- Messages will be injected here -->
                </div>
                <div id="chatbot-input-area">
                    <input type="text" id="chatbot-input" placeholder="Type your message..." aria-label="Type message">
                    <button id="chatbot-send-btn" aria-label="Send">
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;

        // Inject into body
        const wrapper = document.createElement('div');
        wrapper.innerHTML = chatbotHTML;
        document.body.appendChild(wrapper);

        // Setup Event Listeners after injection
        setupEventListeners();

        // Show initial greeting with iframe after a short delay
        setTimeout(() => {
            addMessage(responses.greeting, 'bot');
            addQuickReplies(initialQuickReplies);
            // Proactively open the chat window
            if (!isChatOpen) toggleChat();
        }, 800);
    }

    // -------------------------------------------------------------
    // Logic & Interaction
    // -------------------------------------------------------------

    let isChatOpen = false;
    let messagesContainer, inputField, sendBtn, toggleBtn, container, closeBtn;

    function setupEventListeners() {
        messagesContainer = document.getElementById('chatbot-messages');
        inputField = document.getElementById('chatbot-input');
        sendBtn = document.getElementById('chatbot-send-btn');
        toggleBtn = document.getElementById('chatbot-toggle-btn');
        container = document.getElementById('chatbot-container');
        closeBtn = document.getElementById('chatbot-close-btn');

        toggleBtn.addEventListener('click', toggleChat);
        closeBtn.addEventListener('click', toggleChat);

        sendBtn.addEventListener('click', handleUserMessage);
        inputField.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') handleUserMessage();
        });
    }

    function toggleChat() {
        isChatOpen = !isChatOpen;
        if (isChatOpen) {
            container.classList.add('open');
            inputField.focus();
        } else {
            container.classList.remove('open');
        }
    }

    function addMessage(text, sender) {
        // Remove quick replies if they exist
        const existingReplies = messagesContainer.querySelector('.chat-quick-replies');
        if (existingReplies) {
            existingReplies.remove();
        }

        const msgDiv = document.createElement('div');
        msgDiv.classList.add('chat-message', sender);
        msgDiv.innerHTML = text; // allow simple HTML like <br> and <a>
        messagesContainer.appendChild(msgDiv);
        scrollToBottom();
    }

    function addQuickReplies(replies) {
        const repliesContainer = document.createElement('div');
        repliesContainer.classList.add('chat-quick-replies');

        replies.forEach(reply => {
            const btn = document.createElement('button');
            btn.classList.add('quick-reply-btn');
            btn.textContent = reply.label;
            btn.addEventListener('click', () => {
                // Remove replies visually
                repliesContainer.remove();
                // User sends the label
                addMessage(reply.label, 'user');
                // Bot responds
                setTimeout(() => processBotResponse(reply.label), 500);
            });
            repliesContainer.appendChild(btn);
        });

        messagesContainer.appendChild(repliesContainer);
        scrollToBottom();
    }

    function scrollToBottom() {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function handleUserMessage() {
        const text = inputField.value.trim();
        if (!text) return;

        // Clear input
        inputField.value = '';

        // Add User Message
        addMessage(text, 'user');

        // Typing indicator simulation
        setTimeout(() => {
            processBotResponse(text);
        }, 800);
    }

    let conversationHistory = [];

    async function processBotResponse(userInput) {
        try {
            // Keep the initial quick-greeting handling snappy locally if it's very basic
            const text = userInput.toLowerCase();
            if (text.includes("hello") || text.includes("hi ") || text === "hi" || text.includes("hey")) {
                addMessage("Hello again! How can I assist you with your photography needs today?", 'bot');
                addQuickReplies(initialQuickReplies);
                return;
            }

            // Show a temporary loading message
            const loadingId = 'loading-' + Date.now();
            const msgDiv = document.createElement('div');
            msgDiv.id = loadingId;
            msgDiv.classList.add('chat-message', 'bot', 'loading');
            msgDiv.innerHTML = "...";
            messagesContainer.appendChild(msgDiv);
            scrollToBottom();

            // Call the live Render backend
            const response = await fetch('https://maya-backend-rzv0.onrender.com/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userInput,
                    conversationHistory: conversationHistory
                })
            });

            // Remove loading indicator
            document.getElementById(loadingId).remove();

            if (!response.ok) {
                throw new Error("Server response wasn't OK");
            }

            const data = await response.json();

            // Render the AI reply
            addMessage(data.reply, 'bot');

            // Save conversation history to maintain context
            conversationHistory.push({ role: "user", content: userInput });
            conversationHistory.push({ role: "assistant", content: data.reply });

            // Truncate history to last 10 messages to save tokens if needed
            if (conversationHistory.length > 10) {
                conversationHistory = conversationHistory.slice(conversationHistory.length - 10);
            }

        } catch (error) {
            console.error("Chatbot API Error:", error);
            document.querySelector('.chat-message.loading')?.remove();
            addMessage(responses.fallback, 'bot');
        }
    }

    // Initialize Chatbot when DOM is fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectChatbot);
    } else {
        injectChatbot();
    }

})();
