<style scoped>
.root {
  max-width: 80%;
  margin-left: 10%;
  min-height: 570px;
}
.user-area {
  background-color: white;
  background-image: url('../../res/img/userInfo/userZoneBack.jpg');
  width: inherit;
  background-size: 100% 250px;
  background-repeat: no-repeat;
  opacity: 0.8;
  height: 250px;
}
/* 含头像和用户信息的div容器 */
.user-div {
  width: 80%;
  position: relative;
  top: 85px;
  left: 70px;
  text-align: left;
  height: 120px;
}
/* 用户头像样式 */
.user-avatar {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  border: 1px white solid;
  position: relative;
  cursor: pointer;
}

.nickname {
  font-size: 24px;
  position: relative;
  color: white;
  font-weight: bold;
}

.other-info {
  position: relative;
  left: 80%;
  top: 90px;
  width: 250px;
  color: white;
  font-size: 16px;
  text-align: left;
  /*   border: solid 1px red; */
}
.sex-info {
  position: relative;
  left: 85px;
  top: -25px;
}
.action-area {
  text-align: left;
  margin-top: 10px;
}
.points-info {
  position: relative;
  top: -40px;
  left: 115px;
  color: white;
}
/* 修改按钮样式 */
.edit-button {
  color: white;
  float: right;
  margin-right: 20px;
  margin-top: 10px;
  cursor: pointer;
}
/* 签名样式 */
.signature {
  position: relative;
  top: -45px;
  color: white;
  left: 95px;
  width: 400px;
}
.user-avatar-modal {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 1px white solid;
  margin-left: 30%;
}
/* 基本透明输入框样式 */
.opacity-input {
  background-color: transparent;
  border: none;
  color: white;
  outline: none;
  border-radius: 4px;
}
.opacity-input:hover {
  background-color: rgba(224, 221, 221, 0.5);
  /* border: 1px rgb(255, 255, 255,0.5) solid; */
}
.opacity-input:focus {
  background-color: white;
  color: grey;
}
/* 左侧背诵记录卡片以及系统消息卡片样式 */
.left-card {
  width: 70%;
}
.msg-card {
  margin-top: 10px;
}
.right-card {
  width: 29%;
  float: right;
}
/* 空通知样式 */
.empty-notice {
  position: relative;
  left: 43%;
  top: 100px;
  width: 150px;
  min-height: 200px;
}
/* 消息列表项目 */
.notice-item {
  list-style-type: none;
  cursor: pointer;
  min-height: 30px;
  border-bottom: 1px #e9eaec solid;
  border-radius: 5px;
  padding: 10px 0px 10px 0px;
  width: inherit;
}
.notice-item:hover {
  background-color: #f8f8f9;
}
.empty-word-div {
  position: relative;
  left: 15%;
  top: 20px;
}

