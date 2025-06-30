// NASA APOD API base URL
const NASA_API_URL = 'https://api.nasa.gov/planetary/apod';
// Use your personal NASA API key
const NASA_API_KEY = 'mBandegG3TUDgjZadNQV4vtuCuOBvaP76hzYxiLC';

// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);

// Find the button and gallery
const getImagesBtn = document.querySelector('.filters button');
const gallery = document.getElementById('gallery');

// Listen for button click
getImagesBtn.addEventListener('click', async () => {
  // Get the selected dates
  const startDate = startInput.value;
  const endDate = endInput.value;

  // Show loading message
  gallery.innerHTML = '<p style="font-size:1.2rem;text-align:center;color:#1a237e;">Loading your Journey . . . .</p>';

  // Build the API URL with query parameters
  const url = `${NASA_API_URL}?api_key=${NASA_API_KEY}&start_date=${startDate}&end_date=${endDate}`;

  try {
    // Fetch data from NASA APOD API
    const response = await fetch(url);
    const data = await response.json();

    // Check for errors
    if (data.error) {
      gallery.innerHTML = `<p>Error: ${data.error.message}</p>`;
      return;
    }

    // If only one image is returned, put it in an array
    const images = Array.isArray(data) ? data : [data];

    // Filter out non-image media (e.g., videos)
    const imageItems = images.filter(item => item.media_type === 'image');

    // If no images, show a message
    if (imageItems.length === 0) {
      gallery.innerHTML = '<p>No images found for this date range.</p>';
      return;
    }

    // Create cards for each image
    gallery.innerHTML = '';
    imageItems.forEach(item => {
      // Create a card div
      const card = document.createElement('div');
      card.className = 'gallery-item';

      // Create image element
      const img = document.createElement('img');
      img.src = item.url;
      img.alt = item.title;

      // Create title and date
      const title = document.createElement('p');
      title.innerHTML = `<strong>${item.title}</strong> <br><span>${item.date}</span>`;

      // Add image and title to card
      card.appendChild(img);
      card.appendChild(title);

      // Add click event to open modal
      card.addEventListener('click', () => openModal(item));
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') openModal(item);
      });
      card.tabIndex = 0;
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `View details for ${item.title}`);

      // Add card to gallery
      gallery.appendChild(card);
    });
  } catch (error) {
    // Show error message
    gallery.innerHTML = `<p>Error fetching images. Please try again later.</p>`;
  }
});

// Scroll to the date selectors when the hero button is clicked
const startExploringBtn = document.getElementById('startExploringBtn');
if (startExploringBtn) {
  startExploringBtn.addEventListener('click', () => {
    // Scroll smoothly to the filters section
    const filters = document.querySelector('.filters');
    if (filters) {
      filters.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
}

// Modal HTML structure (hidden by default)
const modalHtml = `
  <div id="imageModal" class="modal" style="display:none;">
    <div class="modal-content">
      <span class="modal-close" tabindex="0" aria-label="Close modal">&times;</span>
      <img id="modalImg" src="" alt="Large NASA image" />
      <h3 id="modalTitle"></h3>
      <p id="modalDate"></p>
      <p id="modalExplanation"></p>
    </div>
  </div>
`;
document.body.insertAdjacentHTML('beforeend', modalHtml);

// Modal element references
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImg');
const modalTitle = document.getElementById('modalTitle');
const modalDate = document.getElementById('modalDate');
const modalExplanation = document.getElementById('modalExplanation');
const modalClose = document.querySelector('.modal-close');

// Function to open modal with image data
function openModal(item) {
  modalImg.src = item.hdurl || item.url;
  modalImg.alt = item.title;
  modalTitle.textContent = item.title;
  modalDate.textContent = item.date;
  modalExplanation.textContent = item.explanation;
  modal.style.display = 'flex';
  modalClose.focus();
}

// Function to close modal
function closeModal() {
  modal.style.display = 'none';
  modalImg.src = '';
}

// Close modal on click or Escape key
modalClose.addEventListener('click', closeModal);
modalClose.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') closeModal();
});
window.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});
modal.addEventListener('click', e => {
  if (e.target === modal) closeModal();
});

// Fun NASA/space facts array
const spaceFacts = [
  "Did you know? A day on Venus is longer than a year on Venus!",
  "Did you know? Neutron stars can spin at a rate of 600 rotations per second!",
  "Did you know? The footprints on the Moon will be there for millions of years.",
  "Did you know? Jupiter is so big that over 1,300 Earths could fit inside it!",
  "Did you know? The Sun makes up 99.8% of the mass in our solar system.",
  "Did you know? There are more stars in the universe than grains of sand on Earth.",
  "Did you know? Saturn could float in water because it’s mostly made of gas.",
  "Did you know? Space is completely silent—there’s no air to carry sound.",
  "Did you know? The hottest planet in our solar system is Venus, not Mercury!",
  "Did you know? The Milky Way galaxy will collide with Andromeda in about 4 billion years."
];

// Pick a random fact
const randomFact = spaceFacts[Math.floor(Math.random() * spaceFacts.length)];

// Insert the fact below the Start Exploring button in the hero section
const heroContent = document.querySelector('.hero-content');
if (heroContent) {
  const factDiv = document.createElement('div');
  factDiv.className = 'space-fact';
  factDiv.setAttribute('aria-live', 'polite');
  heroContent.appendChild(factDiv);

  // Typing effect for the fun fact
  let i = 0;
  function typeFact() {
    if (i <= randomFact.length) {
      factDiv.innerHTML = `<span class="typed">${randomFact.slice(0, i)}</span><span class="typed-cursor">|</span>`;
      i++;
      setTimeout(typeFact, 28);
    } else {
      factDiv.innerHTML = `<span class="typed">${randomFact}</span>`;
    }
  }
  typeFact();
}
