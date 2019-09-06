# Handling of Promise.prototype.finally() in synchronous-promise

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com) [![Build Status](https://travis-ci.com/blalasaadri/finally-in-synchronous-promise.svg?branch=master)](https://travis-ci.com/blalasaadri/finally-in-synchronous-promise)

This is an example project to show, how [synchronous-promise](https://github.com/fluffynuts/synchronous-promise) 2.0.9 doesn't handle `Promise.prototype.finally()` correctly.

In the test file `finally.test.js`, all tests except for those using `.finally()` in cases where the handling of the promise should be paused (either be using) `.pause()` or by having an `.unresolved()` promise).

Those fail, it seems, because even for unresolved promises `.finally()` is executed when defined rather than after the previous steps have been completed.

## Fixed in version 2.0.10

This repository was used to [report the issue](https://github.com/fluffynuts/synchronous-promise/issues/15).
It has been fixed by commit [85fdcc2](https://github.com/fluffynuts/synchronous-promise/commit/85fdcc26f94bbccde5a12b9bf2451d661a123927) which is included in version 2.0.10 of the library.
For that reason, this repository is being archived.
