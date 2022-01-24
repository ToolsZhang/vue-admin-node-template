<template>
    <section>
        <!-- 包联群众 -->
        <div class="title">包联群众信息</div>
        <div class="buttons">
            <div class="check">
                <el-checkbox  
                :indeterminate="isIndeterminate"
                v-model="checkAll"
                @change="handleCheckAllChange"
                >全选</el-checkbox>
            </div>
            <div class="add">+新增</div>
            <div class="del">-删除</div>
        </div>

        <div class="table">
            <el-row class="table-title">
                <el-col :span="3">编号</el-col>
                <el-col :span="3">姓名</el-col>
                <el-col :span="10">单位</el-col>
                <el-col :span="4">联系方式</el-col>
                <el-col :span="4">职业</el-col>
            </el-row>
            <el-checkbox-group
                v-model="checkedCities"
                @change="handleCheckedCitiesChange"
            >
                <el-row class="list">

                    <el-col :span="3">
                        <el-checkbox :label="1">1</el-checkbox>
                    </el-col>
                    <el-col :span="3">户主</el-col>
                    <el-col :span="10">住址</el-col>
                    <el-col :span="4">联系方式</el-col>
                    <el-col :span="4">职业</el-col>
                </el-row>
                 <el-row class="list">

                    <el-col :span="3">
                        <el-checkbox :label="2">2</el-checkbox>
                    </el-col>
                    <el-col :span="3">户主</el-col>
                    <el-col :span="10">住址</el-col>
                    <el-col :span="4">联系方式</el-col>
                    <el-col :span="4">职业</el-col>
                </el-row>
            </el-checkbox-group>

            <!-- <div class="table-title">
                <span style="width:10%;">序号</span>
                <span>户主</span>
                <span>住址</span>
                <span>联系方式</span>
                <span>职业</span>
            </div> -->
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
      cities:['1','2','3']
    };
  },
  methods: {
    handleCheckAllChange() {
    //   this.checkedCities = val ? cityOptions : [];
    //   this.isIndeterminate = false;
    },
    handleCheckedCitiesChange() {
        console.log(this.checkedCities)
        // console.log(value)
    //   let checkedCount = value.length;
    //   this.checkAll = checkedCount === this.cities.length;
    //   this.isIndeterminate =
    //     checkedCount > 0 && checkedCount < this.cities.length;
    }
  }
});
</script>
<style lang="scss" scoped>
section {
  .title {
    padding-left: 20px;
    height: 50px;
    line-height: 50px;
    background: url("../assets/images/icon_16.png") no-repeat left center;
    background-size: auto 17px;
    font-size: 16px;
    font-weight: bold;
    color: #404d54;
    border-bottom: 1px solid #eeeeee;
  }

  .buttons {
    height: 60px;
    display: flex;
    align-items: center;
    .check {
      margin: 0 20px;
    }
    .add {
      margin: 0 20px;
      width: 60px;
      height: 25px;
      background: #3486c2;
      border-radius: 3px;
      font-size: 14px;
      color: #ffffff;
      text-align: center;
      line-height: 25px;
    }
    .del {
      margin: 0 20px;
      width: 60px;
      height: 25px;
      background: #3486c2;
      border-radius: 3px;
      font-size: 14px;
      color: #ffffff;
      text-align: center;
      line-height: 25px;
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



