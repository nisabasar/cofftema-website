document.addEventListener('DOMContentLoaded', function () {
    const menuContainer = document.querySelector('.menu-items');
    const cartContainer = document.querySelector('.cart-list');
    const totalContainer = document.getElementById('total-price');
    const cartSidebar = document.querySelector('.cart-container');
    const closeCartBtn = document.querySelector('.close-cart-btn');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const checkoutBtn = document.getElementById('checkout-btn');
    const cartBtn = document.getElementById('cart-btn');
    const cartCount = document.getElementById('cart-count');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function updateCartUI() {
        cartContainer.innerHTML = '';
        if (cart.length === 0) {
            cartContainer.innerHTML = '<p>Sepetiniz boş.</p>';
        } else {
            cart.forEach(item => {
                const cartItem = document.createElement('li');
                cartItem.classList.add('cart-item');
                cartItem.innerHTML = `
                    <div class="cart-item-details">
                        <span>${item.name}</span>
                        <span>${item.price} TL</span>
                        <div class="quantity-controls">
                            <button class="quantity-btn decrease-btn" data-id="${item.id}">-</button>
                            <span>${item.quantity}</span>
                            <button class="quantity-btn increase-btn" data-id="${item.id}">+</button>
                        </div>
                    </div>
                    <button class="remove-btn" data-id="${item.id}">Sil</button>
                `;
                cartContainer.appendChild(cartItem);

                const increaseBtn = cartItem.querySelector('.increase-btn');
                const decreaseBtn = cartItem.querySelector('.decrease-btn');
                const removeBtn = cartItem.querySelector('.remove-btn');

                increaseBtn.addEventListener('click', () => increaseQuantity(item.id));
                decreaseBtn.addEventListener('click', () => decreaseQuantity(item.id));
                removeBtn.addEventListener('click', () => removeFromCart(item.id));
            });
        }

        const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
        totalContainer.textContent = `${totalPrice}`;

        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;

        if (cart.length > 0) {
            cartSidebar.classList.add('open');
        } else {
            cartSidebar.classList.remove('open');
        }
    }

    function addToCart(id, name, price) {
        const existingItem = cart.find(item => item.id === id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            const item = { id, name, price, quantity: 1 };
            cart.push(item);
        }
        saveCart();
        updateCartUI();
    }

    function increaseQuantity(id) {
        const item = cart.find(item => item.id === id);
        if (item) {
            item.quantity += 1;
            saveCart();
            updateCartUI();
        }
    }

    function decreaseQuantity(id) {
        const item = cart.find(item => item.id === id);
        if (item && item.quantity > 1) {
            item.quantity -= 1;
            saveCart();
            updateCartUI();
        }
    }

    function removeFromCart(id) {
        cart = cart.filter(item => item.id !== id);
        saveCart();
        updateCartUI();
    }

    menuContainer.addEventListener('click', event => {
        if (event.target.classList.contains('add-to-cart-btn')) {
            const menuItem = event.target.closest('.menu-item');
            const itemId = menuItem.dataset.id;
            const itemName = menuItem.querySelector('.menu-item-name').textContent;
            const itemPrice = parseFloat(menuItem.querySelector('.menu-item-price').textContent.replace(' TL', ''));

            addToCart(itemId, itemName, itemPrice);
        }
    });

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.category;
            filterMenu(category);
        });
    });

    closeCartBtn.addEventListener('click', () => {
        cartSidebar.classList.remove('open');
    });

    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            Swal.fire('Sepetiniz boş!', 'Lütfen sepetinize ürün ekleyin.', 'warning');
        } else {
            Swal.fire('Teşekkürler!', 'Satın alma işleminiz başarılı!', 'success');
            cart = [];
            saveCart();
            updateCartUI();
        }
    });

    cartBtn.addEventListener('click', () => {
        cartSidebar.classList.toggle('open');
        if (cartSidebar.classList.contains('open')) {
            updateCartUI(); 
            if (cart.length === 0) {
                Swal.fire('Sepetiniz boş!', '', 'info');
            }
        } else {

        }
    });


    updateCartUI();
});

function filterMenu(category) {
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        if (category === 'all' || item.dataset.category === category) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}
