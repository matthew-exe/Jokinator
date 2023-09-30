/** Runs the getJokes and getRandomJoke() functions on page load */
window.onload = function() {
    getJokes();
    getRandomJoke();
  }

/** Opens/closes the popup to add a new joke */
function addJoke() {
    if (document.getElementById("popup").style.display != "flex") {
        document.getElementById("popup").style.display = "flex";
    }
    else {
        document.getElementById("popup").style.display = "none";
    }
}

/** Opens/closes the popup that displays all the information about a specific joke */
function selectJoke(jokeID, jokeSetup, jokePunchline) {
    if (document.getElementById("selectJoke").style.display != "flex") {
        document.getElementById("selectJoke").style.display = "flex";
        document.getElementById("jokeID2").innerHTML = "Joke ID: " + jokeID;
        document.getElementById("jokeSetup2").innerHTML = "Joke Setup: " + jokeSetup;
        document.getElementById("jokePunchline2").innerHTML = "Joke Punchline: " + jokePunchline;
        document.getElementById("submit2").onclick = function () { deleteJoke(jokeID); };
    }
    else {
        document.getElementById("selectJoke").style.display = "none";
    }
}

/** Sends a post request to the flask using xmlhttp, to send a newly added jokes information */
function submitJoke() {
    document.getElementById("popup").style.display = "none";
    jokeSetupVar = document.getElementById("jokeSetup").value;
    jokePunchlineVar = document.getElementById("jokePunchline").value;
    jokeArray = {jokeSetupVar, jokePunchlineVar}
    var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance 
    xmlhttp.open("PUT", "/submitJoke");
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.onload = () => location.reload()
    xmlhttp.send(JSON.stringify(jokeArray));
    document.getElementById("jokeSetup").value = "";
    document.getElementById("jokePunchline").value = "";
}

/** Sends a post request to the flask using xmlhttp, to send the jokeID of the joke to be deleted */
function deleteJoke(jokeID) {
    document.getElementById("selectJoke").style.display = "none";
    var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance
    xmlhttp.open("POST", "/deleteJoke");
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.onload = () => location.reload()
    xmlhttp.send(jokeID);
}

/** Swaps between the joke setup and the joke punchline for the random joke*/
function revealRandomJokeButton(jokeSetup, jokePunchline) {
    if (document.getElementById("randomJoke").innerHTML == jokeSetup) {
        document.getElementById("randomJoke").innerHTML = jokePunchline
    }
    else {
        document.getElementById("randomJoke").innerHTML = jokeSetup
    }
}

/** Swaps between the joke setup and the joke punchline for a joke */
function revealJokeButton(jokeID, jokeSetup, jokePunchline) {
    if (document.getElementById(jokeID).innerHTML == jokeSetup) {
        document.getElementById(jokeID).innerHTML = jokePunchline
    }
    else {
        document.getElementById(jokeID).innerHTML = jokeSetup
    }
}

/** Fetchs the jokes from flask, then puts html with the joke information into a list to be placed onto the html */
function getJokes() {
    fetch("/getjokes")
    .then(function(response){
        return response.json();
    })
    .then(function(jokes){
        let placeholder = document.querySelector("#data-output");
        let out = "";
        let count = 0;
        for(let joke of jokes){
            count++;
            out += `
                <li>
                    <div id="jokePreviewList">
                    <h2 id="jokeTitle">Joke ${count}</h2>
                    <p id="${joke.jokeID}" class="jokeText">${joke.jokeSetup}</p>
                    <button type="button" id="jokeRevealButton" onclick="revealJokeButton('${joke.jokeID}', '${joke.jokeSetup}', '${joke.jokePunchline}')">Reveal Joke</button>
                    <button type="button" id="deleteJokeButton" onclick="selectJoke('${joke.jokeID}', '${joke.jokeSetup}', '${joke.jokePunchline}')">X</button>
                  </div>
                </li>
            `;
        }
        placeholder.innerHTML = out;
    })
}

/** Fetchs an random joke from flask, then puts html with the joke information into a list to be placed onto the html */
function getRandomJoke() {
    fetch("/getrandomjokes")
    .then(function(response){
        return response.json();
    })
    .then(function(randomJokes){
        let placeholder = document.querySelector("#random-joke-output");
        let out = "";
        let jokeNumber = Math.floor(Math.random() * randomJokes.length);
        out += `
            <li>
                <div id="jokePreviewList">
                <h2 id="jokeTitle">Random Joke</h2>
                <p id="randomJoke" class="jokeText">${randomJokes[jokeNumber].jokeSetup}</p>
                <button type="button" id="jokeRevealButton" onclick="revealRandomJokeButton('${randomJokes[jokeNumber].jokeSetup}', '${randomJokes[jokeNumber].jokePunchline}')">Reveal Joke</button>
                <button type="button" id="refreshJokeButton" onclick="getRandomJoke()">Refresh</button>
                </div>
            </li>
        `;
        placeholder.innerHTML = out;
    })
}