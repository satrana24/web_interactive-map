
const STORAGE_KEY = "northCampBookings";

const houses = [
  {
    id: 1,
    name: "Pine One",
    type: "FOREST CABIN",
    capacity: 2,
    price: 6500,
    description: "Компактный домик среди сосен. Панорамное окно, терраса и всё необходимое для спокойного отдыха вдвоём.",
    features: ["2 ГОСТЯ", "ТЕРРАСА", "ВИД НА ЛЕС"],
    x: 27,
    y: 25,
    icon: "⌂",
    initiallyOccupied: false
  },
  {
    id: 2,
    name: "Pine Two",
    type: "FOREST CABIN",
    capacity: 2,
    price: 7000,
    description: "Уютное пространство с видом на хвойный лес. Подойдёт для короткого уединённого путешествия.",
    features: ["2 ГОСТЯ", "ТЕРРАСА", "ЛЕС"],
    x: 42,
    y: 20,
    icon: "⌂",
    initiallyOccupied: false
  },
  {
    id: 3,
    name: "A-Frame 01",
    type: "A-FRAME HOUSE",
    capacity: 4,
    price: 11000,
    description: "Двухуровневый дом с характерной треугольной архитектурой, большой гостиной и панорамным остеклением.",
    features: ["4 ГОСТЯ", "2 ЭТАЖА", "ПАНОРАМА"],
    x: 57,
    y: 31,
    icon: "△",
    initiallyOccupied: false
  },
  {
    id: 4,
    name: "A-Frame 02",
    type: "A-FRAME HOUSE",
    capacity: 4,
    price: 12000,
    description: "Просторный дом для компании или семьи. Отдельная терраса и панорамный вид на территорию.",
    features: ["4 ГОСТЯ", "ТЕРРАСА", "ПАНОРАМА"],
    x: 76,
    y: 24,
    icon: "△",
    initiallyOccupied: false
  },
  {
    id: 5,
    name: "Lake House",
    type: "WATERFRONT CABIN",
    capacity: 3,
    price: 9500,
    description: "Домик рядом с озером. Здесь можно провести утро на террасе и наблюдать за водой через большое окно.",
    features: ["3 ГОСТЯ", "У ОЗЕРА", "ТЕРРАСА"],
    x: 25,
    y: 64,
    icon: "⌂",
    initiallyOccupied: false
  },
  {
    id: 6,
    name: "Nordic 01",
    type: "DESIGN CABIN",
    capacity: 2,
    price: 8500,
    description: "Минималистичный интерьер, натуральные материалы и мягкий свет. Небольшое пространство для перезагрузки.",
    features: ["2 ГОСТЯ", "ДИЗАЙН", "ЛЕС"],
    x: 45,
    y: 54,
    icon: "⌂",
    initiallyOccupied: false
  },
  {
    id: 7,
    name: "Nordic 02",
    type: "DESIGN CABIN",
    capacity: 3,
    price: 9000,
    description: "Современный домик с отдельной зоной отдыха и видом на лесную часть территории.",
    features: ["3 ГОСТЯ", "ДИЗАЙН", "ТЕРРАСА"],
    x: 64,
    y: 66,
    icon: "⌂",
    initiallyOccupied: false
  },
  {
    id: 8,
    name: "Sky Dome",
    type: "GLASS DOME",
    capacity: 2,
    price: 14500,
    description: "Геокупол с панорамным обзором. Возможность наблюдать за звёздным небом, не выходя из домика.",
    features: ["2 ГОСТЯ", "ГЕОКУПОЛ", "ПАНОРАМА"],
    x: 83,
    y: 76,
    icon: "◉",
    initiallyOccupied: false
  }
];

let bookings = loadBookings();
const demoBookings = createDemoBookings();
let selectedHouseId = null;
let zoom = 1;
let toastTimeout = null;

const mapMarkers = document.querySelector("#map-markers");
const houseList = document.querySelector("#house-list");
const detailPanel = document.querySelector("#detail-panel");
const guestsFilter = document.querySelector("#guests-filter");
const priceFilter = document.querySelector("#price-filter");
const dateCheckInFilter = document.querySelector("#date-check-in");
const dateCheckOutFilter = document.querySelector("#date-check-out");
const priceValue = document.querySelector("#price-value");
const mapResultCount = document.querySelector("#map-result-count");
const catalogCount = document.querySelector("#catalog-count");
const bookingCount = document.querySelector("#booking-count");
const bookingsList = document.querySelector("#bookings-list");
const toast = document.querySelector("#toast");


