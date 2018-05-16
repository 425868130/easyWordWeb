/* 2018-3-12 16:32:21 @author xujw 单词查询结果页面 */
<style scoped>
  .content {
    width: 64%;
    margin-left: 18%;
    min-height: 570px;
    margin-top: 40px;
  }

  .card {
    text-align: left;
    align-content: left;
    margin-top: 20px;
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

  .empty-example {
    text-align: center;
    font-size: 24px;
  }

  .translation {
    font-size: 16px;
  }

  /* 用户例句样式 */

  .sentence-item {
    list-style-type: none;
    margin-top: 10px;
  }

  .user-nick {
    color: #2b85e4;
  }

  .btn-commit {
    width: 20%;
    margin-left: 50%;
  }

  .commit-tips {
    color: #bbbec4;
    text-align: left;
    float: left;
    width: 30%;
  }

  /* 例句发布时间 */

  .create-time {
    color: #bbbec4;
    font-size: 12px;
  }

  .sentence-div {
    margin-left: 20px;
    margin-top: 10px;
  }

  .sentence-voice {
    cursor: pointer;
    color: #6266729f;
  }

  .hr-line {
    width: 96%;
    margin-left: 2%;
    height: 1px;
    border: none;
    border-top: 1px solid #e9eaec;
  }

  .like-button {
    float: right;
    font-size: 18px;
    color: #91969e;
    cursor: pointer;
  }

  .ivu-collapse {
    border-radius: 0px;
    background-color: white;
    width: 100%;
    border: none;
  }

  .sentence-form {
    width: 80%;
    margin-left: 10%;
    padding-bottom: 15px;
    border-bottom: 0.5px solid #e9eaec;
  }

  .sentence-tips {
    color: #ff9900;
  }

  /* 分页 */

  .page-part {
    margin-left: 34%;
    margin-top: 20px;
  }
</style>
<template>
  <div class="content">
    <WordCard :keyword="keywords" @on-finish="onWordFinish"></WordCard>
    <Card :bordered="false" dis-hover class="card">
      <p slot="title" style="margin-left:15px;">系统例句</p>
      <Spin fix class="loading-tips" v-if="!loadFinish">例句加载中....</Spin>
      <p v-if="loadFinish&&wordsExamples.length==0" class="empty-example">
        <Icon type="sad-outline"></Icon>&nbsp;抱歉,该单词暂无系统例句.
      </p>
      <ol class="exampleList" v-if="loadFinish&&wordsExamples.length>0">
        <li v-for="wExample in wordsExamples">
          <p class="annotation">{{wExample.first}}
            <span class="example-mid">{{wExample.mid}}</span>{{wExample.last}}</p>
          <br>
          <p class="translation" v-text="wExample.translation"></p>
          <br>
        </li>
      </ol>
    </Card>

    <!-- 用户自定义例句卡片 -->
    <Card :bordered="false" dis-hover class="sentence-card card">
      <p slot="title" style="margin-left:15px;">用户例句</p>
      <!-- 如果单词id不为空才显示 -->
      <Collapse v-if="args.word_id!=''">
        <Panel style="text-align: center;">
          <span class="sentence-tips">
            系统例句缺失？系统例句不好？快来造句拿积分&nbsp;
            <Icon type="ios-flame"></Icon>
          </span>
          <div slot="content">
            <Form ref="sentenceForm" label-position="left" :label-width="70" class="sentence-form" :model="newSentence" :rules="formRule">
              <FormItem label="英文例句" prop="originSentence">
                <Input placeholder="输入英文例句(必须包含当前单词)." v-model="newSentence.originSentence"></Input>
              </FormItem>
              <FormItem label="中文翻译" prop="translation">
                <Input placeholder="输入对应的中文释义吧." v-model="newSentence.translation"></Input>
              </FormItem>
              <span class="commit-tips">成功发表例句后可获得100积分!</span>
              <Button type="info" class="btn-commit" size="small" @click="handleSubmit('sentenceForm')">发表</Button>
            </Form>
          </div>
        </Panel>
      </Collapse>
      <!-- 用户例句列表 -->
      <ul class="sentence-list">
        <li class="sentence-item" v-for="i in 0">
          <Avatar icon="person" size="large" />&nbsp;
          <span class="user-nick">用户昵称</span>&nbsp;&nbsp;
          <span class="create-time">发表于&nbsp;2018-4-12 19:46 </span>
          <!-- 点赞按钮 -->
          <span class="like-button">
            <Tooltip content="like" placement="bottom">
              <Icon type="android-favorite-outline"></Icon>
              <Icon type="android-favorite" style="color:red;"></Icon>
            </Tooltip>
            &nbsp;222
          </span>
          <br>
          <!-- 用户例句文本区域 -->
          <div class="sentence-div">
            <Icon type="volume-high" size="22" class="sentence-voice" v-if="false"></Icon>
            <div style="margin-left:35px">
              <span class="annotation">The prison's&nbsp;
                <span class="example-mid">admin</span>&nbsp;staff.
              </span>
              <br>
              <br>
              <p class="translation">释义: 监狱的管理人员</p>
              <br>
            </div>
          </div>
          <hr class="hr-line">
        </li>
      </ul>
      <Page :total="totalRecord" size="small" class="page-part" v-if="totalRecord > args.pageSize"></Page>
    </Card>
  </div>
</template>
<script>
  export default {
    data() {
      /* 英文例句校验器 */
      const validateSentence = (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请输入英文例句."));
        } else if (value.toLowerCase().indexOf(this.keywords.toLowerCase()) < 0) {
          callback(new Error("例句必须包含当前单词:" + this.keywords + "!"));
        } else {
          callback();
        }
      };
      /* 中文释义校验器 */
      const validateTranslation = (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请输入例句对应中文释义!"));
        } else if (!/.*[\u4e00-\u9fa5]+.*$/.test(value)) {
          callback(new Error("请输入正确的中文释义!"));
        }
        callback();
      };
      return {
        keywords: "",
        wordsExamples: [],
        loadFinish: false,
        args: {
          word_id: "",
          page: 1,
          pageSize: 10
        },
        totalRecord: 0,
        newSentence: {
          wordId: "",
          originSentence: "",
          first: "",
          mid: "",
          last: "",
          translation: ""
        },
        formRule: {
          originSentence: [
            { validator: validateSentence, trigger: "blur" },
            {
              type: "string",
              max: 1024,
              message: "内容过长,请适当精简!",
              trigger: "blur"
            }
          ],
          translation: [
            {
              validator: validateTranslation,
              trigger: "blur"
            },
            {
              type: "string",
              max: 1024,
              message: "内容过长,请适当精简!",
              trigger: "blur"
            }
          ]
        }
      };
    },
    watch: {
      $route(to, from) {
        /* 如果前后两次路由参数（要查询的单词）相同则直接复用原组件,否则执行查询操作 */
        if (from.params.keywords == to.params.keywords) {
          return;
        }
        this.keywords = this.$route.params.keywords;
      },
      keywords() {
        this.getWordsExample(this.keywords);
      }
    },
    methods: {
      onWordFinish(word) {
        /* 单词释义卡片加载完成后返回单词对象,从中获取单词id */
        if (word == null) {
          this.args.word_id = "";
        } else {
          this.args.word_id = word.id;
        }
      },
      getWordsExample(keywords) {
        this.loadFinish = false;
        this.$http
          .get("/sentence/getNetSentences/" + keywords)
          .then(res => {
            this.wordsExamples = res.data.data;
            this.loadFinish = true;
          })
          .catch(err => {
            this.wordsExamples = [];
            this.loadFinish = true;
          });
      },
      handleSubmit(refName) {
        /* 发表例句 */
        this.$refs[refName].validate(valid => {
          if (valid) {
            this.newSentence.wordId = this.args.word_id;
            /* 如果通过验证则截取英文例句 */
            let sentence = this.newSentence.originSentence;
            /* 先统一转成小写字符进行匹配，但不改变原字符串 */
            let index = sentence
              .toLowerCase()
              .indexOf(this.keywords.toLowerCase());
            this.newSentence.first = sentence.substr(0, index).trim();
            this.newSentence.mid = sentence.substr(index, this.keywords.length);
            this.newSentence.last = sentence
              .substr(index + this.keywords.length)
              .trim();
            /* 完成字符截取后发送创建例句请求 */
            this.$http
              .post("/sentence/createUserSentence", this.newSentence)
              .then(res => {
                if (res.data) {
                  alert("发表成功!");
                }
              });
          }
        });
      }
    },
    created() {
      /* 如果查询关键词为空则不执行查询操作 */
      let word = this.$route.params.keywords;
      if (typeof word != "undefined" && word != "") {
        this.keywords = word;
        this.getWordsExample(word);
      }
    }
  };
