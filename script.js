const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const primaryNavigation = document.querySelector(".primary-nav");
const searchForm = document.querySelector("#property-search");
const propertyCards = [...document.querySelectorAll(".property")];
const resultsMessage = document.querySelector("#results-message");
const emptyResults = document.querySelector("#empty-results");
const clearSearchButton = document.querySelector("#clear-search");
const intentSelect = document.querySelector("#intent");
const priceSelect = document.querySelector("#price");
const priceLabel = priceSelect ? priceSelect.closest(".field")?.querySelector("span") : null;
const buyPriceOptions = [
  ["", "No maximum"],
  ["500000", "£500,000"],
  ["750000", "£750,000"],
  ["1000000", "£1,000,000"],
];
const rentPriceOptions = [
  ["", "No maximum"],
  ["1500", "£1,500 / month"],
  ["2500", "£2,500 / month"],
  ["3500", "£3,500 / month"],
];

function updatePriceOptions(intent) {
  if (!priceSelect || !priceLabel) return;

  const options = intent === "rent" ? rentPriceOptions : buyPriceOptions;
  const previousValue = priceSelect.value;
  priceSelect.replaceChildren(
    ...options.map(([value, label]) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = label;
      return option;
    }),
  );
  if (options.some(([value]) => value === previousValue)) priceSelect.value = previousValue;
  priceLabel.textContent = intent === "rent" ? "Max monthly rent" : "Max price";
}

if (intentSelect) {
  intentSelect.addEventListener("change", () => updatePriceOptions(intentSelect.value));
}

function currentSearchCriteria() {
  if (!searchForm) {
    return { location: "", intent: "", type: "", price: "", bedrooms: "" };
  }

  const formData = new FormData(searchForm);
  return {
    location: formData.get("location"),
    intent: formData.get("intent"),
    type: formData.get("type"),
    price: formData.get("price"),
    bedrooms: formData.get("bedrooms"),
  };
}

function updateHeader() {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 24);
}

if (header) {
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
}

if (menuToggle && primaryNavigation) {
  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isExpanded));
    menuToggle.setAttribute("aria-label", isExpanded ? "Open navigation" : "Close navigation");
    primaryNavigation.classList.toggle("is-open", !isExpanded);
  });

  primaryNavigation.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (!link || !primaryNavigation.classList.contains("is-open")) return;
    primaryNavigation.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
  });
}

if (searchForm && resultsMessage && emptyResults && clearSearchButton && propertyCards.length) {
  function filterProperties({ location = "", intent = "", type = "", price = "", bedrooms = "" } = {}) {
    const normalizeLocation = (value) => value.toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
    const normalizedLocation = normalizeLocation(location);
    let visibleCount = 0;

    propertyCards.forEach((card) => {
      const propertyLocation = normalizeLocation(
        `${card.dataset.location} ${card.querySelector(".property-place").textContent}`,
      );
      const matches =
        (!normalizedLocation || propertyLocation.includes(normalizedLocation)) &&
        (!intent || card.dataset.intent === intent) &&
        (!type || card.dataset.type === type) &&
        (!price || Number(card.dataset.price) <= Number(price)) &&
        (!bedrooms || Number(card.dataset.beds) >= Number(bedrooms));
      card.hidden = !matches;
      if (matches) visibleCount += 1;
    });

    emptyResults.hidden = visibleCount > 0;
    resultsMessage.textContent = visibleCount
      ? `${visibleCount} ${visibleCount === 1 ? "property" : "properties"} to explore`
      : "";
  }

  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    filterProperties(currentSearchCriteria());
    document.querySelector("#properties").scrollIntoView({ behavior: "smooth" });
  });

  clearSearchButton.addEventListener("click", () => {
    searchForm.reset();
    updatePriceOptions(intentSelect.value);
    filterProperties();
    document.querySelector("#featured-title").focus({ preventScroll: true });
  });

  document.querySelectorAll("[data-search-intent]").forEach((link) => {
    link.addEventListener("click", () => {
      intentSelect.value = link.dataset.searchIntent;
      updatePriceOptions(intentSelect.value);
      filterProperties(currentSearchCriteria());
    });
  });

  document.querySelectorAll("[data-category]").forEach((link) => {
    link.addEventListener("click", () => {
      const category = link.dataset.category;
      document.querySelector("#property-type").value = category;
      filterProperties(currentSearchCriteria());
    });
  });

  document.querySelectorAll("[data-location]").forEach((link) => {
    link.addEventListener("click", () => {
      const location = link.dataset.location;
      document.querySelector("#location").value = location;
      filterProperties(currentSearchCriteria());
    });
  });

  const viewAllButton = document.querySelector("#view-all");
  if (viewAllButton) {
    viewAllButton.addEventListener("click", () => {
      searchForm.reset();
      updatePriceOptions(intentSelect.value);
      filterProperties();
    });
  }
}

const yearElement = document.querySelector("#year");
if (yearElement) yearElement.textContent = new Date().getFullYear();

