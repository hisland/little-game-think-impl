const blocks = [
  {
    type: 'line',
    indexList: [],
    shape: [[4,5,6,7], []],
  },
  {
    type: 'z',
    indexList: [],
  },
  {
    type: 'rz',
    indexList: [],
  },
  {
    type: 'l',
    indexList: [],
  },
  {
    type: 'rl',
    indexList: [],
  },
  {
    type: 'square',
    indexList: [],
  },
  {
    type: 't',
    indexList: [],
  },
]
export default class Mine {
  constructor(rows, cols) {
    this.rows = rows
    this.cols = cols
    this.max = rows * cols
    this.init()
  }
  init() {
    const { max } = this
    const cells = []
    for (let ii = 0; ii < max; ii++) {
      cells.push({
        value: 0,
        mark: 'none',
        opened: false,
      })
    }
    this.cells = cells
  }
  rotate() {
    if (this.nowBlock) {
    } else {
      this.nowBlock = {

      }
    }
  }
  downOne() {
    if (this.nowBlock) {
    } else {
      this.nowBlock = {

      }
    }
  }
  moveLeftRight(num) {

  }
  randomBlock() {
    const rid = Math.floor(Math.random() * blocks.length)
    return blocks[rid]
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
  checkAll() {
    const pass = this.cells
      .filter(vv => vv.value === 9)
      .every(vv => vv.mark === 'flag')
    if (pass) {
      this.showAll()
      this.gameState = 'accomplish'
    }
  }
}
