// boards

export const boardRankingTesting = [
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
    [4, 5, 6, 7, 8, 9, 1, 2, 3],
    [7, 8, 9, 1, 2, 3, 4, 5, 6],
    [2, 1, 4, 3, 6, 5, 8, 9, 7],
    [3, 6, 5, 8, 9, 7, 2, 1, 4],
    [8, 9, 7, 2, 1, 4, 3, 6, 5],
    [5, 3, 1, 6, 4, 2, 9, 7, 8],
    [6, 4, 2, 9, 7, 8, 5, 3, 1],
    [9, 7, 8, 5, 3, 1, 6, 4, 0],
]

export const startingCoordinates = [
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

// all buttons

export const easyBtn = document.getElementById('easy')

export const mediumBtn = document.getElementById('medium')

export const hardBtn = document.getElementById('hard')

export const solveBtn = document.getElementById('solve')

export const clearBtn = document.getElementById('clear')

export const sketchBtn = document.getElementById('sketch')

export const helpBtn = document.getElementById('help')

export const inverseBtn = document.getElementById('inverse-btn')

export const numberBtns = [...document.getElementsByClassName('number')]

export const squares = document.getElementsByClassName('square') // 9 bigger boxes

export const grid = document.getElementsByClassName('grid')[0]

export const difficultyBtns = [...document.getElementsByClassName('difficulty-btns')]

export const onOffSketch = document.getElementsByClassName('on-off')[0]

// for color inverse

export const titleH1 = document.getElementById('title')


// divCell

export const inputDivs = [...document.getElementsByClassName('input-div')]




// rest

export const timerSpan = document.getElementById('time')

export const punishmentSpan = document.getElementsByClassName('punishment')

export const hintsSpan = document.getElementById('hints')