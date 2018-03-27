<style scoped>
.root{
    width: 70%;
    margin-left: 15%;
    margin-top: 20px;
    text-align: center;
}
</style>
<template>
<div class="root">
    <h1>欢迎加入简词</h1>
    <p v-text="message"></p>
    <router-link to="/">返回首页</router-link>
    <router-link to="/login">立即登录</router-link>
</div>
</template>
<script>
export default {
    name:"authentication",
    data(){
        return{
            message:'正在验证账号,请稍等.....'
        }
    },
    methods:{},
    mounted(){
        this.$http.post('/user/userAuthentication',{
            account:this.$route.query.account,
            email:this.$route.query.email,
            checkCode:this.$route.query.checkCode
        }).then(res=>{
            if(res){
                this.message = '认证成功！';
            }
        }).catch(err=>{
            this.message=err.response.data;
        });
    }
}
</script>
