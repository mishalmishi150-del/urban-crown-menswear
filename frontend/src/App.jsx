
import { useState } from "react";
import "./App.css";

const products = [
  {
    id: 1,
    name: "Classic Formal Shirt",
    price: 2499,
    category: "SMART CASUAL",
    image: "/images/shirt.jpg",
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Black", "Olive Green"],
    description:
      "A versatile wardrobe essential with a clean, modern look. Style it for work, dinners, or everyday occasions.",
    material: "Everyday premium fabric",
  },
  {
    id: 2,
    name: "Essential Jacket",
    price: 4999,
    category: "OUTERWEAR",
    image: "/images/jacket.jpg",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Brown", "Navy"],
    description:
      "A timeless outerwear piece designed to add structure and confidence to your everyday outfits.",
    material: "Structured outerwear fabric",
  },
  {
    id: 3,
    name: "Classic Leather Shoes",
    price: 3499,
    category: "FOOTWEAR",
    image: "/images/shoes.jpg",
    sizes: ["40", "41", "42", "43", "44"],
    colors: ["Black", "Brown"],
    description:
      "Classic footwear with a refined appearance, suitable for smart casual outfits and special occasions.",
    material: "Classic leather-look finish",
  },
];

const faqs = [
  {
    question: "How do I place an order?",
    answer:
      "Choose a product, select your size and colour, add it to your bag, and follow the demo checkout steps.",
  },
  {
    question: "Can I change my product size?",
    answer:
      "Choose your preferred size on the product detail page before adding the item to your bag.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Delivery times are not configured in this frontend demo. A real store would provide delivery estimates at checkout.",
  },
  {
    question: "Can I return a product?",
    answer:
      "Please review the sample Returns Policy below. Actual returns are not available because this is a demo website.",
  },
  {
    question: "Can I pay online?",
    answer:
      "No real payments are processed. The checkout is for demonstration purposes only.",
  },
];

