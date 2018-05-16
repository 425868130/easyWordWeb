<style scoped>
.content {
  width: 60%;
  margin-left: 20%;
  margin-top: 30px;
  background-color: white;
}
.res-div {
  text-align: left;
  margin-left: 20px;
  min-height: 130px;
}
.res-description {
  color: #80848f;
  padding: 5px 30px 5px 0px;
  width: 90%;
}
hr {
  margin: 10px 20px 15px 10px;
  height: 1px;
  border: none;
  border-top: 1px solid #e9eaec;
}
.download-div {
  float: right;
  margin-right: 30px;
  text-align: center;
}
.page-part {
  padding-bottom: 20px;
}
</style>
<template>
<div class="content">
  <Modal v-model="downloadConfirm" width="360">
        <p slot="header" style="color:#f60;text-align:center">
            <Icon type="information-circled"></Icon>
            <span>资料下载</span>
        </p>
        <div style="text-align:center">
            <p>确认要下载该资料吗?</p>
            <p>下载资料将扣除对应积分!</p>
            <p>Tips:同一资料多次下载不会重复扣积分.</p>
        </div>
        <div slot="footer">
            <Button type="warning" size="large" long @click="startDownload">开始下载</Button>
        </div>
    </Modal>
    <div style="min-height:700px;padding-top:30px;">
      <div class="res-div" v-for="file in files">
          <Spin size="large" v-if="!loadFinish"></Spin>
          <h2 v-text="file.filename"></h2>
          <div class="download-div">
              <a @click="downloadFile(file.id)"><Icon type="ios-download-outline" style="font-size:40px;"></Icon><br>立即下载</a>
          </div>
          <p class="res-description" v-text="file.description"></p>
      <span>上传时间:&nbsp;{{getLocalTime(file.gmtCreate)}}</span>&nbsp;&nbsp;&nbsp;<span>所需积分:&nbsp;{{file.pointsrequired}}</span>&nbsp;&nbsp;&nbsp;<span>下载次数:&nbsp;{{file.downCount}}</span>
      <hr>
      </div>
    </div>
    <!-- 分页控件 -->
     <Page :total="totalRecord" size="small" show-total show-elevator class="page-part" @on-change="pageChange"></Page>
     <back-top></back-top>
</div>
</template>
<script>
export default {
  name: "resDownload",
  data() {
    return {
      page: 1,
      pageSize: 10,
      totalRecord: 0,
      files: [],
      loadFinish: false,
      downloadFileId: "",
      downloadConfirm: false
    };
  },
  watch: {
    page(nVal, oVal) {
      this.$http
        .get("/resFiles/getFileListByPage", {
          params: {
            page: nVal,
            pageSize: this.pageSize
          }
        })
        .then(res => {
          this.files = res.data.dataList;
          this.totalRecord = res.data.totalRecord;
          this.loadFinish = true;
        });
    }
  },
  methods: {
    getLocalTime(timestamp) {
      return this.$util.getLocalTime(timestamp);
    },
    downloadFile(fileId) {
      this.downloadFileId = fileId;
      this.downloadConfirm = true;
    },
    startDownload() {
      this.downloadConfirm = false;
      /* 文件下载 */
      this.$http
        .get("/resFiles/getResUrl/" + this.downloadFileId)
        .then(res => {
          window.location.href = res.data;
          this.$Modal.success({
            title: "下载成功",
            content: "资源已开始下载,如果浏览器没有响应请刷新后重试!"
          });
        })
        .catch(err => {
          console.log(err);
          
          this.$Modal.error({
            title: "下载失败!",
            content: err.data.message
          });
        });
    },
    pageChange(page) {
      /* 修改page值以触发watch事件 */
      this.page = page;
    }
  },
  created() {
    this.$http
      .get("/resFiles/getFileListByPage", {
        params: {
          page: this.page,
          pageSize: this.pageSize
        }
      })
      .then(res => {
        this.files = res.data.dataList;
        this.totalRecord = res.data.totalRecord;
        this.loadFinish = true;
      });
  }
};
</script>
