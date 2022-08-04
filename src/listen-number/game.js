import { randomInt } from '../util'
import { toIndex } from '../util'

export default class Game {
  constructor(config) {
    this.config = config
    this.groups = []
    this.initGroups()
    this.running = false
    this.groupIndex = 0
    this.questionIndex = 0
  }
  initGroups() {
    const groups = []
    const { groupCount } = this.config
    const { groupLength, minLength, maxLength, reverse } = this.config
    for (let ii = 0; ii < groupCount; ii++) {
      const list = []
      groups.push({
        index: ii,
        list,
      })
      for (let jj = 0; jj < groupLength; jj++) {
        const rnd_length = randomInt(minLength, maxLength)
        const set1 = new Set()
        while (set1.size < rnd_length) {
          const rnd = randomInt(0, 9)
          if (!set1.has(rnd)) {
            set1.add(rnd)
          }
        }
        const question = [...set1]
        const realAnswer = reverse ? question.reverse() : question.slice()
        const obj = {
          question,
          realAnswer,
          myAnswer: [],
          isRight: false,
        }
        list.push(obj)
      }
    }
    this.groups = groups
  }
  next() {}
}
