# Handling of Promise.prototype.finally() in synchronous-promise

This is an example project to show, how [synchronous-promise](https://github.com/fluffynuts/synchronous-promise) doesn't handle `Promise.prototype.finally()` correctly.

In the test file `finally.test.js`, all tests except for those using `.finally()` in cases where the handling of the promise should be paused (either be using) `.pause()` or by having an `.unresolved()` promise).

Those fail, it seems, because even for unresolved promises `.finally()` is executed when defined rather than after the previous steps have been completed.
