from LoginAuth import checkLogin
from flask import session,jsonify

def checkAdmin():
    checkLogin()
    if session['role'] != 'Admin':
        return jsonify({"message":"You are not allowed"})

def checkSuperAdmin():
    checkLogin()
    if session['role'] != 'Super Admin':
        return jsonify({"messege":"You are not allowed"})

def checkKasir():
    checkLogin()
    if session['role'] != 'kasir':
        return jsonify({'messege':"You are not allowed"})

def checkStok():
    checkLogin()
    if session['role'] != 'Stok':
        return jsonify({'messege':"You are not allowed"})