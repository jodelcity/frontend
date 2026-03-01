#!/usr/bin/env python3
"""
JodelCity Proxy Server

Serves local static files from this repository and proxies all other requests
to https://jodel.city/
"""

import http.server
import socketserver
import urllib.request
import urllib.error
import os
import sys
import subprocess
import datetime
from pathlib import Path
from urllib.parse import urlparse
import http.cookies

PORT = 8000
UPSTREAM = "https://www.jodel.city"
LOCAL_PATH = Path(__file__).parent

# Cache the git revision for the cfduid cookie
_GIT_REVISION = None

# Cache for the HTML template
_HTML_TEMPLATE = None
_HTML_TEMPLATE_MTIME = None


class ReusableTCPServer(socketserver.TCPServer):
    """TCPServer that allows address reuse to avoid 'Address already in use' errors."""
    allow_reuse_address = True


def get_git_revision():
    """Get the current git HEAD revision, or 'unknown' if not in a git repo."""
    global _GIT_REVISION
    if _GIT_REVISION is not None:
        return _GIT_REVISION

    try:
        result = subprocess.run(
            ['git', 'rev-parse', 'HEAD'],
            cwd=LOCAL_PATH,
            capture_output=True,
            text=True,
            timeout=5
        )
        if result.returncode == 0:
            _GIT_REVISION = result.stdout.strip()
        else:
            _GIT_REVISION = 'unknown'
    except (FileNotFoundError, subprocess.TimeoutExpired, Exception):
        _GIT_REVISION = 'unknown'

    return _GIT_REVISION


def load_html_template():
    """Load the HTML template, caching it and reloading if modified."""
    global _HTML_TEMPLATE, _HTML_TEMPLATE_MTIME

    template_path = LOCAL_PATH / 'app.html'

    if not template_path.exists():
        return None

    # Check if template has been modified
    mtime = template_path.stat().st_mtime
    if _HTML_TEMPLATE is None or _HTML_TEMPLATE_MTIME != mtime:
        _HTML_TEMPLATE = template_path.read_text(encoding='utf-8')
        _HTML_TEMPLATE_MTIME = mtime

    return _HTML_TEMPLATE


def extract_dynamic_values(html_content):
    """Extract dynamic values from upstream HTML using regex."""
    import re

    values = {
        'DATA_UID': '9876543210abcdef',  # Default fallback
        'PAGE_TITLE': 'JodelCity',
        'TITLE_BAR': '',
        'CHANNEL_PATH': '/',
        'CONTENT_AREA': '',  # The posts/messages list
    }

    # Extract data-uid from body tag
    uid_match = re.search(r'<body\s+data-uid="([^"]+)"', html_content)
    if uid_match:
        values['DATA_UID'] = uid_match.group(1)

    # Extract page title
    title_match = re.search(r'<title>(.*?)</title>', html_content)
    if title_match:
        values['PAGE_TITLE'] = title_match.group(1)

    # Extract title bar content
    title_bar_match = re.search(r'<h1\s+id="title-bar"[^>]*>(.*?)</h1>', html_content, re.DOTALL)
    if title_bar_match:
        values['TITLE_BAR'] = title_bar_match.group(1).strip()

    # Extract channel path from refresh link
    refresh_match = re.search(r'<a\s+href="(/[^"]+)">\s*Seite neu laden\s*</a>', html_content)
    if refresh_match:
        values['CHANNEL_PATH'] = refresh_match.group(1)

    # Extract contentArea (the posts/messages list)
    content_match = re.search(r'<ul\s+id="contentArea"[^>]*>(.*?)</ul>', html_content, re.DOTALL)
    if content_match:
        values['CONTENT_AREA'] = content_match.group(0)  # Include the <ul> tag itself

    return values


def render_html_template(upstream_html):
    """Fetch dynamic values from upstream and render the template."""
    template = load_html_template()
    if not template:
        return None

    # Extract dynamic values from upstream HTML
    values = extract_dynamic_values(upstream_html)

    # Fill the template
    rendered = template
    for key, value in values.items():
        placeholder = f'{{{{{key}}}}}'
        rendered = rendered.replace(placeholder, value)

    return rendered