const propertyData = [
  {
    id: "cedar-house",
    title: "The Cedar House",
    status: "sale",
    type: "House",
    location: "Richmond",
    neighbourhood: "Richmond, Surrey",
    price: 895000,
    bedrooms: 4,
    bathrooms: 3,
    area: 2450,
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=82",
    gallery: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=82",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=82",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=82",
    ],
    description:
      "A quietly confident family home designed for generous everyday living, framed by mature planting and a sunny garden terrace.",
    summary:
      "Set in a leafy residential lane with a calm, light-filled layout and impeccable finishing throughout.",
    features: ["Detached home", "Open-plan kitchen and dining", "Garden terrace", "Two-car driveway", "Smart climate control"],
    createdAt: 2024,
  },
  {
    id: "the-edit",
    title: "The Edit",
    status: "sale",
    type: "Apartment",
    location: "Chelsea",
    neighbourhood: "Chelsea, London",
    price: 485000,
    bedrooms: 2,
    bathrooms: 2,
    area: 1180,
    image:
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=1100&q=82",
    gallery: [
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=1100&q=82",
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=82",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=82",
    ],
    description:
      "An elegant apartment with warm timber detailing, crisp architecture, and a handsome city-facing living room designed for slow evenings.",
    summary:
      "Perfect for city living with excellent transport links and a refined, easy-to-live-in layout.",
    features: ["Private balcony", "Concierge access", "Contemporary kitchen", "City views", "High-spec finishes"],
    createdAt: 2023,
  },
  {
    id: "the-workshop",
    title: "The Workshop",
    status: "rent",
    type: "Townhouse",
    location: "Bristol",
    neighbourhood: "Clifton, Bristol",
    price: 3250,
    bedrooms: 3,
    bathrooms: 2,
    area: 1600,
    image:
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1100&q=82",
    gallery: [
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1100&q=82",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=82",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=82",
    ],
    description:
      "An attractive townhouse with layered living spaces, generous daylight, and a tactile palette that feels instantly welcoming.",
    summary:
      "A refined rental in one of Bristol’s most desirable enclaves, balancing character with contemporary ease.",
    features: ["Period façade", "Garden patio", "Wood-burning stove", "Two reception rooms", "Off-street parking"],
    createdAt: 2025,
  },
  {
    id: "ashcombe-villa",
    title: "Ashcombe Villa",
    status: "sale",
    type: "Villa",
    location: "Surbiton",
    neighbourhood: "Surbiton, London",
    price: 1425000,
    bedrooms: 5,
    bathrooms: 4,
    area: 3120,
    image:
      "https://images.unsplash.com/photo-1576941089067-2de3c901e126?auto=format&fit=crop&w=1400&q=82",
    gallery: [
      "https://images.unsplash.com/photo-1576941089067-2de3c901e126?auto=format&fit=crop&w=1400&q=82",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=82",
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=82",
    ],
    description:
      "A striking countryside-inspired villa with sculptural interiors, uninterrupted views, and added flexibility for entertaining or working from home.",
    summary:
      "Designed for ease and abundance, with indoor-outdoor living that feels tailored to the surrounding landscape.",
    features: ["Private garden", "Cinema room", "Guest suite", "Double-height reception", "Gym"],
    createdAt: 2024,
  },
  {
    id: "harbour-loft",
    title: "Harbour Loft",
    status: "rent",
    type: "Apartment",
    location: "Battersea",
    neighbourhood: "Battersea, London",
    price: 2900,
    bedrooms: 2,
    bathrooms: 2,
    area: 1040,
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=82",
    gallery: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=82",
      "https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=1200&q=82",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=82",
    ],
    description:
      "A polished loft apartment focusing on clean lines, light, and effortless urban living with excellent river views.",
    summary:
      "An elegantly paced home that feels relaxed and modern while staying close to the city’s energy.",
    features: ["Riverside outlook", "Integrated appliances", "Roof terrace", "Concierge", "EV charging"],
    createdAt: 2025,
  },
  {
    id: "oakley-garden",
    title: "Oakley Garden",
    status: "sale",
    type: "House",
    location: "Kensington",
    neighbourhood: "Kensington, London",
    price: 1650000,
    bedrooms: 4,
    bathrooms: 3,
    area: 2680,
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=82",
    gallery: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=82",
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=82",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=82",
    ],
    description:
      "A gracious period home in a prime position, elevated through considered renovation and warm contemporary detailing.",
    summary:
      "Combining a classic address with an intuitive everyday layout and quiet sophistication.",
    features: ["Private garden", "Original fireplaces", "Airy reception rooms", "Home office", "High ceilings"],
    createdAt: 2022,
  },
  {
    id: "meadow-court",
    title: "Meadow Court",
    status: "rent",
    type: "House",
    location: "Chiswick",
    neighbourhood: "Chiswick, London",
    price: 4200,
    bedrooms: 4,
    bathrooms: 3,
    area: 2100,
    image:
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1400&q=82",
    gallery: [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1400&q=82",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=82",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=82",
    ],
    description:
      "A family-ready home with a light-filled plan, a lovely back garden, and room to grow across multiple living spaces.",
    summary:
      "A warm and practical rental that feels settled from the moment you walk in.",
    features: ["Garden room", "Family kitchen", "Two reception rooms", "Garage", "Underfloor heating"],
    createdAt: 2024,
  },
  {
    id: "rosewater-penthouse",
    title: "Rosewater Penthouse",
    status: "sale",
    type: "Penthouse",
    location: "Canary Wharf",
    neighbourhood: "Canary Wharf, London",
    price: 1180000,
    bedrooms: 3,
    bathrooms: 2,
    area: 1760,
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=82",
    gallery: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=82",
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=82",
      "https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=1200&q=82",
    ],
    description:
      "A showpiece penthouse with sweeping skyline views, a terrace for long evenings, and a beautifully layered interior.",
    summary:
      "A premium city base combining volume, light, and a strong sense of place.",
    features: ["Wraparound terrace", "Panoramic skyline views", "Lift access", "Lounge dining space", "Guest bathroom"],
    createdAt: 2023,
  },
  {
    id: "westfield-house",
    title: "Westfield House",
    status: "rent",
    type: "House",
    location: "Notting Hill",
    neighbourhood: "Notting Hill, London",
    price: 5100,
    bedrooms: 3,
    bathrooms: 2,
    area: 1920,
    image:
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1400&q=82",
    gallery: [
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1400&q=82",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=82",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=82",
    ],
    description:
      "A characterful residence with a generous living room, calm interior palette, and a leafy outlook in a very desirable pocket of the city.",
    summary:
      "A balanced, beautifully finished rental that offers space, neighbourhood charm, and convenience.",
    features: ["Family dining room", "Garden", "Utility room", "Bay windows", "Storage"],
    createdAt: 2025,
  },
];