const houseExtra = {
  1: { area: "28 м²", beds: "Двуспальная кровать", bathroom: "Санузел с душем", amenities: "Терраса, панорамное окно, отопление, чайная станция", rating: "4,9", reviewCount: 18, review: "Очень тихое место. Утром просыпались с видом на сосны, на террасе приятно пить кофе." },
  2: { area: "30 м²", beds: "Двуспальная кровать", bathroom: "Санузел с душем", amenities: "Терраса, вид на хвойный лес, отопление, мини-холодильник", rating: "4,8", reviewCount: 14, review: "Уютный домик для двоих, чисто и спокойно. Особенно понравилось большое окно." },
  3: { area: "54 м²", beds: "Двуспальная кровать + диван-кровать", bathroom: "Санузел с душем", amenities: "Два этажа, гостиная, панорамное остекление, кухня, терраса", rating: "5,0", reviewCount: 21, review: "Просторно, красивый свет и много воздуха. Хороший вариант для поездки с друзьями." },
  4: { area: "58 м²", beds: "Двуспальная кровать + две односпальные", bathroom: "Санузел с душем", amenities: "Два этажа, отдельная терраса, кухня, гостиная, панорамный вид", rating: "4,9", reviewCount: 16, review: "Отдыхали семьёй. Хватило места всем, вечером собирались на террасе." },
  5: { area: "36 м²", beds: "Двуспальная кровать + кресло-кровать", bathroom: "Санузел с душем", amenities: "Вид на озеро, терраса, мини-кухня, отопление", rating: "4,9", reviewCount: 25, review: "Расположение у воды — главное преимущество. Очень красивые рассветы." },
  6: { area: "32 м²", beds: "Двуспальная кровать", bathroom: "Санузел с душем", amenities: "Дизайнерский интерьер, натуральные материалы, мини-кухня", rating: "4,8", reviewCount: 19, review: "Минималистично, но есть всё нужное. Понравились детали интерьера и мягкий свет." },
  7: { area: "38 м²", beds: "Двуспальная кровать + кресло-кровать", bathroom: "Санузел с душем", amenities: "Зона отдыха, терраса, панорамное окно, мини-кухня", rating: "4,7", reviewCount: 12, review: "Комфортный домик, красивый вид на лес. Хорошее место, чтобы сменить обстановку." },
  8: { area: "40 м²", beds: "Двуспальная кровать", bathroom: "Санузел с душем", amenities: "Геокупол, панорамный потолок, климат-контроль, приватная зона", rating: "5,0", reviewCount: 27, review: "Ночью видно звёзды прямо из кровати. Необычный опыт, который запомнится надолго." }
};

const galleryPhotos = [
  "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1000&q=85"
];


function createDemoBookings() {
  const today = new Date();
  const addDays = (days) => {
    const date = new Date(today);
    date.setDate(date.getDate() + days);
    return getLocalDateString(date);
  };

  // Четыре учебные брони. Периоды частично пересекаются между разными домиками.
  const samples = [
    { houseId: 2, start: 1, nights: 3, guests: 2 },
    { houseId: 6, start: 2, nights: 3, guests: 2 },
    { houseId: 5, start: 2, nights: 4, guests: 3 },
    { houseId: 8, start: 8, nights: 2, guests: 2 }
  ];

  return samples.map((sample, index) => {
    const house = houses.find(item => item.id === sample.houseId);
    return {
      id: `NC-DEMO-0${index + 1}`,
      houseId: house.id,
      houseName: house.name,
      guests: sample.guests,
      nights: sample.nights,
      checkIn: addDays(sample.start),
      checkOut: addDays(sample.start + sample.nights),
      total: house.price * sample.nights,
      createdAt: addDays(-index - 1),
      demo: true
    };
  });
}

function getAllBookings() {
  return [...bookings, ...demoBookings];
}

function loadBookings() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    // Новый пользователь начинает с пустого списка бронирований.
    if (!saved) return [];

    const parsed = JSON.parse(saved);

    if (!Array.isArray(parsed)) {
      throw new Error("Некорректный формат данных");
    }

    // Удаляем демонстрационные записи, которые создавались предыдущей версией сайта.
    // Собственные бронирования пользователя сохраняются.
    const validBookings = parsed.filter(item =>
      item &&
      !item.demo &&
      Number.isInteger(item.houseId) &&
      Number.isInteger(item.guests) &&
      Number.isInteger(item.nights) &&
      Number.isFinite(item.total) &&
      typeof item.id === "string" &&
      houses.some(house => house.id === item.houseId)
    );

    if (validBookings.length !== parsed.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(validBookings));
    }

    return validBookings;
  } catch (error) {
    console.error("Ошибка чтения бронирований:", error);
    showToast("Не удалось прочитать сохранённые брони. Проверьте хранилище браузера.");
    return [];
  }
}

function saveBookings() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
    return true;
  } catch (error) {
    console.error("Ошибка сохранения:", error);
    showToast("Не удалось сохранить бронь. Возможно, хранилище браузера недоступно.");
    return false;
  }
}

function getHouseBooking(houseId) {
  return bookings.find(booking => booking.houseId === houseId);
}

function hasBookingConflict(houseId, checkIn, checkOut) {
  if (!checkIn || !checkOut) return false;

  return getAllBookings().some(booking => {
    if (booking.houseId !== houseId) return false;

    // Старые записи без дат считаем занятыми, чтобы не потерять данные пользователя.
    if (!booking.checkIn || !booking.checkOut) return true;

    return checkIn < booking.checkOut && checkOut > booking.checkIn;
  });
}

function isOccupied(house, checkIn = dateCheckInFilter.value, checkOut = dateCheckOutFilter.value) {
  return hasBookingConflict(house.id, checkIn, checkOut);
}

function getHouseStatus(house) {
  if (isOccupied(house)) return "ЗАНЯТ";
  if (selectedHouseId === house.id) return "ВЫБРАН";
  return "СВОБОДЕН";
}

function matchesBasicFilters(house) {
  const minGuests = Number(guestsFilter.value);
  const maxPrice = Number(priceFilter.value);

  return house.capacity >= minGuests && house.price <= maxPrice;
}

function getFilteredHouses() {
  const checkIn = dateCheckInFilter.value;
  const checkOut = dateCheckOutFilter.value;
  const validDates = checkIn && checkOut && checkOut > checkIn;

  return houses.filter(house =>
    matchesBasicFilters(house) &&
    (!validDates || !isOccupied(house, checkIn, checkOut))
  );
}

