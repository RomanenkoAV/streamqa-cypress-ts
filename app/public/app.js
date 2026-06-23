const loginPanel = document.querySelector('[data-testid="login-panel"]')
const catalogPanel = document.querySelector('[data-testid="catalog-panel"]')
const loginForm = document.querySelector('[data-testid="login-form"]')
const loginError = document.querySelector('[data-testid="login-error"]')
const streamList = document.querySelector('[data-testid="stream-list"]')
const catalogLoading = document.querySelector('[data-testid="catalog-loading"]')
const catalogError = document.querySelector('[data-testid="catalog-error"]')
const emptyState = document.querySelector('[data-testid="empty-state"]')
const searchInput = document.querySelector('[data-testid="search-input"]')
const statusFilter = document.querySelector('[data-testid="status-filter"]')

const state = {
  token: window.localStorage.getItem('token'),
  favorites: new Set()
}

const request = async (url, options = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  })

  const contentType = response.headers.get('content-type') || ''
  const data = contentType.includes('application/json') ? await response.json() : null

  if (!response.ok) {
    const error = new Error(data?.message || 'Request failed')
    error.status = response.status
    throw error
  }

  return data
}

const showCatalog = () => {
  loginPanel.hidden = true
  catalogPanel.hidden = false
  loadCatalog()
}

const showLogin = () => {
  catalogPanel.hidden = true
  loginPanel.hidden = false
}

const renderCatalog = (items) => {
  streamList.innerHTML = ''
  emptyState.hidden = items.length !== 0

  items.forEach((stream) => {
    const card = document.createElement('article')
    card.className = 'stream-card'
    card.dataset.testid = 'stream-card'
    card.dataset.streamId = stream.id

    const favorite = state.favorites.has(stream.id)

    card.innerHTML = `
      <div class="card-header">
        <h3 data-testid="stream-title">${stream.title}</h3>
        <span data-testid="stream-status" class="status status-${stream.status}">${stream.status}</span>
      </div>
      <p class="metadata">
        Category ${stream.category}<br />
        Quality ${stream.quality}<br />
        Viewers ${stream.viewers}
      </p>
      <div class="card-footer">
        <span>${stream.id}</span>
        <button
          type="button"
          data-testid="favorite-button"
          data-stream-id="${stream.id}"
          class="favorite-button ${favorite ? 'active' : ''}"
        >${favorite ? 'Remove favorite' : 'Add favorite'}</button>
      </div>
    `

    streamList.appendChild(card)
  })
}

const loadCatalog = async () => {
  catalogLoading.hidden = false
  catalogError.hidden = true
  emptyState.hidden = true
  streamList.innerHTML = ''

  const params = new URLSearchParams()
  if (searchInput.value.trim()) params.set('q', searchInput.value.trim())
  if (statusFilter.value) params.set('status', statusFilter.value)

  try {
    const data = await request(`/api/catalog?${params.toString()}`)
    renderCatalog(data.items)
  } catch (error) {
    catalogError.textContent = `Unable to load catalog. ${error.message}`
    catalogError.hidden = false
  } finally {
    catalogLoading.hidden = true
  }
}

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault()
  loginError.hidden = true

  const email = document.querySelector('[data-testid="email-input"]').value
  const password = document.querySelector('[data-testid="password-input"]').value

  try {
    const data = await request('/api/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    })
    state.token = data.token
    window.localStorage.setItem('token', data.token)
    showCatalog()
  } catch (error) {
    loginError.textContent = error.message
    loginError.hidden = false
  }
})

document.querySelector('[data-testid="logout-button"]').addEventListener('click', () => {
  state.token = null
  window.localStorage.removeItem('token')
  showLogin()
})

document.querySelector('[data-testid="refresh-button"]').addEventListener('click', loadCatalog)
searchInput.addEventListener('input', loadCatalog)
statusFilter.addEventListener('change', loadCatalog)

streamList.addEventListener('click', async (event) => {
  const button = event.target.closest('[data-testid="favorite-button"]')
  if (!button) return

  const streamId = button.dataset.streamId
  button.disabled = true

  try {
    if (state.favorites.has(streamId)) {
      await request(`/api/favorites/${streamId}`, { method: 'DELETE' })
      state.favorites.delete(streamId)
      button.classList.remove('active')
      button.textContent = 'Add favorite'
    } else {
      await request('/api/favorites', {
        method: 'POST',
        body: JSON.stringify({ streamId })
      })
      state.favorites.add(streamId)
      button.classList.add('active')
      button.textContent = 'Remove favorite'
    }
  } catch (error) {
    catalogError.textContent = `Unable to update favorite. ${error.message}`
    catalogError.hidden = false
  } finally {
    button.disabled = false
  }
})

if (state.token) showCatalog()
else showLogin()
