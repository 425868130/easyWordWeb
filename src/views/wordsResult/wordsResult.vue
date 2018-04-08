/* 
2018-3-12 16:32:21
@author xujw
单词查询结果页面
*/
<style scoped>
.content {
  margin-top: 20px;
}
.result {
  width: 100%;
  top: 0;
  bottom: 0;
  left: 0;
}
.wordsTitle {
  font-size: 35px;
  height:45px;
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
.annotation {
  font-size: 20px;
}
.example-mid {
  color: red;
}
.exampleList {
  margin-left: 20px;
}
</style>
<template>
  <div class="content">
    <div v-if="wordsEntry==null||wordsEntry==''">
      <h1>没有找到相关单词信息哦(╯°Д°)╯</h1>
      <p>可能的原因:</p>
      <p>1.数据库中未收录该单词</p>
      <p>2.单词输入错误</p>
      <p>3.与服务器通信失败</p>
    </div>
    <div class="result" v-else>
      <!-- 单词查询结果 -->
      <Row type="flex" justify="center" v-if="wordsEntry!=''">
        <Col span="16">
        <div style="background:#eee;padding: 2px;margin-top:10px">
          <!-- 单词卡片 -->
          <Card :bordered="false" dis-hover class="card">
            <div slot="title" class="wordsDiv">
              <p v-text="wordsEntry.word" class="wordsTitle"></p>
              <span class="words-voice">
                <span>英:[
                  <span v-text="wordsEntry.voice.ph_en"></span>]&nbsp;
                  <a href="#" @click="playMp3('en')" :disabled="wordsEntry.voice.ph_en_mp3 == ''">
                    <audio :src="wordsEntry.voice.ph_en_mp3" type="audio/mp3" ref="audio_en" />
                    <Icon type="volume-medium"></Icon>
                  </a>
                </span>
                <!--  -->
                <span>美:[
                  <span v-text="wordsEntry.voice.ph_am"></span>]&nbsp;
                  <a href="#" @click="playMp3('am')" :disabled="wordsEntry.voice.ph_am_mp3 == ''">
                    <audio :src="wordsEntry.voice.ph_am_mp3" type="audio/mp3" ref="audio_am" />
                    <Icon type="volume-medium"></Icon>
                  </a>
                </span>
                <!--  -->
                <span>机器发音(TTS):
                  <a href="#" @click="playMp3('tts')" :disabled="wordsEntry.voice.ph_tts_mp3 == ''">
                    <audio :src="wordsEntry.voice.ph_tts_mp3" type="audio/mp3" ref="audio_tts" />
                    <Icon type="volume-medium"></Icon>
                  </a>
                </span>
              </span>
            </div>
            <a href="#" slot="extra" @click="addWords">
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
        </div>
        </Col>
        <Col span="16" style="margin-top:20px;">
        <Card :bordered="false" dis-hover class="card">
          <p slot="title" style="margin-left:15px;">单词例句</p>
          <ol class="exampleList">
            <li v-for="wExample in wordsExamples">
              <p class="annotation">{{wExample.first}}
                <span class="example-mid">{{wExample.mid}}</span>{{wExample.last}}</p><br>
              <p class="translation" v-text="wExample.translation"></p><br>
            </li>
          </ol>
        </Card>
        </Col>
      </Row>

    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      keywords: '',
      wordsEntry: '',
      wordsExamples: []
    }
  },
  watch: {
    $route(to, from) {
      /* 如果前后两次路由参数（要查询的单词）相同则直接复用原组件,否则执行查询操作 */
      if (from.params.keywords == to.params.keywords) {
        return
      }
      this.doSearch(to.params.keywords)
    }
  },
  methods: {
    doSearch(keywords) {
      this.$http.get('/words/searchByKeywordsEn/' + keywords).then(res => {
        /* console.log(res.data); */
        this.wordsEntry = res.data
        this.getWordsExample(keywords)
      })
    },
    getWordsExample(keywords) {
      this.$http.get('/words/getWordsExample/' + keywords).then(res => {
        this.wordsExamples = res.data
      })
    },
    playMp3(voiceType) {
      switch (voiceType) {
        /* 根据不同的发音类型播放不同的音频 */
        case 'en':
          this.$refs.audio_en.play()
          break
        case 'am': {
          this.$refs.audio_am.load()
          this.$refs.audio_am.play()
          break
        }
        case 'tts':
          this.$refs.audio_tts.play()
          break
      }
    },
    addWords() {
      this.$http
        .put('/glossary/addToGlossary/' + this.wordsEntry.id)
        .then(res => {
          if (res.data) {
            /* 添加单词到生词本 */
            this.$Notice.success({
              title: '添加成功!'
            })
          }
        })
        .catch(err => {
          /* 添加单词到生词本 */
          this.$Notice.error({
            title: '添加失败!',
            desc: err.response.data
          })
        })
    }
  },
  created() {
    /* 如果查询关键词为空则不执行查询操作 */
    if (
      typeof this.$route.params.keywords != 'undefined' &&
      this.$route.params.keywords != ''
    ) {
      this.doSearch(this.$route.params.keywords)
    }
  }
}
</script>