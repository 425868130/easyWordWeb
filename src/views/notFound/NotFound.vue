<style scoped>
.tips-img{
    height: 600px;
    width: 800px;
    margin-left: 20%;
    margin-top: 10px;
}
.tips-title{
    margin-left: 33%;
    font-size: 35px;
}
</style>
<template>
    <div>
        <img class="tips-img" src="https://easywords.oss-cn-hangzhou.aliyuncs.com/imageRes/404page.png" />
        <p class="tips-title">当前页面未找到 &nbsp;<router-link to="/">返回首页</router-link></p>
    </div>
</template>
<script>
export default {
  name: "notFound"
};
</script>
