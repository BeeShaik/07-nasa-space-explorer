// Dark/Light mode toggle for beginners
// This script adds a button to switch between dark and light themes

// Wait for the DOM to load
window.addEventListener('DOMContentLoaded', () => {
  // Create the toggle button
  const toggleBtn = document.createElement('button');
  toggleBtn.id = 'themeToggle';
  toggleBtn.setAttribute('aria-pressed', 'false');
  toggleBtn.setAttribute('aria-label', 'Toggle dark and light mode');
  toggleBtn.innerText = '🌙'; // Only show the icon

  // Find the header and add the button to the top right
  const header = document.querySelector('.site-header');
  header.appendChild(toggleBtn);

  // Function to switch themes
  function toggleTheme() {
    const isDark = document.body.classList.toggle('dark-mode');
    toggleBtn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    if (isDark) {
      toggleBtn.innerText = '☀️'; // Only show the icon
    } else {
      toggleBtn.innerText = '🌙';
    }
    // Save preference
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }

  // Listen for button click
  toggleBtn.addEventListener('click', toggleTheme);

  // Load saved theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    toggleBtn.setAttribute('aria-pressed', 'true');
    toggleBtn.innerText = '☀️';
  }
});
