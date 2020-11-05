import {
    startingCoordinates
} from './exports.js'

export let idxBoard = []
let row = []
let counter = 0

// generate [][] like [[1,2,3,4,5,6,7,8,9],[10-18]...]
for (let i = 0; i < 81; i++) {
    row.push(i)
    counter++
    if (counter % 9 == 0) {
        idxBoard.push(row)
        row = []
    }
}
idxBoard = reverseBoard(idxBoard)

export function reverseBoard(board) {
    let allSquares = []
    for (let k = 0; k < 9; k++) {
        let square = []
        let yAxis = startingCoordinates[k][0]
        let xAxis = startingCoordinates[k][1]
        for (let i = yAxis; i < yAxis + 3; i++) {
            for (let j = xAxis; j < xAxis + 3; j++) {
                square.push(board[i][j])
            }
        }
        allSquares.push(square)
    }
    return allSquares
}

export function transpose(matrix) {
    return matrix[0].map((col, i) => matrix.map(row => row[i]));
}

export function validRows(board) {
    for (let y = 0; y < 9; y++) {
        let row = []
        for (let x = 0; x < 9; x++) {
            row.push(board[y][x])
        }
        if (!arrayValidation(row)) return false
    }
    return true
}

// validate columns of [][] array
export function validColumns(board) {
    for (let y = 0; y < 9; y++) {
        let column = []
        for (let x = 0; x < 9; x++) {
            column.push(board[x][y])
        }
        if (!arrayValidation(column)) return false
    }
    return true
}

// validate 3x3 single squares
export function validSquares(board) {
    for (let k = 0; k < 9; k++) {
        let square = []
        let yAxis = startingCoordinates[k][0]
        let xAxis = startingCoordinates[k][1]
        for (let i = xAxis; i < xAxis + 3; i++) {
            for (let j = yAxis; j < yAxis + 3; j++) {
                square.push(board[i][j])
            }
        }
        if (!arrayValidation(square)) return false
    }
    return true
}


// helping function to validate an array
export function arrayValidation(array) {
    for (let i = 1; i <= 9; i++) {
        if (array.filter(number => number === i).length > 1) return false
    }
    return true
}

// check if board at certain state is valid
export function boardValidation(board) {
    if (!validRows(board)) return false
    if (!validColumns(board)) return false
    if (!validSquares(board)) return false
    return true
}

export function twoDimToString(twoDimArray) {
    let stringResult = ''
    for (let row of twoDimArray) {
        for (let el of row) {
            stringResult += el
        }
    }
    return stringResult
}