/* 新增生词列表 */
.glossary-item {
  list-style-type: none;
  cursor: pointer;
  min-height: 30px;
  padding-bottom: 5px;
  border-bottom: 1px #e9eaec solid;
}
.glossary-item:hover {
  background-color: #f8f8f9;
}
.glossary-time {
  color: #80848f;
  font-size: 12px;
}
</style>
<template>
  <div class="root">
    <!-- 用户个人信息面板区，带背景图 -->
    <div class="user-area">
      <!-- 编辑按钮 -->
      <span class="edit-button" @click="editInfo">
        <Tooltip content="编辑" placement="bottom">
          <Icon type="compose" style="font-size:25px;"></Icon>
        </Tooltip>
      </span>
      <div class="user-div">
        <div class="other-info">
          邮箱:
          <span v-text="user.email"></span><br> 手机:
          <span v-text="user.phoneNumber"></span><br>
        </div>
        <span @click="headPortraitModal=true">
          <Avatar icon="person" size="large" :src="user.headPortrait" class="user-avatar" />
        </span>
        <span class="nickname">{{user.nickName}}&nbsp;
          <Tag color="yellow">Lv&nbsp;{{user.rank}}</Tag>
        </span><br>
        <span class="sex-info">
          <Icon type="male" v-if="user.sex" style="color:#2b85e4;font-size:20px;font-weight:bold;"></Icon>
          <Icon v-else type="female" style="color:pink;font-size:23px;font-weight:bold;"></Icon>
        </span>
        <input class="opacity-input signature" v-model="userObj.signature" @change="changeSignature" /><br>
        <!--  <span v-text="user.signature" class="signature"></span> -->
        <span class="points-info">积分: {{user.points}}</span>
      </div>
    </div>
    <!-- 用户信息下方的功能区域 -->
    <div class="action-area">
      <div class="right-card">
        <!-- 任务管理卡片 -->
        <Card shadow>
          <p slot="title">任务管理</p>
          <Circle :size="140" :trail-width="4" :stroke-width="5" :percent="75" stroke-linecap="square" stroke-color="#ff5500">
            <div class="demo-Circle-custom">
              <h3>今日任务进度</h3><br>
              <i>75%</i><br><br>
              <router-link to="#">现在继续</router-link>
            </div>
          </Circle>
          <span style="margin-left:20px">
            <Circle :size="140" :trail-width="4" :stroke-width="5" :percent="75" stroke-linecap="square">
              <div class="demo-Circle-custom">
                <h3>复习任务进度</h3><br>
                <i>75%</i><br><br>
                <router-link to="#">现在继续</router-link>
              </div>
            </Circle>
          </span>
        </Card>
        <!-- 最近生词卡片 -->
        <Card shadow style="margin-top:10px;min-height:150px;">
          <p slot="title">新增生词</p>
          <router-link to="/wordsBook/account" slot="extra">
            <Icon type="clipboard"></Icon>&nbsp;生词本
          </router-link>
          <!-- 生词本为空时的提示 -->
          <div class="empty-word-div" v-if="recentGlossary.loadfinish&&recentGlossary.glossaryList.length==0">
            <p>什么都没有哦,先去添加生词吧&nbsp;
              <Icon type="happy-outline"></Icon>
            </p>
          </div>
          <!-- 简易生词列表 -->
          <div v-else>
            <ul>
              <li v-for="glossary in recentGlossary.glossaryList" :key="glossary.id" class="glossary-item">
                <router-link :to="'/search/'+glossary.word">
                  <h3>{{glossary.word}}</h3>
                </router-link>
                <span class="glossary-time">添加于:&nbsp;{{getLocalTime(glossary.gmtCreate)}}</span>
              </li>
            </ul>
          </div>
        </Card>
      </div>
      <!-- 背诵记录卡片 -->
      <div class="record-card left-card">
        <Card shadow>
          <p slot="title">背诵记录</p>
          <p>Content of card</p>
          <p>Content of card</p>
          <p>Content of card</p>
        </Card>
      </div>
      <!--系统通知消息卡片 -->
      <div class="msg-card left-card">
        <Card shadow>
          <p slot="title">通知消息</p>
          <!-- 没有通知时的提示信息 -->
          <div class="empty-notice" v-if="notifiPage.loadfinish&&notifiPage.total==0">
            <span style="font-size:24px">
              <Icon type="ios-information-outline"></Icon>&nbsp;暂无通知
            </span>
          </div>
          <!--  通知列表面板 -->
          <div class="notice-div" v-else>
            <ul class="notice-list">
              <li class="notice-item" v-for="notice in notifiPage.notifications">
                <span>[{{getLocalTime(notice.gmtCreate)}}] {{notice.content}}</span>
              </li>
            </ul>
            <Page v-if="notifiPage.total>15" style="margin-left:30%;margin-top:30px;" :total="notifiPage.total" :page-size="notifiPage.pageSize" size="small" show-total @on-change="noticePageChange"></Page>
          </div>
        </Card>
      </div>
    </div>
    <!-- 上传头像模态框 -->
    <Modal v-model="headPortraitModal" title="上传头像" @on-cancel="modalCancel" width="400">
      <Avatar icon="person" size="large" :src="headImgUrl" class="user-avatar-modal" />
      <Upload ref="upload" :show-upload-list="false" :format="['jpg','jpeg','png']" :max-size="2048" :with-credentials="true" :before-upload="handleBeforeUpload" :on-exceeded-size="handleMaxSize" :action="uploadUrl" :on-success="handleSuccess" style="margin-left:130px;margin-top:10px">
        <Button type="ghost" icon="ios-cloud-upload-outline">选择图片</Button>
      </Upload>
      <div slot="footer">
        <Button type="primary" size="large" long :loading="uploading" @click="changeHeadPortrait">确认</Button>
      </div>
    </Modal>

    <!-- 个人信息修改模态框 -->
    <Modal v-model="editModal" :mask-closable="false" title="个人信息修改" width="400" @on-ok="userInfoChange" @on-cancel="cancelEdit">
      <div style="width:80%;margin-left:10%;">
        <Input v-model="userObj.nickName">
        <span slot="prepend">昵称:</span>
        </Input><br>
        <Input v-model="userObj.email">
        <span slot="prepend">邮箱:</span>
        </Input><br>
        <Input v-model="userObj.phoneNumber">
        <span slot="prepend">手机:</span>
        </Input><br> 性别:
        <select name="" v-model="userObj.sex">
          <option value="true">男</option>
          <option value="false">女</option>
        </select>
      </div>
    </Modal>
  </div>
