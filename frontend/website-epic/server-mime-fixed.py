import http.server
import socketserver
import mimetypes

# Add custom MIME types
mimetypes.add_type('text/javascript', '.tsx')
mimetypes.add_type('text/javascript', '.ts')
mimetypes.add_type('text/javascript', '.js')

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def guess_type(self, path):
        mimetype, encoding = mimetypes.guess_type(path)
        if mimetype is None:
            if path.endswith('.tsx') or path.endswith('.ts') or path.endswith('.js'):
                return 'text/javascript', None
        return mimetype, encoding

PORT = 8083
Handler = CustomHTTPRequestHandler

with socketserver.TCPServer(('', PORT), Handler) as httpd:
    print(f'Serving at http://localhost:{PORT}')
    httpd.serve_forever()
