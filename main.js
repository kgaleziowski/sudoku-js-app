import {
    Timer
} from './js/timerClass.js'
import {
    SudokuSolver
} from './js/sudokuSolverClass.js'
import {
    difficultyBtns,
    inverseBtn,
    solveBtn,
    sketchBtn,
    clearBtn,
    helpBtn,
    numberBtns,
    inputDivs,
    timerSpan,
    hintsSpan,
    punishmentSpan,
    grid,
    squares,
    onOffSketch
} from './js/exports.js'
import {
    reverseBoard,
    transpose,
    idxBoard
} from './js/utilities.js'

let sketchMode = false

let lastFocusedCell = undefined

let boardDisabled = false

let boardEmpty = true

let sudokuLevel = 0

let generatedBoard

let solvedGenerated = []

let spansToDisable = []

let inverse = false

let solvedBoard = false

let firstInteraction = true

let timer = new Timer()

const solver = new SudokuSolver()

let hintsCounter = 0

setInterval(function () {
    timerSpan.textContent = timer.returnTime()
}, 1000)


document.onkeypress = function (e) {
    e = e || window.event;
    if (!lastFocusedCell) {
        sameValuesHighlation(undefined, e.key, undefined)
    }
    // walking by arrows

};

// fetch

async function fetchAPI(sudokuLevel) {

    // getting value from promise into variable
    const URL = `https://sugoku.herokuapp.com/board?difficulty=${sudokuLevel}`
    let board
    let promise = await fetch(URL, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    })
    const json = await promise.json()
    board = json['board']
    return reverseBoard(board)
}

// listeners 

// btn function - try to make it better

inverseBtn.addEventListener('click', function () {
    resetStyles()
    inverseBaby()
})

difficultyBtns.forEach((button, index) => button.addEventListener('click', async function () {
    restoreNumbers()
    clearAllValues()
    totalReset()
    resetStyles()
    timer.miliseconds = 0
    timer.seconds = 0
    timer.minutes = 0
    timer.stop()
    lastFocusedCell = undefined
    firstInteraction = true
    switch (index) {
        case 0:
            sudokuLevel = 'easy'
            break
        case 1:
            sudokuLevel = 'medium'
            break
        case 2:
            sudokuLevel = 'hard'
            break
        default:
            break
    }
    generatedBoard = await fetchAPI(sudokuLevel)
    solvedGenerated = solver.solveSudoku(reverseBoard(generatedBoard))
    fillBoard(generatedBoard)
}))

solveBtn.addEventListener('click', function () {
    if (!solvedBoard) {
        let current = currentBoardState()
        // check if board is empty
        if (boardEmpty) {
            return alert("There is no point in solving empty sudoku mate!")
        }
        // check if board is possible to solve
        let sudokuSolver = new SudokuSolver(current)
        if (!sudokuSolver.solveSudoku(current)) {
            return alert("Something is wrong. This sudoku is impossible to solve")
        } else {
            colorSolved()
            fillBoard(reverseBoard(sudokuSolver.solveSudoku(current)))
            disableAll()
        }
        solvedBoard = true
    }
})

sketchBtn.addEventListener('click', function () {
    if (!sudokuLevel) return false
    if (sketchMode) {
        onOffSketch.textContent = 'OFF'
        sketchBtn.style.filter = 'invert(0%)'
    } else {
        onOffSketch.textContent = 'ON'
        sketchBtn.style.filter = 'invert(100%)'
    }
    // if its turned off and im gonna turn it on
    if (!sketchMode) {
        if (lastFocusedCell) {
            lastFocusedCell.focus()
        }
    }

    // if its turned on and im gonna turn it off
    if (sketchMode) {
        lastFocusedCell.style.backgroundColor = '#e2e7ed'
        lastFocusedCell = undefined
    }
    sketchMode = !sketchMode

})

clearBtn.addEventListener('click', function () {
    var answer = window.confirm("Are you sure you want to clear entire board?");
    if (answer) {
        resetStyles()
        clearAllValues()
        if (boardDisabled) {
            enableBoard()
        }
        solvedBoard = false
        restoreNumbers()
    }
})

helpBtn.addEventListener('click', function () {
    if (lastFocusedCell) {
        hint(lastFocusedCell)
    }
})

// div cells listeners - click
inputDivs.forEach((inputDiv, divIndex) => inputDiv.addEventListener('click', function () {
    if (boardDisabled) {
        inputDiv.getElementsByTagName('span')[0].textContent = ''
        resetStyles()
        enableBoard()
    } else {
        resetStyles()
        sameValuesHighlation(inputDiv, undefined)
        highlationRowColSquare(divIndex, inputDiv.getElementsByTagName('span')[0].textContent, idxBoard)
        lastFocusedCell = inputDiv
    }
}))

