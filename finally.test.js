const { SynchronousPromise } = require('synchronous-promise')

describe('SynchronousPromise', () => {
  describe('new SynchronousPromise', () => {
    it('calls .then() after being resolved', () => {
      const events = []

      new SynchronousPromise((resolve, reject) => {
        events.push('init')
        resolve('resolve')
      }).then(result => { events.push(`result: ${result}`) })
        .then(() => { events.push('then') })

      expect(events)
        .toEqual(['init', 'result: resolve', 'then'])
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
      }).then(result => { events.push(`result: ${result}`) })
        .then(() => { events.push('then') })
        .finally(() => { events.push('finally') })

      expect(events)
        .toEqual(['result: init', 'then', 'finally'])
    })

    it('calls .finally() after .catch()', () => {
      const events = []

      new SynchronousPromise((resolve, reject) => {
        reject('init')
      }).then(result => { events.push(`result: ${result}`) })
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
          .then((result) => { events.push(`result: ${result}`) })
          .then(() => { events.push('then') })

        expect(events).toEqual([])
      })

      it('calls .then() once promise.resolve is called', () => {
        const events = []

        const promise = SynchronousPromise.unresolved()
          .then((result) => { events.push(`result: ${result}`) })
          .then(() => { events.push('then') })
        promise.resolve('resolve')

        expect(events).toEqual(['result: resolve', 'then'])
      })
    })

    it('calls .catch() but not previous .then()s after being rejected', () => {
      const events = []

      const promise = SynchronousPromise.unresolved()
        .then((result) => { events.push(`result: ${result}`) })
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
          .then((result) => { events.push(`result: ${result}`) })
          .then(() => { events.push('then') })
          .finally(() => { events.push('finally') })

        expect(events)
          .not.toContain('finally')
        expect(events)
          .toEqual([])
      })

      it('calls .then() and .finally() once promise.resolve is called', () => {
        const events = []

        const promise = SynchronousPromise.unresolved()
          .then((result) => { events.push(`result: ${result}`) })
          .then(() => { events.push('then') })
          .finally(() => { events.push('finally') })
        promise.resolve('resolve')

        expect(events)
          .not.toEqual(['finally', 'result: undefined', 'then'])
        expect(events)
          .toEqual(['result: resolve', 'then', 'finally'])
      })
    })

    describe('calls .finally() after .catch()', () => {
      it('calls nothing before promise.reject is called', () => {
        const events = []

        SynchronousPromise.unresolved()
          .then((result) => { events.push(`result: ${result}`) })
          .catch(() => { events.push('catch') })
          .finally(() => { events.push('finally') })

        expect(events)
          .not.toContain('finally')
        expect(events)
          .toEqual([])
      })

      it('calls .catch() and .finally() once promise.reject is called', () => {
        const events = []

        const promise = SynchronousPromise.unresolved()
          .then((result) => { events.push(`result: ${result}`) })
          .catch((error) => { events.push(`error: ${error}`) })
          .finally(() => { events.push('finally') })
        promise.reject('reject')

        expect(events)
          .not.toEqual(['finally', 'result: undefined'])
        expect(events)
          .toEqual(['error: reject', 'finally'])
      })
    })
  })

  describe('SynchronousPromise.resolve(...).pause', () => {
    describe('calls .then() only after being resolved', () => {
      it('calls nothing after the inital initialization before promise.resume is called', () => {
        const events = []

        SynchronousPromise.resolve('init')
          .then((result) => { events.push(`result: ${result}`) })
          .pause()
          .then(() => { events.push('resumed') })

        expect(events)
          .toEqual(['result: init'])
      })

      it('calls .then() after the inital initialization after promise.resume is called', () => {
        const events = []

        const promise = SynchronousPromise.resolve('init')
          .then((result) => { events.push(`result: ${result}`) })
          .pause()
          .then(() => { events.push('resumed') })
        promise.resume()

        expect(events)
          .toEqual(['result: init', 'resumed'])
      })
    })

    describe('calls .catch() only after being resolved', () => {
      it('calls nothing after the inital initialization before promise.resume is called', () => {
        const events = []

        SynchronousPromise.resolve('init')
          .then((result) => {
            events.push(`result: ${result}`)
            throw Error('resumed')
          })
          .pause()
          .catch(({ message }) => { events.push(`catch: ${message}`) })

        expect(events)
          .toEqual(['result: init'])
      })

      it('calls .catch() after the inital initialization after promise.resume is called', () => {
        const events = []

        const promise = SynchronousPromise.resolve('init')
          .then((result) => {
            events.push(`result: ${result}`)
            throw Error('resumed')
          })
          .pause()
          .catch(({ message }) => { events.push(`catch: ${message}`) })
        promise.resume()

        expect(events)
          .toEqual(['result: init', 'catch: resumed'])
      })
    })

    describe('calls .finally() after .then()', () => {
      it('calls nothing before promise.resume is called', () => {
        const events = []

        SynchronousPromise.resolve('init')
          .then((result) => { events.push(`result: ${result}`) })
          .pause()
          .then(() => { events.push('resumed') })
          .finally(() => { events.push('finally') })

        expect(events)
          .not.toContain('finally')
        expect(events)
          .toEqual(['result: init'])
      })

      it('calls .then() and .finally() once promise.resume is called', () => {
        const events = []

        const promise = SynchronousPromise.resolve('init')
          .then((result) => { events.push(`result: ${result}`) })
          .pause()
          .then(() => { events.push('resumed') })
          .finally(() => { events.push('finally') })
        promise.resume()

        expect(events)
          .not.toEqual(['result: init', 'finally', 'resumed'])
        expect(events)
          .toEqual(['result: init', 'resumed', 'finally'])
      })
    })

    describe('calls .finally() after .catch()', () => {
      it('calls nothing before promise.resume is called', () => {
        const events = []

        SynchronousPromise.resolve('init')
          .then((result) => {
            events.push(`result: ${result}`)
            throw Error('resumed')
          })
          .pause()
          .catch(({ message }) => { events.push(`catch: ${message}`) })
          .finally(() => { events.push('finally') })

        expect(events)
          .not.toContain('finally')
        expect(events)
          .toEqual(['result: init'])
      })

      it('calls .catch() and .finally() once promise.resume is called', () => {
        const events = []

        const promise = SynchronousPromise.resolve('init')
          .then((result) => {
            events.push(`result: ${result}`)
            throw Error('resumed')
          })
          .pause()
          .catch(({ message }) => { events.push(`catch: ${message}`) })
          .finally(() => { events.push('finally') })
        promise.resume()

        expect(events)
          .not.toEqual(['result: init', 'finally', 'catch: resumed'])
        expect(events)
          .toEqual(['result: init', 'catch: resumed', 'finally'])
      })
    })
  })
})