function formatPrice(value) {
  return new Intl.NumberFormat("ru-RU").format(value) + " ₽";
}


function getLocalDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function calculateNights(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0;

  const start = new Date(`${checkIn}T12:00:00`);
  const end = new Date(`${checkOut}T12:00:00`);

  return Math.round((end - start) / 86400000);
}

function formatDate(dateString) {
  if (!dateString) return "—";

  const [year, month, day] = dateString.split("-");
  return `${day}.${month}.${year}`;
}


function setDefaultSearchDates() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const checkout = new Date(tomorrow);
  checkout.setDate(checkout.getDate() + 2);

  dateCheckInFilter.value = getLocalDateString(tomorrow);
  dateCheckOutFilter.value = getLocalDateString(checkout);
  dateCheckInFilter.min = getLocalDateString(today);
  const minimumCheckout = new Date(tomorrow);
  minimumCheckout.setDate(minimumCheckout.getDate() + 1);
  dateCheckOutFilter.min = getLocalDateString(minimumCheckout);
}


function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");

  clearTimeout(toastTimeout);

  toastTimeout = setTimeout(() => {
    toast.classList.remove("visible");
  }, 3200);
}

function render() {
  const filteredHouses = getFilteredHouses();

  if (
    selectedHouseId !== null &&
    !filteredHouses.some(house => house.id === selectedHouseId)
  ) {
    selectedHouseId = null;
    showToast("Выбранный дом скрыт текущими фильтрами.");
  }

  renderMap(filteredHouses);
  renderHouseList(filteredHouses);
  renderDetails();
  renderBookingCount();
  renderBookings();
  updateFilterLabels();
}


function renderMap(filteredHouses) {
  // На карте показываем и занятые объекты: они остаются серыми маркерами,
  // а фильтр дат влияет только на доступность выбора и каталог.
  const visibleIds = new Set(houses.filter(matchesBasicFilters).map(house => house.id));

  mapMarkers.innerHTML = houses.map(house => {
    const occupied = isOccupied(house);
    const selected = selectedHouseId === house.id;
    const visible = visibleIds.has(house.id);

    const classes = [
      "map-marker",
      occupied ? "occupied" : "",
      house.y <= 30 ? "tooltip-side" : "",
      selected ? "selected" : "",
      !visible ? "filtered-out" : ""
    ].filter(Boolean).join(" ");

    return `
      <button
        class="${classes}"
        style="left: ${house.x}%; top: ${house.y}%"
        data-house-id="${house.id}"
        aria-label="${house.name}. ${getHouseStatus(house)}. ${house.capacity} гостя. ${formatPrice(house.price)} за ночь."
        aria-pressed="${selected}"
        ${occupied ? "disabled" : ""}
        title="${house.name}"
      >
        <span class="marker-number">${String(house.id).padStart(2, "0")}</span>

        <span class="marker-tooltip">
          <span class="tooltip-name">${house.name}</span>
          <span class="tooltip-info">
            <span>Гости: ${house.capacity}</span>
            <span>${occupied ? "ЗАНЯТ" : "СВОБОДЕН"}</span>
          </span>
          <span class="tooltip-price">${formatPrice(house.price)} / ночь</span>
        </span>
      </button>
    `;
  }).join("");

  mapResultCount.textContent =
    `${visibleIds.size.toString().padStart(2, "0")} ОБЪЕКТОВ НА КАРТЕ`;
}


function renderHouseList(filteredHouses) {
  catalogCount.textContent =
    `${filteredHouses.length.toString().padStart(2, "0")} ВАРИАНТОВ`;

  if (filteredHouses.length === 0) {
    houseList.innerHTML = `
      <div class="no-results">
        По выбранным параметрам ничего не найдено.<br>
        Попробуй изменить фильтры.
      </div>
    `;
    return;
  }

  houseList.innerHTML = filteredHouses.map(house => {
    const occupied = isOccupied(house);
    const selected = selectedHouseId === house.id;

    return `
      <button
        class="house-card ${selected ? "selected" : ""}"
        data-house-id="${house.id}"
        aria-pressed="${selected}"
        ${occupied ? "disabled" : ""}
      >
        <span class="house-icon" aria-hidden="true">${house.icon}</span>
        <span class="house-card-info">
          <span class="house-card-title">${house.name}</span>
          <span class="house-card-meta">${house.type} · ${house.capacity} ГОСТЯ</span>
          <span class="house-card-status">${getHouseStatus(house)}</span>
        </span>
        <span class="house-card-price">${formatPrice(house.price)}</span>
      </button>
    `;
  }).join("");
}



function renderHouseCatalog() {
  const catalog = document.querySelector("#house-catalog");
  if (!catalog) return;

  catalog.innerHTML = houses.map(house => {
    const photo = galleryPhotos[(house.id - 1) % galleryPhotos.length];
    return `
      <button class="compact-house-card" type="button" data-open-house="${house.id}">
        <span class="compact-house-photo-wrap">
          <img class="compact-house-photo" src="${photo}" alt="Домик ${house.name}" loading="lazy">
          <span class="compact-house-number">${String(house.id).padStart(2, "0")}</span>
        </span>
        <span class="compact-house-info">
          <span class="compact-house-name">${house.name}</span>
          <span class="compact-house-type">${house.type} · ДО ${house.capacity} ГОСТЕЙ</span>
          <span class="compact-house-price">${formatPrice(house.price)} <small>/ ночь</small></span>
        </span>
        <span class="compact-house-arrow">↗</span>
      </button>
    `;
  }).join("");
}

