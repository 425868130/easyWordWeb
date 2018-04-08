<style scoped>
.content {
  margin-left: 20%;
  margin-top: 5%;
  width: 900px;
  background-color: white;
  box-shadow: 2px 1px 3px 1px #e5e5e99f;
  border-radius: 3px;
  min-height: 450px;
}
.part-div {
  width: 450px;
  height: 500px;
}
.left-part {
  background-color: #f4f4f5;
}
.carousel {
  width: 350px;
  margin-left: 15%;
  margin-top: 30px;
  height: 350px;
}
.carousel-img {
  width: 100%;
  height: 100%;
}
.login-panel {
  position: relative;
  top: 30px;
  left: 15%;
  width: 70%;
}
.login-form{
  margin-top: 20px;
  /* #dddee1 */
}
.login-button{
  width: 200px;
  height: 40px;
  font-size: 16px;
  box-shadow: 1px 1px  5px 1px #5cadff;
  border-radius: 2px;
  margin-top: 20px;
}
.tips{
    text-align: left;
    color: #93969b;
}
</style>
<template>
  <div class="content">
      <table cellspacing=0 cellpadding=0>
        <tr>
          <!-- 左侧轮播图 -->
          <td class="part-div left-part"  valign="top">
            <Carousel loop autoplay  class="carousel" radius-dot arrow="never">
              <CarouselItem class="carousel-item" v-for="img in carousel.imgList" :key="img.index">
                <div class="demo-carousel">
                  <img :src="img.url" class="carousel-img"/>
                </div>
              </CarouselItem>
            </Carousel>
          </td>
          <!-- 右侧账号注册面板 -->
        <td class="part-div" valign="top">
          <div class="login-panel">
            <h1>欢迎使用简词</h1>
            <Form ref="formInline" :model="formInline" :rules="ruleInline" class="login-form">
              <FormItem prop="user">
                <Input type="text" v-model="formInline.user" placeholder="账号" class="input-box" size="large">
                <Icon type="android-person"slot="prepend"></Icon></Input>
            </FormItem>
            <FormItem prop="password">
              <Input type="password" v-model="formInline.password" placeholder="密码" class="input-box" size="large">
                  <Icon type="locked" slot="prepend"></Icon></Input>
              </FormItem>
              <p class="tips">还没有账号？<router-link to="/register">去注册</router-link></p>
              <FormItem>
                <Button type="primary" @click="handleSubmit('formInline')" class="login-button">登录</Button>
                </FormItem>
            </Form>
          </div>
        </td>
        </tr>
      </table>
  </div>
</template>
<script>
/* 登录注册页面 */
export default {
  name: "login",
  data() {
    return {
      carousel: {
        imgList: [{
          index:1,
          url:"http://easywords.oss-cn-hangzhou.aliyuncs.com/carousel_img/carousel01.png"
        },{
          index:2,
          url:"http://easywords.oss-cn-hangzhou.aliyuncs.com/carousel_img/carousel02.png"
        }
        ]
      },
       formInline: {
                    user: '',
                    password: ''
                },
                ruleInline: {
                    user: [
                        { required: true, message: '请输入完整的账号', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入完整的密码.', trigger: 'blur' },
                        { type: 'string', min: 6, message: '密码长度不能少于4位', trigger: 'blur' }
                    ]
                }
    };
  },
  methods: {
      handleSubmit(name) {
          this.$refs[name].validate((valid) => {
              if (valid) {
                this.$http.post('/user/login',{
                  account:this.formInline.user,
                  password:this.$util.md5(this.formInline.password)
                }).then(res=>{
                  if(res.data){
                    this.$Message.success('登录成功!');
                    this.$store.commit('setUserInfo',res.data);
                    this.$router.push('/wordsMemory');
                  }
                }).catch(err=>{
                  this.$Message.error(err.response.data);
                })
              } else {
                  this.$Message.error('请检查输入的账号信息是否正确!');
              }
          })
      }
  }
};
</script>