function App() {
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [detailSize, setDetailSize] = useState("M");
  const [detailColor, setDetailColor] = useState("White");
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [detailQuantity, setDetailQuantity] = useState(1);
  const [showAccount, setShowAccount] = useState(false);
  const [accountMessage, setAccountMessage] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [filterSize, setFilterSize] = useState("all");
  const [filterColor, setFilterColor] = useState("all");
  const [maxPrice, setMaxPrice] = useState("all");
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(false);
  const [discountMessage, setDiscountMessage] = useState("");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterMessage, setNewsletterMessage] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactStatus, setContactStatus] = useState("");
  const [openFaq, setOpenFaq] = useState(0);
  const [showCookieNotice, setShowCookieNotice] = useState(
    !sessionStorage.getItem("urban-crown-cookie-choice")
  );

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
  });

  const [selections, setSelections] = useState({});

  const cartCount = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const discount = appliedDiscount
    ? Math.round(subtotal * 0.1)
    : 0;

  const total = subtotal - discount;

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch =
        `${product.name} ${product.category} ${product.description}`
          .toLowerCase()
          .includes(search.trim().toLowerCase());

      const matchesSize =
        filterSize === "all" ||
        product.sizes.includes(filterSize);

      const matchesColor =
        filterColor === "all" ||
        product.colors.includes(filterColor);

      const matchesPrice =
        maxPrice === "all" ||
        product.price <= Number(maxPrice);

      return (
        matchesSearch &&
        matchesSize &&
        matchesColor &&
        matchesPrice
      );
    })
    .sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "name-az") {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === "name-za") {
        return b.name.localeCompare(a.name);
      }
      if (sortBy === "newest") return b.id - a.id;
      return a.id - b.id;
    });

  function updateSelection(product, field, value) {
    setSelections((current) => ({
      ...current,
      [product.id]: {
        size: current[product.id]?.size || product.sizes[0],
        color: current[product.id]?.color || product.colors[0],
        ...current[product.id],
        [field]: value,
      },
    }));
  }

  function openProduct(product) {
    const selection = selections[product.id];

    setSelectedProduct(product);
    setDetailSize(selection?.size || product.sizes[0]);
    setDetailColor(selection?.color || product.colors[0]);
    setDetailQuantity(1);
    setGalleryIndex(0);
    setShowSizeGuide(false);
    setOrderPlaced(false);

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function closeProduct() {
    setSelectedProduct(null);
    setShowSizeGuide(false);
  }

  function addToCart(product, size, color, quantity = 1) {
    const key = `${product.id}-${size}-${color}`;

    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (item) => item.key === key
      );

      if (existingItem) {
        return currentCart.map((item) =>
          item.key === key
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [
        ...currentCart,
        {
          ...product,
          key,
          size,
          color,
          quantity,
        },
      ];
    });

    setSelections((current) => ({
      ...current,
      [product.id]: { size, color },
    }));

    setOrderPlaced(false);
    setAppliedDiscount(false);
    setDiscountMessage("");
  }

  function addCardProduct(product) {
    const selection = selections[product.id] || {
      size: product.sizes[0],
      color: product.colors[0],
    };

    addToCart(
      product,
      selection.size,
      selection.color
    );
  }

  function addDetailProduct() {
    if (!selectedProduct) return;

    addToCart(
      selectedProduct,
      detailSize,
      detailColor,
      detailQuantity
    );

    closeProduct();

    document.getElementById("cart")?.scrollIntoView({
      behavior: "smooth",
    });
  }

  function changeQuantity(key, amount) {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.key === key
            ? {
                ...item,
                quantity: item.quantity + amount,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );

    setAppliedDiscount(false);
    setDiscountMessage("");
  }

  function removeFromCart(key) {
    setCart((currentCart) =>
      currentCart.filter((item) => item.key !== key)
    );

    setAppliedDiscount(false);
    setDiscountMessage("");
  }

  function applyDiscount(event) {
    event.preventDefault();

    if (discountCode.trim().toUpperCase() === "URBAN10") {
      setAppliedDiscount(true);
      setDiscountMessage("Success! You received 10% off.");
    } else {
      setAppliedDiscount(false);
      setDiscountMessage("Invalid code. Please try URBAN10.");
    }
  }

  function handleCustomerChange(event) {
    const { name, value } = event.target;

    setCustomer((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleCheckout(event) {
    event.preventDefault();

    if (cart.length === 0) return;

    setOrderPlaced(true);
    setCart([]);
    setShowCheckout(false);
    setAppliedDiscount(false);
    setDiscountCode("");
    setDiscountMessage("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function subscribeNewsletter(event) {
    event.preventDefault();

    setNewsletterMessage(
      "Thank you! This is a demo signup and no email has been sent."
    );

    setNewsletterEmail("");
  }

  function submitContact(event) {
    event.preventDefault();

    setContactStatus(
      "Thank you! This demo form does not send messages to a server."
    );

    setContactMessage("");
  }

  function chooseCookieOption(choice) {
    sessionStorage.setItem("urban-crown-cookie-choice", choice);
    setShowCookieNotice(false);
  }

  function goToCollection() {
    closeProduct();

    setTimeout(() => {
      document.getElementById("collection")?.scrollIntoView({
        behavior: "smooth",
      });
    }, 0);
  }

  return (
    <div className="app" id="home">
      <div className="announcement-bar">
        TIMELESS STYLE. EVERYDAY CONFIDENCE.
      </div>

      <header className="navbar">
        <a className="brand-logo" href="#home" onClick={closeProduct}>
          URBAN <span>CROWN</span>
        </a>

        <nav className="nav-links">
          <a href="#home" onClick={closeProduct}>Home</a>
          <a href="#collection" onClick={closeProduct}>Collection</a>
          <a href="#about" onClick={closeProduct}>Our Story</a>
          <a href="#contact" onClick={closeProduct}>Contact</a>
        </nav>

        <div className="nav-actions">
          <button
            className="nav-text-button"
            type="button"
            onClick={() => {
              closeProduct();
              setShowAccount(true);
              setAccountMessage("");
            }}
          >
            Account
          </button>

          <a href="#cart" onClick={closeProduct}>
            Bag ({cartCount})
          </a>
        </div>
      </header>

      <main>
        {!selectedProduct ? (
          <>
            <section className="hero" id="hero">
              <div className="hero-content">
                <p className="eyebrow">PREMIUM MEN'S FASHION</p>

                <h1>
                  Elevate Your
                  <br />
                  <em>Style.</em>
                </h1>

                <p>
                  Discover premium menswear designed for the
                  modern man. Look good, feel confident, and
                  express your own style.
                </p>

                <button
                  className="shop-button"
                  type="button"
                  onClick={goToCollection}
                >
                  SHOP NOW →
                </button>
              </div>
            </section>

            <section className="usp-bar">
              <div>
                <span>✦</span>
                <h3>Quality First</h3>
                <p>Thoughtful everyday essentials.</p>
              </div>

              <div>
                <span>◇</span>
                <h3>Modern Design</h3>
                <p>Clean looks with timeless appeal.</p>
              </div>

              <div>
                <span>↗</span>
                <h3>Easy Shopping</h3>
                <p>A simple shopping demo.</p>
              </div>
            </section>

            <section className="home-explore">
              <p className="eyebrow">THE URBAN COLLECTION</p>
              <h2>Explore The Collection</h2>

              <div className="explore-grid">
                {products.map((product) => (
                  <button
                    className="explore-card"
                    type="button"
                    key={product.id}
                    onClick={() => openProduct(product)}
                  >
                    <img src={product.image} alt={product.name} />
                    <span>{product.category}</span>
                    <strong>{product.name}</strong>
                    <span className="explore-link">VIEW PRODUCT →</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="collection" id="collection">
              <p className="eyebrow">CURATED FOR YOU</p>
              <h2>New Arrivals</h2>

              <p className="section-description">
                Discover essential pieces for your everyday wardrobe.
              </p>

              <div className="collection-tools">
                <div className="search-bar">
                  <input
                    type="search"
                    placeholder="Search products..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    aria-label="Search products"
                  />
                </div>

                <label className="filter-control">
                  Sort by
                  <select
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value)}
                  >
                    <option value="featured">Featured</option>
                    <option value="newest">Newest</option>
                    <option value="name-az">Name: A to Z</option>
                    <option value="name-za">Name: Z to A</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </label>

                <label className="filter-control">
                  Size
                  <select
                    value={filterSize}
                    onChange={(event) => setFilterSize(event.target.value)}
                  >
                    <option value="all">All sizes</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                    <option value="40">40</option>
                    <option value="41">41</option>
                    <option value="42">42</option>
                    <option value="43">43</option>
                    <option value="44">44</option>
                  </select>
                </label>

                <label className="filter-control">
                  Colour
                  <select
                    value={filterColor}
                    onChange={(event) => setFilterColor(event.target.value)}
                  >
                    <option value="all">All colours</option>
                    <option value="Black">Black</option>
                    <option value="White">White</option>
                    <option value="Brown">Brown</option>
                    <option value="Olive Green">Olive Green</option>
                    <option value="Navy">Navy</option>
                  </select>
                </label>

                <label className="filter-control">
                  Maximum price
                  <select
                    value={maxPrice}
                    onChange={(event) => setMaxPrice(event.target.value)}
                  >
                    <option value="all">Any price</option>
                    <option value="3000">Up to Rs. 3,000</option>
                    <option value="4000">Up to Rs. 4,000</option>
                    <option value="5000">Up to Rs. 5,000</option>
                  </select>
                </label>
              </div>

              <div className="product-grid">
                {filteredProducts.map((product) => {
                  const selected = selections[product.id] || {
                    size: product.sizes[0],
                    color: product.colors[0],
                  };

                  return (
                    <article className="product-card" key={product.id}>
                      <button
                        className="product-image product-image-button"
                        type="button"
                        onClick={() => openProduct(product)}
                        aria-label={`View ${product.name} details`}
                      >
                        <img src={product.image} alt={product.name} />
                      </button>

                      <p className="product-category">
                        {product.category}
                      </p>

                      <button
                        className="product-title-button"
                        type="button"
                        onClick={() => openProduct(product)}
                      >
                        {product.name}
                      </button>

                      <p className="product-price">
                        Rs. {product.price.toLocaleString("en-PK")}
                      </p>

                      <button
                        className="text-link"
                        type="button"
                        onClick={() => openProduct(product)}
                      >
                        VIEW DETAILS →
                      </button>

                      <div className="product-options">
                        <label>
                          Size
                          <select
                            value={selected.size}
                            onChange={(event) =>
                              updateSelection(
                                product,
                                "size",
                                event.target.value
                              )
                            }
                          >
                            {product.sizes.map((size) => (
                              <option key={size} value={size}>
                                {size}
                              </option>
                            ))}
                          </select>
                        </label>

                        <label>
                          Colour
                          <select
                            value={selected.color}
                            onChange={(event) =>
                              updateSelection(
                                product,
                                "color",
                                event.target.value
                              )
                            }
                          >
                            {product.colors.map((color) => (
                              <option key={color} value={color}>
                                {color}
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>

                      <button
                        className="shop-button"
                        type="button"
                        onClick={() => addCardProduct(product)}
                      >
                        ADD TO BAG
                      </button>
                    </article>
                  );
                })}
              </div>

              {filteredProducts.length === 0 && (
                <p className="empty-message">
                  No products found. Try changing your search or filters.
                </p>
              )}
            </section>

            <section className="home-audience">
              <div>
                <p className="eyebrow">MADE FOR EVERY DAY</p>
                <h2>Everyday Essentials</h2>
                <p>
                  Build your wardrobe with versatile pieces that
                  work together, season after season.
                </p>
                <button className="shop-button" onClick={goToCollection}>
                  SHOP ESSENTIALS
                </button>
              </div>

              <div>
                <p className="eyebrow">YOUR STYLE, YOUR WAY</p>
                <h2>Find Your Look</h2>
                <p>
                  From smart casual outfits to relaxed weekend looks,
                  find pieces that fit your personal style.
                </p>
                <button className="shop-button" onClick={goToCollection}>
                  DISCOVER MORE
                </button>
              </div>
            </section>

            <section className="home-lookbook">
              <p className="eyebrow">THE URBAN EDIT</p>
              <h2>Less Noise. More Style.</h2>
              <p>
                Simple silhouettes. Considered details. Everyday confidence.
              </p>
              <button className="shop-button" onClick={goToCollection}>
                FIND YOUR STYLE
              </button>
            </section>

            <section className="home-testimonials">
              <p className="eyebrow">THE BRAND PROMISE</p>
              <h2>Designed Around You</h2>

              <div className="promise-grid">
                <div>
                  <h3>Timeless Style</h3>
                  <p>Modern essentials designed to stay relevant.</p>
                </div>
                <div>
                  <h3>Everyday Comfort</h3>
                  <p>Versatile pieces for your everyday wardrobe.</p>
                </div>
                <div>
                  <h3>Simple Choices</h3>
                  <p>Easy-to-explore products in one place.</p>
                </div>
              </div>
            </section>
          </>
        ) : (
          <section className="product-detail-page">
            <button className="back-link" onClick={closeProduct}>
              ← BACK TO SHOP
            </button>

            <div className="product-detail-layout">
              <div className="detail-gallery">
                <div className="detail-main-image">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    key={`${selectedProduct.id}-${galleryIndex}`}
                  />
                </div>

                <div className="detail-thumbnails">
                  <button
                    type="button"
                    className="detail-thumbnail active"
                    onClick={() => setGalleryIndex(0)}
                    aria-label="Show product image"
                  >
                    <img
                      src={selectedProduct.image}
                      alt={`${selectedProduct.name} thumbnail`}
                    />
                  </button>
                </div>

                <p className="gallery-note">
                  Product image gallery. Additional product images can be
                  added when available.
                </p>
              </div>

              <div className="detail-info">
                <p className="eyebrow">{selectedProduct.category}</p>
                <h1>{selectedProduct.name}</h1>

                <p className="detail-price">
                  Rs. {selectedProduct.price.toLocaleString("en-PK")}
                </p>

                <p className="detail-description">
                  {selectedProduct.description}
                </p>

                <p className="detail-material">
                  <strong>Material:</strong> {selectedProduct.material}
                </p>

                <div className="detail-option">
                  <div className="option-heading">
                    <label htmlFor="detail-size">Size</label>
                    <button
                      type="button"
                      className="text-link"
                      onClick={() => setShowSizeGuide(true)}
                    >
                      SIZE GUIDE
                    </button>
                  </div>

                  <select
                    id="detail-size"
                    value={detailSize}
                    onChange={(event) => setDetailSize(event.target.value)}
                  >
                    {selectedProduct.sizes.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="detail-option">
                  <label htmlFor="detail-color">Colour</label>
                  <select
                    id="detail-color"
                    value={detailColor}
                    onChange={(event) => setDetailColor(event.target.value)}
                  >
                    {selectedProduct.colors.map((color) => (
                      <option key={color} value={color}>
                        {color}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="detail-option">
                  <label htmlFor="detail-quantity">Quantity</label>
                  <div className="quantity-controls detail-quantity">
                    <button
                      type="button"
                      onClick={() =>
                        setDetailQuantity((quantity) =>
                          Math.max(1, quantity - 1)
                        )
                      }
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span>{detailQuantity}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setDetailQuantity((quantity) =>
                          Math.min(10, quantity + 1)
                        )
                      }
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  className="shop-button detail-add-button"
                  type="button"
                  onClick={addDetailProduct}
                >
                  ADD TO BAG — RS.{" "}
                  {(selectedProduct.price * detailQuantity).toLocaleString("en-PK")}
                </button>

                <div className="detail-trust">
                  <p>✓ Easy product selection</p>
                  <p>✓ Size and colour options</p>
                  <p>✓ Secure payment not configured in this demo</p>
                </div>

                <div className="detail-description-panel">
                  <h3>Product Details</h3>
                  <p>{selectedProduct.description}</p>
                  <p>
                    Please note: material and product information shown
                    here is sample content for this website concept.
                  </p>
                </div>

                <div className="related-products">
                  <h3>You May Also Like</h3>
                  {products
                    .filter((product) => product.id !== selectedProduct.id)
                    .map((product) => (
                      <button
                        type="button"
                        className="related-product"
                        key={product.id}
                        onClick={() => openProduct(product)}
                      >
                        <img src={product.image} alt={product.name} />
                        <span>{product.name}</span>
                        <strong>
                          Rs. {product.price.toLocaleString("en-PK")}
                        </strong>
                      </button>
                    ))}
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="home-newsletter">
          <p className="eyebrow">STAY IN THE LOOP</p>
          <h2>A Little More Urban</h2>
          <p>Enter your email to try our newsletter signup demo.</p>

          <form className="newsletter-form" onSubmit={subscribeNewsletter}>
            <input
              type="email"
              placeholder="Your email address"
              value={newsletterEmail}
              onChange={(event) => setNewsletterEmail(event.target.value)}
              required
              aria-label="Your email address"
            />
            <button type="submit">SIGN UP</button>
          </form>

          {newsletterMessage && (
            <p className="form-message">{newsletterMessage}</p>
          )}
        </section>

        <section className="cart-section" id="cart">
          <p className="eyebrow">YOUR SELECTION</p>
          <h2>Shopping Bag ({cartCount})</h2>

          {orderPlaced && (
            <div className="success-message">
              <h3>Thank you for trying our demo!</h3>
              <p>
                This is a sample confirmation only. No real order
                or payment has been processed.
              </p>
            </div>
          )}

          {cart.length === 0 ? (
            <p className="empty-message">
              Your bag is empty. Explore the collection to add products.
            </p>
          ) : (
            <>
              <div className="cart-items">
                {cart.map((item) => (
                  <div className="cart-item" key={item.key}>
                    <img src={item.image} alt={item.name} />

                    <div className="cart-item-info">
                      <button
                        className="cart-product-link"
                        type="button"
                        onClick={() => openProduct(item)}
                      >
                        {item.name}
                      </button>
                      <p>Size: {item.size}</p>
                      <p>Colour: {item.color}</p>
                      <p>Rs. {item.price.toLocaleString("en-PK")}</p>

                      <div className="quantity-controls">
                        <button
                          type="button"
                          onClick={() => changeQuantity(item.key, -1)}
                          aria-label={`Decrease ${item.name} quantity`}
                        >
                          −
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => changeQuantity(item.key, 1)}
                          aria-label={`Increase ${item.name} quantity`}
                        >
                          +
                        </button>
                      </div>

                      <button
                        className="remove-button"
                        type="button"
                        onClick={() => removeFromCart(item.key)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <form className="discount-box" onSubmit={applyDiscount}>
                <label htmlFor="discount-code">Discount code</label>
                <div>
                  <input
                    id="discount-code"
                    value={discountCode}
                    onChange={(event) => setDiscountCode(event.target.value)}
                    placeholder="Enter URBAN10"
                  />
                  <button type="submit">APPLY</button>
                </div>
                {discountMessage && <p>{discountMessage}</p>}
              </form>

              <div className="cart-total">
                <p>Subtotal: Rs. {subtotal.toLocaleString("en-PK")}</p>

                {appliedDiscount && (
                  <p>
                    Discount: − Rs. {discount.toLocaleString("en-PK")}
                  </p>
                )}

                <h3>Total: Rs. {total.toLocaleString("en-PK")}</h3>

                <button
                  className="shop-button"
                  type="button"
                  onClick={() => setShowCheckout((current) => !current)}
                >
                  {showCheckout ? "CLOSE CHECKOUT" : "PROCEED TO CHECKOUT"}
                </button>
              </div>

              {showCheckout && (
                <form className="checkout-form" onSubmit={handleCheckout}>
                  <h3>Checkout Details</h3>

                  <label htmlFor="customer-name">Full name</label>
                  <input
                    id="customer-name"
                    name="name"
                    value={customer.name}
                    onChange={handleCustomerChange}
                    required
                  />

                  <label htmlFor="customer-phone">Phone number</label>
                  <input
                    id="customer-phone"
                    name="phone"
                    type="tel"
                    value={customer.phone}
                    onChange={handleCustomerChange}
                    required
                  />

                  <label htmlFor="customer-email">Email address</label>
                  <input
                    id="customer-email"
                    name="email"
                    type="email"
                    value={customer.email}
                    onChange={handleCustomerChange}
                    required
                  />

                  <label htmlFor="customer-address">Delivery address</label>
                  <textarea
                    id="customer-address"
                    name="address"
                    value={customer.address}
                    onChange={handleCustomerChange}
                    required
                  />

                  <label htmlFor="customer-city">City</label>
                  <input
                    id="customer-city"
                    name="city"
                    value={customer.city}
                    onChange={handleCustomerChange}
                    required
                  />

                  <p className="demo-notice">
                    Demo only: this form does not send your details
                    to a server and does not process payments.
                  </p>

                  <button className="shop-button" type="submit">
                    PLACE DEMO ORDER
                  </button>
                </form>
              )}
            </>
          )}
        </section>

        <section className="about" id="about">
          <p className="eyebrow">OUR STORY</p>
          <h2>Confidence In Every Detail</h2>
          <p>
            URBAN CROWN is a menswear website concept focused on modern
            essentials, simple design, and everyday style. Our goal is
            to make exploring a wardrobe collection straightforward
            and enjoyable.
          </p>
          <button className="shop-button" onClick={goToCollection}>
            EXPLORE OUR COLLECTION
          </button>
        </section>

        <section className="policy-section" id="shipping">
          <p className="eyebrow">DELIVERY INFORMATION</p>
          <h2>Shipping Policy</h2>
          <p>
            This demo does not dispatch real orders. A live store should
            specify delivery areas, shipping charges, estimated delivery
            times, and tracking information before accepting orders.
          </p>
        </section>

        <section className="policy-section" id="returns">
          <p className="eyebrow">SHOP WITH CLARITY</p>
          <h2>Returns Policy</h2>
          <p>
            This demo does not accept real returns. A live store should
            clearly explain return eligibility, time limits, product
            condition requirements, and the refund process.
          </p>
        </section>

        <section className="policy-section" id="terms">
          <p className="eyebrow">PLEASE READ</p>
          <h2>Terms & Conditions</h2>
          <p>
            URBAN CROWN is currently a frontend demonstration. Product
            prices, descriptions, checkout and confirmation messages
            are illustrative and do not create a real purchase.
          </p>
        </section>

        <section className="policy-section" id="privacy">
          <p className="eyebrow">YOUR INFORMATION</p>
          <h2>Privacy Policy</h2>
          <p>
            This frontend demo does not submit checkout, contact, or
            newsletter details to a server. A production store needs a
            complete privacy policy explaining data collection, use,
            storage, consent, and customer rights.
          </p>
        </section>

        <section className="faq-section" id="faq">
          <p className="eyebrow">HELP & SUPPORT</p>
          <h2>Frequently Asked Questions</h2>

          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div className="faq-item" key={faq.question}>
                <button
                  type="button"
                  className="faq-question"
                  onClick={() =>
                    setOpenFaq(openFaq === index ? -1 : index)
                  }
                  aria-expanded={openFaq === index}
                >
                  <span>{faq.question}</span>
                  <span>{openFaq === index ? "−" : "+"}</span>
                </button>

                {openFaq === index && (
                  <p className="faq-answer">{faq.answer}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="contact-section" id="contact">
          <p className="eyebrow">GET IN TOUCH</p>
          <h2>Contact Us</h2>
          <p>
            Send a sample message using the demo form below.
            It will not be sent to a real inbox.
          </p>

          <form className="contact-form" onSubmit={submitContact}>
            <label htmlFor="contact-name">Your name</label>
            <input id="contact-name" required />

            <label htmlFor="contact-email">Email address</label>
            <input id="contact-email" type="email" required />

            <label htmlFor="contact-message">Message</label>
            <textarea
              id="contact-message"
              value={contactMessage}
              onChange={(event) => setContactMessage(event.target.value)}
              required
            />

            <button className="shop-button" type="submit">
              SEND DEMO MESSAGE
            </button>
          </form>

          {contactStatus && <p className="form-message">{contactStatus}</p>}
        </section>
      </main>

      <footer className="footer">
        <a className="brand-logo" href="#home" onClick={closeProduct}>
          URBAN <span>CROWN</span>
        </a>

        <p>Modern menswear. Everyday confidence.</p>

        <div className="footer-links">
          <a href="#home">Home</a>
          <a href="#collection">Collection</a>
          <a href="#about">Our Story</a>
          <a href="#shipping">Shipping</a>
          <a href="#returns">Returns</a>
          <a href="#terms">Terms</a>
          <a href="#privacy">Privacy</a>
          <a href="#faq">FAQs</a>
          <a href="#contact">Contact</a>
        </div>

        <small>
          © {new Date().getFullYear()} URBAN CROWN. Frontend demo project.
        </small>
      </footer>

      {showSizeGuide && selectedProduct && (
        <div
          className="modal-backdrop"
          role="presentation"
          onClick={() => setShowSizeGuide(false)}
        >
          <div
            className="modal-panel size-guide-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="size-guide-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="modal-close"
              type="button"
              onClick={() => setShowSizeGuide(false)}
              aria-label="Close size guide"
            >
              ×
            </button>

            <p className="eyebrow">FIND YOUR FIT</p>
            <h2 id="size-guide-title">Size Guide</h2>

            {selectedProduct.category === "FOOTWEAR" ? (
              <>
                <p>Choose the shoe size that normally fits you.</p>
                <table className="size-guide-table">
                  <thead>
                    <tr>
                      <th>Size</th>
                      <th>Suggested fit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedProduct.sizes.map((size) => (
                      <tr key={size}>
                        <td>{size}</td>
                        <td>Check your usual shoe size</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            ) : (
              <>
                <p>
                  This is a general guide only. Exact measurements have
                  not been provided for these sample products.
                </p>
                <table className="size-guide-table">
                  <thead>
                    <tr>
                      <th>Size</th>
                      <th>Suggested fit</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td>S</td><td>Small</td></tr>
                    <tr><td>M</td><td>Medium</td></tr>
                    <tr><td>L</td><td>Large</td></tr>
                    <tr><td>XL</td><td>Extra Large</td></tr>
                  </tbody>
                </table>
              </>
            )}

            <button
              className="shop-button"
              type="button"
              onClick={() => setShowSizeGuide(false)}
            >
              DONE
            </button>
          </div>
        </div>
      )}

      {showAccount && (
        <div
          className="modal-backdrop"
          role="presentation"
          onClick={() => setShowAccount(false)}
        >
          <div
            className="modal-panel account-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="account-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="modal-close"
              type="button"
              onClick={() => setShowAccount(false)}
              aria-label="Close account window"
            >
              ×
            </button>

            <p className="eyebrow">WELCOME TO URBAN CROWN</p>
            <h2 id="account-title">Your Account</h2>
            <p>
              Account registration and login require a backend service.
              This demo does not create or authenticate accounts.
            </p>

            <button
              className="shop-button"
              type="button"
              onClick={() => {
                setAccountMessage(
                  "Demo only: account registration is not connected."
                );
              }}
            >
              CREATE ACCOUNT
            </button>

            <button
              className="shop-button secondary-button"
              type="button"
              onClick={() => {
                setAccountMessage(
                  "Demo only: login is not connected to an authentication service."
                );
              }}
            >
              LOG IN
            </button>

            {accountMessage && (
              <p className="form-message">{accountMessage}</p>
            )}
          </div>
        </div>
      )}

      {showCookieNotice && (
        <aside className="cookie-notice">
          <div>
            <strong>Your privacy matters</strong>
            <p>
              This demo uses session storage to remember your cookie
              notice choice for this browser session. It does not use
              an advertising or analytics tracker.
            </p>
          </div>

          <div className="cookie-actions">
            <button
              type="button"
              onClick={() => chooseCookieOption("accepted")}
            >
              ACCEPT
            </button>
            <button
              type="button"
              onClick={() => chooseCookieOption("declined")}
            >
              DECLINE
            </button>
          </div>
        </aside>
      )}
    </div>
  );
}

export default App;
