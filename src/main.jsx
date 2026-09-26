import { useMemo, useState } from 'react'
import './styles.css'

const catalogSource = '/images/github-repo-details/photo_2026-09-26_18-46-15.jpg'

const products = [
  ['JM-T001', 'Pop 10C', 'BG6m 64+2', 116638, 'Smartphones'],
  ['JM-T002', 'Pop 10', 'KM4 64+3', 121368, 'Smartphones'],
  ['JM-T003', 'Pop 10', 'KM4 128+3', 132978, 'Smartphones'],
  ['JM-T004', 'POP 10 Pro', 'KM4K 128+4', 144480, 'Smartphones'],
  ['JM-T005', 'POP 20', 'KN3 64+4', 154700, 'Smartphones', true],
  ['JM-T006', 'POP20', 'KN3 128+4', 163500, 'Smartphones', true],
  ['JM-T007', 'SPARK 50', 'KN4 128+4', 199500, 'Smartphones', true],
  ['JM-T008', 'Spark 40', 'KM5 128+4', 162755, 'Smartphones'],
  ['JM-T009', 'Spark 40', 'KM5 256+8', 198445, 'Smartphones'],
  ['JM-T010', 'Spark 40 Pro', 'KM6 128+8', 275630, 'Smartphones'],
  ['JM-T011', 'Spark 40 Pro', 'KM6 256+8', 261978, 'Smartphones'],
  ['JM-T012', 'Spark 40 Pro+', 'KM7 128+8', 283800, 'Smartphones'],
  ['JM-T013', 'Spark 40 Pro+', 'KM7 256+8', 322285, 'Smartphones'],
  ['JM-T014', 'Spark Slim', 'KM7k 256+8', 354428, 'Smartphones'],
  ['JM-T015', 'Mega Pad SE', 'T1102 128+4', 249615, 'Tablets'],
  ['JM-T016', 'Mega Pad SE', 'T1102 256+8', 285520, 'Tablets'],
  ['JM-T017', 'Mega Pad Pro', 'T1201 256+8', 344323, 'Tablets'],
  ['JM-T018', 'Camon 50', 'CN5 128+8', 397643, 'Smartphones'],
  ['JM-T019', 'Camon 50', 'CN5 256+8', 447523, 'Smartphones'],
  ['JM-T020', 'Camon 50 Pro', 'CN5c 256+8', 499230, 'Smartphones'],
  ['JM-T021', 'Camon 50 Ultra', 'CN7c 512+8', 749920, 'Smartphones'],
  ['JM-T022', 'Phantom V Flip 2', 'AE11 256+8', 1053285, 'Smartphones'],
  ['JM-T023', 'Phantom V Fold 2', 'AE10 512+12', 1799335, 'Smartphones'],
].map(([id, name, model, price, category, highlighted]) => ({
  id, name, model, price, category, highlighted,
  brand: 'TECNO',
  imageStatus: 'Needs verification',
  imageSource: catalogSource,
  description: `Official TECNO price-list entry for ${name} (${model}). Product photography is pending exact model verification.`,
  specs: { 'Model': model, 'Brand': 'TECNO', 'Catalog ID': id, 'VAT': 'Included in RRP' },
}))

const categories = [
  { name: 'Smartphones', icon: '▣', count: `${products.filter((p) => p.category === 'Smartphones').length} models` },
  { name: 'Tablets', icon: '▤', count: `${products.filter((p) => p.category === 'Tablets').length} models` },
  { name: 'Accessories', icon: '⌁', count: 'Coming soon' },
  { name: 'Audio', icon: '◖', count: 'Coming soon' },
  { name: 'Power & charging', icon: 'ϟ', count: 'Coming soon' },
]

const formatPrice = (price) => `₦${price.toLocaleString('en-NG')}`

function Icon({ children, className = '' }) {
  return <span className={`icon ${className}`} aria-hidden="true">{children}</span>
}

function ProductVisual({ product, compact = false }) {
  return (
    <div className={`product-visual ${compact ? 'compact' : ''}`}>
      <div className="visual-glow" />
      <div className="visual-device"><span>TECNO</span><strong>{product.name.split(' ')[0]}</strong></div>
      <div className="verification-chip"><span className="status-dot" /> Exact image pending</div>
    </div>
  )
}

function ProductCard({ product, onAdd, onView, onWish, wished }) {
  return (
    <article className="product-card">
      <div className="card-image-wrap">
        <ProductVisual product={product} />
        <button className={`wish-button ${wished ? 'active' : ''}`} onClick={() => onWish(product.id)} aria-label="Add to wishlist">{wished ? '♥' : '♡'}</button>
        {product.highlighted && <span className="featured-tag">Catalog highlight</span>}
      </div>
      <div className="product-copy">
        <div className="product-meta"><span>{product.brand}</span><span>{product.category}</span></div>
        <h3>{product.name}</h3>
        <p className="model-line">{product.model}</p>
        <div className="card-bottom"><strong>{formatPrice(product.price)}</strong><span className="availability"><i /> In catalog</span></div>
        <div className="card-actions"><button className="text-button" onClick={() => onView(product)}>Quick view <span>↗</span></button><button className="add-button" onClick={() => onAdd(product)}>Add to cart</button></div>
      </div>
    </article>
  )
}

