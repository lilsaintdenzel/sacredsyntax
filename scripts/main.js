import { writings } from "./data.js";

const writingsGrid = document.querySelector(".writings-grid");
const pageNumber = document.getElementById("pageNumber");
const progressCircle = document.getElementById("progressCircle");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");
const pagination = document.querySelector(".pagination");
const writingsCount = document.getElementById("writingsCount");

let cards = [];
let currentPage = 0;
let isSearchActive = false;

const radius = 20;
const circumference = 2 * Math.PI * radius;

function createCard(writing) {
  const card = document.createElement("a");
  card.className = "writing-card";
  card.href = writing.href;
  card.dataset.page = writing.page;
  card.innerHTML = `
    <div class="card-scripture">${writing.scripture}</div>
    <h2 class="card-title">${writing.title}</h2>
    <h3 class="card-subtitle">${writing.subtitle}</h3>
    <div class="divider"></div>
    <p class="card-excerpt">
      ${writing.excerpt}
    </p>
    <span class="card-link">Read more →</span>
  `;

  return card;
}

function renderCards() {
  writingsGrid.innerHTML = "";
  writings.forEach((writing, index) => {
    const card = createCard(writing);
    if (index !== 0) {
      card.classList.add("hidden");
    }
    writingsGrid.appendChild(card);
  });

  cards = Array.from(document.querySelectorAll(".writing-card"));
}

function showPage(pageNum) {
  if (isSearchActive) return;

  cards.forEach(card => card.classList.add("hidden"));

  const card = document.querySelector(`[data-page="${pageNum}"]`);
  if (card) card.classList.remove("hidden");

  const progress = (pageNum + 1) / writings.length;
  progressCircle.style.strokeDashoffset = circumference - progress * circumference;

  pageNumber.textContent = pageNum + 1;
  prevBtn.disabled = pageNum === 0;
  nextBtn.disabled = pageNum === writings.length - 1;

  currentPage = pageNum;
}

function performSearch(query) {
  const normalizedQuery = query.toLowerCase().trim();

  if (!normalizedQuery) {
    isSearchActive = false;
    searchResults.textContent = "";
    pagination.style.display = "flex";
    showPage(0);
    return;
  }

  isSearchActive = true;
  pagination.style.display = "none";
  cards.forEach(card => card.classList.add("hidden"));

  const matches = writings.filter(writing => {
    const normalizedFields = [
      writing.title,
      writing.subtitle,
      writing.scripture,
      writing.excerpt
    ].map(field => field.toLowerCase());

    const keywordMatch = writing.keywords.some(keyword =>
      keyword.toLowerCase().includes(normalizedQuery)
    );

    return (
      normalizedFields.some(field => field.includes(normalizedQuery)) ||
      keywordMatch
    );
  });

  if (matches.length === 0) {
    searchResults.textContent = "No writings found.";
    return;
  }

  searchResults.textContent = `Found ${matches.length} writing${
    matches.length > 1 ? "s" : ""
  }`;

  matches.forEach(match => {
    const card = document.querySelector(`[data-page="${match.page}"]`);
    if (card) card.classList.remove("hidden");
  });
}

function initialize() {
  progressCircle.style.strokeDasharray = circumference;
  progressCircle.style.strokeDashoffset = circumference;
  writingsCount.textContent = writings.length;

  renderCards();
  showPage(0);
}

searchInput.addEventListener("input", event => {
  performSearch(event.target.value);
});

prevBtn.addEventListener("click", () => {
  if (currentPage > 0) {
    showPage(currentPage - 1);
  }
});

nextBtn.addEventListener("click", () => {
  if (currentPage < writings.length - 1) {
    showPage(currentPage + 1);
  }
});

initialize();
