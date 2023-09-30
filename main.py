from flask import Flask, render_template, request, jsonify
import uuid
import json



app = Flask(
    __name__,
    template_folder='templates',
    static_folder='static'
)

@app.route('/')
def index():
    return render_template('index.html')


# stores a new joke within the json file
@app.route('/submitJoke',methods=["PUT"])
def submitJoke():
    jokeData = request.get_json()

    jokeSetup = jokeData.get("jokeSetupVar")
    jokePunchline = jokeData.get("jokePunchlineVar")
    jokeID = str(uuid.uuid4())

    try:
        with open('jokes.json', 'r') as f:
            jokeData = json.load(f)
    except FileNotFoundError:
        jokeData = {}

    jokeData.append({
        'jokeID' : jokeID,
        'jokeSetup' : jokeSetup,
        'jokePunchline' : jokePunchline
        })

    with open('jokes.json', 'w') as f:
        json.dump(jokeData, f, indent=5)

    return 'Joke Added'

# removes an specific joke from the json file
@app.route('/deleteJoke', methods = ['POST'])
def deleteJoke():
    jokeID = request.get_data()

    try:
        with open('jokes.json', 'r') as f:
            jokeData = json.load(f)
    except FileNotFoundError:
        jokeData = {}

    jokeData = [joke for joke in jokeData if joke['jokeID'] != bytes.decode(jokeID)]

    with open('jokes.json', 'w') as f:
        json.dump(jokeData, f, indent=5)

    return 'Joke Deleted'

# loads all of the jokes from the json file and returns it as a response object
@app.route('/getjokes', methods=['GET'])
def getJokes():
    with open('jokes.json', 'r') as f:
        jokes = json.loads(f.read())

    return jsonify(jokes)

# loads an random joke from a preset list of jokes in a json file and returns it as a response object
@app.route('/getrandomjokes', methods=['GET'])
def getRandomJokes():
    with open('presetJokes.json', 'r') as f:
        jokes = json.loads(f.read())

    return jsonify(jokes)




if __name__ == '__main__':
    app.run(debug=True)