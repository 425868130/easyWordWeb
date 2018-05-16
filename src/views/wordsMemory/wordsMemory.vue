<style scoped>
.content {
  width: 60%;
  margin-left: 20%;
  margin-top: 30px;
}
.task-info {
  background-color: #eeeeee;
}
.card-tips {
  text-align: left;
  margin-left: 20px;
  font-size: 12px;
  color: #80848f;
}
.task-undo {
  font-size: 60px;
  color: teal;
}
.task-finish {
  font-size: 60px;
  margin-left: 40px;
  color: teal;
}
.task_start {
  font-size: 22px;
  margin-top: 10px;
  color: #80848f;
}
.words-preview {
  text-align: left;
  margin-left: 20px;
  padding-bottom: 10px;
  width: inherit;
}
.words-task {
  word-break: break-all;
}
.empty-tips{
  height: 100px;
  font-size: 20px;
  padding-top: 30px;
}
</style>

<template>
  <div class="content">
    <Timeline>
      <TimelineItem class="time-item">
        <Icon type="trophy" slot="dot"></Icon>
        <div>
          <Card :bordered="false" class="task-card">
            <h1 slot="title">今日任务</h1>
            <a href="#" slot="extra" @click.prevent="getDailyTask(true)">
              <Icon type="ios-loop-strong"></Icon>换一批单词</a>
            <div class="task-info">
              <p class="card-tips">
                <Icon type="ios-color-wand-outline"></Icon>&nbsp;系统随机抽取50个高频词汇作为练习任务,完成今日任获得200积分哦!</p>
              <p style="text-align: left;margin-left:20px;margin-top:10px;">单词预览:</p>
              <div class="words-preview">
                <span v-for="(words,index) in wordsList" :key="words.id" class="words-task">{{words.word}}
                  <!-- 使列表末尾不出现顿号 -->
                  <span v-if="index<wordsList.length-1">、</span>
                </span>
              </div>
              <span class="task-undo">{{dailyTask.wordNum}}</span>全部
              <span class="task-finish">{{dailyTask.todayProgress}}</span>已完成<br>
              <router-link to="/task/dailyTask" class="task_start">立即开始</router-link>
            </div>
          </Card>
        </div>
      </TimelineItem>
      <!-- 练习卡片 -->
      <TimelineItem class="time-item">
        <Icon type="ribbon-b" slot="dot"></Icon>
        <div>
          <Card :bordered="false" class="task-card">
            <h1 slot="title">巩固练习</h1>
            <div class="task-info">
              <p class="card-tips">
                <Icon type="ios-color-wand-outline"></Icon>&nbsp;今日任务完成了?快来测试一下你的掌握程度吧,最多获得400积分哦!</p>
              <span class="task-undo">{{dailyTask.wordNum}}</span>全部
              <span class="task-finish">{{dailyTask.practiceProgress}}</span>已完成<br>
              <router-link to="/task/practiceTask" class="task_start">接受挑战</router-link>
            </div>
          </Card>
        </div>
      </TimelineItem>
      <!-- 复习卡片 -->
      <TimelineItem class="time-item">
        <Icon type="ios-book" slot="dot"></Icon>
        <div>
          <Card :bordered="false" class="task-card">
            <h1 slot="title">温故知新</h1>
            <div class="task-info">
              <div v-if="!reviewTask||reviewTask==null" class="empty-tips">
                没有复习任务哦,请先完成今日任务明天再来复习吧^_^
              </div>
              <div v-if="reviewTask">
                <p class="card-tips">
                  <Icon type="ios-color-wand-outline"></Icon>&nbsp;复习昨天的任务词汇,完成后任获得100积分哦!</p>
                <span class="task-undo">{{reviewTask.wordNum}}</span>全部
                <span class="task-finish">{{reviewTask.reviewProgress}}</span>已完成<br>
                <router-link to="/task/reviewTask" class="task_start">马上复习</router-link>
              </div>
            </div>
          </Card>
        </div>
      </TimelineItem>
      <TimelineItem class="time-item">
        <Icon type="happy-outline" slot="dot"></Icon>
      </TimelineItem>
    </Timeline>
    <back-top></back-top>
  </div>
</template>
<script>
export default {
  name: "wordsMemory",
  data() {
    return {};
  },
  computed: {
    dailyTask() {
      if (this.$store.getters.getDailyTask) {
        return this.$store.getters.getDailyTask;
      }
      /* 如果没有今日任务信息则返回一个初始对象,用于在数据载入前供界面渲染使用 */
      let task = {
        wordNum: 0,
        reviewProgress: 0,
        todayProgress: 0,
        practiceProgress:0,
        wordList: null
      };
      return task;
    },
    reviewTask() {
      return this.$store.getters.reviewTask;
    },
    dailyTaskFinish(){
      /* 判断今日任务是否已经完成 */
      if(this.dailyTask.todayProgress==this.dailyTask.wordNum){
        return true;
      }
      return false;
    },
    wordsList() {
      if (this.dailyTask && this.dailyTask.wordList) {
        let words = JSON.parse(this.dailyTask.wordList || "");
        return words;
      }
      return [];
    }
  },
  methods: {
    getDailyTask(isRefresh) {
      /* 更新今日任务单词 */
      this.$Modal.confirm({
        title: "换一批单词",
        content:
          "<p>你确定要刷新今日任务单词吗?</p><p>刷新后今日已背诵的任务进度将丢失且无法获得积分.</p>",
        onOk: () => {
          this.$store.dispatch("getDailyTask", isRefresh).then(() => {
            this.$Message.success("今日任务已更新!");
          });
        }
      });
    }
  },
  created() {
    this.$store.dispatch("getDailyTask", false);
    this.$store.dispatch("sysReviewTask");
  }
};
</script>
