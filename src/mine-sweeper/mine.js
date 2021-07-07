export default class MineSweeper {
  constructor(rows, cols, mineCount) {
    this.rows = rows
    this.cols = cols
    this.max = rows * cols
    this.mineCount = mineCount
    this.cells = []
    this.checkSet = new Set()
    this.gameState = 'running'
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
    const mines = this.randomMines()
    for (const vv of mines) {
      cells[vv].value = 9
    }
    this.cells = cells
    this.cells.forEach((vv1, index1) => {
      if (vv1.value !== 9) {
        vv1.value = this.countMines(index1)
      }
    })
    this.checkSet = new Set()
  }
  randomMines() {
    const { max, mineCount } = this
    const ss = new Set()
    while (ss.size < mineCount) {
      const rid = Math.floor(Math.random() * max)
      ss.add(rid)
    }
    return ss
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
  aroundIndex(index) {
    const { rows, cols } = this
    const [xx, yy] = this.toPos(index)
    const arr1 = [
      [xx - 1, yy - 1],
      [xx, yy - 1],
      [xx + 1, yy - 1],
      [xx - 1, yy],
      [xx + 1, yy],
      [xx - 1, yy + 1],
      [xx, yy + 1],
      [xx + 1, yy + 1],
    ]
    const arr2 = arr1
      .filter(([xx, yy]) => !(xx < 0 || xx >= cols || yy < 0 || yy >= rows))
      .map(([xx, yy]) => cols * yy + xx)
    return arr2
  }
  countMines(index) {
    const indexList = this.aroundIndex(index)
    const { cells } = this
    let sum = 0
    for (const index2 of indexList) {
      if (cells[index2].value === 9) {
        sum += 1
      }
    }
    return sum
  }
  setMark(index) {
    const { cells } = this
    const one = cells[index]
    if (one.mark === 'none') {
      one.mark = 'flag'
    } else if (one.mark === 'flag') {
      one.mark = 'question'
    } else if (one.mark === 'question') {
      one.mark = 'none'
    }
    this.checkAll()
  }
  open(index) {
    const { cells } = this
    const one1 = cells[index]
    if (one1.value === 9) {
      // 失败, 雷
      this.surrender()
    } else if (one1.opened) {
      // 已经打开
    } else {
      let deepCount2 = 0
      const { checkSet } = this
      // 批量递归, 递归函数调用次数明显少很多
      const deepCheck = (indexList) => {
        deepCount2++
        for (const index2 of indexList) {
          if (checkSet.has(index2)) continue // 注意不是 break
          checkSet.add(index2)
          const one2 = cells[index2]
          if (!one2.opened) {
            one2.opened = true
            if (one2.value === 0) {
              const indexList = this.aroundIndex(index2)
              deepCheck(indexList)
            }
          }
        }
      }
      deepCheck([index])
      console.log('deepCheck', deepCount2)
      this.checkAll()
    }
  }
  open1(index) {
    const { cells } = this
    const one1 = cells[index]
    if (one1.value === 9) {
      // 失败, 雷
      this.surrender()
    } else if (one1.opened) {
      // 已经打开
    } else {
      let deepCount1 = 0
      let deepCount2 = 0
      const { checkSet } = this
      // 单个递归, 递归函数会调用很多次
      const deepCheck = (index2) => {
        deepCount1++
        if (checkSet.has(index2)) return
        checkSet.add(index2)
        deepCount2++
        if (deepCount2 > 300) {
          return console.log('early out')
        } else {
          console.log('deepCheck', deepCount2)
        }
        const one2 = cells[index2]
        if (!one2.opened) {
          one2.opened = true
          if (one2.value === 0) {
            const indexList = this.aroundIndex(index2)
            for (const index3 of indexList) {
              deepCheck(index3)
            }
          }
        }
      }
      deepCheck(index)
      console.log(deepCount1)
      this.checkAll()
    }
  }
  checkAll() {
    const pass = this.cells
      .filter((vv) => vv.value === 9)
      .every((vv) => vv.mark === 'flag')
    if (pass) {
      this.showAll()
      this.gameState = 'accomplish'
    }
  }
  showAll() {
    for (const vv of this.cells) {
      vv.opened = true
    }
  }
  surrender() {
    this.showAll()
    this.gameState = 'fail'
  }
}
