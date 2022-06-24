# stubs-express-middleware

`npm i stubs-express-middleware`

```angular2html
    if (process.env.NODE_ENV === 'development') {
        // put it before bodyparser
        require('stubs-express-middleware')(app, require('../stubs/config.json'))
    }
```

```angular2html
// config.json
{
  "port": 5000,
  "image": "brucejcw/stubs:1.0.1",
  "proxy": {
    "/bff": "/"
  }
}


```
