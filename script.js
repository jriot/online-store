let cart = [];

const cartItemsEl = document.getElementById('cart-items');
const cartStatusEl = document.getElementById('cart-status');
const cartTotalEl = document.getElementById('cart-total');
const clearCartBtn = document.getElementById('clear-cart');

function addToCart(name, price) {
  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ name, price, quantity: 1 });
  }
  updateCart();
}

function removeFromCart(name) {
  cart = cart.filter(item => item.name !== name);
  updateCart();
}

function clearCart() {
  cart = [];
  updateCart();
}

function updateCart() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (totalItems === 0) {
    cartStatusEl.textContent = 'Your cart is empty.';
    cartItemsEl.innerHTML = '';
    cartTotalEl.textContent = '0';
    return;
  }

  cartStatusEl.textContent = `${totalItems} item${totalItems === 1 ? '' : 's'} in cart.`;
  cartItemsEl.innerHTML = cart
    .map(item => `
      <li>
        <strong>${item.name}</strong>
        <span>×${item.quantity}</span>
        <span>$${(item.price * item.quantity).toFixed(2)}</span>
        <button class="remove-item" data-name="${item.name}">Remove</button>
      </li>
    `)
    .join('');

  cartTotalEl.textContent = totalPrice.toFixed(2);

  cartItemsEl.querySelectorAll('.remove-item').forEach(button => {
    button.addEventListener('click', () => removeFromCart(button.dataset.name));
  });
}

function initCart() {
  document.querySelectorAll('button[data-name][data-price]').forEach(button => {
    button.addEventListener('click', () => {
      addToCart(button.dataset.name, parseFloat(button.dataset.price));
    });
  });

  clearCartBtn.addEventListener('click', clearCart);
  updateCart();
}

initCart();
