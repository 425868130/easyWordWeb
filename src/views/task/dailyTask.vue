/* 每日任务页面 */
<style scoped>
.root-div {
  max-width: 60%;
  margin-left: 20%;
  min-height: 550px;
  margin-top: 30px;
  background-color: white;
}
/* 单词导航 */
.word-nav {
  margin-top: 10px;
  text-align: left;
  padding-bottom: 10px;
}
.nav-left {
  margin-left: 5%;
}
.nav-right {
  margin-left: 37%;
}
/* 导航进度提示 */
.nav-tips {
  margin-left: 38%;
  font-size: 18px;
}
/* 选项样式 */
.select-item {
  cursor: pointer;
  border: solid 0.5px #e9eaec;
  height: 70px;
  width: 70%;
  font-size: 18px;
  margin-left: 15%;
  padding-top: 20px;
}
.select-item:hover {
  background-color: #e9eaec;
}
/* 记住与未记住的按钮组 */
.btn-group {
  text-align: left;
  /*  border: solid 1px red; */
  padding-left: 15%;
}
.remember {
  font-size: 30px;
}
.unremember {
  font-size: 30px;
  color: #ff9900;
  margin-left: 30%;
}
/* 进度条区域 */
.progress-bar {
  margin-top: 20px;
  padding-bottom: 50px;
}
/* 单词卡片 */
.word-card {
  min-height: 350px;
  width: 90%;
  margin-left: 5%;
}
/* 模态框弹出框 */
.modal-tips {
  font-size: 18px;
}
.modal-word {
  margin-top: 20px;
  font-size: 25px;
  color: #ff9900;
}
</style>
<template>
  <div class="root-div" v-if="wordsList&&wordsList.length!=0">
    <h1>今日任务&nbsp;
      <Icon type="trophy"></Icon>
    </h1>
    <!-- 导航 -->
    <div class="word-nav">
      <Button type="ghost" shape="circle" icon="chevron-left" class="nav-left" @click="preWord"></Button>
      <span class="nav-tips">{{index+1}}/{{dailyTask.wordNum}}</span>
      <Button type="ghost" shape="circle" icon="chevron-right" class="nav-right" @click="nextWord"></Button>
    </div>
    <!-- 单词卡片 -->
    <WordCard :keyword="recentWord" class="word-card" :autoPlay="true" @on-finish="wordLoaded" :showWord="showWord"></WordCard>
    <div class="btn-group" v-if="!isRemember">
      <a href="#" class="remember" @click="rememberWord">
        <Icon type="happy-outline"></Icon>&nbsp;已记住</a>
      <a href="#" class="unremember" @click="UnRemember">
        <Icon type="sad-outline"></Icon>&nbsp;未记住</a>
    </div>
    <span style="font-size:30px;color:#19be6b" v-if="isRemember">
      <Icon type="android-checkmark-circle"></Icon>&nbsp;已背诵
    </span>
    <div class="progress-bar">进度:
      <Progress :percent="percent" :stroke-width="20" style="width:80%"></Progress>
    </div>
    <!-- 单词检测 -->
    <Modal v-model="isOncheck" :mask-closable="false" title="单词检测">
      <p class="modal-tips">请输入当前单词的完整拼写</p>
      <p v-if="wordObj" class="modal-word">{{wordObj.meansList[0].proName}}&nbsp;{{wordObj.meansList[0].means}}</p><br>
      <Input placeholder="输入单词拼写..." v-model="modalInput" long onpaste="return false" size="large" clearable :autofocus="true" @on-enter="modalOk"></Input>
      <Alert type="error" v-if="modalErr" show-icon style="margin-top:10px;text-align:center">拼写错了,再想想吧!</Alert>
      <div slot="footer">
        <Button long @click="modalOk" type="primary">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