const houseReviews = {
  1: ["Очень тихое место. Утром просыпались с видом на сосны, на террасе приятно пить кофе.", "Провели выходные вдвоём. В домике тепло, чисто и есть всё необходимое."],
  2: ["Уютный домик для двоих, чисто и спокойно. Особенно понравилось большое окно.", "Отличное место, чтобы отключиться от города. Вокруг только лес и тишина."],
  3: ["Просторно, красивый свет и много воздуха. Хороший вариант для поездки с друзьями.", "Понравилась планировка и панорамные окна. Вечером особенно атмосферно."],
  4: ["Отдыхали семьёй. Хватило места всем, вечером собирались на террасе.", "Удобный дом для небольшой компании: просторно и комфортно."],
  5: ["Расположение у воды — главное преимущество. Очень красивые рассветы.", "Понравилось завтракать на террасе и гулять у озера."],
  6: ["Минималистично, но есть всё нужное. Понравились детали интерьера и мягкий свет.", "Очень приятный интерьер и удобная кровать. Хорошо отдохнули."],
  7: ["Комфортный домик, красивый вид на лес. Хорошее место, чтобы сменить обстановку.", "Тихо, уютно и достаточно места для небольшого путешествия."],
  8: ["Ночью видно звёзды прямо из кровати. Необычный опыт, который запомнится надолго.", "Панорамный купол — невероятное впечатление. Особенно красиво вечером."]
};

function openHouseDetail(houseId) {
  const house = houses.find(item => item.id === houseId);
  if (!house) return;
  renderHouseDetail(house);
  switchPage("houseDetail");
}

