from flask import Flask

app = Flask(__name__)

import os
import random
import time

TIME = os.environ.get("TIME", 500)
ERROR_TIME = os.environ.get("ERROR_TIME", 300)
REMOTE_URL = os.environ.get("REMOTE_URL", "http://api.chucknorris.io/jokes/random")
PORT = os.environ.get("PORT", 8080)


@app.route("/")
@app.route("/random-error")
def hello_world():

    number = random.randint(0, int(TIME))

    time.sleep(number / 1000)
    if number < int(ERROR_TIME):
        return "Hello, World!"
    else:
        return "Error occured", 500


@app.route("/bad")
def bad():
    return "Error occured", 500


@app.route("/healthy")
def healthy():
    return "Hello, World!"


@app.route("/remote")
def remote():
    import requests

    try:
        response = requests.get(REMOTE_URL)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        return str(e), 500
    return response.json()


@app.route("/liveness")
def liveness():
    return "Live"


@app.route("/readiness")
def readiness():
    return "Ready"


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=PORT)
