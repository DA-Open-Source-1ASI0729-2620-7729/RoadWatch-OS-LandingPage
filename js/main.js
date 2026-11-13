const languageSelect = document.getElementById("languageSelect");
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

// Languages
const supportedLanguages = ["en", "es"];
const defaultLanguage = "es";

async function loadTranslations(lang) {
  const language = supportedLanguages.includes(lang) ? lang : defaultLanguage;

  try {
    const response = await fetch(`i18n/${language}.json`);

    if (!response.ok) {
      throw new Error(`Unable to load translations for ${language}`);
    }

    return await response.json();
  } catch (error) {
    console.error("i18n error:", error);

    if (language !== defaultLanguage) {
      try {
        const fallbackResponse = await fetch(`i18n/${defaultLanguage}.json`);
        return await fallbackResponse.json();
      } catch (fallbackError) {
        console.error("i18n fallback error:", fallbackError);
      }
    }

    return {};
  }
}

async function applyLanguage(lang) {
  const language = supportedLanguages.includes(lang) ? lang : defaultLanguage;
  const dictionary = await loadTranslations(language);

  document.documentElement.lang = language;

  if (dictionary["meta.title"]) {
    document.title = dictionary["meta.title"];
  }

  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription && dictionary["meta.description"]) {
    metaDescription.setAttribute("content", dictionary["meta.description"]);
  }

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    if (dictionary[key] !== undefined) {
      element.textContent = dictionary[key];
    }
  });

  document.querySelectorAll("[data-i18n-alt]").forEach((element) => {
    const key = element.dataset.i18nAlt;
    if (dictionary[key] !== undefined) {
      element.alt = dictionary[key];
    }
  });

  document.querySelectorAll("[data-i18n-title]").forEach((element) => {
    const key = element.dataset.i18nTitle;
    if (dictionary[key] !== undefined) {
      element.title = dictionary[key];
    }
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    const key = element.dataset.i18nPlaceholder;
    if (dictionary[key] !== undefined) {
      element.placeholder = dictionary[key];
    }
  });

  try {
    localStorage.setItem("roadwatch-language", language);
  } catch (error) {}
  languageSelect.value = language;
}

let savedLanguage = defaultLanguage;
try {
  savedLanguage = localStorage.getItem("roadwatch-language") || defaultLanguage;
} catch (error) {}
applyLanguage(savedLanguage);

languageSelect.addEventListener("change", (event) => {
  applyLanguage(event.target.value);
});

// mobile menu
function closeMenu() {
  mainNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}

menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

mainNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});


// features
document.querySelectorAll(".feature-accordion-header").forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.closest(".feature-accordion-item");
    const isOpen = item.classList.toggle("open");
    button.setAttribute("aria-expanded", String(isOpen));
  });
});


function getYouTubeId(url) {
  if (!url) return null;

  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtu\.be\/([^?&/]+)/,
    /youtube\.com\/embed\/([^?&/]+)/,
    /youtube\.com\/shorts\/([^?&/]+)/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) return match[1];
  }

  return null;
}

const youtubePlayer = document.getElementById("youtubePlayer");
const videoFrame = document.querySelector(".video-frame");

function loadConfiguredYouTubeVideo() {
  const videoId = getYouTubeId(ROADWATCH_YOUTUBE_URL);

  if (!videoId || videoId === "YOUR_VIDEO_ID") return;

  youtubePlayer.src = `https://www.youtube.com/embed/${videoId}?rel=0`;
  videoFrame.classList.add("has-video");
}

loadConfiguredYouTubeVideo();
