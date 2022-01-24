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
              <span>诉求总数量</span>
            </div>
            <div class="blocks">
              <div>
                <i style="background: #b684ff;"></i>
                <span>已解决</span>
              </div>
              <div>
                <i style="background:#CDB370;"></i>
                <span>未解决</span>
              </div>
            </div>
          </div>
          <div class="chartlist">
            <div
              class="item"
              v-for="(item,index) in circleChart"
              :key="index"
            >
              <CircleChart
                :htmlId="'container'+index"
                :data="item.data"
                :title="item.title"
              ></CircleChart>
            </div>
          </div>
        </div>
        <div class="right">
          <div class="tip">
            <div class="icon">
              <img
                src="@/assets/platform/icon_2.png"
                alt=""
              >
              <span>诉求处理数量汇总：</span>
            </div>
            <div class="blocks">
              <div>
                <i style="background:#CECEBF;"></i>
                <span>村/社区</span>
              </div>
              <div>
                <i style="background:#50C3E8;"></i>
                <span>乡镇/街道</span>
              </div>
              <div>
                <i style="background:#5E6FFF;"></i>
                <span>相关部门</span>
              </div>
            </div>
          </div>
          <div class="chartlist">
            <ColumnChart
              :htmlId="'aa'"
              :data="columnChart"
              :isGroup="true"
              :color="['#CECEBF', '#50C3E8', '#5E6FFF']"
            ></ColumnChart>
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
              <span>访惠聚工作今日签到：</span>
            </div>
            <div class="blocks">
              <div>
                <i style="background:#FFE6A3;"></i>
                <span>应到</span>
              </div>
              <div>
                <i style="background:#FF7300;"></i>
                <span>实到</span>
              </div>
            </div>
          </div>
          <div class="chartlist">
            <ColumnChart
              :htmlId="'column2'"
              :data="columnChart"
              :isStack="true"
              :color="['#FF7300','#FFE6A3']"
            ></ColumnChart>
          </div>
        </div>
        <div class="right">
          <div class="item">
            <div class="tip">
              <div class="icon">
                <img
                  src="@/assets/platform/icon_2.png"
                  alt=""
                >
                <span>本周诉求类别汇总：</span>
              </div>
            </div>
            <div class="chartlist">
              <BarChart :htmlId="'barchart1'" :data="barChart"></BarChart>
            </div>
          </div>
           <div class="item">
            <div class="tip">
              <div class="icon">
                <img
                  src="@/assets/platform/icon_2.png"
                  alt=""
                >
                <span>诉求处理平均时长：</span>
              </div>
            </div>
            <div class="chartlist">
              <BarChart :htmlId="'barchart2'" :data="barChart"></BarChart>
            </div>
          </div>
        </div>
      </div>

    </el-main>
  </el-container>
</template>

<script lang="ts">
import Vue from "vue";
import ChartHeader from "@/components/ChartHeader.vue";
import CircleChart from "@/components/CircleChart.vue";
import ColumnChart from "@/components/ColumnChart.vue";
import BarChart from "@/components/BarChart.vue";
export default {
  components: {
    ChartHeader,
    CircleChart,
    ColumnChart,
    BarChart
  },
  data() {
    return {
      circleChart: [
        {
          title: "本周",
          data: [{ type: "分类一", value: 12 }, { type: "分类二", value: 25 }]
        },
        {
          title: "本月",
          data: [{ type: "分类一", value: 27 }, { type: "分类二", value: 25 }]
        },
        {
          title: "本年",
          data: [{ type: "分类一", value: 27 }, { type: "分类二", value: 25 }]
        },
        {
          title: "总计",
          data: [{ type: "分类一", value: 27 }, { type: "分类二", value: 25 }]
        }
      ],
      columnChart: [
        {
          city: "石家庄",
          type: "水果",
          value: 14500
        },
        {
          city: "石家庄",
          type: "米面",
          value: 8500
        },
        {
          city: "石家庄",
          type: "特产零食",
          value: 10000
        },
        {
          city: "深圳",
          type: "水果",
          value: 9000
        },
        {
          city: "深圳",
          type: "米面",
          value: 8500
        },
        {
          city: "深圳",
          type: "特产零食",
          value: 11000
        },
        {
          city: "深圳",
          type: "茶叶",
          value: 6000
        }
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
    flex-direction: column;
    justify-content: space-between;
    background: #0f1948;
    .top {
      height: 35%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .left {
        width: 42%;
        height: 100%;
        background: url("../../../assets/platform/pic_2.png") no-repeat;
        background-size: 100% 100%;
        // display: flex;
        // align-items: center;
        .tip {
          width: 100%;
          height: 20%;
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
          .blocks {
            display: flex;
            div {
              display: flex;
              align-items: center;
              margin-right: 20px;
              i {
                width: 20px;
                height: 14px;
              }
              span {
                font-size: 12px;
                color: #cfdcff;
                padding-left: 5px;
              }
            }
          }
        }
        .chartlist {
          height: 80%;
          display: flex;

          .item {
            width: 25%;
            height: 100%;
          }
        }
      }
      .right {
        width: 56%;
        height: 100%;
        background: url("../../../assets/platform/pic_3.png") no-repeat;
        background-size: 100% 100%;
        .tip {
          width: 100%;
          height: 20%;
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
          .blocks {
            display: flex;
            div {
              display: flex;
              align-items: center;
              margin-right: 20px;
              i {
                width: 20px;
                height: 14px;
                background: #cecebf;
                border-radius: 7px;
              }
              span {
                font-size: 12px;
                color: #cfdcff;
                padding-left: 5px;
              }
            }
          }
        }
        .chartlist {
          height: 80%;
          display: flex;
          padding: 20px;
          box-sizing: border-box;
          // .item {
          //   width: 25%;
          //   height: 100%;
          // }
        }
      }
    }
    .bottom {
      height: 61%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .left {
        width: 49%;
        height: 100%;
        background: url("../../../assets/platform/pic_4.png") no-repeat;
        background-size: 100% 100%;
        .tip {
          width: 100%;
          height: 15%;
          padding: 0 20px;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          // justify-content: space-between;
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
          .blocks {
            display: flex;
            div {
              display: flex;
              align-items: center;
              margin-right: 20px;
              i {
                width: 46px;
                height: 14px;
                // background: #cecebf;
                border-radius: 7px;
              }
              span {
                font-size: 12px;
                color: #cfdcff;
                padding-left: 5px;
              }
            }
          }
        }
        .chartlist {
          height: 80%;
          display: flex;
          padding: 20px;
          box-sizing: border-box;
          // .item {
          //   width: 25%;
          //   height: 100%;
          // }
        }
      }
      .right {
        width: 49%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .item {
          width: 48%;
          height: 100%;
          background: url("../../../assets/platform/pic_5.png") no-repeat;
          background-size: 100% 100%;
          .tip {
            width: 100%;
            height: 15%;
            padding: 0 20px;
            box-sizing: border-box;
            display: flex;
            align-items: center;
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
            height: 80%;
            display: flex;
            padding: 20px;
            box-sizing: border-box;
            // .item {
            //   width: 25%;
            //   height: 100%;
            // }
          }
        }
      }
    }
  }
}
</style>

