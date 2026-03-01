# Jodel City Frontend

not the actual production repo, just a static version of the frontend that might be able to be used for collaboration/PRs

(if the HTML part and the logic isn't changing very much then patches for this repo should probably apply to the production repo, too)

## Develop

The proxy server serves local static files from this repository while proxying all other requests (API calls, websockets) upstream to www.jodel.city:

**Features:**
- Serves local CSS, JS, images, and fonts
- Handles cache-busting suffixes (e.g., `app.1763463330.js` → `app.js`)
- Uses local HTML template with dynamic values from upstream (uid, page title, channel info)
- Generates/forwards `__cfduid` cookie

```
$ python3 proxy.py
```

Then open http://localhost:8000/ in your browser.

You'll need to work around CORS errors, so you probably want something like [this](https://chromewebstore.google.com/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf) extension in your browser.

This allows full functionality including:
- Live posts and real-time updates
- Posting comments, photos, and videos
- All interactive features

