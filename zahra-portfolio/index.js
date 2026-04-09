document.getElementById('yr').textContent = new Date().getFullYear();

// Hamburger
const ham = document.getElementById('hamburger');
const nav = document.getElementById('navLinks');
ham.addEventListener('click', () => nav.classList.toggle('open'));
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

// Contact form
function handleContact(btn) {
btn.textContent = 'Sending...';
btn.disabled = true;
setTimeout(() => {
    btn.textContent = 'Message Sent ✓';
    btn.style.background = '#e8f2ef';
    btn.style.color = '#1a4d3e';
}, 1200);
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
});
});

// Scroll reveal
const observer = new IntersectionObserver(entries => {
entries.forEach(e => {
    if (e.isIntersecting) {
    e.target.style.opacity = '1';
    e.target.style.transform = 'translateY(0)';
    }
});
}, { threshold: 0.08 });

document.querySelectorAll('.project-card, .skill-card, .exp-item, .edu-card').forEach(el => {
el.style.opacity = '0';
el.style.transform = 'translateY(24px)';
el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
observer.observe(el);
});
