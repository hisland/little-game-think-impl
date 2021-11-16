<template>
  <div class="wrap">
    <div
      class="page"
      v-if="state === 0"
    >
      <div class="pagetop">
        <div
          ref="dotWrap"
          class="setting"
        >
          <div class="line">
            <span class="label">设置组数</span>
            <select
              v-model.trim="config.groupCount"
              class="input"
            >
              <option
                v-for="ii in intRange(3, 10)"
                :value="ii"
                :key="ii"
              >
                {{ ii }}
              </option>
            </select>
          </div>
          <div class="line">
            <span>最小点数</span>
            <select
              v-model.trim="config.dotMinCount"
              class="input"
            >
              <option
                v-for="ii in intRange(1, config.dotMaxCount)"
                :value="ii"
                :key="ii"
              >
                {{ ii }}
              </option>
            </select>
          </div>
          <div class="line">
            <span>最大点数</span>
            <select
              v-model.trim="config.dotMaxCount"
              class="input"
            >
              <option
                v-for="ii in intRange(config.dotMinCount, 100)"
                :value="ii"
                :key="ii"
              >
                {{ ii }}
              </option>
            </select>
          </div>
          <div class="line">
            <span>颜色数量</span>
            <select
              v-model.trim="config.colorCount"
              class="input"
            >
              <option
                v-for="ii in [1, 2, 3]"
                :value="ii"
                :key="ii"
              >
                {{ ii }}
              </option>
            </select>
          </div>
          <div class="line">
            <span>显示时间(s)</span>
            <select
              v-model.trim="config.timeCount"
              class="input"
            >
              <option
                v-for="ii in deciRange(5, 20)"
                :value="ii"
                :key="ii"
              >
                {{ ii }}
              </option>
            </select>
          </div>
          <!-- <div>{{ maxCols }}</div>
          <div>{{ maxRows }}</div>
          <div>{{ maxIndex }}</div> -->

        </div>
      </div>
      <div class="btns">
        <button @click="start()">开始</button>
      </div>
    </div>
    <div
      class="page"
      v-if="state === 1"
    >
      <div class="pagetop">
        <div
          class="dotWrap"
          v-if="questionItem"
        >
          <template v-if="isShow">
            <div
              class="row"
              v-for="(cols, yy) in questionItem.rows"
              :key="yy"
            >
              <template
                v-for="(cell, xx) in cols"
                :key="xx"
              >
                <div
                  class="dot"
                  v-if="!cell"
                ></div>
                <div
                  class="dot"
                  v-else
                  :class="{ [cell]: true }"
                ></div>
              </template>
            </div>
           
          </template>
           <div v-if="showAnswer" style="background: #fff; padding:5px;">
            <table class="table">
              <tr>
              <th>组数</th>
              <th>红色</th>
              <th>黄色</th>
              <th>蓝色</th>
              </tr>
              <template  v-for="(v,index) in answerList" 
                :key="v">
                <tr v-if="index==questionIndex">
                <td>第{{index+1}}组</td>
                <td>{{v.red}}</td>
                <td>{{v.yellow}}</td>
                <td>{{v.blue}}</td>
              </tr>
              </template>
              
            </table>
           </div>
        </div>
      </div>
      <div class="btns">
        <button
          @click="next()"
          v-if="questionIndex < questionList.length - 1 || isShow"
        >
          下一组({{ questionIndex + 1 }}/{{ questionList.length }})
        </button>
        <button
          v-else
          @click="state = 2"
        >显示答案</button>
        <button @click="showAnswer = true && state != 2">当前答案</button>
      </div>
    </div>
    <div
      class="page"
      v-if="state === 2"
    >
      <div class="pagetop">
        答案是: {{ questionList.map((vv) => vv.answer).join(', ') }}<br />

      </div>
      <table class="table">
        <tr>
        <th>组数</th>
        <th>红色</th>
        <th>黄色</th>
        <th>蓝色</th>
        </tr>
        <tr
          v-for="(v,index) in answerList"
          :key="v"
        >
          <td>第{{index+1}}组</td>
          <td>{{v.red}}</td>
          <td>{{v.yellow}}</td>
          <td>{{v.blue}}</td>
        </tr>
      </table>

      <div class="btns">
        <button @click="state = 0">返回首页</button>
      </div>
    </div>
  </div>
