# ~~shot~~ pickleback

This is a patched version of [shot](https://github.com/hapijs/shot) that implements [an admittedly pretty gross fix](https://github.com/jfhbrook/pickleback/blob/patches/lib/index.js#L41-L48) so that it works with [express](https://expressjs.com)  because [the shot team won't](https://github.com/hapijs/shot/issues/82).

Unlike the case with shot, this works:

```js
const assert = require('assert');

const express = require('express');
const pickleback = require('pickleback');

const app = express();

app.get('/', (req, res) => {

    res.end('hello world!');
});

const main = async () => {

    const res = await pickleback.inject(app, { url: '/' });
    assert.equal(res.payload, 'hello world!');
}

main();

```

## API

APIs are almost identical to shot's, so [shot's docs](https://hapi.dev/family/shot) should be correct.
