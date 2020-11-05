var ajax = new XMLHttpRequest();
var method = "GET";
var url = "./ranking.php";
var asynch = true;

const easyRank = document.getElementById('easy')
const mediumRank = document.getElementById('medium')
const hardRank = document.getElementById('hard')

ajax.open(method, url, asynch)

ajax.send()

let easyPlayers = []
let mediumPlayers = []
let hardPlayers = []

ajax.onreadystatechange = async function () {
    if (this.readyState == 4 && this.status == 200) {
        data = await JSON.parse(this.responseText)
        console.log(data)
        // group by level
        for (let row of data) {
            if (row['sudokuLevel'] == 'easy') {
                easyPlayers.push(row)
            }
            if (row['sudokuLevel'] == 'medium') {
                mediumPlayers.push(row)
            }
            if (row['sudokuLevel'] == 'hard') {
                hardPlayers.push(row)
            }
        }
        let easyNickTime = uniqueNameAndBestTime(easyPlayers)
        let mediumNickTime = uniqueNameAndBestTime(mediumPlayers)
        let hardNickTime = uniqueNameAndBestTime(hardPlayers)

        console.log(easyNickTime)
        console.log(mediumNickTime)
        console.log(hardNickTime)


        hallOfFame(easyRank, easyNickTime)
        hallOfFame(mediumRank, mediumNickTime)
        hallOfFame(hardRank, hardNickTime)
    }
}

function findBestTime(nickname, arrayOfObjects) {
    let bestTime = '99:99'
    for (let x of arrayOfObjects) {
        if (x['nickname'] == nickname) {
            if (x['sudokuTime'] < bestTime) {
                bestTime = x['sudokuTime']
            }
        }
    }
    return bestTime
}

function uniqueNameAndBestTime(objectOfPlayers, ) {
    // zbior z unikatowymi nickami
    let playersNicknames = new Set()
    for (let x of objectOfPlayers) {
        playersNicknames.add(x['nickname'])
    }
    let nickAndTime = []
    for (let x of playersNicknames) {
        nickAndTime.push([x, findBestTime(x, objectOfPlayers)])
    }

    function sortFunction(a, b) {
        if (a[1] > b[1]) return -1
    }

    return nickAndTime.sort(sortFunction).reverse()
}

function hallOfFame(injectDiv, twoDimArray) {
    let paragraph
    let position = 1
    for (let x of twoDimArray) {
        paragraph = document.createElement('p')
        paragraph.textContent = `${x[0]} - ${x[1]}`
        injectDiv.appendChild(paragraph)
        position += 1
    }
}