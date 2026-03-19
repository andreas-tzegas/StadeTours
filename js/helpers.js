// ============================================================
//  helpers.js – Shared utilities
// ============================================================

function getParam(key) {
  return new URLSearchParams(window.location.search).get(key);
}

function formatPrice(n) {
  return new Intl.NumberFormat("en-EU", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
}

function formatDate(str) {
  if (!str) return "—";
  return new Date(str).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function activityIcon(a) {
  const map = { stadium: "⚽", museum: "🏛️", restaurant: "🍽️", "city-tour": "🗺️" };
  return map[a] || "📍";
}

function activityLabel(a) {
  const map = { stadium: "Stade", museum: "Musée", restaurant: "Restauration", "city-tour": "Visite Guidée" };
  return map[a] || a;
}

function stars(n) {
  return "★".repeat(n) + "☆".repeat(5 - n);
}

function animateIn(selector, delay = 0) {
  const els = typeof selector === "string" ? document.querySelectorAll(selector) : [selector];
  els.forEach((el, i) => {
    el.style.opacity = 0;
    el.style.transform = "translateY(28px)";
    el.style.transition = `opacity 0.55s ease ${(i * 0.08) + delay}s, transform 0.55s ease ${(i * 0.08) + delay}s`;
    requestAnimationFrame(() => {
      el.style.opacity = 1;
      el.style.transform = "translateY(0)";
    });
  });
}

// Lazy intersection observer for card animations
function observeCards(selector) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(selector).forEach(el => observer.observe(el));
}

function circuitCardHTML(c, extraClass = "") {
  const activitiesHTML = c.activities
    .map(a => `<span class="tag">${activityIcon(a)} ${activityLabel(a)}</span>`)
    .join("");
  const tagHTML = c.tag ? `<div class="card-badge">${c.tag}</div>` : "";
  return `
    <div class="circuit-card fade-up ${extraClass}" data-id="${c.id}">
      <a href="circuit.html?id=${c.id}" class="card-img-wrap">
        ${tagHTML}
        <img src="${c.image}" alt="${c.title}" loading="lazy">
        <div class="card-overlay">
          <span class="card-city">${c.city}</span>
        </div>
      </a>
      <div class="card-body">
        <div class="card-meta">
          <span class="card-duration">⏱ ${c.duration} jour${c.duration>1?"s":""}</span>
          <span class="card-rating">★ ${c.rating} <em>(${c.reviews})</em></span>
        </div>
        <h3 class="card-title">${c.title}</h3>
        <div class="card-tags">${activitiesHTML}</div>
        <div class="card-footer">
          <div class="card-price">à partir de <strong>${formatPrice(c.price)}</strong> <span>/pers.</span></div>
          <a href="circuit.html?id=${c.id}" class="btn btn-sm">Voir les Détails</a>
        </div>
      </div>
    </div>`;
}

function countryCardHTML(co) {
  return `
    <a href="circuits.html?country=${co.id}" class="country-card fade-up">
      <img src="${co.image}" alt="${co.name}" loading="lazy">
      <div class="country-card-overlay">
        <div>
          <span class="country-flag">${co.flag}</span>
          <h3>${co.name}</h3>
          <p>${co.tagline}</p>
          <small>${co.circuits} circuits disponibles</small>
        </div>
      </div>
    </a>`;
}