export default {
  name: "dailyTask",
  data() {
    return {
      index: 0,
      navIndex: 0,
      wordsList: [],
      timeFinish: false,
      isOncheck: false,
      wordObj: null,
      modalInput: "",
      modalErr: false,
      showWord: true,
      timer: null
    };
  },
  props: {},
  watch: {
    isOncheck() {
      this.modalInput = "";
      this.modalErr = false;
      if (this.isOncheck) {
        this.showWord = false;
      } else {
        this.showWord = true;
      }
    }
  },
  computed: {
    dailyTask() {
      if (this.$store.getters.getDailyTask != null) {
        return this.$store.getters.getDailyTask;
      }
      return null;
    },
    indexTmp() {
      /* 第一个未记住的单词为当前进度 */
      for (let i = 0, len = this.wordsList.length; i < len; i++) {
        if (!this.wordsList[i].remember) {
          return i;
        }
      }
      return 0;
    },
    percent() {
      let todayTask = this.dailyTask;
      if (todayTask != null) {
        return todayTask.todayProgress * 100 / todayTask.wordNum;
      }
      return 0;
    },
    recentWord() {
      /* 计算当前背诵的单词*/
      if (this.wordsList.length > 0) {
        return this.wordsList[this.index].word;
      } else {
        return -1;
      }
    },
    isRemember() {
      /* 获取当前单词是否为已记住状态 */
      if (this.wordsList.length > 0) {
        return this.wordsList[this.index].remember;
      } else {
        return false;
      }
    }
  },
  methods: {
    preWord() {
      if (this.index > 0) {
        this.index--;
        return;
      }
      this.$Message.warning({
        content: "已经是第一个单词了 (￣▽￣)~*",
        duration: 1
      });
    },
    nextWord() {
      if (this.index < this.wordsList.length - 1) {
        this.index++;
        return;
      }
      this.$Message.warning({
        content: "已经是最后一个单词了 (｀・ω・´)",
        duration: 1
      });
    },
    rememberWord() {
      /* 如果倒计时未结束则弹出拼写测试框 */
      if (!this.timeFinish) {
        this.isOncheck = true;
        return;
      }
      let task = this.dailyTask;
      /* 如果任务已完成则不进行操作 */
      if (task.todayProgress == task.wordNum) {
        return;
      }
      /* 将当前单词的复习标志设为已背诵 */
      this.wordsList[this.index].remember = true;
      /* 更新单词列表信息 */
      task.wordList = JSON.stringify(this.wordsList);
      /* 进度加 1 */
      task.todayProgress++;
      /* 记住当前单词 */
      this.$http
        .post("/task/updateTaskProgress", this.dailyTask, {
          params: {
            wordId: this.wordsList[this.index].word_id,
            word: this.recentWord
          }
        })
        .then(res => {
          /* 如果操作成功则更新本地任务信息 */
          if (res.data) {
            this.$store.commit("setDailyTask", task);
            this.nextWord();
            /* 如果当前是最后一个单词，则弹出积分提示 */
            if (task.todayProgress == task.wordNum) {
              this.$Notice.success({
                title: "任务完成",
                desc: "恭喜你完成今日任务,积分+100"
              });
            }
          }
        });
    },
    UnRemember() {
      if (!this.timeFinish) {
        this.$Message.info("你这速度也太快了吧,再看两眼也许就记住了(｡･ω･｡)");
        return;
      }
      this.$Message.warning({ content: "已跳过该单词", duration: 1 });
      this.nextWord();
    },
    wordsInit() {
      /* 单词数组初始化 */
      if (this.dailyTask != null) {
        /* 将json单词数组转换为数组对象 */
        this.wordsList = JSON.parse(this.dailyTask.wordList || "");
        /* 初始化时确定当前进度 */
        this.index = this.indexTmp;
      }
    },
    wordLoaded(word) {
      this.wordObj = word;
      /* 初始化事件标志 */
      this.timeFinish = false;
      clearTimeout(this.timer);
      /* 单词卡片加载完成并且未完成背诵则启动定时器 */
      if (word != null && !this.isRemember) {
        this.timer = setTimeout(() => {
          this.timeFinish = true;
        }, 10000);
      }
    },
    modalOk() {
      /* 全部转换成小写进行比较 */
      if (
        this.modalInput.trim().toLowerCase() ==
        this.recentWord.trim().toLowerCase()
      ) {
        /* 通过检测则关闭模态框弹出提示并再次执行被中断的记忆操作 */
        this.isOncheck = false;
        this.$Message.success({
          content: "拼写正确",
          duration: 1
        });
        this.timeFinish = true;
        /* 清除定时器 */
        clearTimeout(this.timer);
        this.rememberWord();
      } else {
        this.modalErr = true;
      }
    }
  },
  created() {
    /* 如果页面载入时无任务数据则发起请求，请求完成后执行初始化，若本地有数据则直接初始化 */
    if (this.dailyTask == null) {
      this.$store.dispatch("getDailyTask", false).then(() => {
        this.wordsInit();
      });
    } else {
      this.wordsInit();
    }
  }
};
</script>