"""Serve only the public site files for a local tunnel."""

from argparse import ArgumentParser
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path, PurePosixPath
from urllib.parse import unquote, urlsplit


SITE_ROOT = Path(__file__).resolve().parent
PUBLIC_DIRS = {"css", "js", "assets"}


class SiteHandler(SimpleHTTPRequestHandler):
    def _public_path(self):
        path = unquote(urlsplit(self.path).path)
        if path == "/":
            return "/index.html"
        # SimpleHTTPRequestHandler also decodes paths; reject a second encoded layer.
        if "%" in path:
            return None
        parts = PurePosixPath(path).parts
        if any(part.startswith(".") for part in parts[1:]):
            return None
        if path == "/index.html" or (len(parts) > 2 and parts[1] in PUBLIC_DIRS):
            return path
        return None

    def _serve(self, method):
        path = self._public_path()
        if path is None:
            self.send_error(404, "Fichier introuvable")
            return
        self.path = path
        method()

    def do_GET(self):
        self._serve(super().do_GET)

    def do_HEAD(self):
        self._serve(super().do_HEAD)

    def list_directory(self, path):
        self.send_error(404, "Fichier introuvable")
        return None

    def end_headers(self):
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Referrer-Policy", "strict-origin-when-cross-origin")
        super().end_headers()


if __name__ == "__main__":
    parser = ArgumentParser(description="Serveur local du site romantique")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8766)
    args = parser.parse_args()
    handler = partial(SiteHandler, directory=str(SITE_ROOT))
    with ThreadingHTTPServer((args.host, args.port), handler) as server:
        print(f"Site disponible sur http://{args.host}:{args.port}", flush=True)
        server.serve_forever()
