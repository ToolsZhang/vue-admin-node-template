<template>
    <section>
        <!-- 包联群众 -->
        <div class="title">
            <div class="name">包联群众信息</div>
            <div class="fillter">
                <div class="item">近24h</div>
                <div class="item">近7天</div>
                <div class="item">近30天</div>
            </div>
        </div>

        <div class="table">
            <el-row class="table-title">
                <el-col :span="10">困难诉求</el-col>
                <el-col :span="5">类别</el-col>
                <el-col :span="5">分配</el-col>
                <el-col :span="4">回访</el-col>
            </el-row>

            <el-row class="list">
                <el-col :span="10">xxxxxxxx</el-col>
                <el-col :span="5">经济诉讼</el-col>
                <el-col :span="5">公安局</el-col>
                <el-col :span="4">满意</el-col>
            </el-row>
            <el-row class="list">
                <el-col :span="10">xxxxxxxx</el-col>
                <el-col :span="5">经济诉讼</el-col>
                <el-col :span="5">公安局</el-col>
                <el-col :span="4">满意</el-col>
            </el-row>
        </div>
    </section>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  data() {
    return {
      checkAll: false,
      checkedCities: [],
      isIndeterminate: true,
      cities: ["1", "2", "3"]
    };
  },
  methods: {}
});
</script>
<style lang="scss" scoped>
section {
  .title {
    padding-left: 20px;
    background: url("../assets/images/icon_16.png") no-repeat left center;
    background-size: auto 17px;
    display: flex;
    align-items: center;
    .name {
      height: 50px;
      line-height: 50px;

      font-size: 16px;
      font-weight: bold;
      color: #404d54;
      border-bottom: 1px solid #eeeeee;
    }

    .fillter {
      display: flex;
      align-items: center;
      margin-left: 40px;
      .item {
        font-size: 14px;
        color: #404d54;
        margin-left: 50px;
      }
    }
  }

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




</style>


