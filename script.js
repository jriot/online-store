let cart = [];

function addtocart(name, price) {
    let existing = cart.find(item => item.name === name);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    updatecart();
}

function updatecart() {
    let count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const countEl = document.getElementById('cart-count');
    if (countEl) countEl.innerHTML = count;

    let total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalEl = document.getElementById('cart-total');
    if (totalEl) totalEl.innerHTML = total.toFixed(2);

    // Optionally update a cart items list if present
    const listEl = document.getElementById('cart-items');
    if (listEl) {
        listEl.innerHTML = cart.map(i => `${i.name} x ${i.quantity} - $${(i.price * i.quantity).toFixed(2)}`).join('<br>');
    }
}