def get_or_generate_cfduid(cookie_header):
    """
    Get the cfduid cookie from the request, or generate a new one.

    The generated cookie format is: abc<8-chars-git-rev><32-chars-md5>
    Total length: 43 characters
    """
    import hashlib
    import time

    git_rev = get_git_revision()

    if cookie_header:
        cookies = http.cookies.SimpleCookie()
        try:
            cookies.load(cookie_header)
            if '__cfduid' in cookies:
                # Existing cfduid, use it
                return cookies['__cfduid'].value, False
        except Exception:
            pass

    # Generate new cfduid with pseudo-random suffix
    # Format: abc + 8 chars of git rev + 32 chars of md5 = 43 total
    git_part = git_rev[:8]
    random_data = f"{time.time()}-{os.getpid()}-{git_rev}-{time.thread_time()}"
    random_md5 = hashlib.md5(random_data.encode('utf-8')).hexdigest()[:32]
    generated_value = f'abc{git_part}{random_md5}'
    return generated_value, True

# File extensions that should definitely be served locally
LOCAL_EXTENSIONS = {
    '.html', '.htm', '.css', '.js', '.json', '.xml', '.svg', '.png', '.jpg',
    '.jpeg', '.gif', '.ico', '.woff', '.woff2', '.ttf', '.otf', '.eot',
    '.mp4', '.webm', '.ogg', '.mp3', '.wav'
}

# Paths that should definitely be served locally
LOCAL_PATHS = {
    '/css/', '/js/', '/fonts/', '/img/', '/images/', '/errors/',
    '/android-chrome-', '/apple-touch-icon', '/favicon', '/manifest.json',
    '/browserconfig.xml', '/site.webmanifest'
}


class ProxyRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        # Set the directory to serve files from
        super().__init__(*args, directory=str(LOCAL_PATH), **kwargs)

    def do_GET(self):
        parsed_path = urlparse(self.path)

        # Special case: root path redirects to /YYYYMMDD2230 (current local date + 2230)
        if parsed_path.path == '/' or parsed_path.path == '':
            import datetime
            today = datetime.date.today()
            redirect_path = f"/{today.strftime('%Y%m%d')}2230"
            self.log_message("Root path redirect: %s -> %s", self.path, redirect_path)
            self.send_response(302)
            self.send_header('Location', redirect_path)
            self.end_headers()
            return

        # Check if this should be served locally
        local_path = self.resolve_local_path(parsed_path.path)
        if local_path:
            self.log_message("Serving locally: %s -> %s", self.path, local_path.name)
            # Use SimpleHTTPRequestHandler to serve the file
            # We need to translate the path back for the handler
            self.path = str(local_path.relative_to(LOCAL_PATH))
            super().do_GET()
            return

        # Check if this is a simple channel path (should use HTML template)
        # Only for GET requests without query string
        import re
        is_channel_path = re.match(r'^/\d{3,}$', parsed_path.path)
        has_query_string = parsed_path.query != ''

        if is_channel_path and not has_query_string:
            self.log_message("Channel path detected (no query string), using HTML template: %s", self.path)
            self.serve_html_template()
            return

        # Otherwise proxy to upstream
        self.proxy_request()

    def do_POST(self):
        self.proxy_request()

    def do_PUT(self):
        self.proxy_request()

    def do_DELETE(self):
        self.proxy_request()

    def do_OPTIONS(self):
        self.proxy_request()

    def resolve_local_path(self, path):
        """
        Resolve a request path to a local file, handling cache-busting suffixes.
        Returns the Path object if the file exists locally, None otherwise.
        """
        import re

        # Try exact match first
        local_file = LOCAL_PATH / path.lstrip('/')
        if local_file.exists() and local_file.is_file():
            return local_file

        # Try stripping cache-busting suffixes (e.g., app.1763463330.js -> app.js)
        # Pattern: filename.<numbers>.ext
        cache_bust_pattern = re.compile(r'^(.+)\.(\d+)\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|otf|eot)$')
        path_str = path.lstrip('/')
        match = cache_bust_pattern.match(path_str)

        if match:
            # Reconstruct the filename without the cache-busting suffix
            base_name = match.group(1)
            ext = match.group(3)
            clean_filename = f"{base_name}.{ext}"
            local_file = LOCAL_PATH / clean_filename

            if local_file.exists() and local_file.is_file():
                self.log_message("Stripped cache-busting suffix: %s -> %s", path_str, clean_filename)
                return local_file

        return None

    def should_serve_locally(self, path):
        """Check if a path should be served from local files."""
        # Check for known local paths
        for local_path in LOCAL_PATHS:
            if path.startswith(local_path):
                return True

        # Check for known local file extensions
        _, ext = os.path.splitext(path)
        if ext.lower() in LOCAL_EXTENSIONS:
            return True

        # Root path serves index.html
        if path == '/' or path == '':
            return True

        return False

    def serve_html_template(self):
        """Serve the HTML template with dynamic values from upstream."""
        upstream_url = UPSTREAM + self.path

        try:
            # Fetch upstream HTML to extract dynamic values
            self.log_message("Fetching upstream HTML for dynamic values: %s", upstream_url)

            # Build request with cookie
            cookie_header = self.headers.get('Cookie')
            cfduid_value, cookie_was_generated = get_or_generate_cfduid(cookie_header)
            cookies_to_send = [f'__cfduid={cfduid_value}']
            if cookie_header:
                try:
                    cookies = http.cookies.SimpleCookie()
                    cookies.load(cookie_header)
                    for key, morsel in cookies.items():
                        if key != '__cfduid':
                            cookies_to_send.append(f'{key}={morsel.value}')
                except Exception:
                    pass

            headers = {
                'Cookie': '; '.join(cookies_to_send),
                'User-Agent': self.headers.get('User-Agent', 'JodelCity-Proxy/1.0'),
            }

            req = urllib.request.Request(upstream_url, headers=headers)
            upstream_html = urllib.request.urlopen(req, timeout=10).read().decode('utf-8')

            # Render the template with extracted values
            rendered_html = render_html_template(upstream_html)

            if rendered_html:
                self.log_message("Serving rendered HTML template")
                self.send_response(200)
                self.send_header('Content-Type', 'text/html; charset=utf-8')
                if cookie_was_generated:
                    self.send_header('Set-Cookie', f'__cfduid={cfduid_value}; Path=/; SameSite=Lax')
                self.end_headers()
                self.wfile.write(rendered_html.encode('utf-8'))
                self.wfile.flush()
            else:
                # No template found, fall back to proxying
                self.log_message("No HTML template found, proxying upstream")
                self.proxy_request()

        except urllib.error.HTTPError as e:
            self.log_message("Upstream HTTP error: %s", e.code)
            self.proxy_request()
        except Exception as e:
            self.log_error("Failed to serve HTML template: %s", e)
            self.proxy_request()

    def proxy_request(self):
        """Proxy the request to the upstream server."""
        upstream_url = UPSTREAM + self.path

        try:
            # Handle __cfduid cookie - generate if missing
            cookie_header = self.headers.get('Cookie')
            cfduid_value, cookie_was_generated = get_or_generate_cfduid(cookie_header)

            # Prepare the request with forwarded headers
            headers = {}
            for header, value in self.headers.items():
                # Skip hop-by-hop headers, Cookie (we'll rebuild it), and Accept-Encoding (to avoid compression issues)
                if header.lower() not in ('host', 'connection', 'keep-alive',
                                          'proxy-authenticate', 'proxy-authorization',
                                          'te', 'trailers', 'transfer-encoding', 'cookie',
                                          'accept-encoding'):
                    headers[header] = value

            # Build Cookie header with cfduid
            cookies_to_send = []
            cookies_to_send.append(f'__cfduid={cfduid_value}')

            # Add other cookies from the original request (excluding __cfduid)
            if cookie_header:
                try:
                    cookies = http.cookies.SimpleCookie()
                    cookies.load(cookie_header)
                    for key, morsel in cookies.items():
                        if key != '__cfduid':
                            cookies_to_send.append(f'{key}={morsel.value}')
                except Exception:
                    # If parsing fails, just include the original cookie string minus cfduid
                    pass

            headers['Cookie'] = '; '.join(cookies_to_send)

            # Add forwarding headers
            headers['X-Forwarded-For'] = self.client_address[0]
            headers['X-Forwarded-Host'] = self.headers.get('Host', f'localhost:{PORT}')
            headers['X-Forwarded-Proto'] = 'http'

            # Create the request
            req = urllib.request.Request(upstream_url, headers=headers)

            # Add request body for POST/PUT
            if self.command in ('POST', 'PUT'):
                content_length = int(self.headers.get('Content-Length', 0))
                if content_length > 0:
                    req.data = self.rfile.read(content_length)

            # Set the method
            req.get_method = lambda: self.command

            self.log_message("Proxying: %s -> %s", self.command, upstream_url)
            if cookie_was_generated:
                self.log_message("Generated __cfduid cookie: %s", cfduid_value)

            # Make the request
            with urllib.request.urlopen(req, timeout=30) as response:
                # Copy response headers
                self.send_response(response.status)
                for header, value in response.headers.items():
                    # Skip hop-by-hop headers
                    if header.lower() not in ('connection', 'keep-alive',
                                              'transfer-encoding', 'content-encoding'):
                        self.send_header(header, value)

                # Add Set-Cookie header if we generated a new cfduid
                if cookie_was_generated:
                    self.send_header('Set-Cookie', f'__cfduid={cfduid_value}; Path=/; SameSite=Lax')

                self.end_headers()

                # Copy response body
                self.wfile.write(response.read())

        except urllib.error.HTTPError as e:
            self.log_message("Upstream HTTP error: %s", e.code)
            self.send_response(e.code)
            for header, value in e.headers.items():
                if header.lower() not in ('connection', 'keep-alive',
                                          'transfer-encoding', 'content-encoding'):
                    self.send_header(header, value)

            # Add Set-Cookie header if we generated a new cfduid
            if cookie_was_generated:
                self.send_header('Set-Cookie', f'__cfduid={cfduid_value}; Path=/; SameSite=Lax')

            self.end_headers()
            if e.fp:
                self.wfile.write(e.fp.read())

        except urllib.error.URLError as e:
            self.log_error("Upstream connection error: %s", e.reason)
            self.send_error(502, "Bad Gateway", f"Could not connect to upstream server: {e.reason}")

        except Exception as e:
            self.log_error("Proxy error: %s", e)
            self.send_error(500, "Internal Server Error", str(e))

    def log_message(self, format, *args):
        """Override to add color coding."""
        # Check if this is a local serve or proxy
        if "Serving locally" in format or "Proxying" in format:
            color_code = "\033[92m"  # Green
        else:
            color_code = "\033[94m"  # Blue

        reset = "\033[0m"
        sys.stdout.write(f"{color_code}[{self.log_date_time_string()}]{reset} {format % args}\n")


def main():
    # Change to the script's directory so SimpleHTTPRequestHandler serves from there
    os.chdir(LOCAL_PATH)

    # Get git revision for display and cookie generation
    git_rev = get_git_revision()

    with ReusableTCPServer(("", PORT), ProxyRequestHandler) as httpd:
        print(f"\033[96m" + "="*60)
        print(f"JodelCity Proxy Server")
        print(f"="*60 + "\033[0m")
        print(f"  Local files served from: {LOCAL_PATH}")
        print(f"  Upstream proxy:          {UPSTREAM}")
        print(f"  Listening on:            http://localhost:{PORT}")
        print(f"  Git revision:            {git_rev}")
        print(f"\033[96m" + "="*60 + "\033[0m")
        print(f"\nOpen your browser to: \033[92mhttp://localhost:{PORT}/\033[0m\n")

        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\nShutting down server...")
            httpd.shutdown()


if __name__ == "__main__":
    main()