// div cells listeners - keypressed
inputDivs.forEach(inputDiv => inputDiv.addEventListener('keydown', event => {
    if (boardDisabled) {
        disableBoard()
        lastFocusedCell.getElementsByTagName('span')[0].textContent = event.key
        sameValuesHighlation(lastFocusedCell, undefined)
        liveBoardValidation(lastFocusedCell)
        return false
    }
    // first thing - make generated cells impossible to change
    let lastFocusedSpan = ''
    if (lastFocusedCell != undefined) {
        lastFocusedSpan = lastFocusedCell.getElementsByTagName('span')[0]
        if (lastFocusedSpan.textContent != '') {
            spansToDisable.push(lastFocusedSpan)
        }
    }
    if (lastFocusedSpan.textContent != '' || lastFocusedCell == undefined) {
        sameValuesHighlation(lastFocusedCell, event.key)
    }
    if (spansToDisable.includes(lastFocusedSpan)) {
        if (event.key == 'ArrowUp' || event.key == 'ArrowDown' || event.key == 'ArrowLeft' || event.key == 'ArrowRight') {} else if (boardDisabled && event.key == 'Enter') {
            lastFocusedSpan.textContent = ''
            enableBoard()
        } else {
            return false
        }
    }
    // if its possible to put number in 
    if (lastFocusedCell && (event.key == 'ArrowUp' || event.key == 'ArrowDown' || event.key == 'ArrowLeft' || event.key == 'ArrowRight')) {
        if (boardDisabled) return false
        // finding this square
        let cellIndex = inputDivs.indexOf(lastFocusedCell)
        let row = 0
        let col = 0
        let endLoop = false
        for (let arrayRow of idxBoard) {
            col = 0
            for (let index of arrayRow) {
                if (index == cellIndex) {
                    endLoop = true
                    break
                }
                col++
            }
            if (endLoop) break
            row++
        }
        // index of focused div is here idxBoard[row][column]
        let moveTo = undefined
        switch (event.key) {
            case 'ArrowUp':
                if (row >= 1) {
                    row--
                    moveTo = true
                }
                break;

            case 'ArrowRight':
                if (col <= 7) {
                    col++
                    moveTo = true
                }
                break

            case 'ArrowDown':
                if (row <= 7) {
                    moveTo = true
                    row++
                }
                break

            case 'ArrowLeft':
                if (col >= 1) {
                    moveTo = true
                    col--
                }
                break
            default:
                break
        }
        if (moveTo) {
            let divIndex = idxBoard[row][col]
            moveTo = inputDivs[divIndex]
            lastFocusedCell = moveTo
            resetStyles()
            moveTo.style.backgroundColor = '#eda5f0'
            let moveToValue = moveTo.getElementsByTagName('span')[0].textContent
            sameValuesHighlation(moveTo, moveToValue)
            highlationRowColSquare(divIndex, moveToValue, idxBoard)
        }
    } else {
        if (firstInteraction) {
            timer.start()
            firstInteraction = false
        }
        // only numbers from <1,9>
        if (event.keyCode >= 49 && event.keyCode <= 57) {
            let paragraphs = [...lastFocusedCell.getElementsByTagName('p')]
            // sketch value input
            if (sketchMode) {
                if (paragraphs[event.key - 1].textContent != '') {
                    paragraphs[event.key - 1].textContent = ''
                } else {
                    // clear value in span if is any
                    lastFocusedSpan.textContent = ''
                    // put value inside paragraph
                    paragraphs[event.key - 1].textContent = event.key
                }
            }
            // main value input
            else {
                // clear all paragraphs inside div (delete values from sketchMode in that cell)
                paragraphs.forEach(p => p.textContent = '')
                // put value in span
                lastFocusedSpan.textContent = event.key
                resetStyles()
                sameValuesHighlation(lastFocusedCell, undefined)
                liveBoardValidation(lastFocusedCell)
                highlationRowColSquare(inputDivs.indexOf(lastFocusedCell), lastFocusedSpan.textContent, idxBoard)
            }
        }
    }
}))


