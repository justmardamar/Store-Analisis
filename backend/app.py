from flask import (
    Flask,
    render_template,
    request,
    jsonify,
    session,
    flash,
    redirect,
    url_for,
    get_flashed_messages,
    make_response,
    g,
)
from flask_cors import CORS
from config import SECRET_KEY

app = Flask(__name__)
app.secret_key = SECRET_KEY
CORS(app)

@app.route('/api/data', methods=['GET'])
def get_data():
    return jsonify({"message": "Hello from the Flask backend!","status":"success"})

if __name__ == '__main__':
    app.run(debug=True)