const propertyDetailExtras = {
  "cedar-house": {
    parking: 2,
    mapImage:
      "https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=1400&q=82",
    locationSummary:
      "Set in a leafy Surrey pocket known for excellent schools, quiet residential roads, and quick routes into central London.",
    agent: {
      name: "Olivia Hart",
      role: "Senior property consultant",
      phone: "020 7946 0280",
      email: "olivia@havenestate.co.uk",
      photo:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=700&q=82",
    },
    recommended: ["ashcombe-villa", "harbour-loft", "oakley-garden"],
  },
  "the-edit": {
    parking: 1,
    mapImage:
      "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1400&q=82",
    locationSummary:
      "A prime Chelsea address with strong walkability, design-led dining, and excellent transport links across the capital.",
    agent: {
      name: "Maya Foster",
      role: "London sales advisor",
      phone: "020 7946 0378",
      email: "maya@havenestate.co.uk",
      photo:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=700&q=82",
    },
    recommended: ["cedar-house", "rosewater-penthouse", "oakley-garden"],
  },
  "the-workshop": {
    parking: 2,
    mapImage:
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1400&q=82",
    locationSummary:
      "Clifton offers a balance of period charm, riverside walks, and a thriving cultural scene with quick access to the city core.",
    agent: {
      name: "Lucas Greene",
      role: "Lettings specialist",
      phone: "020 7946 0123",
      email: "lucas@havenestate.co.uk",
      photo:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=82",
    },
    recommended: ["meadow-court", "harbour-loft", "westfield-house"],
  },
  "ashcombe-villa": {
    parking: 3,
    mapImage:
      "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1400&q=82",
    locationSummary:
      "A rare balance of lifestyle and convenience, with green spaces, excellent schools, and easy connections to London.",
    agent: {
      name: "Amelia Reed",
      role: "Private client adviser",
      phone: "020 7946 0431",
      email: "amelia@havenestate.co.uk",
      photo:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=700&q=82",
    },
    recommended: ["cedar-house", "oakley-garden", "rosewater-penthouse"],
  },
  "harbour-loft": {
    parking: 1,
    mapImage:
      "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1400&q=82",
    locationSummary:
      "Battersea delivers a strong mix of modern living, riverside amenity, and efficient access through the city and beyond.",
    agent: {
      name: "Nina Blake",
      role: "Rental advisor",
      phone: "020 7946 0510",
      email: "nina@havenestate.co.uk",
      photo:
        "https://images.unsplash.com/photo-1546961329-78bef0414d7c?auto=format&fit=crop&w=700&q=82",
    },
    recommended: ["the-workshop", "westfield-house", "the-edit"],
  },
  "oakley-garden": {
    parking: 2,
    mapImage:
      "https://images.unsplash.com/photo-1505761671935-60b3a7427c93?auto=format&fit=crop&w=1400&q=82",
    locationSummary:
      "Kensington brings together cultural life, refined neighbourhoods, and superb access to transport and central London.",
    agent: {
      name: "Eleanor Woods",
      role: "Prime London specialist",
      phone: "020 7946 0654",
      email: "eleanor@havenestate.co.uk",
      photo:
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=700&q=82",
    },
    recommended: ["cedar-house", "ashcombe-villa", "rosewater-penthouse"],
  },
  "meadow-court": {
    parking: 2,
    mapImage:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1400&q=82",
    locationSummary:
      "Chiswick blends leafy residential streets with an energetic local high street, good schooling and easy commutes westward.",
    agent: {
      name: "Henry Cole",
      role: "Family property advisor",
      phone: "020 7946 0763",
      email: "henry@havenestate.co.uk",
      photo:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=700&q=82",
    },
    recommended: ["the-workshop", "westfield-house", "cedar-house"],
  },
  "rosewater-penthouse": {
    parking: 1,
    mapImage:
      "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1400&q=82",
    locationSummary:
      "A fast-moving financial district with exceptional amenities, skyline views and easy access to the wider capital.",
    agent: {
      name: "Stella Quinn",
      role: "Luxury sales lead",
      phone: "020 7946 0842",
      email: "stella@havenestate.co.uk",
      photo:
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=700&q=82",
    },
    recommended: ["the-edit", "oakley-garden", "ashcombe-villa"],
  },
  "westfield-house": {
    parking: 2,
    mapImage:
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1400&q=82",
    locationSummary:
      "Notting Hill offers distinctive character, lively neighbourhood appeal, and some of London’s most sought-after street life.",
    agent: {
      name: "Rosa Bell",
      role: "Residential lettings consultant",
      phone: "020 7946 0948",
      email: "rosa@havenestate.co.uk",
      photo:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=700&q=82",
    },
    recommended: ["the-workshop", "harbour-loft", "meadow-court"],
  },
};

