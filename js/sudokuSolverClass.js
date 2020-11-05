export class SudokuSolver {

    constructor(board) {
        this.board = board
        this.startingCoordinates = [
            [0, 0],
            [0, 3],
            [0, 6],
            [3, 0],
            [3, 3],
            [3, 6],
            [6, 0],
            [6, 3],
            [6, 6]
        ]
    }

    solveSudoku = (board) => {
        if (this.solved(board)) {
            return board
        } else {
            const possibilites = this.possibleBoards(board)
            const validBoards = this.keepOnlyValid(possibilites)
            return this.searchForSolution(validBoards)
        }
    }

    // backtracking 
    searchForSolution = (boards) => {
        if (boards.length == 0) return false
        else {
            // backtracking
            let first = boards.shift()
            const tryPath = this.solveSudoku(first)
            if (tryPath) return tryPath
            else {
                return this.searchForSolution(boards)
            }
        }
    }

    // checks if sudoku puzzle is solved already
    solved = (board) => {
        for (let x of board) {
            if (x.includes(0)) return false
        }
        return true
    }

    // generates possible boards from certain state of sudoku puzzle
    possibleBoards = (board) => {
        let res = []
        const firstEmpty = this.findEmptySquare(board) // [y,x]
        if (firstEmpty != undefined) {
            const y = firstEmpty[0]
            const x = firstEmpty[1]

            for (let i = 1; i <= 9; i++) {
                let newBoard = [...board]
                let row = [...newBoard[y]]
                row[x] = i
                newBoard[y] = row
                res.push(newBoard)
            }
        }
        return res
    }

    // returns coordinates of first empty square of sudoku puzzle
    findEmptySquare = (board) => {
        let y = 0
        for (let x of board) {
            if (x.includes(0)) return [y, x.indexOf(0)]
            y++
        }
        return false
    }

    // returns only valid boards
    keepOnlyValid = (boards) => {
        return boards.filter(this.boardValidation)
    }

    // validate rows of [][] array
    validRows = (board) => {
        for (let y = 0; y < 9; y++) {
            let row = []
            for (let x = 0; x < 9; x++) {
                row.push(board[y][x])
            }
            if (!this.arrayValidation(row)) return false
        }
        return true
    }

    // validate columns of [][] array
    validColumns = (board) => {
        for (let y = 0; y < 9; y++) {
            let column = []
            for (let x = 0; x < 9; x++) {
                column.push(board[x][y])
            }
            if (!this.arrayValidation(column)) return false
        }
        return true
    }

    // validate 3x3 single squares
    validSquares = (board) => {
        for (let k = 0; k < 9; k++) {
            let square = []
            let yAxis = this.startingCoordinates[k][0]
            let xAxis = this.startingCoordinates[k][1]
            for (let i = xAxis; i < xAxis + 3; i++) {
                for (let j = yAxis; j < yAxis + 3; j++) {
                    square.push(board[i][j])
                }
            }
            if (!this.arrayValidation(square)) return false
        }
        return true
    }


    // helping function to validate an array
    arrayValidation = (array) => {
        for (let i = 1; i <= 9; i++) {
            if (array.filter(number => number === i).length > 1) return false
        }
        return true
    }

    // check if board at certain state is valid
    boardValidation = (board) => {
        if (!this.validRows(board)) return false
        if (!this.validColumns(board)) return false
        if (!this.validSquares(board)) return false
        return true
    }

    // <--- SUDOKU SOLVER - validation section END --->
}