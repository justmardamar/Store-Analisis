from flask import session,jsonify

def checkLogin():
    if not session['user_id']:
        return jsonify({"messege":"User Not Log in "})
    