const propertyPageState = {
  status: "sale",
  location: "",
  type: "",
  price: "",
  bedrooms: "",
  bathrooms: "",
  sort: "newest",
  page: 1,
  pageSize: 6,
};

function formatCurrency(value) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value);
}

function normalizeText(value = "") {
  return value.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

function updateStatusButtons(activeStatus) {
  document.querySelectorAll("[data-status]").forEach((button) => {
    const isActive = button.dataset.status === activeStatus;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function updatePriceSelectOptions() {
  const priceSelect = document.querySelector("#filter-price");
  const priceLabel = document.querySelector("#filter-price-label");
  if (!priceSelect || !priceLabel) return;

  const currentValue = priceSelect.value;
  const options =
    propertyPageState.status === "rent"
      ? [
          ["", "No maximum"],
          ["1500", "£1,500 / month"],
          ["2500", "£2,500 / month"],
          ["3500", "£3,500 / month"],
          ["5000", "£5,000 / month"],
        ]
      : [
          ["", "No maximum"],
          ["500000", "£500,000"],
          ["750000", "£750,000"],
          ["1000000", "£1,000,000"],
          ["1500000", "£1,500,000"],
        ];

  priceSelect.innerHTML = options
    .map(([value, label]) => `<option value="${value}">${label}</option>`)
    .join("");

  if (options.some(([value]) => value === currentValue)) {
    priceSelect.value = currentValue;
  } else {
    priceSelect.value = "";
  }

  priceLabel.textContent = propertyPageState.status === "rent" ? "Max monthly rent" : "Max price";
}

function getCurrentFilters() {
  const locationInput = document.querySelector("#filter-location");
  const typeSelect = document.querySelector("#filter-type");
  const priceSelect = document.querySelector("#filter-price");
  const bedroomsSelect = document.querySelector("#filter-bedrooms");
  const bathroomsSelect = document.querySelector("#filter-bathrooms");

  return {
    status: propertyPageState.status,
    location: locationInput ? locationInput.value.trim() : "",
    type: typeSelect ? typeSelect.value : "",
    price: priceSelect ? priceSelect.value : "",
    bedrooms: bedroomsSelect ? bedroomsSelect.value : "",
    bathrooms: bathroomsSelect ? bathroomsSelect.value : "",
  };
}

function getVisibleProperties() {
  const filters = getCurrentFilters();
  const normalizedLocation = normalizeText(filters.location);

  const matches = propertyData.filter((property) => {
    const locationMatches =
      !normalizedLocation ||
      normalizeText(`${property.location} ${property.neighbourhood}`).includes(normalizedLocation);
    const typeMatches = !filters.type || property.type === filters.type;
    const priceMatches = !filters.price || property.price <= Number(filters.price);
    const bedroomsMatches = !filters.bedrooms || property.bedrooms >= Number(filters.bedrooms);
    const bathroomsMatches = !filters.bathrooms || property.bathrooms >= Number(filters.bathrooms);
    const statusMatches = property.status === filters.status;

    return (
      statusMatches &&
      locationMatches &&
      typeMatches &&
      priceMatches &&
      bedroomsMatches &&
      bathroomsMatches
    );
  });

  const sorted = [...matches].sort((a, b) => {
    if (propertyPageState.sort === "price-low") return a.price - b.price;
    if (propertyPageState.sort === "price-high") return b.price - a.price;
    return b.createdAt - a.createdAt;
  });

  return sorted;
}

function renderProperties() {
  const grid = document.querySelector("#properties-grid");
  const resultsCount = document.querySelector("#results-count");
  const emptyState = document.querySelector("#empty-state");
  const loadMoreButton = document.querySelector("#load-more-button");

  if (!grid || !resultsCount) return;

  const filteredProperties = getVisibleProperties();
  const visibleProperties = filteredProperties.slice(0, propertyPageState.page * propertyPageState.pageSize);

  resultsCount.textContent = `${filteredProperties.length} ${filteredProperties.length === 1 ? "property" : "properties"} found`;

  if (!filteredProperties.length) {
    grid.innerHTML = "";
    emptyState.hidden = false;
    loadMoreButton.hidden = true;
    return;
  }

  emptyState.hidden = true;
  grid.innerHTML = visibleProperties
    .map(
      (property) => `
        <article class="property-card" aria-label="${property.title} property card">
          <a class="property-card__link" href="property-details.html?id=${property.id}">
            <div class="property-card__image-wrap">
              <img src="${property.image}" alt="${property.title} home exterior and interior" loading="lazy" />
              <span class="property-card__badge">${property.status === "sale" ? "For Sale" : "For Rent"}</span>
              <span class="property-card__price">${property.status === "sale" ? formatCurrency(property.price) : `${formatCurrency(property.price)}/month`}</span>
            </div>
            <div class="property-card__content">
              <div class="property-card__row">
                <span class="property-card__location">${property.neighbourhood}</span>
                <span class="property-card__type">${property.type}</span>
              </div>
              <h3>${property.title}</h3>
              <p class="property-card__meta">
                ${property.bedrooms} bed <span aria-hidden="true">•</span> ${property.bathrooms} bath <span aria-hidden="true">•</span> ${property.area.toLocaleString()} sq ft
              </p>
              <div class="property-card__footer">
                <span>View details</span>
                <span aria-hidden="true">↗</span>
              </div>
            </div>
          </a>
        </article>
      `,
    )
    .join("");

  loadMoreButton.hidden = visibleProperties.length >= filteredProperties.length;
}

function resetFilters() {
  const form = document.querySelector("#property-search-form");
  if (form) form.reset();

  propertyPageState.status = "sale";
  propertyPageState.location = "";
  propertyPageState.type = "";
  propertyPageState.price = "";
  propertyPageState.bedrooms = "";
  propertyPageState.bathrooms = "";
  propertyPageState.sort = "newest";
  propertyPageState.page = 1;

  updateStatusButtons(propertyPageState.status);
  updatePriceSelectOptions();

  const sortSelect = document.querySelector("#sort-select");
  if (sortSelect) sortSelect.value = propertyPageState.sort;

  renderProperties();
}

function initializePropertyPage() {
  const form = document.querySelector("#property-search-form");
  const sortSelect = document.querySelector("#sort-select");
  const clearButton = document.querySelector("#clear-search-button");
  const emptyStateReset = document.querySelector("#empty-state-reset");
  const loadMoreButton = document.querySelector("#load-more-button");

  if (!form) return;

  updateStatusButtons(propertyPageState.status);
  updatePriceSelectOptions();

  document.querySelectorAll("[data-status]").forEach((button) => {
    button.addEventListener("click", () => {
      propertyPageState.status = button.dataset.status;
      propertyPageState.page = 1;
      updateStatusButtons(propertyPageState.status);
      updatePriceSelectOptions();
      renderProperties();
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    propertyPageState.page = 1;
    const filters = getCurrentFilters();
    propertyPageState.location = filters.location;
    propertyPageState.type = filters.type;
    propertyPageState.price = filters.price;
    propertyPageState.bedrooms = filters.bedrooms;
    propertyPageState.bathrooms = filters.bathrooms;
    renderProperties();
  });

  if (sortSelect) {
    sortSelect.addEventListener("change", (event) => {
      propertyPageState.sort = event.target.value;
      propertyPageState.page = 1;
      renderProperties();
    });
  }

  if (clearButton) clearButton.addEventListener("click", resetFilters);
  if (emptyStateReset) emptyStateReset.addEventListener("click", resetFilters);

  if (loadMoreButton) {
    loadMoreButton.addEventListener("click", () => {
      propertyPageState.page += 1;
      renderProperties();
    });
  }

  const queryParams = new URLSearchParams(window.location.search);
  const statusFromUrl = queryParams.get("status");
  if (statusFromUrl === "rent" || statusFromUrl === "sale") {
    propertyPageState.status = statusFromUrl;
    updateStatusButtons(propertyPageState.status);
  }

  if (queryParams.get("location")) {
    const locationInput = document.querySelector("#filter-location");
    if (locationInput) locationInput.value = queryParams.get("location");
  }

  if (queryParams.get("type")) {
    const typeSelect = document.querySelector("#filter-type");
    if (typeSelect) typeSelect.value = queryParams.get("type");
  }

  if (queryParams.get("price")) {
    const priceSelect = document.querySelector("#filter-price");
    if (priceSelect) priceSelect.value = queryParams.get("price");
  }

  if (queryParams.get("bedrooms")) {
    const bedroomsSelect = document.querySelector("#filter-bedrooms");
    if (bedroomsSelect) bedroomsSelect.value = queryParams.get("bedrooms");
  }

  if (queryParams.get("bathrooms")) {
    const bathroomsSelect = document.querySelector("#filter-bathrooms");
    if (bathroomsSelect) bathroomsSelect.value = queryParams.get("bathrooms");
  }

  updatePriceSelectOptions();
  renderProperties();
}

function getPropertyDetail(propertyId) {
  const property = propertyData.find((item) => item.id === propertyId) || propertyData[0];
  const extras = propertyDetailExtras[property.id] || {};
  return {
    ...property,
    parking: extras.parking ?? 1,
    mapImage: extras.mapImage || property.image,
    locationSummary: extras.locationSummary || property.summary,
    agent: extras.agent || {
      name: "Haven Estate Team",
      role: "Property consultant",
      phone: "020 7946 0280",
      email: "hello@havenestate.co.uk",
      photo:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=700&q=82",
    },
    recommended: (extras.recommended || []).map((id) => propertyData.find((item) => item.id === id)).filter(Boolean),
  };
}

function validateField(field) {
  const value = field.value.trim();
  if (!field.required || value) return true;
  field.focus();
  return false;
}

function validateEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function setFormMessage(form, message, isError = false) {
  const status = form.querySelector(".form-status");
  if (!status) return;
  status.textContent = message;
  status.classList.toggle("is-error", isError);
}

function bindFormValidation(property) {
  document.querySelectorAll(".enquiry-form, .viewing-form").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = form.querySelector("[name='name']");
      const email = form.querySelector("[name='email']");
      const phone = form.querySelector("[name='phone']");
      const message = form.querySelector("[name='message']");
      const date = form.querySelector("[name='date']");
      const time = form.querySelector("[name='time']");

      const emailValue = email ? email.value.trim() : "";
      const phoneValue = phone ? phone.value.trim() : "";
      const messageValue = message ? message.value.trim() : "";
      const dateValue = date ? date.value.trim() : "";

      if (!name || !validateField(name)) {
        setFormMessage(form, "Please enter your name.", true);
        return;
      }

      if (!email || !validateField(email) || !validateEmail(emailValue)) {
        setFormMessage(form, "Please enter a valid email address.", true);
        if (email) email.focus();
        return;
      }

      if (phone && phoneValue && !/^\+?[\d\s()-]{7,}$/.test(phoneValue)) {
        setFormMessage(form, "Please enter a valid phone number.", true);
        phone.focus();
        return;
      }

      if (message && !validateField(message)) {
        setFormMessage(form, "Please include a short enquiry message.", true);
        return;
      }

      if (date && !validateField(date)) {
        setFormMessage(form, "Please choose a preferred viewing date.", true);
        return;
      }

      if (time && !validateField(time)) {
        setFormMessage(form, "Please choose a viewing time.", true);
        return;
      }

      const requestType = date ? "Viewing request" : "Property enquiry";
      const requestDetails = [
        `Property: ${property.title}`,
        `Name: ${name.value.trim()}`,
        `Email: ${emailValue}`,
        phoneValue ? `Phone: ${phoneValue}` : "",
        messageValue ? `Enquiry: ${messageValue}` : "",
        dateValue ? `Preferred date: ${dateValue}` : "",
        time?.value ? `Preferred time: ${time.value}` : "",
      ].filter(Boolean);
      const subject = `${requestType}: ${property.title}`;
      const mailto = `mailto:${property.agent.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(requestDetails.join("\n"))}`;

      setFormMessage(form, "Your request is ready. Open the email draft to send it to our advisor.", false);
      const emailDraftLink = document.createElement("a");
      emailDraftLink.href = mailto;
      emailDraftLink.textContent = "Open email draft";
      form.querySelector(".form-status")?.append(" ", emailDraftLink);
    });
  });
}

function renderPropertyDetails() {
  const detailContainer = document.querySelector("#property-detail");
  const emptyState = document.querySelector("#details-empty");
  if (!detailContainer) return;

  const params = new URLSearchParams(window.location.search);
  const propertyId = params.get("id");
  const property = getPropertyDetail(propertyId);

  if (!property) {
    detailContainer.innerHTML = "";
    if (emptyState) emptyState.hidden = false;
    return;
  }

  if (emptyState) emptyState.hidden = true;

  const priceText = property.status === "sale" ? formatCurrency(property.price) : `${formatCurrency(property.price)}/month`;
  const statusLabel = property.status === "sale" ? "For Sale" : "For Rent";
  const priceLabel = property.status === "sale" ? "Guide price" : "Monthly rent";

  detailContainer.innerHTML = `
    <section class="details-jumbo">
      <nav class="details-breadcrumb" aria-label="Breadcrumb">
        <a href="index.html">Home</a>
        <span aria-hidden="true">/</span>
        <a href="properties.html">Properties</a>
        <span aria-hidden="true">/</span>
        <span>${property.location}</span>
        <span aria-hidden="true">/</span>
        <span>${property.title}</span>
      </nav>

      <div class="details-header-row">
        <div class="details-header-copy">
          <p class="eyebrow"><span></span> ${statusLabel}</p>
          <h1>${property.title}</h1>
          <div class="details-header-meta">
            <span>${property.neighbourhood}</span>
            <span>${property.type}</span>
            <span>${property.bedrooms} bed</span>
            <span>${property.bathrooms} bath</span>
          </div>
        </div>
        <div class="details-price-box" aria-label="Property price">
          <span>${priceLabel}</span>
          <strong>${priceText}</strong>
        </div>
      </div>

      <div class="details-gallery-panel">
        <div class="details-gallery__main">
          <img id="details-main-image" src="${property.gallery[0]}" alt="${property.title} main view" />
        </div>
        <div class="details-gallery__thumbs" aria-label="Property image thumbnails">
          ${property.gallery
            .map(
              (image, index) => `
                <button type="button" class="details-gallery__thumb ${index === 0 ? "is-active" : ""}" data-index="${index}" aria-label="Show image ${index + 1}" aria-pressed="${index === 0}">
                  <img src="${image}" alt="${property.title} thumbnail ${index + 1}" loading="lazy" />
                </button>
              `,
            )
            .join("")}
        </div>
      </div>
    </section>

    <section class="details-shell">
      <div class="details-layout">
        <article class="details-primary">
          <div class="details-overview">
            <div class="overview-stat">
              <span>Bedrooms</span>
              <strong>${property.bedrooms}</strong>
            </div>
            <div class="overview-stat">
              <span>Bathrooms</span>
              <strong>${property.bathrooms}</strong>
            </div>
            <div class="overview-stat">
              <span>Parking</span>
              <strong>${property.parking}</strong>
            </div>
            <div class="overview-stat">
              <span>Floor area</span>
              <strong>${property.area.toLocaleString()} sq ft</strong>
            </div>
          </div>

          <div class="detail-copy">
            <p class="eyebrow"><span></span> Property description</p>
            <h2>Thoughtful living, beautifully considered.</h2>
            <p>${property.description}</p>
            <p>${property.summary}</p>
          </div>

          <div class="detail-features">
            <p class="eyebrow"><span></span> Features & amenities</p>
            <ul>
              ${property.features.map((feature) => `<li>${feature}</li>`).join("")}
            </ul>
          </div>

          <div class="detail-location">
            <p class="eyebrow"><span></span> Location</p>
            <div class="detail-location__layout">
              <div>
                <h3>${property.location}</h3>
                <p>${property.locationSummary}</p>
              </div>
              <div class="detail-location__map-wrap">
                <img src="${property.mapImage}" alt="${property.location} area overview" loading="lazy" />
              </div>
            </div>
          </div>

          <div class="detail-agent">
            <p class="eyebrow"><span></span> Meet your advisor</p>
            <div class="agent-card">
              <img src="${property.agent.photo}" alt="${property.agent.name} portrait" loading="lazy" />
              <div>
                <h3>${property.agent.name}</h3>
                <p>${property.agent.role}</p>
                <div class="agent-contact">
                  <a href="mailto:${property.agent.email}">${property.agent.email}</a>
                  <a href="tel:${property.agent.phone.replace(/\s+/g, "")}">${property.agent.phone}</a>
                </div>
              </div>
            </div>
          </div>

          <div class="detail-viewing">
            <div class="viewing-header">
              <div>
                <p class="eyebrow"><span></span> Schedule a viewing</p>
                <h3>Book a private visit</h3>
              </div>
              <a class="text-link" href="mailto:${property.agent.email}?subject=Viewing%20request%20for%20${encodeURIComponent(property.title)}">Arrange now <span aria-hidden="true">↗</span></a>
            </div>

            <form class="viewing-form" novalidate>
              <div class="form-row">
                <label class="form-field">
                  <span>Full name</span>
                  <input name="name" type="text" required placeholder="Your name" />
                </label>
                <label class="form-field">
                  <span>Email address</span>
                  <input name="email" type="email" required placeholder="you@example.com" />
                </label>
              </div>
              <div class="form-row">
                <label class="form-field">
                  <span>Preferred date</span>
                  <input name="date" type="date" required />
                </label>
                <label class="form-field">
                  <span>Preferred time</span>
                  <select name="time" required>
                    <option value="">Select a time</option>
                    <option value="09:00">09:00</option>
                    <option value="11:30">11:30</option>
                    <option value="14:00">14:00</option>
                    <option value="16:30">16:30</option>
                  </select>
                </label>
              </div>
              <button class="button button-dark" type="submit">Book a viewing <span aria-hidden="true">↗</span></button>
              <p class="form-status" aria-live="polite"></p>
            </form>
          </div>

          <div class="detail-similar">
            <div class="similar-header">
              <div>
                <p class="eyebrow"><span></span> Similar homes</p>
                <h3>Recommended for you</h3>
              </div>
              <a class="text-link" href="properties.html">Browse all <span aria-hidden="true">↗</span></a>
            </div>
            <div class="similar-grid">
              ${property.recommended
                .map(
                  (similar) => `
                    <article class="similar-card">
                      <a href="property-details.html?id=${similar.id}">
                        <img src="${similar.image}" alt="${similar.title}" loading="lazy" />
                        <div class="similar-card__content">
                          <span>${similar.neighbourhood}</span>
                          <h4>${similar.title}</h4>
                          <strong>${similar.status === "sale" ? formatCurrency(similar.price) : `${formatCurrency(similar.price)}/month`}</strong>
                        </div>
                      </a>
                    </article>
                  `,
                )
                .join("")}
            </div>
          </div>
        </article>

        <aside class="details-aside">
          <div class="details-sticky-panel">
            <div class="details-contact-card">
              <div class="contact-card__top">
                <span class="eyebrow"><span></span> ${statusLabel}</span>
                <strong>${priceText}</strong>
              </div>
              <p class="contact-card__location">${property.neighbourhood}</p>
              <form class="enquiry-form" novalidate>
                <label class="form-field">
                  <span>Full name</span>
                  <input name="name" type="text" required placeholder="Your name" />
                </label>
                <label class="form-field">
                  <span>Email address</span>
                  <input name="email" type="email" required placeholder="you@example.com" />
                </label>
                <label class="form-field">
                  <span>Phone number</span>
                  <input name="phone" type="tel" placeholder="+44 20 7946 0280" />
                </label>
                <label class="form-field">
                  <span>Enquiry</span>
                  <textarea name="message" rows="4" required placeholder="Tell us what you would like to know..."></textarea>
                </label>
                <button class="button button-dark" type="submit">Request details <span aria-hidden="true">↗</span></button>
                <p class="form-status" aria-live="polite"></p>
              </form>
              <div class="contact-card__actions">
                <a href="mailto:${property.agent.email}?subject=Viewing%20request%20for%20${encodeURIComponent(property.title)}">Email agent</a>
                <a href="tel:${property.agent.phone.replace(/\s+/g, "")}">Call agent</a>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  `;

  const mainImageEl = document.querySelector("#details-main-image");
  const thumbButtons = document.querySelectorAll(".details-gallery__thumb");
  thumbButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const nextIndex = Number(button.dataset.index);
      if (mainImageEl) {
        mainImageEl.src = property.gallery[nextIndex];
        mainImageEl.alt = `${property.title} view ${nextIndex + 1}`;
      }
      thumbButtons.forEach((item) => {
        const isActive = item === button;
        item.classList.toggle("is-active", isActive);
        item.setAttribute("aria-pressed", String(isActive));
      });
    });
  });

  bindFormValidation(property);
}

