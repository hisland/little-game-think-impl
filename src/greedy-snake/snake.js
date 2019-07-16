export default class Mine {
  constructor(rows, cols) {
    this.rows = rows
    this.cols = cols
    this.max = rows * cols
    this.snake = [rows + 3, rows + 2, rows + 1]
    this.food = this.randomFood()
    this.dir = 'right'
  }
  randomFood() {
    const { max } = this
    let rid
    do {
      rid = Math.floor(Math.random() * max)
    } while (this.snake.some(vv => vv === rid))
    return rid
  }
  toIndex([xx, yy]) {
    const { cols } = this
    return cols * yy + xx
  }
  toPos(index) {
    const { cols } = this
    const xx = index % cols
    const yy = (index - xx) / cols
    return [xx, yy]
  }
  getNewHeadPos() {
    const [oldHeadX, oldHeadY] = this.toPos(this.snake[0])
    const { dir } = this
    let newHeadX, newHeadY
    if (dir === 'up') {
      newHeadX = oldHeadX
      newHeadY = oldHeadY - 1
    } else if (dir === 'down') {
      newHeadX = oldHeadX
      newHeadY = oldHeadY + 1
    } else if (dir === 'left') {
      newHeadX = oldHeadX - 1
      newHeadY = oldHeadY
    } else if (dir === 'right') {
      newHeadX = oldHeadX + 1
      newHeadY = oldHeadY
    }
    return [newHeadX, newHeadY]
  }
  next() {
    const newHeadPos = this.getNewHeadPos()
    const [newHeadX, newHeadY] = newHeadPos
    const newHeadIndex = this.toIndex(newHeadPos)
    if (this.snake.some(vv => vv === newHeadIndex)) {
      return 'fail'
    }
    const { rows, cols } = this
    if (newHeadX < 0 || newHeadX >= cols || newHeadY < 0 || newHeadY >= rows) {
      return 'fail'
    }
    this.snake.unshift(newHeadIndex)
    if (newHeadIndex !== this.food) {
      this.snake.pop()
    } else {
      this.food = this.randomFood()
    }
  }
}
