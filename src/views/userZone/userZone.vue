<style scoped>
.root{
  max-width: 80%;
  margin-left: 10%;
  min-height: 570px;
}
.user-area{
  background-color: white;
  background-image: url("../../res/img/userInfo/userZoneBack.jpg");
  width: inherit;
  background-position: center;
	opacity: 0.8;
  min-height: 250px;
}
.user-area *{
  border: solid 1px red;
}
.user-avatar{
  width: 120px;
  height: 120px;
  border-radius: 50%;
  position: relative;
  float: left;
  margin-top: 50%;
}
.user-div{
  width: 400px;
}
.nickName{
  font-size: 20px;
}
</style>
<template>
<div class="root">
  <!-- 用户个人信息面板区，带背景图 -->
  <div class="user-area">
    <div class="user-div">
      <Avatar icon="person" size="large" :src="user.headPortrait" class="user-avatar"/>
     <!--  <span v-text="user.nickName" class="nickName">用户名</span><br>
      性别:<span v-text="user.sex?'男':'女'"></span><br>
      邮箱:<span v-text="user.email"></span><br>
      手机:<span v-text="user.phoneNumber"></span><br>
      积分:<span v-text="user.points"></span><br>
      等级:<span v-text="user.level"></span><br> -->
    </div>
  </div>
  <!-- 用户单词本区域 -->
  <div class="words-list">

  </div>
</div>
</template>
<script>
    export default {
      name:"userZone",
      data(){
        return{
        }
      },
      computed:{
        user(){
          return this.$store.getters.getUser;
        }
      }
    }
</script>