</template>
<script>
import { randomInt } from "../util";
import { toIndex, toPos } from "../util";

export default {
  components: {},
  data() {
    const saved = localStorage.getItem("flash-dot-settings");
    const config = saved
      ? JSON.parse(saved)
      : {
          groupCount: 3,
          dotMinCount: 3,
          dotMaxCount: 10,
          colorCount: 1,
          timeCount: 1,
        };
    return {
      config,
      state: 0,
      maxCols: 0,
      maxRows: 0,
      maxIndex: 0,
      questionList: [],
      questionIndex: 0,
      isShow: false,
      showAnswer:false,
      timer: null,
      answerList: [],
    };
  },
  watch: {},
  props: {},
  computed: {
    questionItem() {
      return this.questionList[this.questionIndex];
    },
  },
  methods: {
    intRange(from, to) {
      const list = [];
      for (let ii = from; ii <= to; ii++) {
        list.push(ii);
      }
      return list;
    },
    deciRange(from, to) {
      //生成小数
      const list = [];
      for (let ii = from; ii <= to; ii++) {
        if (ii%5 != 0){//5的倍数
          continue;
        }
        list.push(ii / 10);
      }
      return list;
    },
    start() {
      localStorage.setItem("flash-dot-settings", JSON.stringify(this.config));

      const { groupCount, dotMinCount, dotMaxCount, colorCount } = this.config;
      const { maxCols, maxRows, maxIndex } = this;

      const list = [];
      const list2 = [];
      for (let ii = 0; ii < groupCount; ii++) {
        let redCount = 0; //计数
        let yellowCount = 0;
        let blueCount = 0;
        const rows = [];
        for (let ii = 0; ii < maxRows; ii++) {
          rows[ii] = new Array(maxCols);
        }
        const set2 = new Set();
        const count = randomInt(dotMinCount, dotMaxCount);
        while (set2.size < count) {
          const idx = randomInt(0, maxIndex);
          if (!set2.has(idx)) {
            set2.add(idx);
            const [xx, yy] = toPos(idx, maxCols);
            const color = randomInt(1, colorCount); //颜色值
            if (color == 1) {
              redCount++;
            } else if (color == 2) {
              yellowCount++;
            } else {
              blueCount++;
            }
            rows[yy][xx] =
              color === 1 ? "red" : color === 2 ? "yellow" : "blue";
          }
        }
        console.log(redCount + "," + yellowCount + "," + blueCount);
        list.push({
          answer: set2.size,
          rows,
        });
        list2.push({ red: redCount, yellow: yellowCount, blue: blueCount });
      }
      this.questionList = list;
      this.answerList = list2;
      console.log(list2);
      this.questionIndex = -1;
      this.state = 1;
      this.next();
    },
    next() {
      if (this.isShow) return;
      const { timeCount } = this.config;
      if (this.questionIndex < this.questionList.length - 1) {
        this.questionIndex++;
        this.isShow = true;
        this.showAnswer = false;//重置答案
        this.timer = setTimeout(() => {
          this.isShow = false;
          
          if (this.questionIndex === this.questionList.length - 1) {
            this.timer = -1;
          }
        }, timeCount * 1000);
      }
    },
    show() {},
  },
  mounted() {
    const wrapWidth = this.$refs.dotWrap.clientWidth;
    const wrapHeight = this.$refs.dotWrap.clientHeight;
    this.maxCols = Math.floor(wrapWidth / 42);
    this.maxRows = Math.floor(wrapHeight / 42);
    this.maxIndex = this.maxCols * this.maxRows - 1;
    // this.$nextTick(() => {
    //   this.start()
    // })
  },
};
</script>
<style scoped lang="scss">
.table {
  table-layout: fixed;
  width: 80%;
  border-collapse: collapse;
  border: 3px solid purple;
  tr:nth-child(odd){background:#F4F4F4;}
  th {
    vertical-align: baseline;
    padding: 10px 10px 10px 10px;
    background-color: #3f3f3f;
    border: 1px solid #3f3f3f;
    text-align: left;
    color: #fff;
  }
  td {
    vertical-align: text-top;
    padding: 9px 9px 9px 9px;
    border: 1px solid #aaa;
  }
}
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
    &.yellow {
      background: yellow;
    }
    &.blue {
      background: blue;
    }
  }
}
</style>
