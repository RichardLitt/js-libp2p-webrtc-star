/* eslint-env mocha */

'use strict'

const expect = require('chai').expect
const multiaddr = require('multiaddr')
const series = require('run-series')

const WebRTCStar = require('../../src/webrtc-star')

describe('dial', () => {
  let ws1
  const ma1 = multiaddr('/libp2p-webrtc-star/ip4/127.0.0.1/tcp/15555/ws/ipfs/QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSooo2a')

  let ws2
  const ma2 = multiaddr('/libp2p-webrtc-star/ip4/127.0.0.1/tcp/15555/ws/ipfs/QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSooo2b')

  before((done) => {
    series([
      first,
      second
    ], done)

    function first (next) {
      ws1 = new WebRTCStar()

      const listener = ws1.createListener((conn) => {
        conn.pipe(conn)
      })

      listener.listen(ma1, next)
    }

    function second (next) {
      ws2 = new WebRTCStar()

      const listener = ws2.createListener((conn) => {
        conn.pipe(conn)
      })
      listener.listen(ma2, next)
    }
  })

  it('dial on IPv4, check callback', (done) => {
    ws1.dial(ma2, (err, conn) => {
      expect(err).to.not.exist
      done()
    })
  })

  it('dial on IPv4, check for connect event', (done) => {
    const conn = ws1.dial(ma2)
    conn.on('connect', done)
  })

  it.skip('dial on IPv6', (done) => {
    // TODO IPv6 not supported yet
  })
})