function renderHouseDetail(house) {
  const extra = houseExtra[house.id];
  const photoStart = (house.id - 1) % galleryPhotos.length;
  const photos = [0, 1, 2].map(offset => galleryPhotos[(photoStart + offset) % galleryPhotos.length]);
  const reviews = houseReviews[house.id] || [extra.review];
  const occupied = isOccupied(house);
  const target = document.querySelector("#house-detail-content");

  target.innerHTML = `
    <article class="full-house-card detail-house-card">
      <div class="full-house-image-wrap detail-house-image-wrap">
        <img class="full-house-image" id="house-detail-photo" src="${photos[0]}" alt="Домик ${house.name}">
        <span class="full-house-number">OBJECT / ${String(house.id).padStart(2, "0")}</span>
        <div class="detail-photo-controls">
          <button type="button" data-detail-photo="-1" aria-label="Предыдущее фото">‹</button>
          <span id="detail-photo-counter">01 / 03</span>
          <button type="button" data-detail-photo="1" aria-label="Следующее фото">›</button>
        </div>
      </div>
      <div class="full-house-content detail-house-content">
        <div class="full-house-heading">
          <div><span class="detail-type">${house.type}</span><h2>${house.name}</h2></div>
          <div class="full-house-price">${formatPrice(house.price)}<small>/ ночь</small></div>
        </div>
        <p class="full-house-description">${house.description}</p>
        <div class="full-house-facts">
          <div><span>ПЛОЩАДЬ</span><strong>${extra.area}</strong></div>
          <div><span>ВМЕСТИМОСТЬ</span><strong>до ${house.capacity} гостей</strong></div>
          <div><span>СПАЛЬНЫЕ МЕСТА</span><strong>${extra.beds}</strong></div>
          <div><span>САНУЗЕЛ</span><strong>${extra.bathroom}</strong></div>
        </div>
        <div class="full-house-amenities"><span>ОСНАЩЕНИЕ</span><p>${extra.amenities}</p></div>
        <div class="detail-house-booking-row">
          <span class="detail-status ${occupied ? "is-occupied" : ""}">● ${occupied ? "ЗАНЯТ НА ВЫБРАННЫЕ ДАТЫ" : "ДОСТУПЕН ДЛЯ БРОНИРОВАНИЯ"}</span>
          <button class="primary-button full-house-book" type="button" id="detail-book-house" ${occupied ? "disabled" : ""}>${occupied ? "НЕДОСТУПЕН НА ВЫБРАННЫЕ ДАТЫ" : "ВЫБРАТЬ ДАТЫ И ЗАБРОНИРОВАТЬ ↗"}</button>
        </div>
      </div>
    </article>
    <section class="reviews-section">
      <div class="reviews-section-heading"><div><div class="eyebrow">GUEST EXPERIENCE</div><h2>Отзывы гостей</h2></div><div class="reviews-rating">★ ${extra.rating}<small>${extra.reviewCount} отзывов</small></div></div>
      <div class="reviews-slider">
        <button type="button" class="reviews-arrow" data-review-step="-1" aria-label="Предыдущий отзыв">‹</button>
        <div class="review-slide" aria-live="polite"><div class="review-stars">★★★★★</div><p id="detail-review-text">«${reviews[0]}»</p><span id="detail-review-author">ГОСТЬ NØRTH / 01</span></div>
        <button type="button" class="reviews-arrow" data-review-step="1" aria-label="Следующий отзыв">›</button>
      </div>
      <div class="reviews-dots">${reviews.map((_, i) => `<button type="button" class="review-dot ${i === 0 ? "active" : ""}" data-review-index="${i}" aria-label="Отзыв ${i + 1}"></button>`).join("")}</div>
      <p class="reviews-demo-note">Отзывы и оценки представлены для демонстрации интерфейса.</p>
    </section>
  `;

  let photoIndex = 0;
  let reviewIndex = 0;
  const showPhoto = step => {
    photoIndex = (photoIndex + step + photos.length) % photos.length;
    document.querySelector("#house-detail-photo").src = photos[photoIndex];
    document.querySelector("#detail-photo-counter").textContent = `${String(photoIndex + 1).padStart(2, "0")} / 03`;
  };
  const showReview = index => {
    reviewIndex = (index + reviews.length) % reviews.length;
    document.querySelector("#detail-review-text").textContent = `«${reviews[reviewIndex]}»`;
    document.querySelector("#detail-review-author").textContent = `ГОСТЬ NØRTH / ${String(reviewIndex + 1).padStart(2, "0")}`;
    document.querySelectorAll(".review-dot").forEach((dot, i) => dot.classList.toggle("active", i === reviewIndex));
  };
  target.querySelectorAll("[data-detail-photo]").forEach(button => button.addEventListener("click", () => showPhoto(Number(button.dataset.detailPhoto))));
  target.querySelectorAll("[data-review-step]").forEach(button => button.addEventListener("click", () => showReview(reviewIndex + Number(button.dataset.reviewStep))));
  target.querySelectorAll("[data-review-index]").forEach(button => button.addEventListener("click", () => showReview(Number(button.dataset.reviewIndex))));
  document.querySelector("#detail-book-house").addEventListener("click", () => {
    switchPage("explore");
    guestsFilter.value = "1";
    priceFilter.value = "15000";
    selectedHouseId = house.id;
    render();
    if (window.innerWidth <= 760) detailPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
}

function renderDetails() {
  const house = houses.find(item => item.id === selectedHouseId);
  const mapAndDetail = document.querySelector("#map-and-detail");

  if (!house) {
    mapAndDetail.classList.remove("has-selection");
    detailPanel.classList.remove("open");
    detailPanel.innerHTML = "";
    return;
  }

  mapAndDetail.classList.add("has-selection");
  detailPanel.classList.add("open");

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const afterTomorrow = new Date(tomorrow);
  afterTomorrow.setDate(afterTomorrow.getDate() + 2);

  const defaultCheckIn = dateCheckInFilter.value || getLocalDateString(tomorrow);
  const defaultCheckOut = dateCheckOutFilter.value || getLocalDateString(afterTomorrow);

  detailPanel.innerHTML = `
    <div class="detail-heading-row">
      <span class="detail-number">
        OBJECT / ${String(house.id).padStart(2, "0")}
      </span>

      <button
        class="detail-close"
        id="close-detail"
        type="button"
        aria-label="Закрыть карточку"
      >×</button>
    </div>

    <div class="detail-gallery" aria-label="Фотографии домика">
      <div class="gallery-frame">
        <img
          class="gallery-photo"
          id="gallery-photo"
          src="${galleryPhotos[(house.id - 1) % galleryPhotos.length]}"
          alt="Фотография домика ${house.name}"
        >
        <button class="gallery-arrow gallery-prev" type="button" data-gallery-step="-1" aria-label="Предыдущее фото">‹</button>
        <button class="gallery-arrow gallery-next" type="button" data-gallery-step="1" aria-label="Следующее фото">›</button>
        <span class="gallery-counter" id="gallery-counter">01 / 03</span>
      </div>
      <div class="gallery-dots" id="gallery-dots" aria-label="Выбор фотографии">
        <button class="gallery-dot active" type="button" data-gallery-index="0" aria-label="Фото 1"></button>
        <button class="gallery-dot" type="button" data-gallery-index="1" aria-label="Фото 2"></button>
        <button class="gallery-dot" type="button" data-gallery-index="2" aria-label="Фото 3"></button>
      </div>
    </div>

    <div class="detail-top" style="margin-top: 15px">
      <span class="detail-status">● ${isOccupied(house) ? "ЗАНЯТ НА ВЫБРАННЫЕ ДАТЫ" : "СВОБОДЕН"}</span>
    </div>

    <h3 class="detail-title">${house.name}</h3>
    <div class="detail-type">${house.type}</div>

    <p class="detail-description">${house.description}</p>

    <div class="detail-features">
      ${house.features.map(feature =>
        `<span class="feature-tag">${feature}</span>`
      ).join("")}
    </div>

    <div class="detail-price-row">
      <span class="detail-price-label">Стоимость за ночь</span>
      <span class="detail-price">${formatPrice(house.price)}</span>
    </div>

    <a class="house-details-link" href="#house-${house.id}" data-open-house-details="${house.id}">
      ПОДРОБНЕЕ О ДОМИКЕ ↗
    </a>

    <form class="booking-form" id="booking-form" novalidate>
      <h4 class="detail-section-title">Параметры проживания</h4>

      <div class="form-row">
        <div class="form-field">
          <label for="check-in">Заезд</label>
          <input
            type="date"
            id="check-in"
            min="${getLocalDateString(today)}"
            value="${defaultCheckIn}"
            required
          >
          <div class="field-error" id="check-in-error"></div>
        </div>

        <div class="form-field">
          <label for="check-out">Выезд</label>
          <input
            type="date"
            id="check-out"
            min="${(() => { const d = new Date(`${defaultCheckIn}T12:00:00`); d.setDate(d.getDate() + 1); return getLocalDateString(d); })()}"
            value="${defaultCheckOut}"
            required
          >
          <div class="field-error" id="check-out-error"></div>
        </div>
      </div>

      <div class="nights-info">
        <span>Продолжительность</span>
        <strong id="nights-count">2 ночи</strong>
      </div>

      <div class="date-hint">
        Заезд — после 14:00 · Выезд — до 12:00
      </div>

      <div class="form-field" style="margin-top: 17px">
        <label for="booking-guests">Количество гостей</label>
        <input
          type="number"
          id="booking-guests"
          min="1"
          max="${house.capacity}"
          value="2"
          required
        >
        <div class="field-error" id="guests-error"></div>
      </div>

      <div class="total-row">
        <span>Итого за проживание</span>
        <strong class="total-amount" id="total-amount">
          ${formatPrice(house.price * 2)}
        </strong>
      </div>

      <button class="primary-button" type="submit" id="confirm-booking">
        ЗАБРОНИРОВАТЬ ↗
      </button>

      <p class="demo-caption">
        Учебное демо: бронь сохраняется в этом браузере.
        Реальная оплата не производится.
      </p>
    </form>
  `;

  const housePhotoStart = (house.id - 1) % galleryPhotos.length;
  const houseGallery = [0, 1, 2].map(offset =>
    galleryPhotos[(housePhotoStart + offset) % galleryPhotos.length]
  );
  let activeGalleryIndex = 0;
  const galleryImage = document.querySelector("#gallery-photo");
  const galleryCounter = document.querySelector("#gallery-counter");
  const galleryDots = document.querySelector("#gallery-dots");

  function showGalleryPhoto(index) {
    activeGalleryIndex = (index + houseGallery.length) % houseGallery.length;
    galleryImage.src = houseGallery[activeGalleryIndex];
    galleryCounter.textContent = `${String(activeGalleryIndex + 1).padStart(2, "0")} / 03`;
    galleryDots.querySelectorAll(".gallery-dot").forEach((dot, dotIndex) => {
      dot.classList.toggle("active", dotIndex === activeGalleryIndex);
    });
  }

  detailPanel.querySelectorAll("[data-gallery-step]").forEach(button => {
    button.addEventListener("click", () => {
      showGalleryPhoto(activeGalleryIndex + Number(button.dataset.galleryStep));
    });
  });

  galleryDots.addEventListener("click", event => {
    const dot = event.target.closest("[data-gallery-index]");
    if (!dot) return;
    showGalleryPhoto(Number(dot.dataset.galleryIndex));
  });

  const checkInInput = document.querySelector("#check-in");
  const checkOutInput = document.querySelector("#check-out");
  const guestsInput = document.querySelector("#booking-guests");

  document.querySelector("#close-detail").addEventListener("click", () => {
    selectedHouseId = null;
    render();
  });

  checkInInput.addEventListener("change", () => {
    if (!checkInInput.value) return;

    const nextDay = new Date(`${checkInInput.value}T12:00:00`);
    nextDay.setDate(nextDay.getDate() + 1);

    const minimumCheckout = getLocalDateString(nextDay);
    checkOutInput.min = minimumCheckout;

    if (!checkOutInput.value || checkOutInput.value <= checkInInput.value) {
      const newCheckout = new Date(nextDay);
      newCheckout.setDate(newCheckout.getDate() + 1);
      checkOutInput.value = getLocalDateString(newCheckout);
    }

    updateTotal();
  });

  checkOutInput.addEventListener("change", updateTotal);
  guestsInput.addEventListener("input", updateTotal);

  document.querySelector("#booking-form").addEventListener(
    "submit",
    confirmBooking
  );

  updateTotal();
}



function updateTotal() {
  const house = houses.find(item => item.id === selectedHouseId);
  if (!house) return;

  const checkInInput = document.querySelector("#check-in");
  const checkOutInput = document.querySelector("#check-out");
  const guestsInput = document.querySelector("#booking-guests");

  if (!checkInInput || !checkOutInput || !guestsInput) return;

  const checkIn = checkInInput.value;
  const checkOut = checkOutInput.value;
  const guests = Number(guestsInput.value);
  const nights = calculateNights(checkIn, checkOut);

  const totalElement = document.querySelector("#total-amount");
  const nightsElement = document.querySelector("#nights-count");

  const guestsValid =
    Number.isInteger(guests) &&
    guests >= 1 &&
    guests <= house.capacity;

  const datesValid =
    checkIn &&
    checkOut &&
    nights >= 1 &&
    checkIn >= checkInInput.min;

  nightsElement.textContent = nights > 0
    ? `${nights} ${getNightsWord(nights)}`
    : "Не выбрано";

  totalElement.textContent =
    datesValid && nights <= 30 && guestsValid
      ? formatPrice(house.price * nights)
      : "—";

  document.querySelector("#guests-error").textContent =
    guestsInput.value !== "" && !guestsValid
      ? `Допустимо от 1 до ${house.capacity} гостей`
      : "";

  document.querySelector("#check-in-error").textContent =
    checkIn && checkIn < checkInInput.min
      ? "Выбери сегодняшнюю или будущую дату"
      : "";

  document.querySelector("#check-out-error").textContent =
    checkOut && checkIn && nights <= 0
      ? "Выезд должен быть позже заезда"
      : nights > 30
        ? "Максимум 30 ночей"
        : "";
}

function getNightsWord(number) {
  const lastTwo = number % 100;
  const last = number % 10;

  if (lastTwo >= 11 && lastTwo <= 14) return "ночей";
  if (last === 1) return "ночь";
  if (last >= 2 && last <= 4) return "ночи";
  return "ночей";
}



function confirmBooking(event) {
  event.preventDefault();

  const house = houses.find(item => item.id === selectedHouseId);

  if (!house) {
    showToast("Сначала выбери свободный дом.");
    return;
  }

  const requestedCheckIn = document.querySelector("#check-in")?.value;
  const requestedCheckOut = document.querySelector("#check-out")?.value;

  if (hasBookingConflict(house.id, requestedCheckIn, requestedCheckOut)) {
    showToast("На выбранные даты этот дом уже забронирован.");
    render();
    return;
  }

  const checkIn = document.querySelector("#check-in").value;
  const checkOut = document.querySelector("#check-out").value;
  const guests = Number(document.querySelector("#booking-guests").value);
  const nights = calculateNights(checkIn, checkOut);

  updateTotal();

  const guestsValid =
    Number.isInteger(guests) &&
    guests >= 1 &&
    guests <= house.capacity;

  const datesValid =
    checkIn &&
    checkOut &&
    nights >= 1 &&
    nights <= 30 &&
    checkIn >= getLocalDateString(new Date());

  if (!guestsValid || !datesValid) {
    showToast("Проверь даты и количество гостей.");
    return;
  }

  if (hasBookingConflict(house.id, checkIn, checkOut)) {
    showToast("На выбранные даты этот дом уже забронирован.");
    render();
    return;
  }

  const booking = {
    id: "NC-" + Date.now().toString().slice(-7),
    houseId: house.id,
    houseName: house.name,
    guests,
    nights,
    checkIn,
    checkOut,
    total: house.price * nights,
    createdAt: new Date().toLocaleDateString("ru-RU")
  };

  bookings.push(booking);

  if (!saveBookings()) {
    bookings.pop();
    return;
  }

  selectedHouseId = null;
  render();

  showToast(`Бронь ${booking.id} подтверждена.`);
}


function renderBookingCount() {
  bookingCount.textContent = bookings.length;
}

function renderBookings() {
  if (bookings.length === 0) {
    bookingsList.innerHTML = `
      <div class="empty-bookings">
        <h3>Пока здесь пусто</h3>
        <p>Выбери домик на карте и оформи свою первую учебную бронь.</p>
        <button id="go-to-explore">ИССЛЕДОВАТЬ ТЕРРИТОРИЮ ↗</button>
      </div>
    `;

    document.querySelector("#go-to-explore").addEventListener("click", () => {
      switchPage("explore");
    });

    return;
  }

  bookingsList.innerHTML = bookings.map(booking => `
    <article class="booking-card">
      <div class="booking-card-main">
        <span class="house-icon" aria-hidden="true">⌂</span>
        <div>
          <span class="booking-id">${booking.id}</span>
          <h3>${booking.houseName}</h3>
          
<div class="booking-meta">
  ${booking.guests} гост. · ${booking.nights} ${getNightsWord(booking.nights)}
  <br>
  ${booking.checkIn ? `${formatDate(booking.checkIn)} — ${formatDate(booking.checkOut)}` : "Даты не указаны"}
  <br>
  Заказ оформлен: ${booking.demo ? "Демонстрационная бронь" : booking.createdAt}
</div>

        </div>
      </div>

      <div class="booking-card-side">
        <strong class="booking-sum">${formatPrice(booking.total)}</strong>
        <button
          class="cancel-button"
          data-cancel-id="${booking.id}"
        >
          ОТМЕНИТЬ БРОНЬ
        </button>
      </div>
    </article>
  `).join("");
}

function cancelBooking(bookingId) {
  const booking = bookings.find(item => item.id === bookingId);

  if (!booking) return;

  const confirmed = confirm(
    `Отменить бронь ${booking.id} (${booking.houseName})?`
  );

  if (!confirmed) return;

  const previousBookings = [...bookings];
  bookings = bookings.filter(item => item.id !== bookingId);

  if (!saveBookings()) {
    bookings = previousBookings;
    return;
  }

  render();
  showToast(`Бронь ${booking.id} отменена. Домик снова свободен.`);
}

function updateFilterLabels() {
  priceValue.textContent = `до ${formatPrice(Number(priceFilter.value))}`;
}


function selectHouse(houseId) {
  const house = houses.find(item => item.id === houseId);

  if (!house || isOccupied(house)) {
    showToast("Этот объект сейчас занят.");
    return;
  }

  // Повторное нажатие закрывает карточку
  if (selectedHouseId === houseId) {
    selectedHouseId = null;
    render();
    return;
  }

  selectedHouseId = houseId;
  render();

  if (window.innerWidth <= 760) {
    detailPanel.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });
  }
}