// number buttons input value logic
numberBtns.forEach(numberBtn => numberBtn.addEventListener('click', function () {
    // first thing - make generated cells impossible to change
    let lastFocusedSpan = ''
    if (boardDisabled) {
        disableBoard()
        lastFocusedCell.getElementsByTagName('span')[0].textContent = numberBtn.textContent
        sameValuesHighlation(lastFocusedCell, undefined)
        liveBoardValidation(lastFocusedCell)
        return false
    }
    if (lastFocusedCell != undefined) {
        lastFocusedSpan = lastFocusedCell.getElementsByTagName('span')[0]
    }
    if (lastFocusedSpan.textContent != '' || lastFocusedCell == undefined) {
        sameValuesHighlation(lastFocusedCell, numberBtn.textContent)
    }
    if (lastFocusedSpan.textContent != '') {
        sameValuesHighlation(undefined, numberBtn.textContent)
    } else {
        if (firstInteraction) {
            timer.start()
            firstInteraction = false
        }
        // only numbers from <1,9>
        let paragraphs = [...lastFocusedCell.getElementsByTagName('p')]
        // sketch value input
        if (sketchMode) {
            if (paragraphs[numberBtn.textContent - 1].textContent != '') {
                paragraphs[numberBtn.textContent - 1].textContent = ''
            } else {
                // clear value in span if is any
                lastFocusedSpan.textContent = ''
                // put value inside paragraph
                paragraphs[numberBtn.textContent - 1].textContent = numberBtn.textContent
            }
        }
        // main value input
        else {
            // clear all paragraphs inside div (delete values from sketchMode in that cell)
            paragraphs.forEach(p => p.textContent = '')
            // put value in span
            lastFocusedSpan.textContent = numberBtn.textContent
            resetStyles()
            sameValuesHighlation(lastFocusedCell, undefined)
            highlationRowColSquare(inputDivs.indexOf(lastFocusedCell), lastFocusedSpan.textContent, idxBoard)
            liveBoardValidation(lastFocusedCell)

        }
    }
}))

// highlation
function highlationRowColSquare(divIndex, divValue, idxBoard) {

    let colorOfHighlation = '#e2e7ed'
    let colorOfError = '#ff3363'
    let colorOfFocused = '#eda5f0'

    if (inverse) {
        colorOfHighlation = '#929194'
        colorOfError = '#00cc9c'
        colorOfFocused = '#125a0f'
    }


    let spansArray = getSpans()
    let spanValue

    let toHighlight = []
    // columns highlation
    let idxTransposed = transpose(idxBoard)

    if (divValue == '') {
        inputDivs[divIndex].style.backgroundColor = colorOfFocused
    }

    for (let row of idxTransposed) {

        if (row.includes(divIndex)) {

            toHighlight = row
        }
    }
    for (let x of toHighlight) {
        spanValue = spansArray[x].textContent
        if (x != divIndex && !boardDisabled) {
            inputDivs[x].style.backgroundColor = colorOfHighlation
        }
        if (x != divIndex && spanValue == divValue && spanValue != '') {
            inputDivs[x].style.backgroundColor = colorOfError
        }
    }
    // rows highlation
    for (let row of idxBoard) {
        if (row.includes(divIndex)) {
            toHighlight = row
        }
    }
    for (let x of toHighlight) {
        spanValue = spansArray[x].textContent

        if (x != divIndex && !boardDisabled) {
            inputDivs[x].style.backgroundColor = colorOfHighlation
        }
        if (x != divIndex && spanValue == divValue && spanValue != '') {
            inputDivs[x].style.backgroundColor = colorOfError
        }
    }
    // squares highlation
    idxBoard = reverseBoard(idxBoard)
    for (let row of idxBoard) {
        if (row.includes(divIndex)) {
            toHighlight = row
        }
    }
    for (let x of toHighlight) {
        spanValue = spansArray[x].textContent

        if (x != divIndex && !boardDisabled) {
            inputDivs[x].style.backgroundColor = colorOfHighlation
        }
        if (x != divIndex && spanValue == divValue && spanValue != '') {
            inputDivs[x].style.backgroundColor = colorOfError
        }
    }
}

// downloads current values from board to board[][]
function currentBoardState() {
    let row = []
    let board = []
    let counter = 0
    for (let span of document.getElementsByClassName('input-value')) {
        span.textContent != '' ? row.push(parseFloat(span.textContent)) : row.push(0)
        if (span.textContent != '') boardEmpty = false
        counter++
        if (counter % 9 == 0) {
            board.push(row)
            row = []
        }
    }
    return reverseBoard(board)
}

// downloads values into array []
function getSpans() {
    let spans = []
    for (let span of document.getElementsByClassName('input-value')) {
        spans.push(span)
    }
    return spans
}

// reset styles
function resetStyles() {
    for (let inputDiv of inputDivs) {
        inputDiv.style.backgroundColor = 'white'
        inputDiv.getElementsByTagName('span')[0].style.color = 'black'
    }
}

