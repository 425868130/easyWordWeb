<style scoped>
.content{
    width: 60%;
    margin-left: 20%;
    margin-top: 30px;
}
.task-info{
    background-color: #eeeeee;
}
.card-tips{
    text-align: left;
    margin-left: 20px;
    font-size: 12px;
    color: #80848f;
}
.task-undo{
    font-size: 60px;
    color: teal;
}
.task-finish{
    font-size: 60px;
    margin-left: 40px;
    color: teal;
}
.task_start{
    font-size: 22px;
    margin-top: 10px;
    color: #80848f;
}
.words-preview{
    text-align: left;margin-left:20px;
    padding-bottom: 10px;
    width: inherit;
}
.words-task{
    word-break:break-all;
}
</style>

<template>
<div class="content">
 <Timeline>
        <TimelineItem class="time-item">
            <Icon type="trophy" slot="dot"></Icon>
            <div>
                <Card :bordered="false" class="task-card">
                    <h1 slot="title">今日任务</h1>
                    <a href="#" slot="extra" @click.prevent="getDailyTask">
                    <Icon type="ios-loop-strong"></Icon>换一批单词</a>
                    <div class="task-info">
                        <p class="card-tips"><Icon type="ios-color-wand-outline"></Icon>&nbsp;系统随机抽取50个高频词汇作为练习任务,完成今日任获得100积分哦!</p>
                        <p style="text-align: left;margin-left:20px;margin-top:10px;">单词预览:</p>
                        <div class="words-preview">
                            <span v-for="words in wordsList" :key="words.id" class="words-task">{{words.word}} 、 </span>
                        </div>

                        <span class="task-undo">50</span>全部 <span class="task-finish">0</span>已完成<br>
                        <router-link to="#" class="task_start">立即开始</router-link>
                    </div>
                </Card>
            </div>
        </TimelineItem>
        <TimelineItem class="time-item">
            <Icon type="ios-book" slot="dot"></Icon>
             <div>
                <Card :bordered="false" class="task-card">
                    <h1 slot="title">温故知新</h1>
                    <div class="task-info">
                        <p class="card-tips"><Icon type="ios-color-wand-outline"></Icon>&nbsp;复习昨天的任务词汇,完成后任获得50积分哦!</p>
                        <span class="task-undo">50</span>全部 <span class="task-finish">10</span>已完成<br>
                        <router-link to="#" class="task_start">马上复习</router-link>
                    </div>
                </Card>
            </div>
        </TimelineItem>
        <TimelineItem class="time-item">
           <Icon type="ribbon-b" slot="dot"></Icon>
           <div>
                <Card :bordered="false" class="task-card">
                    <h1 slot="title">巩固练习</h1>
                    <div class="task-info">
                        <p class="card-tips"><Icon type="ios-color-wand-outline"></Icon>&nbsp;系统在您全部已背诵的单词中随机抽取100个单词作为测试任务,完成后任获得50积分哦!</p>
                        <span class="task-undo">100</span>全部 <span class="task-finish">0</span>已完成<br>
                        <router-link to="#" class="task_start">接受挑战</router-link>
                    </div>
                </Card>
            </div>
        </TimelineItem>
        <TimelineItem class="time-item">
            <Icon type="happy-outline" slot="dot"></Icon>
        </TimelineItem>
    </Timeline>
</div>
</template>
<script>
    export default {
        name:"wordsMemory",
        data(){
            return{
                wordsList:[]
            };
        },
        methods:{
            getDailyTask(){
                this.$http.get('/words/getDailyTask').then(res=>{
                    this.wordsList = res.data;
                }).catch(err=>{
                    alert(err.response.data);
                });
            }
        },
        created(){
            this.getDailyTask();
        }
    };
</script>
