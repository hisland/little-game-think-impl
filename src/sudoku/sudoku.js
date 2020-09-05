const blocks = [
  {
    type: 'line',
    indexList: [],
    shape: [[4, 5, 6, 7], []],
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
  constructor() {
    this.cells = []
    this.InitCells()
    this.blocks = this.GetBlocks()
    this.rows = this.GetRows()
    this.cols = this.GetCols()
    // console.log(this)
  }
  InitCells() {
    const cells = []
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        cells.push({
          value: null,
          index: 9 * row + col,
          row,
          col,
          tmpValues: [],
        })
      }
    }
    this.cells = cells
  }
  resolve() {}
  FillOneRest(list) {
    const [one, two] = list.filter((vv) => !vv.value)
    if (!two && one) {
      const ss = new Set(list.map((vv) => vv.value))
      for (let ii = 1; ii < 10; ii++) {
        if (!ss.has(ii)) {
          one.value = ii
          return
        }
      }
    }
  }
  TryBlocks() {
    for (const block of this.blocks) {
      this.FillOneRest(block)
    }
    console.log('done blocks')
  }
  TryRows() {
    for (const line of this.rows) {
      this.FillOneRest(line)
    }
    console.log('done rows')
  }
  TryCols() {
    for (const line of this.cols) {
      this.FillOneRest(line)
    }
    console.log('done cols')
  }
  TryCells() {
    for (const cell of this.cells) {
      if (!cell.value) {
      }
    }
    console.log('done cells')
  }
  TryAllRestOne() {
    this.TryBlocks()
    this.TryRows()
    this.TryCols()
  }
  GetBlocks() {
    const { cells } = this
    const rs = []
    for (let ii = 0; ii < 9; ii++) {
      const block = []
      const b_row = Math.floor(ii / 3)
      const b_col = ii % 3
      for (let s_row = 0; s_row < 3; s_row++) {
        for (let s_col = 0; s_col < 3; s_col++) {
          const index = b_row * 9 * 3 + s_row * 9 + b_col * 3 + s_col
          // console.log(index)
          block.push(cells[index])
        }
      }
      rs.push(block)
    }
    return rs
  }
  GetRows() {
    const { cells } = this
    const rs = []
    for (let row = 0; row < 9; row++) {
      rs.push(cells.slice(9 * row, 9 * row + 9))
    }
    return rs
  }
  GetCols() {
    const rs = []
    for (let row = 0; row < 9; row++) {
      rs.push([])
    }
    for (const row of this.rows) {
      for (const cell of row) {
        rs[cell.col].push(cell)
      }
    }
    return rs
  }
}
