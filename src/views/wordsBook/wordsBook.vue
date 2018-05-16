<style scoped>
.root {
  max-width: 80%;
  margin-left: 10%;
  min-height: 570px;
  margin-top: 50px;
}
.back-1 {
  box-shadow: rgb(211, 206, 206) 1px 1px 4px 2px;
  height: 570px;
  width: 94%;
  margin-left: 2%;
  background-color: white;
}
.back-2 {
  box-shadow: rgb(226, 221, 221) 1px 0px 2px 1px;
  height: 568px;
  width: 99.5%;
}
.part-line {
  margin-left: 25%;
  width: 1px;
  background-color: #dddee1b6;
  border: none;
  height: 568px;
}
.left-panel {
  width: 25%;
  float: left;
  text-align: left;
}
.glossary-item {
  list-style-type: none;
  cursor: pointer;
  border-bottom: 0.5px #e9eaec solid;
  width: 95%;
  height: 45px;
}
.word-text {
  font-size: 18px;
}
.glossary-item:hover {
  background-color: rgb(245, 245, 245);
}
/* 右侧 */
.right-panel {
  float: right;
  width: 74.5%;
  height: 500px;
}
.switch-tabs {
  margin-top: 10px;
}
.word-list {
  min-height: 400px;
  max-height: 400px;
  margin-left: 20px;
}
.glossary-time {
  font-size: 8px;
  color: #bbbec4;
}
.page-part {
  background-color: white;
  margin-left: 30px;
  margin-top: 10px;
}
.word-card {
  width: 100%;
  min-height: 460px;
}
/* 已记住按钮 */
.remember {
  font-size: 20px;
}
/* 列表被选中时的样式 */
.item-active {
  background-color: rgb(245, 245, 245);
}
</style>
<template>
  <div class="root">
    <!-- 背景层 -->
    <div class="back-1">
      <div class="back-2">
        <div class="back-2">
          <!-- 左侧单词列表面板 -->
          <div class="left-panel">
            <h1 style="text-align:center;margin-top:10px">
              <Icon type="ios-list-outline"></Icon>&nbsp;生词本</h1>
            <!-- 页签 -->
            <Tabs v-model="tabActive" class="switch-tabs">
              <TabPane label="未记住" name="tab1">
                <!-- 未记住的生词列表 -->
                <ul class="word-list" :active="0">
                  <li v-for="(word,index) in glossary.dataList" :key="word.id" class="glossary-item" @click="select(index)" :class="{'item-active':isActive[index]}">
                    <span class="word-text">{{word.word}}</span><br>
                    <span class="glossary-time">添加于:&nbsp;{{getLocalTime(word.gmtCreate)}}</span>
                  </li>
                </ul>
                <Page :current="args.page" :total="glossary.totalRecord" simple @on-change="pageChange" class="page-part"></Page>
              </TabPane>
              <TabPane label="已记住" name="tab2">
                <!-- 未记住的生词列表 -->
                <ul class="word-list" :active="0">
                  <li v-for="(word,index) in glossary.dataList" :key="word.id" class="glossary-item" @click="select(index)" :class="{'item-active':isActive[index]}">
                    <span class="word-text">{{word.word}}</span><br>
                    <span class="glossary-time">添加于:&nbsp;{{getLocalTime(word.gmtCreate)}}</span>
                  </li>
                </ul>
                <Page :current="args.page" :total="glossary.totalRecord" simple @on-change="pageChange" class="page-part"></Page>
              </TabPane>
            </Tabs>
          </div>
          <div class="right-panel">
            <!-- 右侧的单词释义卡片 -->
            <WordCard :keyword="wordSelected" :minMode="true" :cardHeight="500" class="word-card" @on-removeWord="loadGlossaryPage"></WordCard>
            <a href="#" class="remember" @click="rememberWord" v-if="tabActive=='tab1'&&glossary.dataList.length>0">
              <Icon type="happy-outline"></Icon>&nbsp;已记住</a>
          </div>
          <!-- 竖直分割线 -->
          <hr class="part-line">
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    let pageSize = 9;
    let isActive = new Array(pageSize).fill(false);
    isActive[0] = true;
    return {
      args: {
        page: 1,
        pageSize: pageSize,
        isRemember: false
      },
      isActive: isActive,
      selectIndex: 0,
      tabActive: "tab1"
    };
  },
  computed: {
    glossary() {
      return this.$store.getters.glossaryPage;
    },
    wordSelected() {
      /* 返回当前选中的单词 */
      let dataList = this.$store.getters.glossaryPage.dataList;
      return dataList && dataList.length > 0
        ? this.$store.getters.glossaryPage.dataList[this.selectIndex].word
        : "";
    }
  },
  watch: {
    tabActive(nVal) {
      /* 面板切换时页码恢复为第一页 */
      this.args.page = 1;
      if (nVal == "tab1") {
        this.args.isRemember = false;
      } else if (nVal == "tab2") {
        this.args.isRemember = true;
      }
      this.loadGlossaryPage();
    }
  },
  methods: {
    rememberWord() {
      /* 将当前选中的单词设置为已记住状态 */
      this.$http
        .put(
          "/glossary/rememberWord/" +
            this.glossary.dataList[this.selectIndex].id
        )
        .then(res => {
          if (res.data) {
            this.$Notice.success({
              title: "该单词已移至已记住生词表"
            });
            this.loadGlossaryPage();
          }
        });
    },
    select(index) {
      this.selectIndex = index;
      /* 将其他标志位全部设置为false */
      this.isActive = this.isActive.fill(false);
      /* 将当前选中项的标志位设置为true */
      this.isActive[index] = true;
    },
    getLocalTime(timestamp) {
      return this.$util.getLocalTime(timestamp);
    },
    loadGlossaryPage() {
      this.$store.dispatch("getGlossaryPage", this.args).then(() => {
        /* 加载完数据后默认选中第一项 */
        this.select(0);
      });
    },
    pageChange(page) {
      this.args.page = page;
      this.loadGlossaryPage();
    }
  },
  created() {
    this.loadGlossaryPage();
  }
};
</script>