// current div and same values highlation
function sameValuesHighlation(focusedDiv, value) {
    let colorOfSameValues = '#63f2b7'
    if (inverse) {
        colorOfSameValues = '#e44be9'
    }
    let focusedSpanText = ''
    if (focusedDiv == undefined) {
        for (let inputDiv of inputDivs) {
            if (value != undefined) {
                focusedSpanText = inputDiv.getElementsByClassName('input-value')[0].textContent
                inputDiv.style.backgroundColor = 'white'
                if (focusedSpanText == value) {
                    inputDiv.style.backgroundColor = colorOfSameValues
                }
            }
        }
    } else {
        focusedSpanText = focusedDiv.getElementsByClassName('input-value')[0].textContent
        if (focusedSpanText != '') {
            // current values in divs
            const inputDivs = [...document.getElementsByClassName('input-div')]
            for (let inputDiv of inputDivs) {
                // if inputDiv -> span.textContent == focusedDiv -> span.textContent
                if ((inputDiv.getElementsByTagName('span')[0].textContent == focusedSpanText) && inputDiv.getElementsByTagName('span')[0].textContent != '') {
                    inputDiv.style.backgroundColor = colorOfSameValues
                }
                if (value != undefined) {
                    focusedSpanText = inputDiv.getElementsByClassName('input-value')[0].textContent
                    inputDiv.style.backgroundColor = 'white'
                    if (focusedSpanText == value) {
                        inputDiv.style.backgroundColor = colorOfSameValues
                    }
                }
            }
            focusedDiv.style.backgroundColor = colorOfSameValues
        }
    }
}
// disable divs if error and force to correct it
function disableBoard(focusedDiv) {
    // styling of disabled board

    let colorOfDisabledCell = '#8c8c8c'

    if (inverse) {
        colorOfDisabledCell = '#badfaa'
    }

    grid.style.borderColor = 'black'

    for (let square of squares) {
        square.style.borderColor = 'black'
    }

    for (let inputDiv of inputDivs) {
        if (inputDiv != focusedDiv) {
            inputDiv.style.pointerEvents = "none";
            inputDiv.style.backgroundColor = colorOfDisabledCell
        } else {}
    }
    boardDisabled = true
}

function disableAll() {
    for (let inputDiv of inputDivs) {
        inputDiv.style.pointerEvents = "none";
    }
    boardDisabled = true
}

function enableBoard() {
    for (let inputDiv of inputDivs) {
        inputDiv.style.pointerEvents = 'auto'
        inputDiv.getElementsByTagName('span')[0].style.color = 'black'
    }
    boardDisabled = false
}

function fillBoard(board) {
    spansToDisable = []
    let counter = 0
    let spans = getSpans()
    for (let row of board) {
        for (let cell of row) {
            if (cell == 0) {
                spans[counter].textContent = ''
            } else {
                spans[counter].textContent = cell
                spansToDisable.push(spans[counter])
            }
            counter++
        }
    }
}

function colorSolved() {
    for (let inputDiv of inputDivs) {
        let spanText = inputDiv.getElementsByTagName('span')[0].textContent
        if (spanText == '') {
            inputDiv.style.backgroundColor = 'lightgreen'
        } else {
            inputDiv.style.backgroundColor = 'green'
        }
    }
}

function boardOfDivsGen() {
    let row = []
    let board = []
    let counter = 0
    for (let inputDiv of inputDivs) {
        row.push(inputDiv)
        counter++
        if (counter % 9 == 0) {
            board.push(row)
            row = []
        }
    }
    return reverseBoard(board)
}

function liveBoardValidation(lastFocusedCell) {
    if (sudokuLevel == 0) {
        return false
    }
    // get board after input value
    // check if value from input is the same value at corresponding cell in solved sudoku
    const boardOfDivs = boardOfDivsGen()
    let i = 0
    for (let row of boardOfDivs) {
        let j = 0
        for (let div of row) {
            // finding div where value was inserted
            if (div == lastFocusedCell) {
                // checking if inserted value is correct
                let span = div.getElementsByTagName('span')[0]
                if (solvedGenerated[i][j] == span.textContent) {
                    // if value is correct - disable this cell and highlight row/col/sq
                    resetStyles()
                    sameValuesHighlation(lastFocusedCell, undefined)
                    highlationRowColSquare(inputDivs.indexOf(div), span.textContent, idxBoard)
                    let currentBoard = currentBoardState()
                    spansToDisable.push(span)
                    enableBoard()
                    scanForDisappear(span.textContent)
                    // endgame ?
                    if (solver.solved(currentBoard)) {
                        timer.stop()
                        submitDatabase()
                    }
                } else {
                    // if value is wrong - cells that generates error bg color = 'red' and color of divInput = 'red
                    punishmentFunc('mistake')
                    timer.seconds += 30
                    let wrongColor = '#ff3363'
                    if (inverse) {
                        wrongColor = '#00ffff'
                    }
                    span.style.color = wrongColor
                    highlationRowColSquare(inputDivs.indexOf(lastFocusedCell), span.textContent, idxBoard)
                    if (!boardDisabled) {
                        disableBoard(lastFocusedCell)
                    }
                }
            }
            j++
        }
        i++
    }
}

