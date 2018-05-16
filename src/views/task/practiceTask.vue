<style lang="less" scoped>
.success-tip {
  margin-top: 20px;
  .title {
    font-size: 30px;
    margin-top: 20px;
  }
  .tips-text {
    font-size: 20px;
    .word-num {
      font-size: 30px;
      color: #ed3f14;
    }
    .right-num {
      font-size: 30px;
      color: #19be6b;
    }
  }
  .finish-img {
    width: 500px;
    height: 400px;
  }
}
</style>
<template>
  <div>
    <div v-if="isPracticeFinish" class="success-tip">
      <img src="https://easywords.oss-cn-hangzhou.aliyuncs.com/imageRes/finishpic.png" class="finish-img">
      <p class="title">恭喜,您已完成全部今日练习！</p><br>
      <span class="tips-text">总单词数:&nbsp;&nbsp;
        <span class="word-num">{{dailyTask.wordNum}}</span>&nbsp;&nbsp;&nbsp;答对:&nbsp;&nbsp;
        <span class="right-num">{{rightNum}}</span>
      </span>
    </div>
    <practiceCard v-if="!isPracticeFinish" :taskWords="wordsList" @on-finish="finish" @onSelect="onSelect" :title="title" :progress="cardIndex">
    </practiceCard>
  </div>
</template>
<script>
export default {
  name: "practiceTask",
  data() {
    return {
      title: "巩固练习",
      isPracticeFinish: false
    };
  },
  computed: {
    dailyTask() {
      if (!this.$store.getters.getDailyTask) {
        this.$store.dispatch("getDailyTask", false);
        return null;
      }
      return this.$store.getters.getDailyTask;
    },
    wordsList() {
      if (!this.dailyTask) {
        return [];
      }
      return JSON.parse(this.dailyTask.wordList || "");
    },
    progress() {
      /* 初始进度 */
      if (!this.dailyTask) {
        return 0;
      }
      if (this.dailyTask.practiceProgress == this.dailyTask.wordNum) {
        this.isPracticeFinish = true;
      }
      return this.dailyTask.practiceProgress;
    },
    cardIndex() {
      if (this.progress > 0) {
        return this.progress - 1;
      } else {
        return this.progress;
      }
    },
    rightNum(){
      let num = 0;
      /* 计算正确的单词数 */
      this.wordsList.forEach(word => {
        if(word.practice){
          num++;
        }
      });
      return num;
    }
  },
  watch: {
    progress() {
      if (this.progress == this.dailyTask.wordNum) {
        this.isPracticeFinish = true;
      }
    }
  },
  methods: {
    finish() {
      //console.log(resultArr);
      this.isPracticeFinish = true;
      this.$Notice.success({
        title: "完成",
        desc: "您已通过全部练习"
      });
    },
    onSelect(index, isRight) {
      if (this.dailyTask.practiceProgress >= this.dailyTask.wordNum) {
        return;
      }
      this.wordsList[index].practice = isRight ? true : false;
      // 进度加1
      this.dailyTask.practiceProgress++;
      this.dailyTask.wordList = JSON.stringify(this.wordsList);
      this.$http.post("/task/updatePracticeTask", this.dailyTask).then(res => {
        if (res.data) {
          /* 更本地任务信息 */
          this.$store.commit("setDailyTask", this.dailyTask);
        }
      });
    }
  }
};
</script>
