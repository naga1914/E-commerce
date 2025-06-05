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
// AI Chatbot
const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");

let userMessage = null;
const inputInitHeight = chatInput.scrollHeight;

const API_KEY = "AIzaSyBDEOVPw1QRrtcYhRjIkD1XXPfTzHC-mBw"; // Replace with your actual Gemini API key
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

const createChatLi = (message, className) => {
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", className);
  chatLi.innerHTML =
    className === "outgoing"
      ? `<p></p>`
      : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
  chatLi.querySelector("p").textContent = message;
  return chatLi;
};

const createImageReply = (data) => {
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", "incoming");

  let imageHTML = data.images.map(
    (src) =>
      `<img src="${src}" class="ai-recommend-img" style="width:100px; height:auto; margin:8px; border-radius:10px; cursor:pointer;" data-product="${data.text}">`
  ).join("");

  chatLi.innerHTML = `<span class="material-symbols-outlined">smart_toy</span>
    <div>
      <p>${data.text}</p>
      <div style="display:flex; flex-wrap:wrap; gap:10px; margin-top:8px;">
        ${imageHTML}
      </div>
    </div>`;

  // Add event listeners on images after insertion
  setTimeout(() => {
    document.querySelectorAll(".ai-recommend-img").forEach((img) => {
      img.addEventListener("click", () => {
        // Optional: store clicked product info for cart use
        const product = img.getAttribute("data-product");
        localStorage.setItem("ai-selected-product", product);

        // Redirect or scroll to cart section
        window.location.hash = "#cart";

        // If you want smooth scroll:
        /*
        document.querySelector("#cart").scrollIntoView({ behavior: "smooth" });
        */
      });
    });
  }, 0);

  return chatLi;
};

const generateResponse = async (chatElement) => {
  const fashionReply = checkFashionKeywords(userMessage.toLowerCase());
  if (fashionReply) {
    chatbox.appendChild(createImageReply(fashionReply));
    chatbox.scrollTo(0, chatbox.scrollHeight);
    chatElement.remove(); // remove "thinking..." message
    return;
  }

  const messageElement = chatElement.querySelector("p");

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: userMessage }],
        },
      ],
    }),
  };

  try {
    const response = await fetch(API_URL, requestOptions);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error.message);
    messageElement.textContent = data.candidates[0].content.parts[0].text.replace(
      /\*\*(.*?)\*\*/g,
      "$1"
    );
  } catch (error) {
    messageElement.classList.add("error");
    messageElement.textContent = error.message;
  } finally {
    chatbox.scrollTo(0, chatbox.scrollHeight);
  }
};

const handleChat = () => {
  userMessage = chatInput.value.trim();
  if (!userMessage) return;

  chatInput.value = "";
  chatInput.style.height = `${inputInitHeight}px`;

  chatbox.appendChild(createChatLi(userMessage, "outgoing"));
  chatbox.scrollTo(0, chatbox.scrollHeight);

  setTimeout(() => {
    const incomingChatLi = createChatLi("Thinking...", "incoming");
    chatbox.appendChild(incomingChatLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);
    generateResponse(incomingChatLi);
  }, 600);
};

chatInput.addEventListener("input", () => {
  chatInput.style.height = `${inputInitHeight}px`;
  chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
    e.preventDefault();
    handleChat();
  }
});

sendChatBtn.addEventListener("click", handleChat);

chatbotToggler.addEventListener("click", () => {
  document.body.classList.toggle("show-chatbot");
  document.body.style.overflow = document.body.classList.contains("show-chatbot")
    ? "hidden"
    : "auto";
});

closeBtn.addEventListener("click", () => {
  document.body.classList.remove("show-chatbot");
  document.body.style.overflow = "auto";
});

function checkFashionKeywords(message) {
  if (message.includes("tall") && message.includes("fair")) {
    return {
      text: "We recommend pastel long dresses for tall and fair skin tones.",
      images: ["img/tall.webp", "img/fair.webp"],
    };
  } else if (message.includes("short") && message.includes("wheatish")) {
    return {
      text: "A-line and maroon dresses suit short and wheatish tones.",
      images: ["img/short.webp", "img/wheatish.jpg"],
    };
  } else if (message.includes("plus size") || message.includes("curvy")) {
    return {
      text: "Empire waist or wrap dresses are great for plus-size and curvy shapes.",
      images: ["img/plussize.jpg", "img/curvy.webp"],
    };
  } else if (message.includes("slim") || message.includes("lean")) {
    return {
      text: "Bodycon or structured printed dresses will look amazing on you!",
      images: ["img/slim.jpg", "img/lean.avif"],
    };
  } else {
    return null;
  }
}
