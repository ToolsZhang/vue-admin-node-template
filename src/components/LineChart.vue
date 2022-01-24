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
import { Line } from "@antv/g2plot";
export default Vue.extend({
  props: {
    htmlId: null,
    data: null,
    color:null
  },

  mounted() {
    this.create();
  },
  methods: {
    create() {
      const data = this.data;

      const linePlot = new Line(this.htmlId, {
        data,
        xField: "year",
        yField: "value",
        color: this.color,
        autoFit: true,
        lineStyle:{
            // fill:'#FA6400',
        },
        label: {
          // offsetY:-5,
          style:{
            fontSize: 14,
            fill:'#CFDCFF'
          }
        },
        point: {
          size: 3,
          // shape: "circle",
          style: {
            fill: "white",
            stroke: "#5B8FF9"
          }
        },
        xAxis: {
          label: {
            style: {
              fill: "#CFDCFF"
            }
          },
        
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
        },
        tooltip: false
      });

      linePlot.render();
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


