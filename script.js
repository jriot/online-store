let cart [];
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
        document.getElementById('cart-count').innerHTML = count;
        let total = cart.reduce
    }
