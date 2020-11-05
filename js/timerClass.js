export class Timer {
    constructor() {
        this.minutes = 0
        this.seconds = 0
        this.miliseconds = 0
        this.timer = 0
        this.running = false
    }

    start = () => {
        if (!this.timer) {
            this.timer = setInterval(this.run, 10)
        }
        this.running = true
    }

    run = () => {
        this.miliseconds++
        if (this.miliseconds == 100) {
            this.miliseconds = 0
            this.seconds++
        }
        if (this.seconds >= 60) {
            this.seconds = this.seconds % 60
            this.minutes++
        }
    }

    stop = () => {
        clearInterval(this.timer)
        this.timer = false
        this.minutes = 0, this.seconds = 0, this.miliseconds = 0
    }

    returnTime = () => {
        let printMinutes = ''
        let printSeconds = ''
        this.minutes < 10 ? printMinutes = `0${this.minutes}` : printMinutes = this.minutes
        this.seconds < 10 ? printSeconds = `0${this.seconds}` : printSeconds = this.seconds
        return `${printMinutes}:${printSeconds}`
    }
}