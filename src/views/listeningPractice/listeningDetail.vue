<style lang="less" scoped>
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
  h1 {
    color: rgb(91, 130, 204);
    text-align: center;
  }
  .inner-html {
    padding: 30px 50px 50px 30px;
    font-size: 16px;
  }
  .voice {
    margin-left: 350px;
    margin-top: 20px;
  }
}
</style>
<template>
  <div class="root-div">
    <div class="content" v-if="listenObj">
      <h1>{{listenObj.title}}</h1>
      <span style="margin-left:60px;">分类: {{listenObj.category}}</span>
      &nbsp;&nbsp;&nbsp;<span>{{getLocalTime(listenObj.gmtCreate)}}</span>
      <audio :src="listenObj.voiceUrl" controls="controls" class="voice" autoplay="autoplay"></audio>
      <div v-html="listenObj.originalText" class="inner-html"></div>
    </div>
  </div>
</template>
<script>
export default {
  name: "listeningDetail",
  data() {
    return {
      listenObj: null
    };
  },
  methods: {
    getLocalTime(timestamp) {
      return this.$util.getLocalTime(timestamp);
    }
  },
  created() {
    this.$http("/listen/getListenById/" + this.$route.params.id).then(res => {
      this.listenObj = res.data;
    });
  }
};
</script>
