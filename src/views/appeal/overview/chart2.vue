<template>
  <el-container>
    <el-header>
      <ChartHeader></ChartHeader>
    </el-header>
    <el-main>
      <div class="left">
        <div class="item">
          <div class="tip">
            <div class="icon">
              <img
                src="@/assets/platform/icon_2.png"
                alt=""
              >
              <span>最近一周走访干部人数：</span>
            </div>
          </div>
          <div class="chartlist">

            <LineChart
              :htmlId="'lineChart1'"
              :data="lineChart"
              :color="'#FA6400'"
            ></LineChart>
          </div>
        </div>
        <div class="item">
          <div class="tip">
            <div class="icon">
              <img
                src="@/assets/platform/icon_2.png"
                alt=""
              >
              <span>最近一周入户数量汇总：</span>
            </div>
          </div>
          <div class="chartlist">
            <LineChart
              :htmlId="'lineChart2'"
              :data="lineChart"
              :color="'#FFE6A3'"
            ></LineChart>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="tip">
          <div class="icon">
            <img
              src="@/assets/platform/icon_5.png"
              alt=""
            >
            <span>各单位包联群众数量汇总：</span>
          </div>
        </div>
        <div class="chartlist">
          <BarChart
            :htmlId="'barchart1'"
            :data="barChart"
          ></BarChart>

        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script lang="ts">
import Vue from "vue";
import ChartHeader from "@/components/ChartHeader.vue";
import LineChart from "@/components/LineChart.vue";
import BarChart from "@/components/BarChart.vue";
export default {
  components: {
    ChartHeader,
    LineChart,
    BarChart
  },
  data() {
    return {
      lineChart: [
        { year: "1991", value: 3 },
        { year: "1992", value: 4 },
        { year: "1996", value: 6 },
        { year: "1997", value: 7 },
        { year: "1998", value: 9 },
        { year: "1999", value: 13 }
      ],

      barChart: [
        {
          type: "家具家电",
          sales: 38
        },
        {
          type: "粮油副食",
          sales: 52
        },
        {
          type: "生鲜水果",
          sales: 61
        },
        {
          type: "美容洗护",
          sales: 145
        },
        {
          type: "母婴用品",
          sales: 48
        },
        {
          type: "进口食品",
          sales: 38
        },
        {
          type: "食品饮料",
          sales: 38
        },
        {
          type: "家庭清洁",
          sales: 38
        }
      ]
    };
  },

  methods: {}
};
</script>


<style lang="scss" scoped>
.el-container {
  height: 100%;
  .el-header {
    height: 10%;
    background: #0f1948;
  }
  .el-main {
    height: 90%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #0f1948;
    .left {
      width: 45%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .item {
        height: 48%;
        background: url("../../../assets/platform/pic_6.png") no-repeat;
        background-size: 100% 100%;
        .tip {
          width: 100%;
          height: 15%;
          padding: 0 20px;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .icon {
            display: flex;
            align-items: center;
            img {
              height: 15px;
            }
            span {
              font-size: 14px;
              color: #2ad0ff;
              padding-left: 5px;
            }
          }
        }
        .chartlist {
          height: 85%;
          display: flex;
          padding: 20px;
          box-sizing: border-box;
        }
      }
    }
    .right {
      width: 53%;
      height: 100%;
      background: url("../../../assets/platform/pic_7.png") no-repeat;
      background-size: 100% 100%;
      .tip {
        width: 100%;
        height: 8%;
        padding: 0 20px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .icon {
          display: flex;
          align-items: center;
          img {
            height: 15px;
          }
          span {
            font-size: 14px;
            color: #2ad0ff;
            padding-left: 5px;
          }
        }
      }
      .chartlist {
        height: 92%;
        display: flex;
        padding: 20px;
        box-sizing: border-box;
      }
    }
  }
}
</style>

