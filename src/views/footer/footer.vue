<style scoped>
.footer {
  background-color: #e9eaec;
  margin-top: 5%;
  min-height: 50px;
  color: #bbbec4;
}
.copy-right {
  font-size: 16px;
}
.links a {
  color: #bbbec4;
  font-size: 16px;
}
</style>
<template>
    <div class="footer">
        <p class="links">
            <a to="#">帮助</a>|
            <a href="mailto:425868130@qq.com">联系我</a>
        </p>
        <p class="copy-right">
            Copyright © 2018 NCHU by Xujw&nbsp;&nbsp;&nbsp;备案号:&nbsp;赣ICP备18005465号-1
        </p>
    </div>
</template>
<script>
export default {
  name: "MyFooter"
};
</script>