</template>
<script>
export default {
  name: 'userZone',
  data() {
    return {
      editModal: false,
      headPortraitModal: false,
      headImgPreViewUrl: null,
      uploading: false,
      headImgFile: null,
      uploadUrl: 'http://127.0.0.1:8088/user/updateUserImg',
      userObj: null,
      notifiPage: {
        page: 1,
        pageSize: 15,
        total: 0,
        notifications: [],
        loadfinish: false
      },
      recentGlossary: {
        loadfinish: false,
        glossaryList: []
      }
    }
  },
  computed: {
    user() {
      /* 拷贝一个user对象用于进行表单的双向绑定 */
      this.userObj = JSON.parse(JSON.stringify(this.$store.getters.getUser))
      return this.userObj
    },
    headImgUrl() {
      /* 计算模态框中预览用户头像的url,如果用户已选择本地文件则预览本地图片,否则预览原本的用户头像 */
      if (this.headImgPreViewUrl == null) {
        return this.user.headPortrait
      } else {
        return this.headImgPreViewUrl
      }
    }
  },
  methods: {
    getLocalTime(timestamp) {
      return this.$util.getLocalTime(timestamp)
    },
    changeSignature() {
      /* 更新用户签名 */
      this.$http
        .put('/user/userInfoUpdate', this.userObj)
        .then(res => {
          if (res.data) {
            this.$store.dispatch('sysUserInfo')
            this.$Message.success('个性签名修改成功!')
          }
        })
        .catch(err => {
          this.$Modal.warning({
            title: '操作失败',
            content: err.response.data
          })
        })
    },
    /* 切换成编辑模式 */
    editInfo() {
      this.editModal = true
    },
    changeHeadPortrait() {
      if (this.headImgFile == null) {
        this.$Message.error('请先选择本地头像文件!')
        return
      }
      this.uploading = true
      /* 上传用户头像 */
      this.$refs.upload.post(this.headImgFile)
    },
    modalCancel() {
      /* 模态框取消时清除本地预览url */
      this.headImgPreViewUrl = null
      this.headImgFile = null
      this.uploading = false
    },
    handleBeforeUpload(file) {
      this.headImgFile = file
      /* 将本地文件读取为url地址 */
      let reader = new FileReader()
      /* 此处必须用箭头函数否则无法对 headImgPreViewUrl进行修改 */
      reader.onload = e => {
        this.headImgPreViewUrl = reader.result
      }
      reader.readAsDataURL(file)
      return false
    },
    handleMaxSize() {
      this.$Message.error('头像文件过大,请选择不大于2M的图片文件!')
      this.uploading = false
    },
    handleSuccess(res) {
      this.uploading = false
      /* 同步用户信息必须在文件上传之后做, 如果放在changeHeadPortrait方法中会导致同步时拿到的是更新前的用户数据*/
      this.$store.dispatch('sysUserInfo').then(() => {
        this.headPortraitModal = false
      })
    },
    userInfoChange() {
      /* 更新用户信息 */
      this.$http
        .put('/user/userInfoUpdate', this.userObj)
        .then(res => {
          if (res.data) {
            this.$store.dispatch('sysUserInfo')
            this.$Message.success('用户信息修改成功!')
          }
        })
        .catch(err => {
          this.$Modal.warning({
            title: '操作失败',
            content: err.response.data
          })
        })
    },
    cancelEdit() {
      /* 取消用户信息修改时恢复用户信息 */
      this.userObj = JSON.parse(JSON.stringify(this.$store.getters.getUser))
    },
    noticePageChange(pageIndex) {
      this.notifiPage.loadfinish = false
      /* 通知消息页码切换 */
      this.$http
        .get('/notification/getUserNotification', {
          params: {
            page: pageIndex,
            pageSize: this.notifiPage.pageSize
          }
        })
        .then(res => {
          this.notifiPage.notifications = res.data.dataList
          this.notifiPage.total = res.data.totalRecord
          this.notifiPage.page = pageIndex
          this.notifiPage.loadfinish = true
        })
        .catch(err => {
          this.notifiPage.loadfinish = true
        })
    }
  }, //methods
  mounted() {
    /* 挂载前加载第一页的通知消息 */
    this.noticePageChange(1)
    this.$http
      .get('/glossary/recentGlossary')
      .then(res => {
        if (res.data.status_code == 0) {
          this.recentGlossary.loadfinish = true
          this.recentGlossary.glossaryList = res.data.data
        }
      })
      .catch(err => {
        this.recentGlossary.loadfinish = true
      })
  }
}
</script>
