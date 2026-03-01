# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **static frontend repository** for JodelCity - a web app for anonymous location-based posting with photos/videos. This is not the production repo, but a static version used for collaboration and PRs. Changes to HTML/logic here should apply to the production repo.

The app is a single-page application (SPA) built with vanilla JavaScript and the Phonon framework.

## Development

### Running the App

**Recommended: Use the Proxy Server**

```bash
python3 proxy.py
```

Then navigate to `http://localhost:8000/#!home`

The proxy server serves local static files (CSS, JS, images) while proxying API calls and websockets to https://www.jodel.city/. This enables full functionality including live updates, posting, and all interactive features.

**Root Path Redirect:**
- Visiting `/` redirects to a channel path derived from git refs mtime
- Uses Unix timestamp of `.git/refs/remotes` modification time (e.g., `/1772328232`)
- Falls back to current date format (`YYYYMMDD`) if git refs unavailable
- The redirected path uses the HTML template with dynamic upstream data

**Dynamic HTML Template:**
- Channel pages (any numeric URL with 3+ digits, e.g., `/123`, `/1234`, `/202603012230`) use `app.html`
- Dynamic values are extracted from upstream and filled into the template:
  - `{{DATA_UID}}` - User ID
  - `{{PAGE_TITLE}}` - Page title (e.g., "202603012230 - test - JodelCity")
  - `{{TITLE_BAR}}` - Channel display name
  - `{{CHANNEL_PATH}}` - Channel path for refresh link
  - `{{CONTENT_AREA}}` - The posts/messages list from upstream
- Template is cached and reloaded when modified

### Building Error Pages

The `errors/` directory contains HTML error page templates. To rebuild them:

```bash
cd errors
./make.bash    # Build unminified
./make.bash min # Build minified
```

The `make.bash` script generates error pages from comments in the script itself (400, 401, 403, 404, 405, 408, 500, 501, 502, 503, 504, 505).

## Architecture

### Core Technologies

- **Phonon Framework** (`phonon.js`): SPA navigation, panels, side-panels, dialogs, notifications
- **Zepto.js**: Lightweight jQuery-compatible DOM manipulation
- **Nchan**: WebSocket-based pubsub for live post updates
- **Clusterize.js**: Virtual scrolling for performance with large post lists
- **PhotoSwipe**: Image gallery/lightbox functionality
- **Lockr**: Local storage wrapper for settings persistence

### File Structure

- `app.html` - Main HTML structure with Phonon pages (`<home>`, `<photo>`, `<vid>`, `<faq>`, `<slideshow>`) and templated variables
- `app.js` - All application logic (~2900 lines)
- `app.css` - Main application Stylesheet
- `css/` - Other Stylesheets (Phonon base, Material Refresh, Font Awesome, app-specific)
- `errors/` - HTTP error page templates
- `fonts/`, `img/`, `images/` - Static assets

### Key App.js Concepts

**Global State Variables:**
- `feedData` - Posts indexed by message ID
- `feedID2no` - Maps message IDs to feed position numbers
- `feedRows` - Array for Clusterize.js virtual scrolling
- `clusterize` - The Clusterize instance
- `ownUID` - Current user's ID (from `data-uid` on body tag)

**Page Navigation:**
- Phonon navigator handles page transitions (e.g., `phonon.navigator().changePage('home')`)
- URL hash routing (e.g., `#!home`, `#!faq`)
- Access current page via `phonon.navigator().currentPage`

**UI Components:**
- **Panels** (`phonon.panel()`): Full-screen overlays (capture options, photo/video preview)
- **Side panels** (`phonon.sidePanel()`): Slide-out menus (settings menu)
- **Dialogs** (`phonon.dialog()`): Modal confirmations
- **Notifications** (`phonon.notif()`): Toast messages
- **Popovers** (`phonon.popover()`): Context menus (channels menu)

**Live Updates:**
- Nchan subscription for real-time post updates
- `livesubonoff` checkbox controls live updates
- Subscriber count shown in header via `#subscribers` element

**Tabs:**
- Three main tabs: Home (feed), Comment (post form), Photo (camera)
- `currentTabNr` tracks active tab (1=home, 2=comment, 3=photo)
- Tab swipe controlled by `tabSwipeEnabled`

### Data Flow

1. Initial fetch via AJAX loads posts
2. Posts rendered via Clusterize.js for performance
3. Nchan WebSocket receives live updates
4. New posts prepended to `feedData` and `feedRows`
5. Clusterize updates only visible rows

### Key Functions in app.js

- `init(net)` - App initialization, sets up Phonon pages, event handlers
- `fetchFeed(fromNo, toNo)` - AJAX fetch for posts
- `renderPost(data, options)` - Generates HTML for a single post
- `textToHtml(text, postMid)` - Converts post text to HTML with hashtag/mention linking
- `openPost(mid)` - Opens a post for viewing/comments
- `showNotification(msg, type)` - Displays toast notifications
