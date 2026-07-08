from LoginAuth import login_required
from flask import session,jsonify

def checkAdmin():
    login_required()
    if session['role'] != 'Admin':
        return jsonify({"message":"You are not allowed"})

def checkSuperAdmin():
    login_required()
    if session['role'] != 'Super Admin':
        return jsonify({"messege":"You are not allowed"})

def checkKasir():
    login_required()
    if session['role'] != 'kasir':
        return jsonify({'messege':"You are not allowed"})

def checkStok():
    login_required()
    if session['role'] != 'Stok':
        return jsonify({'messege':"You are not allowed"})