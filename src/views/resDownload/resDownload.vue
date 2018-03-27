<style scoped>
.content{
    width: 60%;
    margin-left: 20%;
    margin-top: 30px;
    background-color: white;
}
.res-div{
    text-align: left;
    margin-left: 20px;
    min-height: 130px;
}
.res-description{
    color: #80848f;
    padding: 5px 30px 5px 0px;
    width: 90%;
}
hr{
    margin: 10px 20px 15px 10px;
    height:1px;
    border:none;
    border-top:1px solid #e9eaec;
}
.download-div{
    float: right;
    margin-right: 30px;
    text-align: center;
}
.page-part{
    padding-bottom: 20px;
}
</style>
<template>
<div class="content">
    
    <div class="res-div" v-for="file in files">
        <Spin size="large" v-if="!loadFinish"></Spin>
        <h2 v-text="file.filename"></h2>
        <div class="download-div">
            <a :href="file.url"><Icon type="ios-download-outline" style="font-size:40px;"></Icon><br>立即下载</a>
        </div>
        <p class="res-description" v-text="file.description"></p>
    <span>上传时间:&nbsp;{{getLocalTime(file.gmtCreate)}}</span>&nbsp;&nbsp;&nbsp;<span>所需积分:&nbsp;{{file.pointsrequired}}</span>&nbsp;&nbsp;&nbsp;<span>下载次数:&nbsp;{{file.downCount}}</span>
    <hr>
    </div>
     <Page :total="totalRecord" size="small" show-total show-elevator class="page-part"></Page>
</div>
</template>
<script>
    export default {
        name:'resDownload',
        data(){
            return{
                page:1,
                pageSize:10,
                totalRecord:0,
                files:[],
                loadFinish:false
            }
        },
        methods:{
            getLocalTime(timestamp){
                return this.$util.getLocalTime(timestamp);
            }
        },
        created(){
            this.$http.get('/resFiles/getFileListByPage',{
                params:{
                    page:this.page,
                    pageSize:this.pageSize
                }
            }).then(res=>{
                this.files = res.data.dataList;
                this.totalRecord = res.data.totalRecord;
                this.loadFinish = true;
            });
        }
    }
</script>
