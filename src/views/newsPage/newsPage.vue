<style scoped>
.content{
    width: 60%;
    margin-left: 20%;
    margin-top: 30px;
    background-color: white;
}
.news-div{
    text-align: left;
    margin-left: 20px;
}
.news-div:hover{
    cursor: pointer;
    background-color: #e9eaec;
}
.news-description{
    color: #80848f;
    float: right;
    width: 78%;
    padding-right: 20px;
}
hr{
    margin: 10px 20px 15px 10px;
    height:1px;
    border:none;
    border-top:1px solid #e9eaec;
}
.news-img{
    width: 120px;
    height: 120px;
}
.news-img img{
    width: 100%;
    height: 100%;
}
.news-tips{
    margin-top: 10px;
    color: #80848f;
    text-align: right;
    margin-right: 30px;
}
.page-part{
    padding-bottom: 20px;
}
</style>
<template>
  <div class="content">
    <div class="news-div" v-for="n in 10" @click="newsClick">
        <h2 style="padding-bottom: 10px;">Stone Age People in South Africa Unharmed by Supervolcano Eruption</h2>
        <p class="news-description">The Pinnacle Point archeological locality on the south coast of South Africa, a rock shelter, called PP5-6, used by humans from about 90,000 to 50,000 years ago, near the town of Mossel Bay viewed from the northeast is seen in this 2014 photo released March 12, 2018.</p>
        <div class="news-img">
            <img src="../../res/img/news/news.png"/>
        </div>
        <p class="news-tips">阅读积分:&nbsp;30</p>
        <hr>
    </div>
     <Page :total="40" size="small" show-total show-elevator class="page-part"></Page>
</div>
</template>
<script>
    export default {
        name:'newsPage',
        methods:{
            newsClick(){
                this.$router.push('/newsDetail/newsId');
            }
        }
    }
</script>
