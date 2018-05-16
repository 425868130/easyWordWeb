/* 可复用的单词释义卡片 */
<style scoped>
.wordsTitle {
  font-size: 35px;
  height: 45px;
  padding-top: 5px;
}
.code-row-bg {
  margin-top: 30px;
}
.wordsDiv {
  margin-left: 20px;
}
.words-voice {
  font-size: 16px;
  color: #80848f;
}
.card {
  text-align: left;
  align-content: left;
}
.words-info {
  margin-left: 25px;
}
.empty-tips {
  margin-top: 40px;
  text-align: center;
}
.word-spin {
  background-color: white;
}
</style>
<template>
  <div>
    <Card :bordered="false" dis-hover class="card" v-if="loadfinish&&wordsEntry==null">
      <p slot="title" style="margin-left:15px;">单词释义</p>
      <div class="empty-tips">
        <h1>没有找到相关单词信息哦(╯°Д°)╯</h1>
        <p>可能的原因:</p>
        <p>1.数据库中未收录该单词</p>
        <p>2.单词输入错误</p>
        <p>3.与服务器通信失败</p>
      </div>
    </Card>
    <!-- 单词卡片 -->
    <Card :bordered="false" dis-hover class="card" :style="{height:cardHeight==0?'auto':cardHeight+'px'}" v-if="loadfinish&&wordsEntry!=null">
      <div slot="title" class="wordsDiv">
        <p v-text="wordsEntry.word" class="wordsTitle"></p>
        <span class="words-voice">
          <span>英:[
            <span v-text="wordsEntry.voice.ph_en"></span>]&nbsp;
            <a href="#" @click="playMp3('en')" :disabled="wordsEntry.voice.ph_en_mp3 == ''">
              <audio :src="wordsEntry.voice.ph_en_mp3" type="audio/mp3" ref="audio_en" :autoplay="autoPlayArr[0]" />
              <Icon type="volume-medium"></Icon>
            </a>
          </span>
          <!--  -->
          <span>美:[
            <span v-text="wordsEntry.voice.ph_am"></span>]&nbsp;
            <a href="#" @click="playMp3('am')" :disabled="wordsEntry.voice.ph_am_mp3 == ''">
              <audio :src="wordsEntry.voice.ph_am_mp3" type="audio/mp3" ref="audio_am" :autoplay="autoPlayArr[1]" />
              <Icon type="volume-medium"></Icon>
            </a>
          </span>
          <!--  -->
          <span>机器发音(TTS):
            <a href="#" @click="playMp3('tts')" :disabled="wordsEntry.voice.ph_tts_mp3 == ''">
              <audio :src="wordsEntry.voice.ph_tts_mp3" type="audio/mp3" ref="audio_tts" :autoplay="autoPlayArr[2]" />
              <Icon type="volume-medium"></Icon>
            </a>
          </span>
        </span>
      </div>
      <a href="#" slot="extra" @click="removeWord" v-if="minMode">
        <Icon type="ios-trash-outline"></Icon>&nbsp;移出生词本</a>
      <a href="#" slot="extra" @click="addWord" v-else>
        <Icon type="ios-bookmarks-outline"></Icon>&nbsp;加入生词本</a>
      <!--  -->
      <div class="words-info">
        <h3>单词释义:</h3>
        <ul style="margin-top:10px;">
          <li v-for="mean in wordsEntry.meansList" style="margin-top:5px;">
            {{mean.proName}}&nbsp;&nbsp;{{mean.means}}
          </li>
        </ul>
        <!--  -->
        <h3 style="margin-top:10px;">其他形态:</h3>
        <p style="margin-top:5px;">过去分词:{{wordsEntry.exchange.word_done}}</p>
        <p style="margin-top:5px;">现在分词:{{wordsEntry.exchange.word_ing}}</p>
        <p style="margin-top:5px;">过去式:{{wordsEntry.exchange.word_past}}</p>
        <p style="margin-top:5px;">第三人称单数:{{wordsEntry.exchange.word_third}}</p>
        <p style="margin-top:5px;">出现频次:{{wordsEntry.times}}</p>
      </div>
    </Card>
    <!-- 启用加载遮罩层遮挡单词,用于单词拼写检测 -->
    <Spin fix v-if="!showWord" class="word-spin">...</Spin>
  </div>
</template>
<script>
export default {
  name: "wordCard",
  props: {
    minMode: {
      type: Boolean,
      default: false
    },
    keyword: {
      type: String,
      required: true,
      default: ""
    },
    cardHeight: {
      type: Number,
      default: 0
    },
    autoPlay: {
      type: Boolean,
      default: false
    },
    showWord: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      wordsEntry: null,
      loadfinish: false,
      autoPlayArr: [false, false, false]
    };
  },
  watch: {
    keyword() {
      this.doSearch();
    }
  },
  methods: {
    doSearch() {
      /* 还原自动播放数组 */
      this.autoPlayArr = [false, false, false];
      /* 如果搜索单词为空则恢复单词数据对象 */
      if (this.keyword == "") {
        this.wordsEntry = null;
        this.loadfinish = true;
        this.$emit("on-finish", null);
        return;
      }
      this.loadfinish = false;
      this.$http.get("/words/searchByKeywordsEn/" + this.keyword).then(res => {
        /* console.log(res.data); */
        this.wordsEntry = res.data;
        this.loadfinish = true;
        this.autoPlayInit();
        /* 触发完成加载事件 */
        this.$emit("on-finish", this.wordsEntry);
      });
    },
    playMp3(voiceType) {
      switch (voiceType) {
        /* 根据不同的发音类型播放不同的音频 */
        case "en":
          this.$refs.audio_en.play();
          break;
        case "am": {
          this.$refs.audio_am.load();
          this.$refs.audio_am.play();
          break;
        }
        case "tts":
          this.$refs.audio_tts.play();
          break;
      }
    },
    addWord() {
      this.$http
        .put("/glossary/addToGlossary/" + this.wordsEntry.id)
        .then(res => {
          if (res.data) {
            /* 添加单词到生词本 */
            this.$Notice.success({
              title: "添加成功!"
            });
          }
        })
        .catch(err => {
          /* 添加单词到生词本 */
          this.$Notice.error({
            title: "添加失败!",
            desc: err.data.message
          });
        });
    },
    removeWord() {
      this.$http
        .delete("/glossary/removeWord/" + this.wordsEntry.id)
        .then(res => {
          if (res.data) {
            /* 添加单词到生词本 */
            this.$Notice.info({
              title: "该单词已被移出生词本!"
            });
            this.$emit("on-removeWord");
          }
        });
    },
    autoPlayInit() {
      if (!this.autoPlay) {
        return;
      }
      /* 判断音频自动播放属性，将第一个音频连接有效的audio设置为自动播放,其他的为不自动播放 */
      if (this.wordsEntry) {
        if (this.wordsEntry.voice.ph_en_mp3) {
          this.$set(this.autoPlayArr, 0, true);
          return;
        }
        if (this.wordsEntry.voice.ph_am_mp3) {
          this.$set(this.autoPlayArr, 1, true);
          return;
        }
        if (this.wordsEntry.voice.ph_tts_mp3) {
          this.$set(this.autoPlayArr, 2, true);
          return;
        }
      }
    }
  },
  created() {
    this.doSearch();
  }
};
</script>