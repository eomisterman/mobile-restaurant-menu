import { menuArray } from "./data.js";
import uuid4 from "https://cdn.jsdelivr.net/gh/tracker1/node-uuid4/browser.mjs";

const menuDetails = document.getElementById("menu");
const orderSection = document.getElementById("order-section");
const totalPrice = document.getElementById("total-price");
const paymentModal = document.getElementById("payment-modal");

const orderBtn = document.getElementById("order-btn");
orderBtn.addEventListener("click", () => {
  paymentModal.style.display = "flex";
});

const cardholderName = document.getElementById("cardholderName");
const cardNumber = document.getElementById("cardNumber");
const cardCvv = document.getElementById("cvv");
const paymentForm = document.getElementById("paymentForm");
paymentForm.addEventListener("submit", handleFormSubmission);

const cancelBtn = document.getElementById("cancel-btn");
cancelBtn.addEventListener("click", () => {
  paymentModal.style.display = "none";
  resetInputs();
});

let cart = [];

render();

function render() {
  renderMenu();
  renderOrder();
  resetInputs();
}

function handleFormSubmission(e) {
  e.preventDefault();
  const formData = new FormData(paymentForm);
  paymentModal.style.display = "none";
  cart = [];
  render();
  let name = formData.get("cardholderName");
  renderSuccessMessage(name);
}

function renderSuccessMessage(name) {
  const orderSuccessSection = document.getElementById("order-submission");
  const successMessage = document.getElementById("success-message");
  orderSuccessSection.style.display = "flex";
  successMessage.textContent = `Thanks, ${name}! Your order is on its way!`;
}

function resetInputs() {
  cardholderName.value = "";
  cardNumber.value = "";
  cardCvv.value = "";
}

function renderMenu() {
  menuDetails.innerHTML = "";
  let menuHtmlArray = [];
  menuArray.forEach((item) => {
    menuHtmlArray.push(createMenuItemHtml(item));
    menuHtmlArray.push(createDivider());
  });
  menuDetails.append(...menuHtmlArray);
}

function createDivider() {
  const divider = document.createElement("div");
  divider.className = "divider";
  return divider;
}

function createMenuItemHtml(item) {
  let { name, ingredients, id, price, emoji } = item;
  const menuItemContainer = document.createElement("div");
  const emojiSpan = document.createElement("span");
  const foodDetails = document.createElement("div");
  const nameHeader = document.createElement("h3");
  const ingredientsHeader = document.createElement("h5");
  const priceHeader = document.createElement("h4");
  const addBtn = document.createElement("button");
  menuItemContainer.className = "menu-item";
  menuItemContainer.id = id;
  emojiSpan.className = "emoji";
  emojiSpan.textContent = emoji;
  foodDetails.className = "food-details";
  nameHeader.textContent = name;
  ingredientsHeader.textContent = ingredients.join(", ");
  priceHeader.textContent = `$${price}`;
  addBtn.className = "add-item-btn";
  addBtn.id = "add-item-btn";
  addBtn.textContent = "+";
  addBtn.addEventListener("click", () => {
    addToCart(id);
  });
  foodDetails.append(nameHeader, ingredientsHeader, priceHeader);
  menuItemContainer.append(emojiSpan, foodDetails, addBtn);
  return menuItemContainer;
}

function renderOrder() {
  orderSection.style.display = cart.length ? "flex" : "none";
  const orderDetails = document.getElementById("order-details");
  orderDetails.innerHTML = "";
  let cartItems = cart.map((cartItem) => renderOrderHtml(cartItem));
  orderDetails.append(...cartItems);
  let orderSum = cart.reduce((acc, curr) => acc + curr.price, 0);
  totalPrice.textContent = `$${orderSum}`;
}

function renderOrderHtml(item) {
  let { name, price, uuid } = item;
  const orderDiv = document.createElement("div");
  const itemName = document.createElement("h3");
  const removeBtn = document.createElement("button");
  const priceEl = document.createElement("h4");
  orderDiv.className = "order-item";
  itemName.textContent = name;
  removeBtn.className = "remove-btn";
  removeBtn.textContent = "remove";
  removeBtn.addEventListener("click", () => {
    removeFromCart(uuid);
  });
  priceEl.className = "price";
  priceEl.textContent = `$${price}`;
  orderDiv.append(itemName, removeBtn, priceEl);
  return orderDiv;
}

function addToCart(itemId) {
  const item = menuArray.find(({ id }) => id === itemId);
  const itemCopy = { ...item };
  itemCopy.uuid = uuid4();
  cart.push(itemCopy);
  render();
}

function removeFromCart(itemId) {
  console.log("id", itemId);
  const updatedCart = cart.filter(({ uuid }) => itemId !== uuid);
  cart = updatedCart;
  render();
}