</script> /* 2018-3-12 16:32:21 @author xujw 单词查询结果页面 */
<style scoped>
  .content {
    width: 64%;
    margin-left: 18%;
    min-height: 570px;
    margin-top: 40px;
  }

  .card {
    text-align: left;
    align-content: left;
    margin-top: 20px;
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

  .empty-example {
    text-align: center;
    font-size: 24px;
  }

  .translation {
    font-size: 16px;
  }

  /* 用户例句样式 */

  .sentence-item {
    list-style-type: none;
    margin-top: 10px;
  }

  .user-nick {
    color: #2b85e4;
  }

  .btn-commit {
    width: 20%;
    margin-left: 50%;
  }

  .commit-tips {
    color: #bbbec4;
    text-align: left;
    float: left;
    width: 30%;
  }

  /* 例句发布时间 */

  .create-time {
    color: #bbbec4;
    font-size: 12px;
  }

  .sentence-div {
    margin-left: 20px;
    margin-top: 10px;
  }

  .sentence-voice {
    cursor: pointer;
    color: #6266729f;
  }

  .hr-line {
    width: 96%;
    margin-left: 2%;
    height: 1px;
    border: none;
    border-top: 1px solid #e9eaec;
  }

  .like-button {
    float: right;
    font-size: 18px;
    color: #91969e;
    cursor: pointer;
  }

  .ivu-collapse {
    border-radius: 0px;
    background-color: white;
    width: 100%;
    border: none;
  }

  .sentence-form {
    width: 80%;
    margin-left: 10%;
    padding-bottom: 15px;
    border-bottom: 0.5px solid #e9eaec;
  }

  .sentence-tips {
    color: #ff9900;
  }

  /* 分页 */

  .page-part {
    margin-left: 34%;
    margin-top: 20px;
  }
</style>
<template>
  <div class="content">
    <WordCard :keyword="keywords" @on-finish="onWordFinish"></WordCard>
    <Card :bordered="false" dis-hover class="card">
      <p slot="title" style="margin-left:15px;">系统例句</p>
      <Spin fix class="loading-tips" v-if="!loadFinish">例句加载中....</Spin>
      <p v-if="loadFinish&&wordsExamples.length==0" class="empty-example">
        <Icon type="sad-outline"></Icon>&nbsp;抱歉,该单词暂无系统例句.
      </p>
      <ol class="exampleList" v-if="loadFinish&&wordsExamples.length>0">
        <li v-for="wExample in wordsExamples">
          <p class="annotation">{{wExample.first}}
            <span class="example-mid">{{wExample.mid}}</span>{{wExample.last}}</p>
          <br>
          <p class="translation" v-text="wExample.translation"></p>
          <br>
        </li>
      </ol>
    </Card>

    <!-- 用户自定义例句卡片 -->
    <Card :bordered="false" dis-hover class="sentence-card card">
      <p slot="title" style="margin-left:15px;">用户例句</p>
      <!-- 如果单词id不为空才显示 -->
      <Collapse v-if="keyword_id!=-1">
        <Panel style="text-align: center;">
          <span class="sentence-tips">
            系统例句缺失？系统例句不好？快来造句拿积分&nbsp;
            <Icon type="ios-flame"></Icon>
          </span>
          <div slot="content">
            <Form ref="sentenceForm" label-position="left" :label-width="70" class="sentence-form" :model="newSentence" :rules="formRule">
              <FormItem label="英文例句" prop="originSentence">
                <Input placeholder="输入英文例句(必须包含当前单词)." v-model="newSentence.originSentence"></Input>
              </FormItem>
              <FormItem label="中文翻译" prop="translation">
                <Input placeholder="输入对应的中文释义吧." v-model="newSentence.translation"></Input>
              </FormItem>
              <span class="commit-tips">成功发表例句后可获得100积分!</span>
              <Button type="info" class="btn-commit" size="small" @click="handleSubmit('sentenceForm')">发表</Button>
            </Form>
          </div>
        </Panel>
      </Collapse>
      <!-- 用户例句列表 -->
      <ul class="sentence-list">
        <Spin fix class="loading-tips" v-if="!isPageLoad">例句加载中....</Spin>
        <li class="sentence-item" v-for="(sentence,index) in sentenceList" :key="sentence.id">
          <Avatar icon="person" size="large" :src="sentence.userHeadportrait" />&nbsp;
          <span class="user-nick" v-text="sentence.userNick"></span>&nbsp;&nbsp;
          <span class="create-time">发表于&nbsp;{{getLocalTime(sentence.gmtCreate)}} </span>
          <!-- 点赞按钮 -->
          <span class="like-button">
            <Tooltip content="like" placement="bottom">
              <a @click="likeSentence(sentence.id,index)">
              <Icon type="android-favorite" style="color:red;" v-if="likeArr[index]"></Icon>
              <Icon type="android-favorite-outline" v-else></Icon>
              </a>
            </Tooltip>
            &nbsp;{{sentence.likeNum}}
          </span>
          <br>
          <!-- 用户例句文本区域 -->
          <div class="sentence-div">
            <Icon type="volume-high" size="22" class="sentence-voice" v-if="false"></Icon>
            <div style="margin-left:35px">
              <span class="annotation">{{sentence.first}}&nbsp;
                <span class="example-mid">{{sentence.mid}}</span>&nbsp;{{sentence.last}}
              </span>
              <br>
              <br>
              <p class="translation">翻译:&nbsp;{{sentence.translation}}</p>
              <br>
            </div>
          </div>
          <hr class="hr-line">
        </li>
      </ul>
      <Page :total="totalRecord" :page-size="args.pageSize" :current="args.page" @on-change="pageChange" size="small" class="page-part" v-if="totalRecord > args.pageSize"></Page>
    </Card>
    <back-top></back-top>
  </div>
</template>
<script>
  export default {
    data() {
      /* 英文例句校验器 */
      const validateSentence = (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请输入英文例句."));
        } else if (value.toLowerCase().indexOf(this.keywords.toLowerCase()) < 0) {
          callback(new Error("例句必须包含当前单词:" + this.keywords + "!"));
        } else {
          callback();
        }
      };
      /* 中文释义校验器 */
      const validateTranslation = (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请输入例句对应中文释义!"));
        } else if (!/.*[\u4e00-\u9fa5]+.*$/.test(value)) {
          callback(new Error("请输入正确的中文释义!"));
        }
        callback();
      };
      /* 设置每页用户例句数 */
      let pageSize = 10;
      /* 用户点赞数组大小与例句数相同,默认全为未点赞状态 */
      let likeArr = new Array(pageSize).fill(false);
      return {
        keywords: "",
        keyword_id: -1,
        wordsExamples: [],
        loadFinish: false,
        sentenceList: [],
        likeArr: likeArr,
        args: {
          word_id: -1,
          page: 1,
          pageSize: pageSize,
          isCheck: false
        },
        totalRecord: 0,
        isPageLoad:false,
        newSentence: {
          wordId: "",
          originSentence: "",
          first: "",
          mid: "",
          last: "",
          translation: ""
        },
        formRule: {
          originSentence: [
            { validator: validateSentence, trigger: "blur" },
            {
              type: "string",
              max: 1024,
              message: "内容过长,请适当精简!",
              trigger: "blur"
            }
          ],
          translation: [
            {
              validator: validateTranslation,
              trigger: "blur"
            },
            {
              type: "string",
              max: 1024,
              message: "内容过长,请适当精简!",
              trigger: "blur"
            }
          ]
        }
      };
    },
    watch: {
      $route(to, from) {
        /* 如果前后两次路由参数（要查询的单词）相同则直接复用原组件,否则执行查询操作 */
        if (from.params.keywords == to.params.keywords) {
          return;
        }
        this.keywords = this.$route.params.keywords;
      },
      keyword_id(nVal) {
        /* 监控单词id，如果单词id不为-1表示单词释义已经加载完成，则将单词id复制到请求参数中,并记载用户例句*/
        if (nVal != -1) {
          this.args.word_id = nVal;
          this.getWordsExample(this.keywords);
          this.getUserSentence();
        } else {
          /* 单词id为-1表示没有该单词,则将数据初始化 */
          this.wordsExamples = [];
          this.loadFinish = true;
          this.pageInit();
        }
      }
    },
    methods: {
      getLocalTime(timestamp) {
        return this.$util.getLocalTime(timestamp)
      },
      onWordFinish(word) {
        /* 单词释义卡片加载完成后返回单词对象,从中获取单词id 如果单词为空则设置单词id为-1*/
        if (word == null) {
          this.keyword_id = -1;
        } else {
          this.keyword_id = word.id;
        }
      },
      getWordsExample(keywords) {
        /* 获取系统例句 */
        this.loadFinish = false;
        this.$http
          .get("/sentence/getNetSentences/" + keywords)
          .then(res => {
            this.wordsExamples = res.data;
            this.loadFinish = true;
          })
          .catch(err => {
            this.wordsExamples = [];
            this.loadFinish = true;
          });
      },
      handleSubmit(refName) {
        /* 发表例句 */
        this.$refs[refName].validate(valid => {
          if (valid) {
            this.newSentence.wordId = this.keyword_id;
            /* 如果通过验证则截取英文例句 */
            let sentence = this.newSentence.originSentence;
            /* 先统一转成小写字符进行匹配，但不改变原字符串 */
            let index = sentence
              .toLowerCase()
              .indexOf(this.keywords.toLowerCase());
            this.newSentence.first = sentence.substr(0, index).trim();
            this.newSentence.mid = sentence.substr(index, this.keywords.length);
            this.newSentence.last = sentence
              .substr(index + this.keywords.length)
              .trim();
            /* 完成字符截取后发送创建例句请求 */
            this.$http
              .post("/sentence/createUserSentence", this.newSentence)
              .then(res => {
                if (res.data) {
                  /* 发布成功后初始化表单，重新加载用户例句表 */
                  this.sentenceInit();
                  this.getUserSentence();
                  this.$Modal.success({
                    title: "发布成功",
                    content: "您的例句已成功发表.\n积分 +100"
                  })
                }
              }).catch(err => {
                this.sentenceList = [];
                this.totalRecord = 0;
                this.$Modal.error({
                  title: "发布失败",
                  content: err.data.message
                })
              });
          }
        });
      },
      sentenceInit() {
        this.newSentence.first = "";
        this.newSentence.mid = "";
        this.newSentence.last = "";
        this.newSentence.translation = "";
        this.newSentence.originSentence = "";
      },
      pageInit() {
        this.sentenceList = [];
        this.totalRecord = 0;
      },
      getUserSentence() {
        this.isPageLoad=false;
        /* 获取用户例句列表 */
        this.$http.get('/sentence/getUserSentences', {
          params: this.args
        }).then(res => {
          /* 获取用户例句列表和总记录条数 */
          this.sentenceList = res.data.dataList;
          this.totalRecord = res.data.totalRecord;
          this.isPageLoad = true;
          /* 例句加载成功后加载用户点赞列表 */
          this.getLikeList();
        }).catch(err => {
          this.pageInit();
          this.isPageLoad = true;
          this.$Modal.error({
            title: "加载失败",
            content: err.data.message
          });
        });
      },
      getLikeList() {
        /* 获取例句id列表 */
        let sentenceIdArr = this.sentenceList.map(sentence => sentence.id);
        /* 获取当前页面用户例句的点赞列表 */
        this.$http.get('/sentence/getLikeByUser', { params: { sentenceIdList: sentenceIdArr } }).then(res => {
          this.likeArr = res.data;
        }).catch(err => {
          this.likeArr.fill(false);
        });
      },
      likeSentence(sentenceId, index) {
        /* 点赞操作 */
        if(this.likeArr[index]){
          this.$Modal.warning({title: '点赞失败',content: '你已经点过赞了,请勿重复操作！'});
          return;
        }
        this.$http.post('/sentence/likeSentence',{
          sentenceId:sentenceId
        }
      ).then(res => {
        if(res.data){
          this.$Message.success('点赞成功！');
          /* 点赞成功后修改本地数据，这里必须用$set方法修改数组内容，否则无法触发vue响应式更新 */
          this.$set(this.likeArr,index,true);
          this.sentenceList[index].likeNum++;
        }
      }).catch(err=>{
        this.$Modal.error({title: '点赞失败',content: res.data.message});
      })
      },
      pageChange(page){
        this.args.page = page;
        this.getUserSentence();
      }
    },
    created() {
      /* 如果查询关键词为空则不执行查询操作 */
      let word = this.$route.params.keywords;
      if (typeof word != "undefined" && word != "") {
        this.keywords = word;
      }
    }
  };
</script>