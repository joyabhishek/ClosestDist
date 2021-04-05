from flask import Flask

app = Flask(__name__)


@app.route('/hello', methods=['POST'])
def hello_world():
    return {'Reasponse': 'Hello World'}