function App() {
  const [activeCategory, setActiveCategory] = useState('All products')
  const [query, setQuery] = useState('')
  const [cart, setCart] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [heroSlide, setHeroSlide] = useState(0)
  const [notice, setNotice] = useState('')

  const filteredProducts = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return products.filter((product) => {
      const matchesCategory = activeCategory === 'All products' || product.category === activeCategory
      const searchable = `${product.name} ${product.brand} ${product.model} ${product.id} ${product.category}`.toLowerCase()
      return matchesCategory && (!normalized || searchable.includes(normalized))
    })
  }, [activeCategory, query])

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const showNotice = (message) => { setNotice(message); window.setTimeout(() => setNotice(''), 2600) }
  const addToCart = (product) => {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id)
      return existing ? current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item) : [...current, { ...product, quantity: 1 }]
    })
    showNotice(`${product.name} added to your cart`)
  }
  const toggleWish = (id) => setWishlist((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])
  const updateQuantity = (id, direction) => setCart((current) => current.map((item) => item.id === id ? { ...item, quantity: item.quantity + direction } : item).filter((item) => item.quantity > 0))

  const slides = [
    { eyebrow: 'TECNO COLLECTION / 2026', title: 'Technology that\nfits your everyday.', body: 'Shop official catalog pricing on thoughtfully selected phones and tablets from a store built around honest value.', button: 'Shop catalog', accent: '01' },
    { eyebrow: 'SMARTER EVERY DAY', title: 'Make more\nroom for possibility.', body: 'From pocket-ready smartphones to powerful tablets, find the right tech for work, play and everything between.', button: 'Explore devices', accent: '02' },
    { eyebrow: 'SHOP WITH CONFIDENCE', title: 'Clear prices.\nNo guesswork.', body: 'Every listed model is connected to its catalog record. Product photography is only shown after exact verification.', button: 'View our process', accent: '03' },
  ]
  const slide = slides[heroSlide]

  return (
    <div className="app-shell">
      <div className="notice" aria-live="polite">{notice}</div>
      <header className="site-header">
        <div className="topbar"><div>Open daily <span>•</span> Closes 8:00 PM</div><div className="topbar-right"><span>155 Ibrahim Taiwo Rd, Oko Erin</span><span>Need help? Visit our store</span></div></div>
        <div className="header-main container">
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Open menu"><span /><span /><span /></button>
          <a className="brand" href="#top" aria-label="John Major Innovation Technology home"><img src="/images/logo/photo_2026-09-26_18-46-39.jpg" alt="John Major logo" /><span><strong>JOHN MAJOR</strong><small>INNOVATION TECHNOLOGY</small></span></a>
          <div className="search-wrap"><Icon>⌕</Icon><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search phones, models & gadgets" /><kbd>⌘ K</kbd></div>
          <div className="header-actions"><button className="header-action"><Icon>♙</Icon><span>Account</span></button><button className="header-action"><Icon>♡</Icon><span>Wishlist</span></button><button className="cart-button" onClick={() => setCartOpen(true)}><Icon>▱</Icon><span>Cart</span>{cartCount > 0 && <b>{cartCount}</b>}</button></div>
        </div>
        <nav className={`main-nav ${menuOpen ? 'open' : ''}`}><div className="container nav-inner"><button onClick={() => { setActiveCategory('All products'); setMenuOpen(false) }}>Home</button><button onClick={() => { setActiveCategory('Smartphones'); setMenuOpen(false) }}>Smartphones</button><button onClick={() => { setActiveCategory('Tablets'); setMenuOpen(false) }}>Tablets</button><button onClick={() => showNotice('Accessories are being added to the catalog')}>Accessories</button><button onClick={() => showNotice('Audio collection coming soon')}>Audio</button><button onClick={() => showNotice('Gadgets collection coming soon')}>Gadgets</button><button onClick={() => showNotice('Deals are shown only when verified in the catalog')}>Deals</button><button className="nav-about" onClick={() => document.getElementById('about').scrollIntoView({ behavior: 'smooth' })}>About us</button><button onClick={() => document.getElementById('visit').scrollIntoView({ behavior: 'smooth' })}>Contact & store</button></div></nav>
      </header>

      <main id="top">
        <section className="hero container">
          <div className="hero-copy"><p className="eyebrow">{slide.eyebrow}</p><h1>{slide.title.split('\n').map((line) => <span key={line}>{line}</span>)}</h1><p className="hero-body">{slide.body}</p><div className="hero-cta"><button className="primary-button" onClick={() => document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' })}>{slide.button}<span>↗</span></button><button className="play-button" onClick={() => setHeroSlide((heroSlide + 1) % slides.length)}><span>▶</span> Next story</button></div><div className="slide-controls"><span>{slide.accent} / 03</span><div className="progress"><i style={{ width: `${((heroSlide + 1) / slides.length) * 100}%` }} /></div><button onClick={() => setHeroSlide((heroSlide + 1) % slides.length)}>Next <span>→</span></button></div></div>
          <div className="hero-art"><div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" /><div className="art-glow" /><div className="hero-device"><div className="device-camera" /><div className="device-mark">JM</div><span>TECNO<br /><b>COLLECTION</b></span></div><div className="float-card float-top"><span className="float-label">CATALOG STATUS</span><strong>23</strong><small>verified entries</small></div><div className="float-card float-bottom"><span className="check">✓</span><span>Exact pricing<br /><b>Including VAT</b></span></div><div className="hero-index">{slide.accent}</div></div>
        </section>

        <section className="category-section container"><div className="section-heading"><div><p className="eyebrow">CURATED FOR YOU</p><h2>Find your next <em>essential.</em></h2></div><button className="arrow-link" onClick={() => document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' })}>View all categories <span>↗</span></button></div><div className="category-grid">{categories.map((category) => <button key={category.name} className={`category-tile ${activeCategory === category.name ? 'selected' : ''}`} onClick={() => setActiveCategory(category.name)}><span className="category-icon">{category.icon}</span><span><strong>{category.name}</strong><small>{category.count}</small></span><span className="tile-arrow">↗</span></button>)}</div></section>

        <section className="catalog-section" id="catalog"><div className="container"><div className="section-heading catalog-heading"><div><p className="eyebrow">THE CATALOG</p><h2>Devices with a <em>clear story.</em></h2><p className="section-subtitle">Prices are taken from the supplied TECNO official price list. No product image is presented as verified until it matches the exact model.</p></div><div className="catalog-count"><strong>{filteredProducts.length}</strong><span>catalog entries<br />available now</span></div></div><div className="catalog-toolbar"><div className="filter-pills"><button className={activeCategory === 'All products' ? 'active' : ''} onClick={() => setActiveCategory('All products')}>All products</button><button className={activeCategory === 'Smartphones' ? 'active' : ''} onClick={() => setActiveCategory('Smartphones')}>Smartphones</button><button className={activeCategory === 'Tablets' ? 'active' : ''} onClick={() => setActiveCategory('Tablets')}>Tablets</button></div><span className="sort-note">Official RRP <span>Including VAT</span></span></div>{filteredProducts.length ? <div className="product-grid">{filteredProducts.map((product) => <ProductCard key={product.id} product={product} onAdd={addToCart} onView={setSelectedProduct} onWish={toggleWish} wished={wishlist.includes(product.id)} />)}</div> : <div className="empty-state"><strong>No exact match found</strong><p>Try a model number such as KM6 or search another product name.</p><button className="primary-button" onClick={() => { setQuery(''); setActiveCategory('All products') }}>Clear search</button></div>}</div></section>

        <section className="trust-strip"><div className="container trust-grid"><div><span className="trust-number">01</span><strong>Quality-first selection</strong><p>Catalog records stay tied to their original model and price.</p></div><div><span className="trust-number">02</span><strong>Affordable, clear pricing</strong><p>See the official RRP with VAT included, without invented deals.</p></div><div><span className="trust-number">03</span><strong>Human customer support</strong><p>Visit us in Oko Erin for a considered recommendation.</p></div></div></section>

        <section className="about-section container" id="about"><div className="about-panel"><p className="eyebrow">WHY JOHN MAJOR</p><h2>Good technology should feel <em>simple.</em></h2><p>We are a phone and gadget store in Kwara, Nigeria, focused on making quality devices and everyday technology easier to find at affordable prices.</p><div className="review"><span className="stars">★★★★★</span><blockquote>“It's a phone and gadget store where you can get your phones, accessories and gadget at affordable prices.”</blockquote><cite>— Isaac Ajiyat</cite></div></div><div className="source-panel"><div className="source-label">CATALOG SOURCE</div><div className="source-image"><img src={catalogSource} alt="TECNO official price catalog reference" /></div><p>This catalog reference is retained with each product record so model, pricing and image verification can be reviewed together.</p><button className="text-button" onClick={() => showNotice('Catalog reference is already attached to every listed product')}>View verification note <span>↗</span></button></div></section>

        <section className="visit-section container" id="visit"><div><p className="eyebrow">COME BY & SAY HELLO</p><h2>Visit our <em>store.</em></h2><p>Bring your questions. We’ll help you find the right fit for your everyday.</p></div><div className="address-card"><div className="pin">⌖</div><div><strong>JOHN MAJOR INNOVATION TECHNOLOGY</strong><p>155 Ibrahim Taiwo Rd<br />Oko Erin 240101<br />Kwara, Nigeria</p><small>Open daily · Closes 8:00 PM</small></div><button className="round-arrow" onClick={() => showNotice('Directions will be available once a map location is configured')}>↗</button></div></section>
      </main>

      <footer className="site-footer"><div className="container footer-main"><div className="footer-brand"><a className="brand" href="#top"><img src="/images/logo/photo_2026-09-26_18-46-39.jpg" alt="John Major logo" /><span><strong>JOHN MAJOR</strong><small>INNOVATION TECHNOLOGY</small></span></a><p>Your trusted destination for phones, gadgets and accessories at affordable prices.</p></div><div><h4>Shop</h4><button onClick={() => setActiveCategory('Smartphones')}>Smartphones</button><button onClick={() => setActiveCategory('Tablets')}>Tablets</button><button onClick={() => showNotice('Accessories are being added to the catalog')}>Accessories</button><button onClick={() => showNotice('More collections coming soon')}>Gadgets</button></div><div><h4>Customer care</h4><button onClick={() => document.getElementById('visit').scrollIntoView({ behavior: 'smooth' })}>Contact us</button><button onClick={() => showNotice('FAQs will be configured for store policies')}>FAQs</button><button onClick={() => showNotice('Delivery information will be configured by the store')}>Delivery info</button><button onClick={() => showNotice('Returns and warranty details will be configured by the store')}>Returns & warranty</button></div><div><h4>Store</h4><p>155 Ibrahim Taiwo Rd<br />Oko Erin 240101<br />Kwara, Nigeria</p><p>Open daily<br />Closes 8:00 PM</p></div></div><div className="container footer-bottom"><span>© 2026 John Major Innovation Technology</span><span>Built around clarity, care & real catalog data.</span></div></footer>

      {selectedProduct && <div className="modal-backdrop" onClick={() => setSelectedProduct(null)}><div className="quick-modal" onClick={(event) => event.stopPropagation()}><button className="close-button" onClick={() => setSelectedProduct(null)}>×</button><div className="modal-visual"><ProductVisual product={selectedProduct} /></div><div className="modal-copy"><p className="eyebrow">{selectedProduct.brand} / {selectedProduct.id}</p><h2>{selectedProduct.name}</h2><p className="modal-model">{selectedProduct.model}</p><strong className="modal-price">{formatPrice(selectedProduct.price)}</strong><p>{selectedProduct.description}</p><div className="spec-list">{Object.entries(selectedProduct.specs).map(([key, value]) => <div key={key}><span>{key}</span><strong>{value}</strong></div>)}</div><div className="verification-note"><span className="status-dot" /> Product image pending exact model verification</div><button className="primary-button full" onClick={() => { addToCart(selectedProduct); setSelectedProduct(null) }}>Add to cart <span>↗</span></button></div></div></div>}
      {cartOpen && <div className="drawer-backdrop" onClick={() => setCartOpen(false)}><aside className="cart-drawer" onClick={(event) => event.stopPropagation()}><div className="drawer-heading"><div><p className="eyebrow">YOUR SELECTION</p><h2>Shopping cart</h2></div><button className="close-button" onClick={() => setCartOpen(false)}>×</button></div>{cart.length ? <><div className="cart-items">{cart.map((item) => <div className="cart-item" key={item.id}><ProductVisual product={item} compact /><div className="cart-item-copy"><strong>{item.name}</strong><span>{item.model}</span><b>{formatPrice(item.price)}</b><div className="quantity"><button onClick={() => updateQuantity(item.id, -1)}>−</button><span>{item.quantity}</span><button onClick={() => updateQuantity(item.id, 1)}>+</button></div></div></div>)}</div><div className="cart-summary"><div><span>Subtotal</span><strong>{formatPrice(cartTotal)}</strong></div><div><span>Delivery</span><span>Configured at checkout</span></div><div className="total"><span>Total</span><strong>{formatPrice(cartTotal)}</strong></div><button className="primary-button full" onClick={() => showNotice('Checkout will be connected when delivery and payment details are configured')}>Proceed to checkout <span>↗</span></button><button className="continue-button" onClick={() => setCartOpen(false)}>Continue shopping</button></div></> : <div className="empty-cart"><div>▱</div><h3>Your cart is empty</h3><p>Save a device here when you’re ready to make it yours.</p><button className="primary-button" onClick={() => setCartOpen(false)}>Browse catalog</button></div>}</aside></div>}
    </div>
  )
}

export default App
