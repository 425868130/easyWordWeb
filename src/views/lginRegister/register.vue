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
.reg-panel {
  position: relative;
  top: 30px;
  left: 15%;
  width: 70%;
}
.reg-form{
  margin-top: 20px;
  /* #dddee1 */
}
.reg-button{
  width: 200px;
  height: 40px;
  font-size: 16px;
  box-shadow: 1px 1px  5px 1px #acf3b7;
  border-radius: 2px;
  background-color: #19be6b;
  border-color:  #19be6b;
}
.reg-button:hover{
  background-color: #19be6b;
  border-color:  #19be6b;
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
          <div class="reg-panel">
            <h1>欢迎使用简词</h1>
            <Form ref="formInline" :model="formInline" :rules="ruleInline" class="reg-form">
              <FormItem prop="account">
                <Input type="text" v-model="formInline.account" placeholder="账号" class="input-box" size="large">
                <Icon type="android-person"slot="prepend"></Icon></Input>
            </FormItem>
            <FormItem prop="password">
              <Input type="password" v-model="formInline.password" placeholder="密码" class="input-box" size="large">
                  <Icon type="locked" slot="prepend"></Icon></Input>
              </FormItem>
            <FormItem prop="psdCheck">
              <Input type="password" v-model="formInline.psdCheck" placeholder="密码确认" class="input-box" size="large">
                  <Icon type="locked" slot="prepend"></Icon></Input>
              </FormItem>
            <FormItem prop="emailAddress">
              <Input type="email" v-model="formInline.email" placeholder="电子邮箱" class="input-box" size="large">
                  <Icon type="email" slot="prepend"></Icon></Input>
              </FormItem>
              <FormItem>
                <Button type="primary" @click="handleSubmit('formInline')" class="reg-button">立即注册</Button>
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
  name: "register",
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
                    account: '',
                    password: '',
                    psdCheck:'',
                    email:''
                },
                ruleInline: {
                    account: [
                        { required: true, message: '请输入完整的账号', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入完整的密码.', trigger: 'blur' },
                        { type: 'string', min: 6, message: '密码长度不能少于4位', trigger: 'blur' }
                    ],
                    psdCheck:[
                       { required: true, message: '请输入完整的密码.', trigger: 'blur' },
                       { type: 'string', min: 6, message: '密码长度不能少于4位', trigger: 'blur' }
                    ],
                    email:[
                       { required: true, message: '请输入邮箱地址.', trigger: 'blur' },
                       { type: 'email', message: '请输入格式的邮箱地址', trigger: 'blur' }
                    ]
                }
    };
  },
  methods: {
      handleSubmit(name) {
        /* 检验输入合法后发出注册请求 */
          this.$refs[name].validate((valid) => {
              if (valid) {
                this.$http.post('/user/register',{
                  account:this.formInline.account,
                  password:this.$util.md5(this.formInline.password),
                  email:this.formInline.email
                }).then(res=>{
                  if(res.data){
                    this.$Message.success('注册成功,请尽快前往邮箱完成账号校验!');
                    this.$router.push('/login');
                  }
                }).catch(err=>{
                  this.$Message.error(err.response.data);
                });
              } else {
                  this.$Message.error('请检查输入的账号信息是否正确!');
              }
          })
      }
  }
};
</script>