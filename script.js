let cart = [];

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

function adjustQuantity(name, delta) {
    const item = cart.find(item => item.name === name);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
        removeFromCart(name);
        return;
    }

    updateCart();
}

function updateCart() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const statusEl = document.getElementById('cart-status');
    const floatingStatusEl = document.getElementById('floating-cart-status');
    const statusText = count === 0
        ? 'Your cart is empty.'
        : `You have ${count} item${count === 1 ? '' : 's'} in your cart.`;

    if (statusEl) statusEl.textContent = statusText;
    if (floatingStatusEl) floatingStatusEl.textContent = statusText;

    const totalEl = document.getElementById('cart-total');
    if (totalEl) totalEl.textContent = total.toFixed(2);

    const floatingTotalEl = document.getElementById('floating-cart-total');
    if (floatingTotalEl) floatingTotalEl.textContent = formatCurrency(total);

    const countEl = document.getElementById('cart-count');
    if (countEl) countEl.textContent = count;

    const floatingCountEl = document.getElementById('floating-cart-count');
    if (floatingCountEl) floatingCountEl.textContent = count;

    updateCartList('cart-items', false);
    updateCartList('floating-cart-items', true);
}

function updateCartList(listId, isFloating) {
    const listEl = document.getElementById(listId);
    if (!listEl) return;

    listEl.innerHTML = '';
    if (cart.length === 0) return;

    cart.forEach(item => {
        const li = document.createElement('li');
        if (isFloating) {
            li.innerHTML = `
                <div class="item-top">
                  <strong>${item.name}</strong>
                  <span>${formatCurrency(item.price * item.quantity)}</span>
                </div>
                <div class="item-details">
                  <span>Unit price: ${formatCurrency(item.price)}</span>
                </div>
                <div class="item-controls">
                  <span>${item.quantity} pcs</span>
                  <div class="qty-controls">
                    <button class="qty-btn" type="button" data-name="${item.name}" data-action="decrease">−</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" type="button" data-name="${item.name}" data-action="increase">+</button>
                  </div>
                </div>
            `;
        } else {
            li.innerHTML = `
                <span><strong>${item.name}</strong> x ${item.quantity} — ${formatCurrency(item.price * item.quantity)}</span>
                <button class="remove-item" type="button" data-name="${item.name}">Remove</button>
            `;
        }
        listEl.appendChild(li);
    });

    if (isFloating) {
        listEl.querySelectorAll('.qty-btn').forEach(button => {
            button.addEventListener('click', () => {
                const name = button.dataset.name;
                const action = button.dataset.action;
                adjustQuantity(name, action === 'increase' ? 1 : -1);
            });
        });
    } else {
        listEl.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', () => removeFromCart(button.dataset.name));
        });
    }
}

function formatCurrency(value) {
    return `$${value.toFixed(2)}`;
}

window.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('button[data-name][data-price]').forEach(button => {
        button.addEventListener('click', () => {
            const name = button.dataset.name;
            const price = parseFloat(button.dataset.price);
            if (!name || Number.isNaN(price)) return;
            addToCart(name, price);
        });
    });

    const clearButton = document.getElementById('clear-cart');
    if (clearButton) {
        clearButton.addEventListener('click', () => {
            cart = [];
            updateCart();
        });
    }

    updateCart();
});
