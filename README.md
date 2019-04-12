Tiny JavaScript library to catch all errors & post to your server.

```html
<script src="catch-all-errors.min.js" data-post-url="/api/errorhandler"></script>
```

This is for you if you want to see the JavaScript errors happening to your users.

This is intended for self-hosting, small businesses, and indie-hacker scale traffic, not venture backed startup scale traffic.

No more mangled, half-understood, context-free error-feelings reported. \o/

### API

Catch every error and post to a URL on your server.

```html
<script src="catch-all-errors.min.js" data-post-url="/api/errorhandler"></script>
```

By default only the first JS error is caught to prevent bad code from spamming of your API endpoint. You can change to continuous mode like this:

```html
<script src="catch-all-errors.min.js" data-post-url="/api/errorhandler" data-continous></script>
```

By default the trace is propagated to the browser resulting in `console.error`s but you can disable this behaviour with `data-prevent-default`:

```html
<script src="catch-all-errors.min.js" data-post-url="/api/errorhandler" data-prevent-default></script>
```

Errors will have the following properties when caught and handled:

```json
{
  "message": "blee is not defined",
  "url": "http://localhost:8000/",
  "pos": [23, 9],
  "useragent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:66.0) Gecko/20100101 Firefox/66.0",
  "stack": "window.onload@http://localhost:8000/:23:9\n",
}
```

### Why use this instead of hosted service X?

 * You like self-hosting stuff.
 * You don't want to sign up for yet another service.
 * You don't need all of their weird complicated features.
 * Those services keep going out of business.
 * You find those services to be over-engineered.

This won't ever become complicated bloatware requiring a signup.
