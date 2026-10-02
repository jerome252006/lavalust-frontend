import { useEffect, useState } from 'react'
import {
  createProduct,
  deleteProduct,
  getProducts,
  login,
  logout,
  updateProduct,
} from './api'

const emptyProduct = { product_name: '', description: '', price: '', quantity: '' }

function Brand() {
  return (
    <span className="brand" aria-label="Product management">
      <span className="brand-mark" aria-hidden="true">+</span>
      <span>PRODUCT<small>MANAGEMENT</small></span>
    </span>
  )
}

function Login({ onLogin, error }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  function submit(event) {
    event.preventDefault()
    onLogin(username, password)
  }

  return (
    <div className="app-frame auth-frame">
      <header className="site-header glass-nav">
        <div className="container nav-wrap"><Brand /><span className="header-note">INVENTORY WORKSPACE</span></div>
      </header>
      <main className="auth-main">
        <section className="auth-hero container">
          <div className="auth-copy">
            <p className="eyebrow">STAFF PORTAL</p>
            <h1>Keep your inventory moving.</h1>
            <p className="lead">Manage your product catalog, stock levels, and product details from one clear workspace.</p>
          </div>
          <form className="glass-card auth-card" onSubmit={submit}>
            <p className="eyebrow">WELCOME BACK</p>
            <h2>Sign in to your shop</h2>
            <p className="muted">Use your staff account to continue.</p>
            <label>Username<input value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" required /></label>
            <label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required /></label>
            {error && <p className="alert error">{error}</p>}
            <button className="button button-primary glass-button" type="submit">Sign in <span aria-hidden="true">↗</span></button>
          </form>
        </section>
      </main>
    </div>
  )
}

function ProductForm({ product, editing, onChange, onSubmit, onCancel, error }) {
  return (
    <form className="glass-card product-form" onSubmit={onSubmit}>
      <div className="form-heading">
        <div>
          <p className="eyebrow">{editing ? 'UPDATE PRODUCT' : 'NEW PRODUCT'}</p>
          <h2>{editing ? 'Edit product' : 'Add a product'}</h2>
        </div>
        {editing && <button type="button" className="button button-ghost" onClick={onCancel}>Cancel</button>}
      </div>
      <div className="form-grid">
        <label>Product name<input name="product_name" value={product.product_name} onChange={onChange} maxLength="100" placeholder="e.g. Trailblazer Helmet" required /></label>
        <label>Description<textarea name="description" value={product.description} onChange={onChange} placeholder="Describe the product..." required /></label>
        <label>Price<input name="price" type="number" min="0" step="0.01" value={product.price} onChange={onChange} placeholder="0.00" required /></label>
        <label>Quantity<input name="quantity" type="number" min="0" step="1" value={product.quantity} onChange={onChange} placeholder="0" required /></label>
      </div>
      {error && <p className="alert error">{error}</p>}
      <button className="button button-primary glass-button" type="submit">{editing ? 'Save changes' : 'Add product'} <span aria-hidden="true">↗</span></button>
    </form>
  )
}

function ProductCard({ product, onEdit, onDelete }) {
  const availability = Number(product.quantity) === 0 ? 'Out of stock' : Number(product.quantity) <= 5 ? 'Low stock' : 'In stock'
  const availabilityClass = availability.toLowerCase().replace(' ', '-')

  return (
    <article className="product-card glass-card">
      <div className="product-art" aria-hidden="true"><span>PRODUCT</span><strong>IN<br />STOCK</strong></div>
      <div className="card-copy">
        <p className="tag">CATALOG ITEM</p>
        <p className="product-brand">Inventory item</p>
        <h3>{product.product_name}</h3>
        <p className={`availability-badge availability-${availabilityClass}`}>{availability} · {product.quantity} unit{Number(product.quantity) === 1 ? '' : 's'}</p>
        <p className="card-description">{product.description}</p>
        <div className="card-bottom">
          <div><p className="price">₱{Number(product.price).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</p><span className="muted">Product #{product.id}</span></div>
          <div className="button-row">
            <button className="button button-ghost" onClick={() => onEdit(product)}>Edit</button>
            <button className="button button-danger" onClick={() => onDelete(product.id)}>Delete</button>
          </div>
        </div>
      </div>
    </article>
  )
}

function ProductList({ products, onEdit, onDelete, onAdd, error }) {
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy-panel">
            <div className="hero-copy">
              <p className="eyebrow">PRODUCT MANAGEMENT · STAFF PORTAL</p>
              <h1>Everything your inventory needs, in one place.</h1>
              <p className="lead">Review your products, check stock levels, and keep your catalog ready for what comes next.</p>
              <div className="button-row"><button className="button button-primary glass-button" onClick={onAdd}>Add a product <span aria-hidden="true">↗</span></button><span className="hero-caption">Simple tools. Clear inventory.</span></div>
            </div>
          </div>
          <div className="hero-card glass-card" aria-label="Catalog summary">
            <span className="hero-card-kicker">INVENTORY OVERVIEW</span>
            <strong>{String(products.length).padStart(2, '0')}</strong>
            <span>catalog items<br />currently listed</span>
            <div className="hero-wheel" aria-hidden="true">✳</div>
          </div>
        </div>
      </section>
      <section className="container stats" aria-label="Catalog summary">
        <div><strong>{products.length}</strong><span>Products listed</span></div>
        <div><strong>{products.reduce((sum, product) => sum + Number(product.quantity || 0), 0)}</strong><span>Units in stock</span></div>
        <div><strong>24/7</strong><span>Catalog access</span></div>
      </section>
      <section className="container section-block">
        <div className="section-title"><div><p className="eyebrow">YOUR CURRENT CATALOG</p><h2>Products</h2></div><span className="muted">{products.length} item{products.length === 1 ? '' : 's'}</span></div>
        {error && <p className="alert error">{error}</p>}
        <div className="catalog-grid">
          {products.map((product) => <ProductCard key={product.id} product={product} onEdit={onEdit} onDelete={onDelete} />)}
        </div>
        {!products.length && <div className="empty-state glass-card"><span className="empty-symbol">✳</span><h3>Your product list is ready.</h3><p className="muted">Add a product to start building your inventory.</p><button className="button button-primary" onClick={onAdd}>Add first product</button></div>}
      </section>
    </>
  )
}

