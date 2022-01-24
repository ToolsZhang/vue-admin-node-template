<template>
  <el-container>
    <el-header>
      <ChartHeader></ChartHeader>
    </el-header>
    <el-main>
      <div class="top">
        <div class="left">
          <div class="tip">
            <div class="icon">
              <img
                src="@/assets/platform/icon_2.png"
                alt=""
              >
              <span>每日诉求数量明细：</span>
            </div>
          </div>
          <div class="chartlist">

            <AreaChart
              :htmlId="'areaChart1'"
              :data="lineChart"
              :color="'#FFD052'"
              :fillColor="'#FFD666'"
            ></AreaChart>
          </div>
        </div>
        <div class="right">
          <div class="tip">
            <div class="icon">
              <img
                src="@/assets/platform/icon_2.png"
                alt=""
              >
              <span>本周已处理诉求数量明细：</span>
            </div>
          </div>
          <div class="chartlist">

            <AreaChart
              :htmlId="'areaChart2'"
              :data="lineChart"
              :color="'#44D7B6'"
              :fillColor="'#6EBF19'"
            ></AreaChart>
          </div>
        </div>
      </div>
      <div class="bottom">
        <div class="left">
          <div class="tip">
            <div class="icon">
              <img
                src="@/assets/platform/icon_2.png"
                alt=""
              >
              <span>最近一周乡镇/街道诉求数量汇总：</span>
            </div>
          </div>
          <div class="chartlist">
            <ColumnChart
              :htmlId="'columnchart1'"
              :data="columnChart"
              :fillColor="'l(90) 0:#2AD0FF 1:#015FEE'"
              :xName="'type'"
              :yName="'sales'"
            ></ColumnChart>
          </div>
          <div id="select">
            <el-dropdown
              size="small"
              trigger="click"
            >
              <el-button type="primary">
                地区选择<i class="el-icon-caret-bottom"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>啦啦啦啦镇</el-dropdown-item>
                <el-dropdown-item>木尕拉镇</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
        <div class="right">
          <div class="tip">
            <div class="icon">
              <img
                src="@/assets/platform/icon_2.png"
                alt=""
              >
              <span>最近一周诉求类别数量汇总：</span>
            </div>
          </div>
          <div class="chartlist">
            <ColumnChart
              :htmlId="'columnchart2'"
              :data="columnChart"
              :fillColor="'l(90) 0:#2AD0FF 1:#015FEE'"
              :xName="'type'"
              :yName="'sales'"
            ></ColumnChart>
          </div>
          <div id="select">
            <el-dropdown
              size="small"
              trigger="click"
            >
              <el-button type="primary">
                地区选择<i class="el-icon-caret-bottom"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>啦啦啦啦镇</el-dropdown-item>
                <el-dropdown-item>木尕拉镇</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script lang="ts">
import Vue from "vue";
import ChartHeader from "@/components/ChartHeader.vue";
import LineChart from "@/components/LineChart.vue";
import ColumnChart from "@/components/ColumnChart.vue";
import AreaChart from "@/components/AreaChart.vue";
import BarChart from "@/components/BarChart.vue";
export default {
  components: {
    ChartHeader,
    LineChart,
    ColumnChart,
    BarChart,
    AreaChart
  },
  data() {
    return {
      columnChart: [
        {
          type: "婚姻调节类诉求",
          sales: 38
        },
        {
          type: "民生类诉求",
          sales: 52
        },
        {
          type: "政策类诉求",
          sales: 61
        },
        {
          type: "涉法涉诉类诉求",
          sales: 145
        },
        {
          type: "告知类诉求",
          sales: 48
        },
        {
          type: "债务类诉求",
          sales: 38
        },
        {
          type: "其他类诉求",
          sales: 38
        }
      ],
      lineChart: [
        { year: "1991", value: 3 },
        { year: "1992", value: 22 },
        { year: "1996", value: 6 },
        { year: "1997", value: 25 },
        { year: "1998", value: 9 },
        { year: "1999", value: 13 }
      ],
      options: [
        {
          value: "选项1",
          label: "黄金糕"
        },
        {
          value: "选项2",
          label: "双皮奶"
        },
        {
          value: "选项3",
          label: "蚵仔煎"
        },
        {
          value: "选项4",
          label: "龙须面"
        },
        {
          value: "选项5",
          label: "北京烤鸭"
        }
      ],
      value: ""
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
    flex-direction: column;
    justify-content: space-between;
    background: #0f1948;

    .top {
      height: 48%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;

      .left {
        width: 49%;
        height: 100%;
        background: url("../../../assets/platform/pic_2.png") no-repeat;
        background-size: 100% 100%;

        // display: flex;
        // align-items: center;
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
              font-weight: bold;
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

      .right {
        width: 49%;
        height: 100%;
        background: url("../../../assets/platform/pic_3.png") no-repeat;
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
              font-weight: bold;
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

    .bottom {
      height: 48%;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .left,
      .right {
        width: 49%;
        height: 100%;
        background: url("../../../assets/platform/pic_4.png") no-repeat;
        background-size: 100% 100%;
        position: relative;
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
              font-weight: bold;
            }
          }
        }

        .chartlist {
          height: 85%;
          display: flex;
          padding: 20px;
          box-sizing: border-box;
        }

        #select {
          position: absolute;
          right: 10px;
          top: 10px;
          // width: 120px;
          .aac {
            background: #2080b9;
          }
        }
      }
    }
  }
}
</style>