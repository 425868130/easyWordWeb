<style scoped>
.index {
  width: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  text-align: center;
}
[v-cloak] {
  display: none;
}
</style>
<template>
    <div class="index" v-cloak>
      <!-- 网页头部导航栏 -->
      <MainHeader @onSearch="onSearch" :is-login="isUserLogin" :user="userInfo" @onLogout="onLogout"></MainHeader>
      <!-- 内容出口路由 -->
      <router-view></router-view>
      <MyFooter></MyFooter>
    </div>
</template>
<script>
export default {
  name:"index",
  computed:{
    isUserLogin(){
      return this.$store.getters.getLoginStatus;
    },
    userInfo(){
      return this.$store.getters.getUser;
    }
  },
  methods:{
    onSearch(keywords){
      if(keywords.length==0){
              this.$Message.error('请输入要查询的单词！');
              return;
          }
      /* 跳转路由到wordsResult页面 */
      this.$router.push('/search/'+keywords);
    },
    onLogout(){
       this.$http.get('/user/logout');
       this.$store.commit('logout');
       this.$router.push('/login');
    }
  }
};
</script>