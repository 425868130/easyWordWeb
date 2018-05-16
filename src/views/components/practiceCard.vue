/**
@author xujw 2018-5-4 14:47:46
单词测试卡片组件，给定单词列表自动生成测试选项
 */
<style scoped lang="less">
.root-div {
  max-width: 80%;
  margin-left: 10%;
  height: 600px;
  margin-top: 30px;
  padding: 20px;
  background-color: white;
}

/* 进度条区域 */
.progress-bar {
  margin-top: 40px;
  padding-bottom: 50px;
}
/* 选择提示文本 */
.text-tips {
  text-align: left;
  width: 80%;
  margin-left: 10%;
  margin-top: 10px;
  /* 单词样式 */
  .word-text {
    font-size: 50px;
    color: #5cadff;
  }
  .select-tips {
    margin-top: 20px;
  }
  .vioce-text {
    color: #bbbec4;
  }
}
/* 选项组 */
/* 选项框样式 */
#select-group {
  width: 80%;
  height: 300px;
  margin-top: 30px;
  /* 选项被禁用时的样式 */
  .ivu-radio-wrapper-disabled {
    color: #bbbec4;
    background-color: #f8f8f9;
  }
  .ivu-radio-group-item {
    height: 70px;
    cursor: pointer;
    //border: solid 0.5px #e9eaec;
    text-align: left;
    padding: 15px 10px 5px 10px;
    margin-top: 5px;
    border-bottom: 0.5px solid #c9def1;
    .mean-text {
      height: 50px;
      word-break: normal;
      width: auto;
      white-space: pre-wrap;
      word-wrap: break-word;
      overflow: hidden;
    }
  }
  .ivu-radio-group-item:hover {
    background-color: #e9eaec;
  }
}
</style>
<template>
  <div class="root-div" v-if="taskWords&&taskWords.length!=0">
    <h1 class="title">{{title}}&nbsp;
      <Icon type="ribbon-b"></Icon>
    </h1>
    <div class="text-tips">
      <p class="word-text">
        <b>{{taskWords[index].word}}</b>&nbsp;&nbsp;
        <span class="vioce-text" v-if="voicePh.length!=0">/
          <i>{{voicePh}}</i>/</span>
        <audio :src="voiceUrl" type="audio/mp3" ref="audio" />
        <Button v-if="voiceUrl.length!=0" type="ghost" shape="circle" icon="android-volume-up" @click="$refs.audio.play();"></Button>
      </p>
      <h2 class="select-tips">请选择正确的解释:</h2>
    </div>
    <!-- 选项按钮组 -->
    <RadioGroup vertical v-model="currentSelectVal" size="large" id="select-group">
      <Radio v-for="(word,index) in randomWords" :key="word.id" :label="index" class="select-item" :disabled="disabledArr[index]">
        <span class="mean-text">{{word.meansList[0].proName}}&nbsp;&nbsp;{{word.meansList[0].means}}</span>
      </Radio>
    </RadioGroup>
    <div class="progress-bar">进度:
      <Progress :percent="percent" :stroke-width="20" style="width:80%"></Progress>
    </div>
    <!-- 正确单词模态框 -->
    <Modal v-model="modalShow" :closable="false" :mask-closable="false">
      <h2 style="color:#ed3f14;text-align:center">Σ(っ°Д°;)っ回答错了,快看看正确解释吧</h2><br>
      <!-- 单词卡片 -->
      <div style="height:400px;">
        <WordCard :keyword="modalKeyword" class="word-card" v-if="modalShow"></WordCard>
      </div>
      <div slot="footer">
        <Button size="large" long @click="modalShow=false;nextWord()" icon="happy-outline">
          我知道了,下一个</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
