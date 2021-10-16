from flask import Flask, request, jsonify,Response
from flask_pymongo import PyMongo
from time import time
from bson import json_util
from pymongo import MongoClient
import hashlib
import boto3
from botocore.exceptions import ClientError
import base64
import tempfile
import uuid
import logging
import json


import datetime

app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False


@app.route("/")
def prueba():
	return "Hola Este es el Servidor de docker de SEMI 1 A!"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int("5000"), debug=True)


