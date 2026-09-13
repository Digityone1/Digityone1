document.addEventListener('DOMContentLoaded', () => {

    // =====================================================
    // MOBILE MENU
    // =====================================================

    const bar = document.getElementById('bar');
    const close = document.getElementById('close');
    const nav = document.getElementById('navbar');

    if (bar && nav) {
        bar.addEventListener('click', () => {
            nav.classList.add('active');
        });
    }

    if (close && nav) {
        close.addEventListener('click', () => {
            nav.classList.remove('active');
        });
    }


    // =====================================================
    // PRODUCT GALLERY
    // =====================================================

    const mainImg = document.getElementById('MainImg');
    const smallImgs = document.getElementsByClassName('small-img');

    if (mainImg && smallImgs.length > 0) {
        for (let i = 0; i < smallImgs.length; i++) {
            smallImgs[i].addEventListener('click', function () {
                mainImg.src = this.src;
            });
        }
    }


    // =====================================================
    // CART SYSTEM
    // =====================================================

    function addToCart(item) {

        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        const existingItemIndex = cart.findIndex(itemInCart =>
            itemInCart.title === item.title &&
            itemInCart.img === item.img &&
            itemInCart.size === item.size
        );

        if (existingItemIndex !== -1) {

            cart[existingItemIndex].qty =
                parseInt(cart[existingItemIndex].qty || 0) +
                parseInt(item.qty || 1);

        } else {

            cart.push({
                title: item.title,
                price: Number(item.price),
                img: item.img,
                size: item.size || 'M',
                qty: parseInt(item.qty || 1)
            });
        }

        localStorage.setItem('cart', JSON.stringify(cart));

        updateCartBadge();
    }


    function updateCartBadge() {

        const cart = JSON.parse(localStorage.getItem('cart')) || [];

        const totalItems = cart.reduce((sum, item) => {
            return sum + parseInt(item.qty || 0);
        }, 0);

        document.querySelectorAll('.cart-badge').forEach(badge => {

            if (totalItems > 0) {
                badge.textContent = totalItems;
                badge.style.display = 'inline-block';
            } else {
                badge.style.display = 'none';
            }

        });
    }


    // =====================================================
    // TOAST
    // =====================================================

    function showToast(message) {

        const toast = document.createElement('div');

        toast.textContent = message;

        toast.style.position = 'fixed';
        toast.style.bottom = '20px';
        toast.style.right = '20px';
        toast.style.backgroundColor = '#088178';
        toast.style.color = '#fff';
        toast.style.padding = '12px 24px';
        toast.style.borderRadius = '4px';
        toast.style.zIndex = '99999';
        toast.style.boxShadow = '0 5px 15px rgba(0,0,0,0.15)';
        toast.style.fontWeight = '600';
        toast.style.fontSize = '14px';

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    }


    // =====================================================
    // SHOP PRODUCTS
    // =====================================================

    document.querySelectorAll('.pro').forEach(product => {

        const imgElement = product.querySelector('img');
        const titleElement = product.querySelector('.des h5');
        const priceElement = product.querySelector('.des h4');
        const cartLink = product.querySelector('a');
        const cartIcon = product.querySelector('.cart');

        if (!imgElement || !titleElement || !priceElement) {
            return;
        }

        const img = imgElement.getAttribute('src');

        const title = titleElement.textContent.trim();

        const price = parseFloat(
            priceElement.textContent
                .replace('€', '')
                .trim()
        );

        if (!Number.isFinite(price)) {
            console.error('Preço inválido:', title);
            return;
        }


        // -------------------------------------------------
        // CART BUTTON
        // -------------------------------------------------

        if (cartLink && cartIcon) {

            cartLink.addEventListener('click', function (e) {

                e.preventDefault();
                e.stopPropagation();

                addToCart({
                    title: title,
                    price: price,
                    img: img,
                    size: 'M',
                    qty: 1
                });

                showToast(
                    `${title} adicionado ao carrinho!`
                );

            });
        }


        // -------------------------------------------------
        // PRODUCT PAGE
        // -------------------------------------------------

        const productUrl =
            'sproduct.html' +
            '?title=' + encodeURIComponent(title) +
            '&price=' + encodeURIComponent(price) +
            '&img=' + encodeURIComponent(img);


        // Image opens product page

        imgElement.style.cursor = 'pointer';

        imgElement.addEventListener('click', function (e) {

            e.preventDefault();
            e.stopPropagation();

            window.location.href = productUrl;

        });


        // Description opens product page

        const productContent = product.querySelector('.des');

        if (productContent) {

            productContent.style.cursor = 'pointer';

            productContent.addEventListener('click', function (e) {

                if (e.target.closest('.cart')) {
                    return;
                }

                window.location.href = productUrl;

            });
        }

    });


    // =====================================================
    // SPRODUCT.HTML
    // =====================================================

    const urlParams = new URLSearchParams(
        window.location.search
    );

    const titleParam = urlParams.get('title');
    const priceParam = urlParams.get('price');
    const imgParam = urlParams.get('img');

    const mainProductImg = document.getElementById('MainImg');
    const productTitle = document.getElementById('ProductTitle');
    const productPrice = document.getElementById('ProductPrice');


    if (
        titleParam &&
        priceParam &&
        imgParam &&
        mainProductImg &&
        productTitle &&
        productPrice
    ) {

        mainProductImg.src = imgParam;

        productTitle.textContent = titleParam;

        productPrice.textContent =
            '€' + parseFloat(priceParam).toFixed(2);


        const smallImgsList =
            document.querySelectorAll('.small-img');

        if (smallImgsList.length > 0) {
            smallImgsList[0].src = imgParam;
        }

    }


    // =====================================================
    // SPRODUCT ADD TO CART
    // =====================================================

    const addToCartBtn =
        document.getElementById('AddToCartBtn');

    if (addToCartBtn) {

        addToCartBtn.addEventListener('click', () => {

            const titleElement =
                document.getElementById('ProductTitle');

            const priceElement =
                document.getElementById('ProductPrice');

            const mainImage =
                document.getElementById('MainImg');

            const sizeSelect =
                document.getElementById('ProductSize');

            const qtyInput =
                document.getElementById('ProductQty');


            if (
                !titleElement ||
                !priceElement ||
                !mainImage
            ) {
                return;
            }


            const title =
                titleElement.textContent.trim();


            const price =
                parseFloat(
                    priceElement.textContent
                        .replace('€', '')
                        .trim()
                );


            const img =
                mainImage.getAttribute('src');


            const size =
                sizeSelect
                    ? sizeSelect.value
                    : 'M';


            const qty =
                qtyInput
                    ? parseInt(qtyInput.value) || 1
                    : 1;


            if (
                sizeSelect &&
                (
                    size === 'Select Size' ||
                    size === 'Selecionar Tamanho'
                )
            ) {

                alert(
                    'Por favor, selecione primeiro um tamanho!'
                );

                return;
            }


            addToCart({
                title: title,
                price: price,
                img: img,
                size: size,
                qty: qty
            });


            showToast(
                `${qty} x ${title} adicionado ao carrinho!`
            );

        });
    }


    // =====================================================
    // CART PAGE
    // =====================================================

    const cartItemsContainer =
        document.getElementById('cart-items');


    if (cartItemsContainer) {

        renderCart();


        // -------------------------------------------------
        // COUPON
        // -------------------------------------------------

        const applyCouponBtn =
            document.getElementById('apply-coupon-btn');


        if (applyCouponBtn) {

            applyCouponBtn.addEventListener('click', () => {

                const couponInput =
                    document.getElementById('coupon-code');

                const statusDiv =
                    document.getElementById('coupon-status');


                if (!couponInput || !statusDiv) {
                    return;
                }


                const code =
                    couponInput.value
                        .trim()
                        .toUpperCase();


                if (code === 'SAVE70') {

                    localStorage.setItem(
                        'activeCoupon',
                        JSON.stringify({
                            code: 'SAVE70',
                            discount: 0.70
                        })
                    );

                    statusDiv.textContent =
                        'Cupão aplicado com sucesso! (70% Desconto)';

                    statusDiv.style.color = '#088178';

                    renderCart();

                }

                else if (code === 'WELCOME10') {

                    localStorage.setItem(
                        'activeCoupon',
                        JSON.stringify({
                            code: 'WELCOME10',
                            discount: 0.10
                        })
                    );

                    statusDiv.textContent =
                        'Cupão aplicado com sucesso! (10% Desconto)';

                    statusDiv.style.color = '#088178';

                    renderCart();

                }

                else if (code === '') {

                    statusDiv.textContent =
                        'Por favor, insira um código de cupão.';

                    statusDiv.style.color = '#ef3636';

                }

                else {

                    statusDiv.textContent =
                        'Código de cupão inválido.';

                    statusDiv.style.color = '#ef3636';
                }

            });


            // Load saved coupon

            const savedCoupon =
                JSON.parse(
                    localStorage.getItem('activeCoupon')
                );


            if (savedCoupon) {

                const couponInput =
                    document.getElementById('coupon-code');

                const statusDiv =
                    document.getElementById('coupon-status');


                if (couponInput) {
                    couponInput.value =
                        savedCoupon.code;
                }


                if (statusDiv) {

                    statusDiv.textContent =
                        `Cupão ${savedCoupon.code} ativo! ` +
                        `(${savedCoupon.discount * 100}% Desconto)`;

                    statusDiv.style.color = '#088178';
                }
            }
        }


        // =================================================
        // CHECKOUT
        // =================================================

        const checkoutBtn =
            document.getElementById('checkout-btn');


        if (checkoutBtn) {

            checkoutBtn.addEventListener(
                'click',
                async () => {

                    const cart =
                        JSON.parse(
                            localStorage.getItem('cart')
                        ) || [];


                    if (cart.length === 0) {

                        alert(
                            'O seu carrinho está vazio!'
                        );

                        return;
                    }


                    const coupon =
                        JSON.parse(
                            localStorage.getItem('activeCoupon')
                        );


                    try {

                        const response =
                            await fetch(
                            'https://ibkube-stripe-1.vercel.app/api/create-checkout-session',
                                {
                                    method: 'POST',

                                    headers: {
                                        'Content-Type':
                                            'application/json'
                                    },

                                    body: JSON.stringify({
                                        cart: cart,

                                        coupon:
                                            coupon
                                                ? coupon.code
                                                : null
                                    })
                                }
                            );


                        const data =
                            await response.json();


                        if (!response.ok) {

                            throw new Error(
                                data.error ||
                                'Checkout error'
                            );
                        }


                        window.location.href =
                            data.url;

                    }

                    catch (error) {

                        console.error(
                            'Checkout error:',
                            error
                        );

                        alert(
                            'Não foi possível iniciar o pagamento. ' +
                            'Tente novamente.'
                        );
                    }

                }
            );
        }
    }


    // =====================================================
    // RENDER CART
    // =====================================================

    function renderCart() {

        if (!cartItemsContainer) {
            return;
        }


        const cart =
            JSON.parse(
                localStorage.getItem('cart')
            ) || [];


        cartItemsContainer.innerHTML = '';


        if (cart.length === 0) {

            cartItemsContainer.innerHTML = `
                <tr>
                    <td colspan="6"
                        style="text-align:center; padding:40px;">
                        O seu carrinho está vazio.
                        <a href="shop.html"
                           style="color:#088178;
                                  font-weight:700;
                                  text-decoration:none;">
                            Comprar Agora
                        </a>
                    </td>
                </tr>
            `;

            updateTotals(0);

            return;
        }


        let subtotal = 0;


        cart.forEach((item, index) => {

            const price =
                Number(item.price) || 0;

            const qty =
                parseInt(item.qty) || 1;


            const itemSubtotal =
                price * qty;


            subtotal += itemSubtotal;


            const tr =
                document.createElement('tr');


            tr.innerHTML = `
                <td>
                    <i class="far fa-times-circle
                              delete-cart-item"
                       data-index="${index}">
                    </i>
                </td>

                <td>
                    <img src="${item.img}"
                         alt=""
                         style="
                            width:50px;
                            height:50px;
                            object-fit:cover;
                            border-radius:6px;
                         ">
                </td>

                <td>
                    ${item.title}
                    <span style="
                        color:#088178;
                        font-weight:700;
                    ">
                        (${item.size || 'M'})
                    </span>
                </td>

                <td>
                    €${price.toFixed(2)}
                </td>

                <td>
                    <input
                        type="number"
                        class="cart-qty-input"
                        data-index="${index}"
                        value="${qty}"
                        min="1"
                    >
                </td>

                <td>
                    €${itemSubtotal.toFixed(2)}
                </td>
            `;


            cartItemsContainer.appendChild(tr);
        });


        // Delete

        document
            .querySelectorAll('.delete-cart-item')
            .forEach(btn => {

                btn.addEventListener('click', function () {

                    const index =
                        parseInt(
                            this.getAttribute(
                                'data-index'
                            )
                        );

                    deleteCartItem(index);

                });

            });


        // Quantity

        document
            .querySelectorAll('.cart-qty-input')
            .forEach(input => {

                input.addEventListener(
                    'change',
                    function () {

                        const index =
                            parseInt(
                                this.getAttribute(
                                    'data-index'
                                )
                            );


                        let qty =
                            parseInt(this.value);


                        if (!qty || qty < 1) {
                            qty = 1;
                        }


                        updateCartItemQty(
                            index,
                            qty
                        );
                    }
                );
            });


        updateTotals(subtotal);
    }


    // =====================================================
    // DELETE CART ITEM
    // =====================================================

    function deleteCartItem(index) {

        let cart =
            JSON.parse(
                localStorage.getItem('cart')
            ) || [];


        cart.splice(index, 1);


        localStorage.setItem(
            'cart',
            JSON.stringify(cart)
        );


        renderCart();

        updateCartBadge();
    }


    // =====================================================
    // UPDATE QUANTITY
    // =====================================================

    function updateCartItemQty(index, qty) {

        let cart =
            JSON.parse(
                localStorage.getItem('cart')
            ) || [];


        if (!cart[index]) {
            return;
        }


        cart[index].qty = qty;


        localStorage.setItem(
            'cart',
            JSON.stringify(cart)
        );


        renderCart();

        updateCartBadge();
    }


    // =====================================================
    // CART TOTALS
    // =====================================================

    function updateTotals(subtotal) {

        const subtotalElement =
            document.getElementById('cart-subtotal');

        const totalElement =
            document.getElementById('cart-total');

        const discountRow =
            document.getElementById('discount-row');

        const couponName =
            document.getElementById('coupon-name');

        const couponDiscount =
            document.getElementById('coupon-discount');


        if (!subtotalElement || !totalElement) {
            return;
        }


        subtotalElement.textContent =
            `€${subtotal.toFixed(2)}`;


        const savedCoupon =
            JSON.parse(
                localStorage.getItem('activeCoupon')
            );


        let total = subtotal;


        if (savedCoupon && subtotal > 0) {

            const discountAmount =
                subtotal * savedCoupon.discount;


            total =
                subtotal - discountAmount;


            if (couponName) {
                couponName.textContent =
                    savedCoupon.code;
            }


            if (couponDiscount) {
                couponDiscount.textContent =
                    `-€${discountAmount.toFixed(2)}`;
            }


            if (discountRow) {
                discountRow.style.display =
                    'table-row';
            }

        } else {

            if (discountRow) {
                discountRow.style.display =
                    'none';
            }
        }


        totalElement.innerHTML =
            `<strong>€${total.toFixed(2)}</strong>`;
    }


    // =====================================================
    // SHOP PAGINATION / TABS
    // =====================================================

    const tabBtns =
        document.querySelectorAll(
            '#pagination .tab-btn'
        );

    const tabContents =
        document.querySelectorAll(
            '.tab-content'
        );

    const tabNextBtn =
        document.getElementById(
            'tab-next-btn'
        );


    if (
        tabBtns.length > 0 &&
        tabContents.length > 0
    ) {

        function switchTab(targetTabId) {

            tabContents.forEach(content => {

                if (content.id === targetTabId) {

                    content.style.display =
                        'flex';

                    content.classList.add(
                        'active'
                    );

                } else {

                    content.style.display =
                        'none';

                    content.classList.remove(
                        'active'
                    );
                }
            });


            tabBtns.forEach(btn => {

                if (
                    btn.getAttribute(
                        'data-tab'
                    ) === targetTabId
                ) {

                    btn.classList.add(
                        'active'
                    );

                } else {

                    btn.classList.remove(
                        'active'
                    );
                }
            });
        }


        tabBtns.forEach(btn => {

            btn.addEventListener(
                'click',
                e => {

                    e.preventDefault();

                    const targetTab =
                        btn.getAttribute(
                            'data-tab'
                        );

                    switchTab(targetTab);
                }
            );
        });


        if (tabNextBtn) {

            tabNextBtn.addEventListener(
                'click',
                e => {

                    e.preventDefault();


                    const activeBtn =
                        document.querySelector(
                            '#pagination .tab-btn.active'
                        );


                    if (!activeBtn) {
                        return;
                    }


                    const allBtns =
                        Array.from(
                            document.querySelectorAll(
                                '#pagination .tab-btn'
                            )
                        );


                    const currentIndex =
                        allBtns.indexOf(
                            activeBtn
                        );


                    const nextIndex =
                        (
                            currentIndex + 1
                        ) %
                        allBtns.length;


                    const nextTabId =
                        allBtns[
                            nextIndex
                        ].getAttribute(
                            'data-tab'
                        );


                    switchTab(nextTabId);
                }
            );
        }
    }


    // =====================================================
    // INITIALIZE CART BADGE
    // =====================================================

    updateCartBadge();

});