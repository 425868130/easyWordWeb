<style scoped>
.layout-logo {
  width: 130px;
  height: 50px;
  float: left;
  position: relative;
  top:3px;
  left: 8%;
}
.headerLogo{
    width: inherit;
    height: inherit;
}
.layout-nav {
  width: 500px;
  margin: 0 auto;
  margin-left: 22%;
}
.header-search-input{
    margin-left: -10%;
}
/* 头像及登录提示区 */
.login-div{
    color: white;
    margin-left: 70px;
}
.userName{
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    font-size: 16px;
}
.login-div a{
    color: white;
}

</style>
<template>
    <div class="header">
        <!-- 顶部菜单栏 -->
        <Menu mode="horizontal" theme="primary" class="my-menu"
        @on-select="onMenuClick">
             <div class="layout-logo">
                 <img src="../../res/img/headerLogo.png" class="headerLogo">
             </div>
            <div class="layout-nav">
                <MenuItem name="1">
                <Icon type="social-wordpress"></Icon>
                    单词记忆
                </MenuItem>
                <MenuItem name="2">
                    <Icon type="headphone"></Icon>
                    听力训练
                </MenuItem>
                <MenuItem name="3">
                    <Icon type="ios-paper"></Icon>
                    新闻资讯
                </MenuItem>
                <MenuItem name="4">
                    <Icon type="ios-cloud-download"></Icon>
                    资料下载
                </MenuItem>
            </div>
            <Input v-model="inputStr" icon="ios-search-strong" placeholder="查词"
            class="header-search-input" @on-enter="onSearch" @on-click="onSearch"></Input>
            <span v-if="isLogin" class="login-div">
        <Dropdown @on-click="floatMenuClick">
            <a href="javascript:void(0)">
                <Avatar icon="person" class="avatar" :src="user.headPortrait"/>&nbsp;&nbsp;<span class="userName" v-text="user.nickName"></span>
                &nbsp;<Icon type="chevron-down"></Icon>
            </a>
            <DropdownMenu slot="list">
                <DropdownItem name="userZone">个人中心</DropdownItem>
                <DropdownItem name="wordsList">生词本</DropdownItem>
                <DropdownItem name="logout">退出</DropdownItem>
            </DropdownMenu>
        </Dropdown>
            </span>
            <span v-else class="login-div">
                <router-link to="/login">登录</router-link> · <router-link to="/register">注册</router-link>
            </span>
        </Menu>
    </div>
</template>
<script>
export default {
  name: "MainHeader",
  props:{
      isLogin:{
          type:Boolean,
          required:true,
          default:false
      },
      user:Object
  },
  data() {
    return {
        inputStr:''
    };
  },
  methods:{
      onSearch(){
          this.$emit('onSearch',this.inputStr);
      },
      onMenuClick(name){
          switch(name){
              case '1':this.$router.push('/wordsMemory');break;
              case '2':this.$router.push('/listeningPractice');break;
              case '3':this.$router.push('/newsPage');break;
              case '4':this.$router.push('/resDownload');break;
          }
      },
      floatMenuClick(name){
          switch(name){
              case 'userZone':{
                this.$router.push('/userZone/account');
              }break;
              case 'wordsList':
              {
                  this.$router.push('/wordsBook/account');
              }
              break;
              case 'logout':{
                  this.$emit('onLogout');
              }break;
          }
      }
  }
};
</script>