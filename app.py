from __future__ import annotations
from flask import Flask, send_from_directory, redirect
from livereload import Server, shell
app = Flask(__name__)
app.config['RESULT_STATIC_PATH'] = "."

_html_caches: dict[str, str] = {}

@app.route('/')
def index():
    return redirect('/out/index.html')

@app.route('/update/<path:file>')
def query_change(file):
    print("update", file)
    try:
        with open(file, 'r', encoding='utf-8') as f:
            if _html_caches.get(file) == f.read():
                return "changed"
            print("not changed")
            return ""
    except IOError:
        return "changed"

@app.route('/<path:file>')
def page(file: str):
    print("page", file)
    if file.endswith('.html'):
        with open(file, 'r', encoding='utf-8') as f:
            _html_caches[file] = f.read()
    return send_from_directory(app.config['RESULT_STATIC_PATH'], file)

def onchange():
    pass
if __name__ == '__main__':
    app.debug = True
    server = Server(app.wsgi_app)
    server.watch('./**/*.op', shell('op index.op --out out --force', cwd='.'))
    server.serve(host="0.0.0.0")
