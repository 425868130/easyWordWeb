<style scoped>
/* 最外层容器 */

.root-div {
  width: 70%;
  margin-left: 15%;
  margin-top: 30px;
  background-color: white;
  padding-bottom: 30px;
}

/* 文章详情区域 */

.content {
  padding: 30px;
  text-align: left;
}

h1 {
  color: rgb(91, 130, 204);
}

.title-ch {
  font-size: 18px;
}

.switch-btn {
  float: right;
}

.top-panel {
  margin-top: 10px;
  height: 30px;
  border-bottom: 0.5px solid #e9eaec;
}

.news-time {
  color: #80848f;
}

.news-img {
  width: 54%;
  margin-left: 23%;
}

.finish-button {
  margin-top: 20px;
  margin-left: 30%;
  width: 300px;
  height: 40px;
}

.news-summary {
  background-color: #f8f8f9;
  margin: 10px;
  padding: 20px;
}

.news-text {
  font-size: 18px;
  text-indent: 2em;
  margin-top: 10px;
}
</style>
<template>
    <div class="root-div">
        <Spin size="large" v-if="!isLoad"></Spin>
        <div class="content" v-if="isLoad&&news!=''">
            <h1>{{news.titleEn}}
                <a href="#" @click="playAudio" :disabled="news.voice==''">
                    <audio :src="news.voice" type="audio/mp3" ref="audio" preload="auto" />
                    <Icon type="volume-medium" size="27"></Icon>
                </a>
            </h1>
            <b class="title-ch">{{news.titleCn}}</b>
            <br>
            <!-- 标题下方面板 -->
            <div class="top-panel">
                <span class="news-time">时间:&nbsp;{{getLocalTime(news.gmtCreate)}}</span>
                <span style="margin-left: 20px;">单词数:&nbsp;
                    <b>{{news.wordNum}}</b>
                </span>
                <span style="margin-left: 20px;">{{news.source}}</span>
                <Switch size="large" class="switch-btn" v-model="chMethod">
                    <span slot="open">中文</span>
                    <span slot="close">英文</span>
                </Switch>
            </div>
            <!-- 新闻主体区 -->
            <div>
                <div class="news-summary">
                    <b>摘要:</b>&nbsp;{{news.summary}}</div>
                <img :src="news.coverPic" class="news-img">
                <div v-html="news.translationText" class="news-text" v-if="chMethod"></div>
                <div v-html="news.englishText" class="news-text" v-else></div>
            </div>
            <Button type="success" size="large" class="finish-button" @click="onFinish" icon="android-happy">完成阅读</Button>
        </div>
        <back-top></back-top>
    </div>
</template>

<script>
export default {
  name: "newsDetail",
  data() {
    return {
      newsId: null,
      news: "",
      isLoad: false,
      chMethod: false
    };
  },
  watch: {
    $route(to, from) {
      /* 监听路由参数变化 */
      let newId = to.params.newsId;
      if (from.params.newsId == newId) {
        return;
      }
      this.newsId = newId;
    },
    newsId() {
      if (this.newId != null) {
        this.loadNews();
      }
    }
  },
  methods: {
    getLocalTime(timestamp) {
      return this.$util.getLocalTime(timestamp);
    },
    onFinish() {
      this.$http
        .post("/news/readFinish/" + this.news.id)
        .then(res => {
          console.log(res)
          if (res.data) {
            this.$Notice.success({
              title: "完成阅读,积分增加" + this.news.point + "点!"
            });
            this.$store.dispatch('sysUserInfo');
          }
        })
        .catch(err => {
          console.log(err);
           this.$Modal.error({
            title: "操作失败",
            content: err.data.message
          });
        });
    },
    loadNews() {
      this.isLoad = false;
      /* 加载新闻详情 */
      this.$http
        .get("/news/getNewsById/" + this.newsId)
        .then(res => {
          this.news = res.data;
          this.isLoad = true;
        })
        .catch(err => {
          this.isLoad = true;
          this.news = "";
        });
    },
    playAudio() {
      /* 播放音频 */
      let audio = this.$refs.audio;
      if (audio.paused) {
        audio.play();
      } else {
        audio.pause();
      }
    }
  },
  created() {
    /* 读取路由参数 */
    let news_id = this.$route.params.newsId;
    this.newsId = news_id ? news_id : null;
    this.loadNews();
  }
};
</script>