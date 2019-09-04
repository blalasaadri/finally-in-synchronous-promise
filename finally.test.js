const { SynchronousPromise } = require('synchronous-promise')

describe('SynchronousPromise', () => {
  describe('new SynchronousPromise', () => {
    it('calls .then() after being resolved', () => {
      const events = []

      new SynchronousPromise((resolve, reject) => {
        events.push('init')
        resolve('resolve')
      }).then(result => { events.push(result) })
        .then(() => { events.push('then') })

      expect(events)
        .toEqual(['init', 'resolve', 'then'])
    })

    it('calls .catch() but not previous .then()s after being rejected', () => {
      const events = []

      new SynchronousPromise((resolve, reject) => {
        events.push('init')
        reject('reject')
      }).then(result => { events.push(`result: ${result}`) })
        .then(() => { events.push('then') })
        .catch(error => { events.push(`error: ${error}`) })

      expect(events)
        .toEqual(['init', 'error: reject'])
    })

    it('calls .finally() after .then()', () => {
      const events = []

      new SynchronousPromise((resolve, reject) => {
        resolve('init')
      }).then(result => { events.push(result) })
        .then(() => { events.push('then') })
        .finally(() => { events.push('finally') })

      expect(events)
        .toEqual(['init', 'then', 'finally'])
    })

    it('calls .finally() after .catch()', () => {
      const events = []

      new SynchronousPromise((resolve, reject) => {
        reject('init')
      }).then(result => { events.push(result) })
        .then(() => { events.push('then') })
        .catch(error => { events.push(`error: ${error}`) })
        .finally(() => { events.push('finally') })

      expect(events)
        .toEqual(['error: init', 'finally'])
    })
  })

  describe('SynchronousPromise.unresolved', () => {
    describe('calls .then() only after being resolved', () => {
      it('calls nothing before promise.resolve is called', () => {
        const events = []

        SynchronousPromise.unresolved()
          .then((result) => events.push(result))
          .then(() => { events.push('then') })

        expect(events).toEqual([])
      })

      it('calls .then() once promise.resolve is called', () => {
        const events = []

        const promise = SynchronousPromise.unresolved()
          .then((result) => events.push(result))
          .then(() => { events.push('then') })
        promise.resolve('resolve')

        expect(events).toEqual(['resolve', 'then'])
      })
    })

    it('calls .catch() but not previous .then()s after being rejected', () => {
      const events = []

      const promise = SynchronousPromise.unresolved()
        .then((result) => events.push(result))
        .then(() => { events.push('then') })
        .catch(error => { events.push(`error: ${error}`) })
      promise.reject('reject')

      expect(events)
        .toEqual(['error: reject'])
    })

    describe('calls .finally() after .then()', () => {
      it('calls nothing before promise.resolve is called', () => {
        const events = []

        SynchronousPromise.unresolved()
          .then((result) => events.push(result))
          .then(() => { events.push('then') })
          .finally(() => { events.push('finally') })

        expect(events).toEqual([])
      })

      it('calls .then() and .finally() once promise.resolve is called', () => {
        const events = []

        const promise = SynchronousPromise.unresolved()
          .then((result) => events.push(result))
          .then(() => { events.push('then') })
          .finally(() => { events.push('finally') })
        promise.resolve('resolve')

        expect(events).toEqual(['resolve', 'then', 'finally'])
      })
    })

    describe('calls .finally() after .catch()', () => {
      it('calls nothing before promise.reject is called', () => {
        const events = []

        SynchronousPromise.unresolved()
          .then((result) => events.push(result))
          .catch(() => { events.push('catch') })
          .finally(() => { events.push('finally') })

        expect(events).toEqual([])
      })

      it('calls .catch() and .finally() once promise.reject is called', () => {
        const events = []

        const promise = SynchronousPromise.unresolved()
          .then((result) => events.push(result))
          .catch(() => { events.push('catch') })
          .finally(() => { events.push('finally') })
        promise.reject('reject')

        expect(events).toEqual(['catch', 'finally'])
      })
    })
  })
})