export default {
  name: "practiceCard",
  data() {
    return {
      index: 0,
      modalShow: false,
      recentWord: null,
      randomWords: [],
      currentSelectVal: "",
      /* 结果集,记录每道题是否答对,结果下标与index相同 */
      resultArr: [],
      /* 四个选项的使能控制数组 */
      disabledArr: [false, false, false, false],
      isFinish: false
    };
  },
  props: {
    /* 任务单词列表 */
    taskWords: {
      type: Array,
      required: true
    },
    title: {
      type: String,
      default: "单词练习"
    },
    progress: {
      type: Number,
      default: 0
    }
  },
  computed: {
    answerArr() {
      let answerArr = [];
      /* 初始化答案数组,直接生成所有单词正确选项索引，数组大小与任务单词数量一致，
      通过导航索引即可获取当前单词的随机选项位置*/
      for (
        let i = 0, len = this.taskWords ? this.taskWords.length : 0;
        i < len;
        i++
      ) {
        answerArr[i] = Math.round(Math.random() * 3);
      }
      return answerArr;
    },
    percent() {
      if (this.index == 0) {
        return 0;
      }
      if(this.isFinish){
        return 100
      }
      return this.taskWords
        ? parseInt(this.index * 100 / this.taskWords.length)
        : 0;
    },
    recentWordId() {
      /* 计算当前要练习的单词的id */
      if (this.taskWords.length > 0) {
        return this.taskWords[this.index].word_id;
      } else {
        return -1;
      }
    },
    voicePh() {
      /* 计算当前单词的音标 */
      if (this.recentWord == null) {
        return "";
      }
      if (this.recentWord.voice.ph_am != "") {
        return this.recentWord.voice.ph_am;
      } else if (this.recentWord.voice.ph_en != "") {
        return this.recentWord.voice.ph_en;
      }
      return "";
    },
    voiceUrl() {
      /* 获取音频地址 */
      if (this.recentWord == null) {
        return "";
      }
      if (this.recentWord.voice.ph_am_mp3 != "") {
        return this.recentWord.voice.ph_am_mp3;
      } else if (this.recentWord.voice.ph_en_mp3 != "") {
        return this.recentWord.voice.ph_en_mp3;
      } else if (this.recentWord.voice.ph_tts_mp3) {
        return this.recentWord.voice.ph_tts_mp3;
      }
      return "";
    },
    modalKeyword() {
      if (this.modalShow) {
        return this.recentWord ? this.recentWord.word : "";
      } else {
        return "";
      }
    }
  },
  watch: {
    recentWordId() {
      /* 当前单词id改变时载入选项数据，即taskWords属性填充时和index切换时都会导致数据加载 */
      this.loadRecentWord();
    },
    currentSelectVal() {
      /* 获取当前选中的选项,当用户选择答案时触发 */
      if (this.currentSelectVal === "") {
        return;
      }
      /* 设置选项使能状态 */
      let tempArr = [true, true, true, true];
      tempArr[this.currentSelectVal] = false;
      this.disabledArr = tempArr;
      if (this.currentSelectVal == this.answerArr[this.index]) {
        /* 回答正确 */
        this.resultArr[this.index] = true;
        /* 触发选择事件,传递当前序号,以及是否选对 */
        this.$emit("onSelect", this.index, true);
        this.nextWord();
      } else {
        /* 回答错误 */
        this.resultArr[this.index] = false;
        this.modalShow = true;
        this.$emit("onSelect", this.index, false);
      }
      if (this.index == this.taskWords.length - 1) {
        /* 如果到了最后一个单词则弹出完成提示并触发完成事件,传入参数为练习结果数组 */
        this.$emit("on-finish", this.resultArr);
        this.isFinish = true;
      }
    }
  },
  methods: {
    preWord() {
      if (this.index > 0) {
        this.index--;
      }
    },
    nextWord() {
      if (this.index < this.taskWords.length - 1) {
        /* 能够进入下一步则先清除选项值 */
        this.currentSelectVal = "";
        this.disabledArr = [false, false, false, false];
        this.index++;
      }
    },
    loadRecentWord() {
      /* 加载当前单词信息 */
      this.$http.get("/words/getWordById/" + this.recentWordId).then(res => {
        this.recentWord = res.data;
        this.$http
          .get("/words/getRandomMean/" + this.recentWordId)
          .then(res => {
            /* 根据答案位置计算选项数组,即四个选项要绑定的内容 */
            /* 将正确单词添加到随机单词数组中 */
            res.data.splice(this.answerArr[this.index], 0, this.recentWord);
            this.randomWords = res.data;
          });
      });
    },
    playAudio() {
      /* 播放音频 */
      this.$refs.audio.play();
    }
  },
  mounted() {
    this.loadRecentWord();
    /* 如果父组件指定了进度则采用父组件进度 */
    if (this.progress) {
      this.index = this.progress;
    }
  }
};
</script>