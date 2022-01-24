<template>
  <div
    :id="htmlId"
    class="content"
  >
    <!-- <div class="title">{{title}}</div> -->
  </div>
</template>

<script>
import Vue from "vue";
import { Column } from "@antv/g2plot";
export default Vue.extend({
  props: {
    htmlId: null,
    data: null,
    title: "",
    //显示方式 isGroup分组柱状图   isStack堆积柱状图
    isGroup: false,
    isStack: false,
    color: null,
    fillColor: null,
    xName: null,
    yName: null
  },

  mounted() {
    this.create();
  },
  methods: {
    create() {
      const data = this.data;

      const columnPlot = new Column(this.htmlId, {
        data,
        color: this.color,
        autoFit: true,
        xField: this.xName,
        yField: this.yName,
        seriesField: "type",
        isGroup: this.isGroup,
        isStack: this.isStack,
        columnStyle: {
          radius: [20, 20, 0, 0],
          fill: this.fillColor
        },
        barStyle: {},
        maxColumnWidth: 10,
        marginRatio: [0 - 0.8],
        tooltip: false,
        legend: false,
        xAxis: {
          label: {
            style: {
              fill: "#CFDCFF",
              fontSize: 12
            }
          },
          // grid:null,
          line: {
            style: {
              stroke: "#29A4FF",
              lineWidth: 2
            }
          }
        },
        yAxis: {
          label: {
            style: {
              fill: "#CFDCFF",
              fontSize: 12
            }
          },
          grid: null,
          line: {
            style: {
              stroke: "#29A4FF",
              lineWidth: 2
            }
          },
          tickLine: null
        }
      });

      columnPlot.render();
    }
  }
});
</script>

<style lang="scss" scoped>
.content {
  width: 100%;
  height: 100%;
  position: relative;
  .title {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    text-align: center;

    font-size: 14px;
    font-weight: 500;
    color: #cfdcff;
  }
}
</style>


