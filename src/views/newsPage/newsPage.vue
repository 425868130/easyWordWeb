<style scoped>
.content {
  width: 70%;
  margin-left: 15%;
  margin-top: 20px;
  padding-top: 20px;
  background-color: white;
}
/* 新闻列表项最外层div样式 */
.news-div {
  text-align: left;
  margin-left: 50px;
  margin-right: 50px;
  height: 200px;
  padding: 10px 10px 5px 10px;
  border-bottom: 0.5px solid #e9eaec;
}
.news-div:hover {
  cursor: pointer;
  background-color: #f9fafd;
}
/* 新闻简介样式 */
.news-summary {
  color: #80848f;
  padding-right: 20px;
  height: 65px;
}

/* 左侧新闻图片框 */
.news-img {
  height: 180px;
  width: 25%;
  float: left;
}
/* 右侧新闻标题框 */
.news-text {
  width: 70%;
  height: 180px;
  float: left;
  margin-left: 2%;
}
.news-img img {
  width: 100%;
  height: 100%;
}
.news-point {
  color: #80848f;
  text-align: right;
  float: right;
}
.news-time {
  color: #80848f;
  width: 200px;
}
.page-part {
  padding-bottom: 40px;
  margin-top: 30px;
}
/* 新闻标题 */
.title-en {
  color: cornflowerblue;
}
</style>
<template>
    <div class="content">
        <Spin fix class="loading-tips" v-if="!isLoad">加载中....</Spin>
        <div class="news-div" v-for="news in newsList" @click="newsClick(news.id)" :key="news.id">
            <div class="news-img">
                <img :src="news.coverPic" />
            </div>
            <div class="news-text">
                <h2 style="padding-bottom: 10px;" class="title-en">{{news.titleEn}}</h2>
                <h3 class="title-ch">{{news.titleCn}}</h3><br>
                <p class="news-summary">{{news.summary}}</p>
                <p class="news-point">阅读积分:&nbsp;{{news.point}}</p>
                <p class="news-time">{{getLocalTime(news.gmtCreate)}}</p>
            </div>

        </div>
        <Page :total="totalRecord" :page-size="args.pageSize" :current="args.page" @on-change="pageChange" v-if="totalRecord>args.pageSize" size="small" show-total show-elevator class="page-part"></Page>
        <back-top></back-top>
    </div>
</template>
<script>
export default {
  name: "newsPage",
  data() {
    let pageSize = 10;
    return {
      isLoad: false,
      newsList: [],
      args: {
        page: 1,
        pageSize: pageSize,
        order: ""
      },
      totalRecord: 0
    };
  },
  watch: {
    $route(to, from) {
      let newPage = to.params.page;
      if (from.params.page == newPage) {
        return;
      }
       /* 如果前后两次路由参数相同则直接复用原组件,否则执行新闻数据加载 */
      this.args.page = newPage ? parseInt(newPage) : 1;
      this.loadNews();
    }
  },
  methods: {
    getLocalTime(timestamp) {
      return this.$util.getLocalTime(timestamp);
    },
    newsClick(newsId) {
      this.$router.push("/newsDetail/" + newsId);
    },
    loadNews() {
      this.isLoad = false;
      /* 加载新闻列表 */
      this.$http
        .get("/news/getNewsByPage", { params: this.args })
        .then(res => {
          console.log(res);
          this.newsList = res.data.dataList;
          this.totalRecord = res.data.totalRecord;
          this.isLoad = true;
        })
        .catch(err => {
          this.isLoad = true;
          this.newsList = [];
          this.totalRecord = 0;
        });
    },
    pageChange(page) {
      this.args.page = page;
      this.$router.push("/newsPage/" + page);
    }
  },
  created() {
    /* 如果查询关键词为空则不执行查询操作 */
    let page = parseInt(this.$route.params.page);
    this.args.page = page ? page : 1;
    this.loadNews();
  }
};
</script>
