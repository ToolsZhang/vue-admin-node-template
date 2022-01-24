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
import { Bar } from "@antv/g2plot";
export default Vue.extend({
  props: {
    htmlId: null,
    data: null,
    title: "",
    //显示方式 isGroup分组柱状图   isStack堆积柱状图
    isGroup: null,
    isStack: null
  },

  mounted() {
    this.create();
  },
  methods: {
    create() {
      const data = this.data;

      const barPlot = new Bar(this.htmlId, {
        data,
        xField: "sales",
        yField: "type",
        color:'#2AD0FF',
        autoFit: true,
        maxBarWidth: 10,
        barStyle: { radius: [20, 20, 0, 0] },
         tooltip: false,
        label: {
          // 可手动配置 label 数据标签位置
          position: "right", // 'left', 'middle', 'right'
          offset: 4,
          style: {
            fill: "#CFDCFF"
          }
        },
        xAxis: {
          label:{
            style:{
              fill:"#CFDCFF"
            }
          },
          grid:null,
          line:{
           style:{
              stroke:'#29A4FF',
               lineWidth: 2,
           }
          }
        },
        yAxis:{
            label:{
            style:{
              fill:"#CFDCFF",
              fontSize:12
            }
          },
          line:{
           style:{
              stroke:'#29A4FF',
               lineWidth: 2,
           }
          },
          tickLine:null
        }
      });

      barPlot.render();
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


