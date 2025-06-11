'use strict';

// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }

// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });

// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {
  testimonialsItem[i].addEventListener("click", function () {
    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
    modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;
    testimonialsModalFunc();
  });
}

// add click event to modal close button
modalCloseBtn.addEventListener("click", testimonialsModalFunc);
overlay.addEventListener("click", testimonialsModalFunc);

// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", function () { elementToggleFunc(this); });

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);
  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {
  for (let i = 0; i < filterItems.length; i++) {
    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }
  }
}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {
  filterBtn[i].addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);
    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;
  });
}

// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {
    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }
  });
}

// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {
    for (let i = 0; i < pages.length; i++) {
      if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }
  });
}

/* ---------------------------
   Add Real Blog Posts Dynamically
---------------------------- */
const blogPostsList = document.querySelector('.blog-posts-list');

// TechCrunch RSS feed URL for technology news
const RSS_FEED_URL = 'https://techcrunch.com/feed/';

const rss2jsonApi = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_FEED_URL)}`;

// Helper: Extract first image src from HTML content
function extractImageFromContent(content) {
  if (!content) return null;
  const imgRegex = /<img[^>]+src=["']([^"']+)["']/i;
  const match = imgRegex.exec(content);
  return match ? match[1] : null;
}

// Helper: Strip HTML tags from text
function stripHtml(html) {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

// Helper: Truncate text to a max length
function truncateText(text, maxLength) {
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
}

async function fetchAndRenderRSS() {
  try {
    const response = await fetch(rss2jsonApi);
    const data = await response.json();

    if (data.status !== 'ok') {
      blogPostsList.innerHTML = '<li>Failed to load blog posts.</li>';
      return;
    }

    blogPostsList.innerHTML = '';

    // Show first 6 posts
    const posts = data.items.slice(0, 6);

    posts.forEach(post => {
      const thumbnail = post.thumbnail
        || extractImageFromContent(post.content)
        || extractImageFromContent(post.description)
        || 'https://via.placeholder.com/400x200?text=No+Image';

      const postDate = new Date(post.pubDate);
      const formattedDate = postDate.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });

      const postItem = `
        <li class="blog-post-item">
          <a href="${post.link}" target="_blank" rel="noopener noreferrer">
            <figure class="blog-banner-box">
              <img src="${thumbnail}" alt="${post.title}" loading="lazy">
            </figure>
            <div class="blog-content">
              <div class="blog-meta">
                <p class="blog-category">TechCrunch</p>
                <span class="dot"></span>
                <time datetime="${postDate.toISOString()}">${formattedDate}</time>
              </div>
              <h3 class="h3 blog-item-title">${post.title}</h3>
              <p class="blog-text">${truncateText(stripHtml(post.description), 100)}</p>
            </div>
          </a>
        </li>
      `;

      blogPostsList.insertAdjacentHTML('beforeend', postItem);
    });

  } catch (error) {
    console.error('Error loading RSS feed:', error);
    blogPostsList.innerHTML = '<li>Failed to load blog posts.</li>';
  }
}

// Call on page load
fetchAndRenderRSS();