if (document.body.dataset.page === "properties") {
  initializePropertyPage();
}

if (document.body.dataset.page === "property-details") {
  renderPropertyDetails();
}

const revealPage = document.querySelector(".about-page, .services-page, .contact-page");
const revealElements = revealPage ? revealPage.querySelectorAll("[data-reveal]") : [];

if (
  revealPage &&
  revealElements.length &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  revealPage.classList.add("scroll-reveal-ready");
  let revealObserver;
  let revealFallback;

  const revealAll = () => {
    revealElements.forEach((element) => element.classList.add("is-revealed"));
    revealObserver?.disconnect();
    window.clearTimeout(revealFallback);
  };

  if ("IntersectionObserver" in window) {
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-revealed");
          revealObserver.unobserve(entry.target);
        });
        if ([...revealElements].every((element) => element.classList.contains("is-revealed"))) {
          window.clearTimeout(revealFallback);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -35px 0px" },
    );

    revealElements.forEach((element) => revealObserver.observe(element));
    revealFallback = window.setTimeout(revealAll, 3000);
  } else {
    revealAll();
  }
}

const servicesPage = document.querySelector(".services-page");
const serviceIndexLinks = servicesPage
  ? [...servicesPage.querySelectorAll(".services-index a[href^='#']")]
  : [];

