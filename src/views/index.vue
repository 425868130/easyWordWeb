<style scoped>
.index {
  width: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  text-align: center;
  border: solid 1px red;
}
.wordsTitle{
  font-size: 23px;
}
</style>
<template>
    <div class="index">
        <Row >
          <Row>
            <Col span="24">
               <h1>易背单词</h1>
            </Col>
          </Row>
          <Row type="flex" justify="start" class="code-row-bg">
             <Col :lg="{span:5,offset:10}">
            <Input v-model="keywords" placeholder="输入要查找的单词"></Input>
            </Col>
            <Col :lg="{span:2}" class="butt">
              <Button type="primary" shape="circle" icon="ios-search" @click="onSearch">查询</Button>
            </Col>
          </Row>
          <Row type="flex" justify="center" v-if="wordsEntry!=''">
            <Col span="16">
               <div style="background:#eee;padding: 2px;margin-top:10px">
            <Card :bordered="false">
            <p slot="title" v-text="wordsEntry.word" class="wordsTitle"></p>
            <p>英:[<span v-text="wordsEntry.voice.ph_en"></span>]&nbsp;
            <a href="#" @click="playMp3('en')">
              <audio :src="wordsEntry.voice.ph_en_mp3" type="audio/mp3" ref="audio_en"/>
            <Icon type="volume-medium" size="23">
            </Icon>
            </a>
            </p>
            <!--  -->
            <p>美:[<span v-text="wordsEntry.voice.ph_am"></span>]&nbsp;
            <a href="#" @click="playMp3('am')">
              <audio :src="wordsEntry.voice.ph_am_mp3" type="audio/mp3" ref="audio_am"/>
            <Icon type="volume-medium" size="23">
            </Icon>
            </a>
            </p>
            <!--  -->
            <p>机器发音(TTS):
            <a href="#" @click="playMp3('tts')">
              <audio :src="wordsEntry.voice.ph_tts_mp3" type="audio/mp3" ref="audio_tts"/>
            <Icon type="volume-medium" size="23">
            </Icon>
            </a>
            </p>
            <!--  -->
            <hr>
            <p>释义:</p>
            <ul>
              <li v-for="mean in wordsEntry.meansList">
                {{mean.proName}}&nbsp;&nbsp;{{mean.means}}
              </li>
            </ul>
            <!--  -->
            <hr>
            <p>过去分词:{{wordsEntry.exchange.word_done}}</p>
            <p>现在分词:{{wordsEntry.exchange.word_ing}}</p>
            <p>过去式:{{wordsEntry.exchange.word_past}}</p>
            <p>第三人称单数:{{wordsEntry.exchange.word_third}}</p>
            <p>出现频次:{{wordsEntry.times}}</p>
            </Card>
            </div>
            </Col>
          </Row>
        </Row>
    </div>
</template>
<script>
export default {
  data() {
    return {
      keywords: "",
      wordsEntry: ""
    };
  },
  methods: {
    handleStart() {
      this.$Modal.info({
        title: "Bravo",
        content: "Now, enjoy the convenience of iView."
      });
    },
    onSearch: function() {
      this.$http.get("/searchByKeywordsEn/" + this.keywords).then(res => {
        this.wordsEntry = res.data;
        console.log(this.wordsEntry);
      });
    },
    playMp3:function(voiceType){
      
      switch(voiceType){
        case 'en':this.$refs.audio_en.play();break;
        case 'am':{
          this.$refs.audio_am.load();
          this.$refs.audio_am.play();
        break;}
        case 'tts':this.$refs.audio_tts.play();break;
      }
    }
  }
};
</script>