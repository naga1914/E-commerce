// Script for navigation bar toggle
const bar = document.getElementById('bar');
const close = document.getElementById('close');
const nav = document.getElementById('navbar');

if (bar) {
    bar.addEventListener('click', () => {
        nav.classList.add('active');
    });
}

if (close) {
    close.addEventListener('click', () => {
        nav.classList.remove('active');
    });
}

// Scroll reveal effect on elements with class "scroll-reveal"
const revealElements = document.querySelectorAll('.scroll-reveal');

function revealOnScroll() {
    const windowHeight = window.innerHeight;
    const revealPoint = 150;

    revealElements.forEach(el => {
        const elementTop = el.getBoundingClientRect().top;

        if (elementTop < windowHeight - revealPoint) {
            el.classList.add('visible');  // You can define .visible in CSS for opacity and transform
            el.classList.remove('hidden'); // Remove hidden class or set opacity 0/translate-y in CSS
        } else {
            el.classList.remove('visible');
            el.classList.add('hidden');
        }
    });
}

// Highlight active nav link based on scroll position
const navLinks = document.querySelectorAll('#navbar a[href^="#"]');
const sections = Array.from(navLinks).map(link => {
    const id = link.getAttribute('href').substring(1);
    return document.getElementById(id);
});

function highlightActiveLink() {
    let scrollPos = window.scrollY + 100;  // Offset for better detection
    let currentIndex = sections.length - 1;

    for (let i = 0; i < sections.length; i++) {
        if (sections[i].offsetTop > scrollPos) {
            currentIndex = i - 1;
            break;
        }
    }

    navLinks.forEach(link => link.classList.remove('active-link')); // Use a CSS class like 'active-link' for styling
    if (currentIndex >= 0) {
        navLinks[currentIndex].classList.add('active-link');
    }
}

// Attach scroll events
window.addEventListener('scroll', () => {
    revealOnScroll();
    highlightActiveLink();
});

// Initialize on page load
window.addEventListener('load', () => {
    revealOnScroll();
    highlightActiveLink();
});


// Select all cart buttons
const cartButtons = document.querySelectorAll('.cart a');

cartButtons.forEach(button => {
  button.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent default link action
    const product = button.closest('.pro').querySelector('.des h5').innerText;
    alert(`${product} added to cart!`);
  });
});


const proContainers = document.querySelectorAll('.pro-container');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in');
    }
  });
}, { threshold: 0.1 });

proContainers.forEach(container => observer.observe(container));


document.querySelectorAll('button.normal, button.white').forEach(btn => {
  btn.addEventListener('click', () => {
    alert('Button clicked! Redirecting or showing more info...');
    // You can add your redirect logic here:
    // window.location.href = 'somepage.html';
  });
});

// AI Chatbot
const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
let userMessage = null; // Variable to store user's message
const inputInitHeight = chatInput.scrollHeight;
// API configuration
const API_KEY = "AIzaSyBDEOVPw1QRrtcYhRjIkD1XXPfTzHC-mBw"; // Your API key here
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
const createChatLi = (message, className) => {
  // Create a chat <li> element with passed message and className
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", `${className}`);
  let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
  chatLi.innerHTML = chatContent;
  chatLi.querySelector("p").textContent = message;
  return chatLi; // return chat <li> element
}
const generateResponse = async (chatElement) => {
  const messageElement = chatElement.querySelector("p");
  // Define the properties and message for the API request
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      contents: [{ 
        role: "user", 
        parts: [{ text: userMessage }] 
      }] 
    }),
  }
  // Send POST request to API, get response and set the reponse as paragraph text
  try {
    const response = await fetch(API_URL, requestOptions);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error.message);
    
    // Get the API response text and update the message element
    messageElement.textContent = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, '$1');
  } catch (error) {
    // Handle error
    messageElement.classList.add("error");
    messageElement.textContent = error.message;
  } finally {
    chatbox.scrollTo(0, chatbox.scrollHeight);
  }
}
const handleChat = () => {
  userMessage = chatInput.value.trim(); // Get user entered message and remove extra whitespace
  if (!userMessage) return;
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
  if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
    e.preventDefault();
    handleChat();
  }
});
sendChatBtn.addEventListener("click", handleChat);
closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
