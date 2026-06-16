const cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart() {
   localStorage.setItem('cart', JSON.stringify(cart));
}

function parsePrice(raw) {
   const n = parseFloat(String(raw).replace(/[^0-9.]/g, ''));
   return Number.isFinite(n) ? n : 0;
}

function formatPrice(n) {
   return Number(n).toFixed(2);
}

function addToCart(name, price) {
   const p = parsePrice(price);
   const existing = cart.find(i => i.name === name);
   if (existing) {
      existing.quantity += 1;
   } else {
      cart.push({ name, price: p, quantity: 1 });
   }
   saveCart();
   renderCart();
  
}

function clearCart() {
   cart.length = 0;
   saveCart();
   renderCart();
}

function removeItem(name) {
   const idx = cart.findIndex(i => i.name === name);
   if (idx > -1) {
      cart.splice(idx, 1);
      saveCart();
      renderCart();
   }
}

function changeQuantity(name, delta) {
   const it = cart.find(i => i.name === name);
   if (!it) return;
   it.quantity = Math.max(1, it.quantity + delta);
   saveCart();
   renderCart();
}

function renderCart() {
   const status = document.getElementById('cart-status');
   const itemsUl = document.getElementById('cart-items');
   const totalSpan = document.getElementById('cart-total');
   itemsUl.innerHTML = '';
   if (!cart.length) {
      status.textContent = 'Your cart is empty.';
      totalSpan.textContent = '0';
      return;
   }

   const totalItems = cart.reduce((s, it) => s + it.quantity, 0);
   status.textContent = `Items in cart: ${totalItems}`;

   let total = 0;
   cart.forEach(item => {
      total += item.price * item.quantity;
      const li = document.createElement('li');
      li.className = 'cart-item';
      li.innerHTML = `
         <div class="floating-item-info">
            <div class="floating-item-name">${item.name}</div>
            <div class="floating-item-price">$${formatPrice(item.price * item.quantity)}</div>
         </div>
         <div style="display:flex;gap:.5rem;align-items:center;margin-top:.5rem">
            <div class="item-controls">
               <button class="qty-btn" data-action="dec" data-name="${escapeHtmlAttr(item.name)}">-</button>
               <div class="item-qty">${item.quantity}</div>
               <button class="qty-btn" data-action="inc" data-name="${escapeHtmlAttr(item.name)}">+</button>
            </div>
            <button class="remove-btn" data-remove="${escapeHtmlAttr(item.name)}">Remove</button>
         </div>
      `;
      itemsUl.appendChild(li);
   });
   totalSpan.textContent = formatPrice(total);
}

function escapeHtmlAttr(s) {
   return String(s).replace(/"/g, '&quot;').replace(/'/g, "&#39;");
}

// Event delegation for buttons
document.addEventListener('click', (e) => {
   const t = e.target;
   if (!t) return;

   // buttons that have data-name and data-price (products in #products section)
   if (t.matches('button[data-name][data-price]')) {
      addToCart(t.dataset.name, t.dataset.price);
      return;
   }

   if (t.id === 'clear-cart') {
      clearCart();
      return;
   }

   if (t.matches('button[data-action]')) {
      const name = t.dataset.name;
      const action = t.dataset.action;
      if (action === 'inc') changeQuantity(name, 1);
      if (action === 'dec') changeQuantity(name, -1);
      return;
   }

   if (t.matches('button.remove-btn[data-remove]')) {
      removeItem(t.dataset.remove);
      return;
   }
});

 

window.addToCart = addToCart;
window.clearCart = clearCart;

 
renderCart();