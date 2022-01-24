<template>
    <section>
        <div class="table">
            <el-row class="table-title">
                <el-col :span="10">困难诉求</el-col>
                <el-col :span="5">类别</el-col>
                <el-col :span="5">时间</el-col>
                <el-col :span="4">处理人</el-col>
            </el-row>

            <el-row class="list"
                v-for="(n, index) in 30" :key="index"
            >
                <el-col :span="10">xxxxxxxx</el-col>
                <el-col :span="5">经济诉讼</el-col>
                <el-col :span="5">2020-09-23</el-col>
                <el-col :span="4">xxx局</el-col>
            </el-row>

        </div>
    </section>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({});
</script>


<style lang="scss" scoped>
section {
    height: 60vh;
    overflow: scroll;
  .table {
    .table-title {
      height: 50px;
      background: #4f7ea0;
      //    justify-content: space-between;
      .el-col {
        font-size: 16px;
        font-weight: bold;
        color: #ffffff;
        text-align: center;
        height: 100%;
        line-height: 50px;
      }
      .el-col:not(:last-child) {
        border-right: 1px solid #eeeeee;
      }
    }

    .list {
      height: 40px;
      background: #eeeeee;
      border-top: 1px solid #fff;
      .el-col {
        font-size: 14px;
        font-weight: bold;
        color: #909090;
        text-align: center;
        height: 100%;
        line-height: 40px;
      }
      .el-col:not(:last-child) {
        border-right: 1px solid #fff;
      }
    }
  }
}
</style>

