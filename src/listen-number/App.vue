<template>
  <div class="wrap">
    <div class="page" v-if="state === 0">
      <div class="pagetop">
        <div ref="dotWrap" class="setting">
          <div class="line">
            <span class="label">设置组数</span>
            <select v-model.trim="config.groupCount" class="input">
              <option v-for="ii in intRange(3, 10)" :value="ii" :key="ii">
                {{ ii }}
              </option>
            </select>
          </div>
          <div class="line">
            <span>最小长度</span>
            <select v-model.trim="config.minLength" class="input">
              <option
                v-for="ii in intRange(1, config.maxLength)"
                :value="ii"
                :key="ii"
              >
                {{ ii }}
              </option>
            </select>
          </div>
          <div class="line">
            <span>最大长度</span>
            <select v-model.trim="config.maxLength" class="input">
              <option
                v-for="ii in intRange(config.minLength, 10)"
                :value="ii"
                :key="ii"
              >
                {{ ii }}
              </option>
            </select>
          </div>
          <div class="line">
            <span>反写</span>
            <input type="checkbox" v-model="config.reverse" />
          </div>
        </div>
      </div>
      <div class="btns">
        <button @click="start()">开始</button>
      </div>
    </div>
    <div class="page" v-if="state === 1">
      <div class="pagetop">
        <div class="dotWrap" v-if="questionItem">
          <template v-if="isShow">
            <div class="row" v-for="(cols, yy) in questionItem.rows" :key="yy">
              <template v-for="(cell, xx) in cols" :key="xx">
                <div class="dot" v-if="!cell"></div>
                <div class="dot" v-else :class="{ [cell]: true }"></div>
              </template>
            </div>
          </template>
        </div>
      </div>
      <div class="btns">
        <button
          @click="next()"
          v-if="questionIndex < questionList.length - 1 || isShow"
        >
          下一组({{ questionIndex + 1 }}/{{ questionList.length }})
        </button>
        <button v-else @click="state = 2">显示答案</button>
      </div>
    </div>
    <div class="page" v-if="state === 2">
      <div class="pagetop">
        答案是: {{ questionList.map((vv) => vv.answer).join(', ') }}
      </div>
      <div class="btns">
        <button @click="state = 0">返回首页</button>
      </div>
    </div>
  </div>
</template>
<script>
import GameCore from './game.js'
import { randomInt } from '../util'
import { toIndex, toPos } from '../util'
import { SaveLocalJSON, GetLocalJSONByVersion } from '../util'

export default {
  components: {},
  data() {
    const config = GetLocalJSONByVersion('flash-dot-settings', {
      groupCount: 3,
      groupLength: 10,
      minLength: 3,
      maxLength: 5,
      timeCount: 3,
      reverse: false,
      version: 0,
    })
    return {
      config,
      game: null,
      state: 0,
      maxCols: 0,
      maxRows: 0,
      maxIndex: 0,
      questionList: [],
      questionIndex: 0,
      isShow: false,
      timer: null,
    }
  },
  watch: {},
  props: {},
  computed: {},
  methods: {
    intRange(from, to) {
      const list = []
      for (let ii = from; ii <= to; ii++) {
        list.push(ii)
      }
      return list
    },
    start() {
      SaveLocalJSON('flash-dot-settings', JSON.stringify(this.config))

      this.game = new GameCore(this.config)
      console.log(this.game)
    },
  },
  mounted() {
    this.start()
  },
}
</script>
<style scoped lang="scss">
.wrap {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
}
.page {
  width: 100%;
  height: 100%;
  background: #ddd;
  display: flex;
  flex-direction: column;
}
.pagetop {
  flex: 1 1 0;
  display: flex;
}
.btns {
  flex: 0 0 auto;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  button {
    flex: 1 1 0;
    border-radius: 4px;
    padding: 12px 20px;
    color: #fff;
    font-size: 20px;
    border: 1px solid #409eff;
    background-color: #409eff;
    &:hover {
      background-color: #66b1ff;
    }
    &:active {
      border: 1px solid #0d84ff;
      background-color: #0d84ff;
      color: #e6e6e6;
    }
    & + button {
      margin-left: 10px;
    }
  }
}
.setting {
  flex: 1 1 auto;
  .line {
    margin: 10px;
    > span {
      display: inline-block;
      width: 40%;
    }
    .input {
      width: 50%;
    }
  }
}
.dotWrap {
  flex: 1 1 auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  padding: 5px 0 0 5px;
  background: #000;
  .row {
    flex: 1 1 auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
  }
  .dot {
    width: 30px;
    height: 30px;
    margin: 5px;
    border-radius: 50%;
    &.red {
      background: red;
    }
    &.pink {
      background: pink;
    }
    &.purple {
      background: purple;
    }
  }
}
</style>