mapMarkers.addEventListener("click", event => {
  const button = event.target.closest("[data-house-id]");
  if (!button || button.disabled) return;

  selectHouse(Number(button.dataset.houseId));
});

houseList.addEventListener("click", event => {
  const button = event.target.closest("[data-house-id]");
  if (!button || button.disabled) return;

  selectHouse(Number(button.dataset.houseId));
});


function switchPage(page) {
  const pages = {
    explore: document.querySelector("#explore-page"),
    bookings: document.querySelector("#bookings-page"),
    houses: document.querySelector("#houses-page"),
    houseDetail: document.querySelector("#house-detail-page")
  };

  Object.entries(pages).forEach(([key, element]) => {
    element.classList.toggle("hidden", key !== page);
  });

  document.querySelectorAll(".nav-link").forEach(button => {
    const activePage = page === "houseDetail" ? "houses" : page;
    button.classList.toggle("active", button.dataset.page === activePage);
  });

  if (page === "bookings") renderBookings();
  if (page === "houses") renderHouseCatalog();

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Фильтрация
guestsFilter.addEventListener("change", render);

priceFilter.addEventListener("input", render);

dateCheckInFilter.addEventListener("change", () => {
  if (!dateCheckInFilter.value) return;

  const nextDay = new Date(`${dateCheckInFilter.value}T12:00:00`);
  nextDay.setDate(nextDay.getDate() + 1);
  dateCheckOutFilter.min = getLocalDateString(nextDay);

  if (!dateCheckOutFilter.value || dateCheckOutFilter.value <= dateCheckInFilter.value) {
    dateCheckOutFilter.value = getLocalDateString(nextDay);
  }

  render();
});

dateCheckOutFilter.addEventListener("change", render);

document.querySelector("#reset-filters").addEventListener("click", () => {
  guestsFilter.value = "1";
  priceFilter.value = "15000";
  setDefaultSearchDates();
  selectedHouseId = null;
  render();
  showToast("Фильтры сброшены.");
});

// Навигация
document.querySelectorAll(".nav-link").forEach(button => {
  button.addEventListener("click", () => {
    switchPage(button.dataset.page);
  });
});

// Переход к подробной карточке домика из формы бронирования.
detailPanel.addEventListener("click", event => {
  const link = event.target.closest("[data-open-house-details]");
  if (!link) return;
  event.preventDefault();
  const houseId = Number(link.dataset.openHouseDetails);
  openHouseDetail(houseId);
});

// Переход из карточки домика к оформлению брони.
document.querySelector("#house-catalog").addEventListener("click", event => {
  const card = event.target.closest("[data-open-house]");
  if (!card) return;
  openHouseDetail(Number(card.dataset.openHouse));
});

document.querySelector("#back-to-catalog").addEventListener("click", () => switchPage("houses"));

// Отмена бронирования
bookingsList.addEventListener("click", event => {
  const button = event.target.closest("[data-cancel-id]");
  if (!button) return;

  cancelBooking(button.dataset.cancelId);
});

// Масштабирование и перемещение карты
let panX = 0;
let panY = 0;
let dragStartX = 0;
let dragStartY = 0;
let startPanX = 0;
let startPanY = 0;
let isDraggingMap = false;
let suppressMapClick = false;

const mapViewport = document.querySelector("#map-viewport");
const mapCanvas = document.querySelector("#map-canvas");

function clampMapPosition() {
  const width = mapViewport.clientWidth;
  const height = mapViewport.clientHeight;
  // Холст на 40% больше окна карты: по краям есть дополнительная территория.
  // Ограничения не дают сдвинуть его настолько, чтобы открыть пустое пространство.
  const scaledWidth = width * 1.4 * zoom;
  const scaledHeight = height * 1.4 * zoom;
  const minX = width / 2 - scaledWidth / 2;
  const maxX = -minX;
  const minY = height / 2 - scaledHeight / 2;
  const maxY = -minY;

  panX = Math.min(maxX, Math.max(minX, panX));
  panY = Math.min(maxY, Math.max(minY, panY));
}

function updateZoom() {
  clampMapPosition();
  mapCanvas.style.transform = `translate(${panX}px, ${panY}px) scale(${zoom})`;
}

mapViewport.addEventListener("pointerdown", event => {
  if (event.target.closest(".map-marker")) return;

  isDraggingMap = true;
  suppressMapClick = false;
  dragStartX = event.clientX;
  dragStartY = event.clientY;
  startPanX = panX;
  startPanY = panY;
  mapViewport.classList.add("is-dragging");
  mapViewport.setPointerCapture(event.pointerId);
});

mapViewport.addEventListener("pointermove", event => {
  if (!isDraggingMap) return;

  const dx = event.clientX - dragStartX;
  const dy = event.clientY - dragStartY;

  if (Math.abs(dx) + Math.abs(dy) > 4) suppressMapClick = true;

  panX = startPanX + dx;
  panY = startPanY + dy;
  updateZoom();
});

function stopMapDrag(event) {
  if (!isDraggingMap) return;
  isDraggingMap = false;
  mapViewport.classList.remove("is-dragging");

  if (mapViewport.hasPointerCapture(event.pointerId)) {
    mapViewport.releasePointerCapture(event.pointerId);
  }
}

mapViewport.addEventListener("pointerup", stopMapDrag);
mapViewport.addEventListener("pointercancel", stopMapDrag);
window.addEventListener("resize", updateZoom);

mapMarkers.addEventListener("click", event => {
  if (suppressMapClick) {
    suppressMapClick = false;
    event.preventDefault();
    return;
  }
}, true);

document.querySelector("#zoom-in").addEventListener("click", () => {
  zoom = Math.min(zoom + 0.15, 1.6);
  updateZoom();
});

document.querySelector("#zoom-out").addEventListener("click", () => {
  zoom = Math.max(zoom - 0.15, 1);
  updateZoom();
});

// Сброс демо через консоль браузера:
// window.resetNorthCampDemo()
window.resetNorthCampDemo = function () {
  const confirmed = confirm(
    "Удалить все учебные бронирования и вернуть исходное состояние демо?"
  );

  if (!confirmed) return;

  const previousBookings = [...bookings];
  bookings = [];

  if (!saveBookings()) {
    bookings = previousBookings;
    return;
  }

  selectedHouseId = null;
  render();
  showToast("Все учебные бронирования удалены.");
};

// Первичная отрисовка
setDefaultSearchDates();
render();
renderHouseCatalog();
