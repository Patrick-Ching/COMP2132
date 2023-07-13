// definitions
const imgPath = '../images/';
const $messageText = $("#messageText")
const $hangman = $("#hangman")
const inputElement = document.getElementById("inputChar")
const $guessList = $("#guessList")
const $answerSection = $("#answerSection")
const $restartGameButton = $("#restartGame")
const $submitGuessButton = $("#submitGuess")

class Game { // stores all data and status of the active game
    constructor(answer, hint) {
        this.answers = createAnswerList(answer)
        this.wrongGuessCount = 0;
        this.guesses = [];
        this.hint = hint
        this.answerString = answer
    }
    checkAlreadyGuessed(character) {
        character = character.toUpperCase();
        return this.guesses.includes(character);
        }        
    
    checkAllAnswersTrue() {
        for (let i = 0; i < this.answers.length; i++) {
            for (let j = 0; j < this.answers[i].length; j++) {
                if (!this.answers[i][j][1]) {
                    return false;
                }
            }
        }
        return true;
    }
    returnMatchPositions(character) {
        let positions = []
        for (let i = 0; i < this.answers.length; i++) {
            for (let j = 0; j < this.answers[i].length; j++) {
                if (this.answers[i][j][0] == character) {
                    positions.push(this.answers[i][j][2])
                    this.answers[i][j][1]=true
                }
            }
        }
        return positions
    }

    makeGuess(character) {
        character = character.toUpperCase()
        this.guesses.push(character)
        const addGuess = document.createElement('li');
        addGuess.textContent = character

        $guessList.append(addGuess)
        let result = this.returnMatchPositions(character)
        if (result.length == 0) {
            this.wrongGuessCount++
            this.updateHangman()
            $messageText.fadeOut(400, function () {
                $messageText.html("Letter did not match.");
                $messageText.fadeIn(400);
            });
            if (this.wrongGuessCount == 6) {
                // Game over
                $("#submitGuess").prop("disabled", true);
                $messageText.fadeOut(400, function () {
                    $messageText.html("<h3 id='failMessage'>YOU LOSE. TRY AGAIN.</h3>");
                    $messageText.fadeIn(400);
                });
            }
        } else {            
            $messageText.fadeOut(400, function () {
                $messageText.html("Letter matched!");
                $messageText.fadeIn(400);
            });
            for (let i = 0; i < result.length; i++) {
                spin(result[i]);
            }
            if (this.checkAllAnswersTrue()) {
                $("#submitGuess").prop("disabled", true);
                $messageText.fadeOut(400, function () {
                    $messageText.html("<h3 id='victoryMessage'>YOU WIN. DO YOU WANT TO PLAY AGAIN?</h3>");
                    $messageText.fadeIn(400);
                });
            }
        }
    }
    updateHangman() {
        let srcPath = imgPath + this.wrongGuessCount + ".jpg"
        let altText = "Step " + this.wrongGuessCount
        $hangman.attr("alt", altText);
        $hangman.fadeOut(400, function () {            
            $hangman.attr("src", srcPath);
            $hangman.fadeIn(400);
        });
    }
    }

function spin(index) { // rotates the letter board to display matched letter
    boxId = "box" + index.toString()
    const box_element = document.getElementById(boxId)
    box_element.setAttribute('class', 'box show-back');
}

function createAnswerList(inputString) {
    let words = inputString.split(' ')
    let position = 1
    let outputList = []
    for (let i = 0; i < words.length; i++) {
        let word = words[i]
        let innerList = []
        let characters = word.split("")
        for (let j = 0; j < characters.length; j++) {
            innerList.push([characters[j], false, position])
            position++
        }
        outputList.push(innerList)
    }
    return outputList
    }

