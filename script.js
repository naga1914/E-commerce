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

