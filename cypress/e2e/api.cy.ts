describe('Streaming API', () => {
  it('returns catalog schema and expected data types', () => {
    cy.request('/api/catalog').then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.total).to.eq(3)
      expect(response.body.items).to.be.an('array')

      response.body.items.forEach((stream: Record<string, unknown>) => {
        expect(stream).to.have.all.keys('id', 'title', 'category', 'status', 'quality', 'viewers')
        expect(stream.id).to.be.a('string')
        expect(stream.title).to.be.a('string')
        expect(stream.viewers).to.be.a('number')
      })
    })
  })

  it('returns a stream by id', () => {
    cy.request('/api/streams/stream-101').then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.include({
        id: 'stream-101',
        title: 'Ocean Depths VR',
        status: 'online'
      })
    })
  })

  it('returns 404 for an unknown stream', () => {
    cy.request({
      url: '/api/streams/unknown',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(404)
      expect(response.body.code).to.eq('STREAM_NOT_FOUND')
    })
  })

  it('creates a favorite and verifies it through GET', () => {
    cy.request('POST', '/api/favorites', { streamId: 'stream-102' }).then((response) => {
      expect(response.status).to.eq(201)
      expect(response.body).to.deep.equal({ streamId: 'stream-102', favorite: true })
    })

    cy.request('/api/favorites').then((response) => {
      expect(response.body.total).to.eq(1)
      expect(response.body.items[0].id).to.eq('stream-102')
    })
  })

  it('returns 400 when streamId is absent', () => {
    cy.request({
      method: 'POST',
      url: '/api/favorites',
      failOnStatusCode: false,
      body: {}
    }).then((response) => {
      expect(response.status).to.eq(400)
      expect(response.body.code).to.eq('VALIDATION_ERROR')
    })
  })
})