function createGameDisplay(gameObject) { // displays the puzzle phrase on the letter board with all letters initially hidden
    
    for (let i = 0; i < gameObject.answers.length; i++) { /* iterate each word */
        const divElement0 = document.createElement('div');
        divElement0.setAttribute('class', 'wordSection')
        for (let j = 0; j < gameObject.answers[i].length; j++) { /* iterate each letter */
            const figureElement1 = document.createElement('figure');
            figureElement1.setAttribute('class', 'front');

            const figureElement2 = document.createElement('figure');
            figureElement2.setAttribute('class', 'back');
            figureElement2.textContent = gameObject.answers[i][j][0]

            const figureElement3 = document.createElement('figure');
            figureElement3.setAttribute('class', 'top');

            const figureElement4 = document.createElement('figure');
            figureElement4.setAttribute('class', 'bottom');

            const divElement1 = document.createElement('div');
            divElement1.setAttribute('class', 'box');
            let boxId = "box" + gameObject.answers[i][j][2].toString()
            divElement1.setAttribute('id', boxId);

            divElement1.appendChild(figureElement1)
            divElement1.appendChild(figureElement2)
            divElement1.appendChild(figureElement3)
            divElement1.appendChild(figureElement4)

            const divElement2 = document.createElement('div');
            divElement2.setAttribute('class', 'container');
            divElement2.appendChild(divElement1)
            divElement0.appendChild(divElement2)
        }
        $answerSection.append(divElement0)
        const $hint = $("#hint")
        $hint.html("<h3 id='hintMessage'>Hint: "+gameObject.hint+"</h3>")
    }   
}

$submitGuessButton.click(function () {
    let inputValue = inputElement.value;
    let letterRegex = /^[a-zA-Z]$/; // Regular expression for a single letter

    if (inputValue.length == 0) {
        $messageText.fadeOut(400, function () {
            $messageText.html("Blank entries not permitted. Please enter a letter");
            $messageText.fadeIn(400);
        });
        inputElement.value = ""
        inputElement.focus()
        return
    }
    if (inputValue.length > 1) {
        $messageText.fadeOut(400, function () {
            $messageText.html("Please enter a single letter character");
            $messageText.fadeIn(400);
        });
        inputElement.value = ""
        inputElement.focus()
        return
    }
    if (!letterRegex.test(inputValue)) {             
        $messageText.fadeOut(400, function () {
            $messageText.html("Please enter a letter");
            $messageText.fadeIn(400);
        });
        inputElement.value = ""
        inputElement.focus()
        return
    }
    if (myInstance.checkAlreadyGuessed(inputValue)) {
        $messageText.fadeOut(400, function () {
            $messageText.html("Letter previously guessed. Please enter a new letter");
            $messageText.fadeIn(400);
        });
        inputElement.value = ""
        inputElement.focus()
        return
    }
    myInstance.makeGuess(inputValue)
    inputElement.value = ""
    inputElement.focus()
}
)

$(document).keypress(function (e) { // this function binds enter key to the submit button
    if (e.which == 13) {
        $submitGuessButton.click();
    }
});

$restartGameButton.click(function () {
    randomIndex = Math.floor(Math.random() * answerDatabase.length);
    gameAnswer = answerDatabase[randomIndex][0]
    gameHint = answerDatabase[randomIndex][1]
    resetDisplay()
    myInstance = new Game(gameAnswer, gameHint)    
    createGameDisplay(myInstance)
})

function resetDisplay() {
    // clear letter board    
    $answerSection.empty()

    // clear guess list    
    $guessList.empty()

    // reset hangman image
    let srcPath = imgPath +  "0.jpg"
    let altText = "Step 0" 
    $hangman.attr("alt", altText);
    $hangman.fadeOut(400, function () {
        $hangman.attr("src", srcPath);
        $hangman.fadeIn(400);
    });

    // provide new game message
    $messageText.fadeOut(400, function () {
        $messageText.html("<h3 id='newGameMessage'>New game started</h3>");
        $messageText.fadeIn(400);
    });

    // reset form input
    inputElement.value = ""
    inputElement.focus()

    //enable submit button
    $("#submitGuess").prop("disabled", false);
}

// initiate game
let randomIndex = Math.floor(Math.random() * answerDatabase.length);
let gameAnswer = answerDatabase[randomIndex][0]
let gameHint = answerDatabase[randomIndex][1]
let myInstance = new Game(gameAnswer, gameHint)
createGameDisplay(myInstance)