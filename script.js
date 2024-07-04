const cart = [];

const menuContainer = document.querySelector('.menu-items');
const cartContainer = document.querySelector('.cart-list');
const totalContainer = document.getElementById('total-price');
const cartSidebar = document.querySelector('.cart-container');
const closeCartBtn = document.querySelector('.close-cart-btn');
const filterButtons = document.querySelectorAll('.filter-btn');
const checkoutBtn = document.getElementById('checkout-btn');

document.addEventListener('DOMContentLoaded', () => {
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
        
        cart.length = 0;
        renderCart();
    });
});

function addToCart(id, name, price) {
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }
    renderCart();
}

function renderCart() {
    cartContainer.innerHTML = '';
    cart.forEach(item => {
        const cartItem = document.createElement('li');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <div>
                <span>${item.name}</span>
                <span>${item.price} TL</span>
                <div class="quantity-controls">
                    <button class="quantity-btn" data-id="${item.id}" data-action="decrease">-</button>
                    <span>${item.quantity} adet</span>
                    <button class="quantity-btn" data-id="${item.id}" data-action="increase">+</button>
                </div>
            </div>
            <button class="remove-btn">Sil</button>
        `;
        cartItem.querySelector('.remove-btn').addEventListener('click', () => removeFromCart(item.id));
        cartContainer.appendChild(cartItem);
    });

    const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    totalContainer.textContent = `${totalPrice}`;

    if (cart.length > 0) {
        cartSidebar.classList.add('open');
    } else {
        cartSidebar.classList.remove('open');
    }

    const quantityButtons = document.querySelectorAll('.quantity-btn');
    quantityButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const id = event.target.dataset.id;
            const action = event.target.dataset.action;
            updateQuantity(id, action);
        });
    });
}

function updateQuantity(id, action) {
    const item = cart.find(item => item.id === id);
    if (item) {
        if (action === 'increase') {
            item.quantity++;
        } else if (action === 'decrease' && item.quantity > 1) {
            item.quantity--;
        }
    }
    renderCart();
}

function removeFromCart(id) {
    const index = cart.findIndex(item => item.id === id);
    if (index !== -1) {
        const item = cart[index];
        if (item.quantity > 1) {
            item.quantity--;
        } else {
            cart.splice(index, 1);
        }
        renderCart();
    }
}

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

document.addEventListener('DOMContentLoaded', function () {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    const cartContainer = document.querySelector('.cart-container');
    const closeCartButton = document.querySelector('.close-cart-btn');
    const cartList = document.querySelector('.cart-list');
    const cartButton = document.querySelector('#cart-btn');
    const cartCount = document.querySelector('#cart-count');
    const checkoutButton = document.querySelector('#checkout-btn');
    const totalPriceElement = document.getElementById('total-price');
  
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
    function saveCart() {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  
    function updateCartUI() {
      cartList.innerHTML = '';
      cart.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.name} - ${item.price} TL`;
        cartList.appendChild(li);
      });
      const totalPrice = cart.reduce((total, item) => total + item.price, 0);
      totalPriceElement.textContent = totalPrice;
      cartCount.textContent = cart.length;
    }
  
    function addToCart(name, price) {
      const item = { name, price };
      cart.push(item);
      saveCart();
      updateCartUI();
    }
  
    addToCartButtons.forEach(button => {
      button.addEventListener('click', function () {
        const menuItem = this.closest('.menu-item');
        const itemName = menuItem.querySelector('.menu-item-name').textContent;
        const itemPrice = parseInt(menuItem.querySelector('.menu-item-price').textContent.replace(' TL', ''));
        addToCart(itemName, itemPrice);
      });
    });
  
    cartButton.addEventListener('click', function () {
      cartContainer.classList.toggle('open');
    });
  
    closeCartButton.addEventListener('click', function () {
      cartContainer.classList.remove('open');
    });
  
    checkoutButton.addEventListener('click', function () {
      if (cart.length === 0) {
        Swal.fire('Sepetiniz boş!', 'Lütfen sepetinize ürün ekleyin.', 'warning');
      } else {
        Swal.fire('Teşekkürler!', 'Satın alma işleminiz başarılı!', 'success');
        cart = [];
        saveCart();
        updateCartUI();
      }
    });
  
    updateCartUI();
  });
  