if (servicesPage && serviceIndexLinks.length && "IntersectionObserver" in window) {
  const serviceSections = serviceIndexLinks
    .map((link) => servicesPage.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const updateActiveService = () => {
    const activationLine = window.innerHeight * 0.3;
    const currentSection = serviceSections.reduce((current, section) => {
      const bounds = section.getBoundingClientRect();
      return bounds.top <= activationLine && bounds.bottom > activationLine ? section : current;
    }, null);

    serviceIndexLinks.forEach((link) => {
      const isCurrent = currentSection && link.getAttribute("href") === `#${currentSection.id}`;
      link.classList.toggle("is-active", Boolean(isCurrent));
      if (isCurrent) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  };

  window.addEventListener("scroll", updateActiveService, { passive: true });
  window.addEventListener("resize", updateActiveService);
  updateActiveService();
}

const contactForm = document.querySelector(".contact-form");

if (contactForm) {
  const contactFields = {
    name: contactForm.querySelector("[name='name']"),
    email: contactForm.querySelector("[name='email']"),
    phone: contactForm.querySelector("[name='phone']"),
    enquiryType: contactForm.querySelector("[name='enquiryType']"),
    message: contactForm.querySelector("[name='message']"),
  };

  const setContactFieldError = (field, message) => {
    const error = contactForm.querySelector(`[data-error="${field.name}"]`);
    field.setAttribute("aria-invalid", String(Boolean(message)));
    if (error) error.textContent = message;
  };

  const getContactFieldError = (field) => {
    const value = field.value.trim();
    if (field.required && !value) {
      if (field.name === "name") return "Please enter your full name.";
      if (field.name === "email") return "Please enter your email address.";
      if (field.name === "enquiryType") return "Please choose an enquiry type.";
      if (field.name === "message") return "Please tell us briefly how we can help.";
    }
    if (field.type === "email" && value && !validateEmail(value)) {
      return "Please enter a valid email address.";
    }
    if (field.name === "phone" && value && !/^\+?[\d\s()-]{7,}$/.test(value)) {
      return "Please enter a valid phone number or leave this field blank.";
    }
    return "";
  };

  contactForm.querySelectorAll("input, select, textarea").forEach((field) => {
    field.setAttribute("aria-invalid", "false");
    const updateFieldState = () => {
      if (field.getAttribute("aria-invalid") === "true" || field.value.trim()) {
        setContactFieldError(field, getContactFieldError(field));
      }

      const status = contactForm.querySelector(".form-status");
      if (status?.classList.contains("is-success")) {
        status.classList.remove("is-success");
        setFormMessage(contactForm, "");
      } else if (
        status?.classList.contains("is-error") &&
        !contactForm.querySelector('[aria-invalid="true"]')
      ) {
        setFormMessage(contactForm, "");
      }
    };

    field.addEventListener("input", updateFieldState);
    field.addEventListener("change", updateFieldState);
  });

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const fieldsToValidate = [
      contactFields.name,
      contactFields.email,
      contactFields.phone,
      contactFields.enquiryType,
      contactFields.message,
    ];
    const invalidFields = fieldsToValidate.filter((field) => {
      const error = getContactFieldError(field);
      setContactFieldError(field, error);
      return Boolean(error);
    });

    const status = contactForm.querySelector(".form-status");
    status?.classList.remove("is-success");
    if (invalidFields.length) {
      setFormMessage(contactForm, "Please review the highlighted fields.", true);
      invalidFields[0].focus();
      return;
    }

    status?.classList.remove("is-error");
    status?.classList.add("is-success");
    setFormMessage(
      contactForm,
      "Validation passed. This demo did not send or store your enquiry.",
    );
  });
}
