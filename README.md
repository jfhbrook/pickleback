# ~~shot~~ pickleback

This is a patched version of [shot](https://github.com/hapijs/shot) that implements [an admittedly pretty gross fix](https://github.com/jfhbrook/pickleback/blob/patches/lib/index.js#L55-L57) so that it works with [express](https://expressjs.com)  because [the shot team won't](https://github.com/hapijs/shot/issues/82).

## Example

Unlike the case with shot, this works:

```js
const express = require('express');
const pickleback = require('pickleback');

const app = express();

app.get('/', (req, res) => {
  res.end('hello world!');
});

pickleback.inject(app, { url: '/' }, (res) => {
  assert.equal(res.payload, 'hello world!');
});

```

## API

APIs are almost identical to shot's, so [shot's docs](https://github.com/hapijs/shot/blob/master/API.md) should be correct.