function Products({ onLogout }) {
  const [products, setProducts] = useState([])
  const [route, setRoute] = useState(window.location.hash || '#/products')
  const [form, setForm] = useState(emptyProduct)
  const [error, setError] = useState('')
  const [authorized, setAuthorized] = useState(false)

  async function load() {
    try {
      setProducts((await getProducts()).data || [])
      setAuthorized(true)
    } catch (err) {
      if (err.message === 'Unauthorized') {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        onLogout()
        return
      }
      setAuthorized(true)
      setError(err.message)
    }
  }

  useEffect(() => { load() }, [])

  useEffect(() => {
    const navigate = () => setRoute(window.location.hash || '#/products')
    window.addEventListener('hashchange', navigate)
    return () => window.removeEventListener('hashchange', navigate)
  }, [])

  if (!authorized) {
    return (
      <main className="auth-main">
        <section className="container glass-card loading-card">
          <p className="eyebrow">AUTHENTICATING</p>
          <h1>Checking your access...</h1>
        </section>
      </main>
    )
  }

  function go(path) {
    window.location.hash = path
  }

  function change(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  async function save(event) {
    event.preventDefault()
    try {
      const editId = route.match(/^#\/products\/edit\/(\d+)$/)?.[1]
      if (editId) await updateProduct(editId, form)
      else await createProduct(form)
      setForm(emptyProduct)
      setError('')
      await load()
      go('#/products')
    } catch (err) {
      setError(err.message)
    }
  }

  async function remove(id) {
    if (!window.confirm('Delete this product?')) return
    try {
      await deleteProduct(id)
      await load()
    } catch (err) {
      setError(err.message)
    }
  }

  async function signOut() {
    try { await logout() } catch { /* Credentials are removed regardless. */ }
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    onLogout()
  }

  function edit(product) {
    setForm({
      product_name: product.product_name,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
    })
    go(`#/products/edit/${product.id}`)
  }

  const editingProduct = route.match(/^#\/products\/edit\/(\d+)$/)
  const editing = editingProduct ? products.find((product) => String(product.id) === editingProduct[1]) : null

  return (
    <div className="app-frame">
      <header className="site-header glass-nav">
        <div className="container nav-wrap">
          <Brand />
          <nav className="site-nav" aria-label="Product management navigation">
            <a className="active" href="#/products">Catalog</a>
            <a href="#/products/new">Add product</a>
            <button className="button button-ghost" onClick={signOut}>Logout</button>
          </nav>
        </div>
      </header>
      <main id="catalog">
        {route === '#/products/new' || editingProduct
          ? <section className="container standalone-section"><div className="page-heading"><p className="eyebrow">{editingProduct ? 'EDIT PRODUCT' : 'ADD PRODUCT'}</p><h1>{editingProduct ? 'Update product details.' : 'Add a new product.'}</h1><p className="lead">Keep your inventory information accurate and ready for your customers.</p></div><ProductForm product={editing || form} editing={Boolean(editingProduct)} error={error} onChange={change} onSubmit={save} onCancel={() => { setForm(emptyProduct); setError(''); go('#/products') }} /></section>
          : <ProductList products={products} onEdit={edit} onDelete={remove} onAdd={() => { setForm(emptyProduct); setError(''); go('#/products/new') }} error={error} />}
      </main>
      <footer className="site-footer"><div className="container"><Brand /><p>Product management workspace.</p></div></footer>
    </div>
  )
}

export default function App() {
  const [authenticated, setAuthenticated] = useState(Boolean(localStorage.getItem('access_token')))
  const [error, setError] = useState('')

  async function signIn(username, password) {
    try {
      const result = await login(username, password)
      localStorage.setItem('access_token', result.token.access_token)
      localStorage.setItem('refresh_token', result.token.refresh_token)
      window.location.hash = '#/products'
      setAuthenticated(true)
      setError('')
    } catch (err) {
      setError(err.message)
    }
  }

  return authenticated ? <Products onLogout={() => setAuthenticated(false)} /> : <Login onLogin={signIn} error={error} />
}