function scanForDisappear(passedBtnValue) {
    let counter = 0
    let actualBoard = currentBoardState()
    for (let row of actualBoard) {
        for (let element of row) {
            if (element == passedBtnValue) {
                counter++
            }
        }
    }
    if (counter == 9) {
        numberBtns[passedBtnValue - 1].textContent = ''
        numberBtns[passedBtnValue - 1].style.pointerEvents = 'none'
    }
}

function restoreNumbers() {
    for (let i = 0; i < 9; i++) {
        let value = i + 1
        numberBtns[i].style.pointerEvents = 'auto'
        numberBtns[i].textContent = value
    }
}


function hint(lastFocusedCell) {
    let current
    if (!sudokuLevel) return false
    let selectedSpan = lastFocusedCell.getElementsByTagName('span')[0]
    if (selectedSpan.textContent == '') {

        if (timer.running == false) {
            timer.start()
        }
        if (hintsCounter == 5) {
            alert('You are out of hints!')
            return false
        }
        hintsCounter++
        punishmentFunc('hint')
        timer.seconds += 30
        const boardOfDivs = boardOfDivsGen()
        let i = 0
        let j = 0
        for (let row of boardOfDivs) {
            j = 0
            for (let element of row) {
                if (element == lastFocusedCell) {
                    for (let paragraph of lastFocusedCell.getElementsByTagName('p')) {
                        paragraph.textContent = ''
                    }
                    selectedSpan.textContent = solvedGenerated[i][j]
                    spansToDisable.push(selectedSpan)
                    sameValuesHighlation(lastFocusedCell, undefined)
                }
                j++
            }
            i++
        }
        current = currentBoardState()
        if (solver.solved(current)) {
            return submitDatabase()
        }
    }

}

function totalReset() {
    sketchMode = false
    boardDisabled = false
    boardEmpty = true
    sudokuLevel = 0
    generatedBoard = []
    spansToDisable = []
    firstInteraction = true
    timer = new Timer()
    hintsCounter = 0
    hintsSpan.textContent = `0`
    enableBoard()
    resetStyles()
    clearAllValues()
}

function punishmentFunc(source) {
    let value
    if (source == 'mistake') {
        value = 30
    } else {
        value = 60
    }
    punishmentSpan[0].textContent = `+${value}`
    punishmentSpan[1].textContent = `+1`

    hintsSpan.textContent = `${hintsCounter}`

    $(punishmentSpan[0]).fadeIn(500)
    $(punishmentSpan[0]).fadeOut(500)
    $(punishmentSpan[1]).fadeIn(500)
    $(punishmentSpan[1]).fadeOut(500)
}

function clearAllValues() {
    for (let span of getSpans()) {
        span.textContent = ''
    }
    for (let inputDiv of inputDivs) {
        let sketchDiv = inputDiv.getElementsByClassName('sketch-div')[0]
        for (let paragraph of sketchDiv.getElementsByTagName('p')) {
            paragraph.textContent = ''
        }
    }
}

function inverseBaby() {
    const html = document.querySelector('html')
    if (!inverse) {
        html.style.filter = 'invert(100%)'
    } else {
        html.style.filter = 'invert(0%)'
    }
    inverse = !inverse
}


$('#nickname-input').keypress(function (e) {
    if (e.keyCode === 13) document.activeElement.blur();
})

function submitDatabase() {
    $("#database-add").submit(function () {
        let nickname = $('#nickname-input').val()
        let level = sudokuLevel
        let time = timerSpan.textContent
        // if nick is not empty we send this to database
        if (nickname != '') {
            $.ajax({
                url: "./php/send-to-ranking.php",
                type: "POST",
                data: {
                    'nick': nickname,
                    'level': level,
                    'time': time
                },
                success: function (data) {
                    $('#message').html(data);
                }
            })
            alert(`${nickname} you've finished ${sudokuLevel} sudoku in ${time}. Let's check how do you compare with others!`)
        }
        // buying time for sending to database (alerts) 
        else {
            alert(`You left nickname input empty. Fill it next time if you want to be included in monthly ranking... but still you can check others time!`)
        }
    })
    $("#database-add").submit()
}