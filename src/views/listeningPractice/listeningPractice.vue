<style scoped lang="less">
.root-div {
  width: 60%;
  margin-left: 20%;
  margin-top: 30px;
  padding: 20px;
  background-color: white;
  text-align: left;
  .title-tips {
    font-size: 30px;
    margin-left: 30px;
  }
  .list {
    list-style: none;
    min-height: 500px;
    margin: 40px;
  }
  .list li {
    margin-top: 20px;
    cursor: pointer;
  }
  .list li:hover {
    background-color: #f8f8f9;
  }
  .page-part {
    margin-left: 45%;
  }
  .view {
    color: #bbbec4;
  }
  .item-title {
    font-size: 25px;
  }
  .info {
    font-size: 16px;
    margin-top: 15px;
  }
}
</style>
<template>
    <div class="root-div">
        <p class="title-tips">听力在线&nbsp;
            <Icon type="headphone"></Icon>
        </p>
        <ul class="list">
            <li v-for="item in listenArr" :key="item.id" @click="toListenPage(item.id)">
                <p class="item-title">[{{item.category}}]&nbsp;&nbsp;{{item.title}}</p>
                <span class="info">
                    <span>时间:{{getLocalTime(item.gmtCreate)}}</span>
                    <span class="view">浏览:{{item.viewNum}}</span>
                </span>
            </li>
        </ul>
        <Page :total="page.count" size="small" :page-size="page.pageSize" :current="page.pageIndex" @on-change="pageChange" class="page-part"></Page>
    </div>
</template>
<script>
export default {
  name: "listeningPractice",
  data() {
    return {
      listenArr: [],
      page: {
        pageIndex: 1,
        pageSize: 10,
        count: 0
      }
    };
  },
  methods: {
    getLocalTime(timestamp) {
      return this.$util.getLocalTime(timestamp);
    },
    toListenPage(id) {
      this.$router.push("/listeningDetail/" + id);
    },
    pageChange(page) {
      this.page.pageIndex = page;
    },
    loadPage() {
      this.$http("/listen/getListenListPage", {
        params: {
          page: this.page.pageIndex,
          pageSize: this.page.pageSize
        }
      }).then(res => {
        //   /console.log(res);
        this.listenArr = res.data.dataList;
        this.count = res.data.totalRecord;
      });
    }
  },
  created() {
      this.loadPage();
  }
};
</script>
