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
          tmpValues: new Set(),
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
          this.SetValue(one, ii)
          return
        }
      }
    }
  }
  TryBlocks() {
    for (const block of this.blocks) {
      this.FillOneRest(block)
    }
    console.log('done TryBlocks')
  }
  TryRows() {
    for (const line of this.rows) {
      this.FillOneRest(line)
    }
    console.log('done TryRows')
  }
  TryCols() {
    for (const line of this.cols) {
      this.FillOneRest(line)
    }
    console.log('done TryCols')
  }
  TryCells() {
    AllCell: for (const cell of this.cells) {
      if (!cell.value) {
        const block = this.blocks[cell.block]
        const row = this.rows[cell.row]
        const col = this.cols[cell.col]
        const nums = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9])
        for (const list of [block, row, col]) {
          for (const cell2 of list) {
            if (cell2.value) {
              nums.delete(cell2.value)
              if (nums.size === 1) {
                this.SetValue(cell, nums.values().next().value)
                continue AllCell
              }
            }
          }
        }
      }
    }
    console.log('done TryCells')
  }
  TryBlockRowCol() {
    const { blocks } = this
    for (let ii = 1; ii <= 9; ii++) {
      LOOP_BLOCKS: for (let jj = 0; jj <= 8; jj++) {
        const block = blocks[jj]
        const index = block.findIndex((vv) => vv.value === ii)
        if (index === -1) {
          const nums = new Set([0, 1, 2, 3, 4, 5, 6, 7, 8])
          const b_row = Math.floor(jj / 3)
          const b_col = jj % 3

          const test_rest = () => {
            const rest_empty = [...nums.values()]
              .map((vv) => block[vv])
              .filter((vv) => vv.value === null)
            if (rest_empty.length === 1) {
              console.log('唯一', ii, jj, nums.values(), rest_empty)
              this.SetValue(rest_empty[0], ii)
              return true
            } else if (rest_empty.length === 0) {
              console.log('错误了', ii, jj, rest_empty)
              throw Error('错误了')
            }
          }

          if (test_rest()) {
            continue LOOP_BLOCKS
          }

          const row_other_2 =
            b_col === 0
              ? [blocks[b_row * 3 + b_col + 1], blocks[b_row * 3 + b_col + 2]]
              : b_col === 1
              ? [blocks[b_row * 3 + b_col - 1], blocks[b_row * 3 + b_col + 1]]
              : [blocks[b_row * 3 + b_col - 2], blocks[b_row * 3 + b_col - 1]]
          // console.log(
          //   'row_other_2',
          //   row_other_2.map((vv) => vv[0].block)
          // )

          for (const block2 of row_other_2) {
            const index = block2.findIndex((vv) => vv.value === ii)
            if (index !== -1) {
              const s_row = Math.floor(index / 3)
              nums.delete(s_row * 3 + 0)
              nums.delete(s_row * 3 + 1)
              nums.delete(s_row * 3 + 2)

              if (test_rest()) {
                continue LOOP_BLOCKS
              }
            }
          }

          const col_other_2 =
            b_row === 0
              ? [
                  blocks[(b_row + 1) * 3 + b_col],
                  blocks[(b_row + 2) * 3 + b_col],
                ]
              : b_row === 1
              ? [
                  blocks[(b_row - 1) * 3 + b_col],
                  blocks[(b_row + 1) * 3 + b_col],
                ]
              : [
                  blocks[(b_row - 2) * 3 + b_col],
                  blocks[(b_row - 1) * 3 + b_col],
                ]
          // console.log(
          //   'col_other_2',
          //   col_other_2.map((vv) => vv[0].block)
          // )

          for (const block2 of col_other_2) {
            const index = block2.findIndex((vv) => vv.value === ii)
            if (index !== -1) {
              const s_col = index % 3
              nums.delete(0 * 3 + s_col)
              nums.delete(1 * 3 + s_col)
              nums.delete(2 * 3 + s_col)

              if (test_rest()) {
                continue LOOP_BLOCKS
              }
            }
          }
        }
      }
    }

    console.log('done TryBlockRowCol')
  }
  ClearMark() {
    for (const cell of this.cells) {
      if (!cell.value) {
        cell.tmpValues = new Set()
      }
    }
    console.log('done ClearMark')
  }
  SetMark() {
    for (const cell of this.cells) {
      if (!cell.value) {
        const block = this.blocks[cell.block]
        const row = this.rows[cell.row]
        const col = this.cols[cell.col]
        const nums = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9])
        for (const list of [block, row, col]) {
          for (const cell2 of list) {
            if (cell2.value) {
              nums.delete(cell2.value)
            }
          }
        }
        cell.tmpValues = nums
      }
    }
    console.log('done SetMark')
  }
  TrimMark2Lock() {
    for (const [name, list3] of [
      ['block', this.blocks],
      ['row', this.rows],
      ['col', this.cols],
    ]) {
      for (const list of list3) {
        const emptyList = list.filter((vv) => !vv.value)
        const empty2ValueList = emptyList.filter(
          (vv) => vv.tmpValues.size === 2
        )
        // const empty2ValueList = []
        // for (const vv of emptyList) {
        //   if (vv.tmpValues.size === 2) {
        //     empty2ValueList.push(vv)
        //   }
        // }
        const sorted = empty2ValueList
          .map((vv) => [vv, [...vv.tmpValues.values()].join('-')])
          .sort(([, aa], [, bb]) => aa.localeCompare(bb))
        for (let ii = 0; ii < sorted.length - 1; ii++) {
          const [vv1, aa] = sorted[ii]
          const [vv2, bb] = sorted[ii + 1]
          if (aa === bb) {
            for (const vv4 of emptyList) {
              if (vv4 === vv1 || vv4 === vv2) {
                continue
              } else {
                for (const num of vv1.tmpValues) {
                  vv4.tmpValues.delete(num)
                }
              }
            }
          } else {
            console.log(name, aa, bb)
          }
        }
      }
    }
    console.log('done TrimMark2Lock')
  }
  FillMarkOnlyOne() {
    for (const cell of this.cells) {
      if (!cell.value) {
        if (cell.tmpValues.size === 1) {
          this.SetValue(cell, cell.tmpValues.values().next().value)
        }
      }
    }
    console.log('done FillMarkOnlyOne')
  }
  SetValue(cell, value) {
    cell.value = value

    const block = this.blocks[cell.block]
    const row = this.rows[cell.row]
    const col = this.cols[cell.col]
    for (const list of [block, row, col]) {
      for (const cell2 of list) {
        if (!cell2.value) {
          cell2.tmpValues.delete(value)
        }
      }
    }
    console.log('SetValue: ', cell, value)
  }
  validate() {
    for (const [name, list3] of [
      ['block', this.blocks],
      ['row', this.rows],
      ['col', this.cols],
    ]) {
      for (const [index, list] of list3.entries()) {
        const nums = new Set()
        for (const cell of list) {
          const { value } = cell
          if (nums.has(value)) {
            console.log(
              name,
              'error: ',
              cell.row + 1,
              cell.col + 1,
              value,
              cell
            )
            return
          } else {
            nums.add(value)
          }
        }
      }
    }
    console.log('done validate')
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
      const big_row = Math.floor(ii / 3)
      const big_col = ii % 3
      for (let small_row = 0; small_row < 3; small_row++) {
        for (let small_col = 0; small_col < 3; small_col++) {
          const index =
            big_row * 9 * 3 + small_row * 9 + big_col * 3 + small_col
          // console.log(index)
          const cell = cells[index]
          cell.block = ii
          block.push(cell)
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