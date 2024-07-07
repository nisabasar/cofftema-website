document.addEventListener('DOMContentLoaded', () => {
    const menuItems = [
        { id: 1, name: 'Espresso', price: 15, category: 'sicak-icecekler', img: 'images/latte.jpg' },
        { id: 2, name: 'Americano', price: 20, category: 'sicak-icecekler', img: 'images/latte.jpg' },
        { id: 3, name: 'Latte', price: 18, category: 'sicak-icecekler', img: 'images/latte.jpg' },
        { id: 4, name: 'Cappuccino', price: 22, category: 'sicak-icecekler', img: 'images/latte.jpg' },
        { id: 5, name: 'Mocha', price: 25, category: 'sicak-icecekler', img: 'images/latte.jpg' },
        { id: 6, name: 'Cheesecake', price: 30, category: 'tatlilar', img: 'images/latte.jpg' },
        { id: 7, name: 'Turkey Sandwich', price: 28, category: 'tuzlular', img: 'images/latte.jpg' },
        { id: 8, name: 'Cips', price: 12, category: 'atistirmaliklar', img: 'images/latte.jpg' },
        { id: 9, name: 'Kahve Çekirdekleri', price: 50, category: 'kahve-cekirdekleri', img: 'images/latte.jpg' },
    ];

    const menuContainer = document.querySelector('.menu-items');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const cartBtn = document.getElementById('cart-btn');
    const cartSidebar = document.querySelector('.cart-container');
    const closeCartBtn = document.querySelector('.close-cart-btn');
    const cartContainer = document.querySelector('.cart-list');
    const totalContainer = document.getElementById('total-price');
    const cartCount = document.getElementById('cart-count');
    const checkoutBtn = document.getElementById('checkout-btn');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function updateCartUI() {
        cartContainer.innerHTML = '';
        if (cart.length === 0) {
            cartContainer.innerHTML = '';
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

            cartSidebar.classList.add('open');
            cartBtn.classList.add('show');
        }

        const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
        totalContainer.textContent = `${totalPrice}`;

        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
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

    menuItems.forEach(menuItem => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('menu-item');
        itemDiv.dataset.id = menuItem.id;
        itemDiv.dataset.category = menuItem.category;
        itemDiv.innerHTML = `
            <div class="menu-item-img">
                <img src="${menuItem.img}" alt="${menuItem.name}">
            </div>
            <div class="menu-item-details">
                <span class="menu-item-name">${menuItem.name}</span>
                <span class="menu-item-price">${menuItem.price} TL</span>
                <button class="add-to-cart-btn">Sepete Ekle</button>
            </div>
        `;
        menuContainer.appendChild(itemDiv);
    });

    menuContainer.addEventListener('click', event => {
        if (event.target.classList.contains('add-to-cart-btn')) {
            const menuItem = event.target.closest('.menu-item');
            const itemId = parseInt(menuItem.dataset.id);
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
            Swal.fire({
                icon: 'warning',
                title: 'Sepetiniz boş!',
                text: 'Lütfen sepetinize ürün ekleyin.',
                confirmButtonColor: '#6b4f4f'
            });
        } else {
            Swal.fire({
                icon: 'success',
                title: 'Teşekkürler!',
                html: '<span class="coffee-icon">☕</span> Satın alma işleminiz başarılı!',
                confirmButtonColor: '#6b4f4f'
            });
            cart = [];
            saveCart();
            updateCartUI();
        }
    });

    cartBtn.addEventListener('click', () => {
        cartSidebar.classList.toggle('open');
    });

    function filterMenu(category) {
        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            if (category === 'all' || item.dataset.category === category) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }

    const videoElement = document.getElementById('header-video');
    videoElement.addEventListener('ended', () => {
        cartBtn.classList.add('show');
    });

    videoElement.addEventListener('play', () => {
        cartBtn.classList.remove('show');
    });

    videoElement.addEventListener('pause', () => {
        cartBtn.classList.add('show');
    });

    document.getElementById('search-btn').addEventListener('click', () => {
        const query = document.getElementById('search-bar').value.toLowerCase();
        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            const itemName = item.querySelector('.menu-item-name').textContent.toLowerCase();
            if (itemName.includes(query)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });

    updateCartUI();

    if (cart.length > 0) {
        cartBtn.classList.add('show');
    }

    window.addEventListener('scroll', () => {
        const headerHeight = document.getElementById('header-video').clientHeight;
        if (window.scrollY > headerHeight) {
            cartBtn.classList.add('show');
        } else {
            cartBtn.classList.remove('show');
        }
    });
});
