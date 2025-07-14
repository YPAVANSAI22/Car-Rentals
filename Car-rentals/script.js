// ============  GLOBAL CAR DATA  ============
const cars = [
  {
    id: 1,
    name: "Toyota Camry",
    price: 10000,
    fuel: "Petrol",
    seats: 5,
    img: "assets/car1.jpg",
  },
  {
    id: 2,
    name: "BMW X5",
    price: 15000,
    fuel: "Diesel",
    seats: 7,
    img: "assets/car2.jpg",
  },
  {
    id: 3,
    name: "Mercedes Benz",
    price: 20000,
    fuel: "Petrol",
    seats: 5,
    img: "assets/car3.jpg",
  },
  {
    id: 4,
    name: "Hyundai Creta",
    price: 6500,
    fuel: "Diesel",
    seats: 5,
    img: "assets/car4.jpg",
  },
  {
    id: 5,
    name: "Baleno",
    price: 5000,
    fuel: "Petrol",
    seats: 5,
    img: "assets/car5.jpg",
  },
  {
    id: 6,
    name: "Hyundai i20",
    price: 6000,
    fuel: "Petrol",
    seats: 5,
    img: "assets/car6.jpg",
  },
  {
    id: 7,
    name: "Maruti Suzuki Swift",
    price: 4500,
    fuel: "Petrol",
    seats: 5,
    img: "assets/car7.jpg",
  },
  {
    id: 8,
    name: "Toyota Fortuner",
    price: 9000,
    fuel: "Diesel",
    seats: 7,
    img: "assets/car8.jpg",
  },
  {
    id: 9,
    name: "Hyundai Venue",
    price: 6000,
    fuel: "Petrol",
    seats: 5,
    img: "assets/car9.jpg",
  },
  {
    id: 10,
    name: "Toyota Innova",
    price: 8000,
    fuel: "Diesel",
    seats: 7,
    img: "assets/car10.jpg",
  },
];

// ============  LOCAL STORAGE HELPERS  ============
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}
function getSelectedCar() {
  return JSON.parse(localStorage.getItem("selectedCar"));
}
function saveSelectedCar(car) {
  localStorage.setItem("selectedCar", JSON.stringify(car));
}

// ============  RENDER CAR LISTS  ============
function renderCarCards(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = cars
    .map(
      (car) => `
    <div class="car tilt" data-tilt data-tilt-glare>
      <img src="${car.img}" alt="${car.name}">
      <h3>${car.name}</h3>
      <p class="price-tag">₹${car.price.toLocaleString()}/day</p>
      <a class="btn" onclick="viewDetails(${car.id})">View Details</a>
    </div>`
    )
    .join("");
}

// ============  VIEW DETAILS  ============
function viewDetails(id) {
  const car = cars.find((c) => c.id === id);
  saveSelectedCar(car);
  window.location.href = "car-details.html";
}

function loadCarDetails() {
  const car = getSelectedCar();
  if (!car) return;

  const box = document.getElementById("car-details-box");
  if (!box) return;

  box.innerHTML = `
    <img src="${car.img}" alt="${car.name}">
    <h2>${car.name}</h2>
    <p class="price-tag">₹${car.price.toLocaleString()}/day</p>
    <p><strong>Fuel:</strong> ${car.fuel}</p>
    <p><strong>Seats:</strong> ${car.seats}</p>
    <button class="btn" onclick="addToCart(${car.id})">Add to Cart</button>
  `;
}

// ============  CART  ============
function addToCart(id) {
  const cart = getCart();
  const car = cars.find((c) => c.id === id);

  if (cart.some((item) => item.id === id)) {
    alert(`${car.name} is already in the cart.`);
    return;
  }

  cart.push(car);
  saveCart(cart);
  updateCartCount();
  alert(`${car.name} added to cart!`);
}

function removeFromCart(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  renderCartPage();
}

function checkout() {
  const cart = getCart();
  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  const names = cart.map((c) => c.name).join(", ");
  alert(`Thanks for booking: ${names}\nTotal: ₹${total.toLocaleString()}`);
  saveCart([]);
  renderCartPage();
  updateCartCount();
}

function updateCartCount() {
  const countSpan = document.getElementById("cart-count");
  if (countSpan) countSpan.innerText = getCart().length;
}

// ============  CART PANEL (floating)  ============
function toggleCart() {
  document.getElementById("cart-panel").classList.toggle("open");
  renderCartPanel();
}

function renderCartPanel() {
  const itemsContainer = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");
  const cart = getCart();
  if (!itemsContainer || !totalEl) return;

  itemsContainer.innerHTML = cart
    .map(
      (item, idx) => `
    <div class="cart-item">
      <strong>${item.name}</strong><br>
      ₹${item.price.toLocaleString()}/day
      <button class="cart-remove" onclick="removeFromCart(${idx})">Remove</button>
    </div>`
    )
    .join("");

  const total = cart.reduce((s, i) => s + i.price, 0);
  totalEl.innerText = `Total: ₹${total.toLocaleString()}/day`;
}

// ============  CART PAGE (cart.html)  ============
function renderCartPage() {
  const cartList = document.getElementById("cart-page-list");
  const cartTotal = document.getElementById("cart-page-total");
  if (!cartList || !cartTotal) return;

  const cart = getCart();
  if (cart.length === 0) {
    cartList.innerHTML = "<p>Your cart is empty.</p>";
    cartTotal.innerText = "";
    return;
  }

  cartList.innerHTML = cart
    .map(
      (c, idx) => `
    <div class="cart-item">
      <strong>${c.name}</strong><br>
      ₹${c.price.toLocaleString()}/day
      <button class="cart-remove" onclick="removeFromCart(${idx})">Remove</button>
    </div>`
    )
    .join("");

  const total = cart.reduce((t, c) => t + c.price, 0);
  cartTotal.innerHTML = `<h3>Total: ₹${total.toLocaleString()}/day</h3>
                         <button class="checkout" onclick="checkout()">Checkout</button>`;
}

// ============  ON LOAD HANDLERS  ============
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  /* Initialize Vanilla‑Tilt where '.tilt' exists */
  if (typeof VanillaTilt !== "undefined") {
    VanillaTilt.init(document.querySelectorAll(".tilt"), {
      max: 12,
      speed: 400,
      glare: true,
      "max-glare": 0.3,
    });
  }
});
