<template>
  <div
    :id="htmlId"
    class="content"
  >
    <div class="title">{{title}}</div>
  </div>
</template>

<script>
import Vue from "vue";
import { Pie } from "@antv/g2plot";
export default Vue.extend({
  props: {
    htmlId: null,
    data: null,
    title: ""
  },

  mounted() {
    this.create();
  },
  methods: {
    create() {
      const data = this.data;

      const piePlot = new Pie(this.htmlId, {
        appendPadding: 5,
        data,
        angleField: "value",
        colorField: "type",
        color: ["#CDB370", "#B684FF"],
        radius: 0.5,
        innerRadius: 0.9,
        autoFit: true,

        label: {
          type: "spider",
          labelHeight: 28,
          content: "{name}\n{percentage}",
          style: {
            fill: "#CFDCFF",
            fontSize: 12
          },
          rotate: true
        },
        legend: false,
        tooltip: false,
        // interactions: [
        //   { type: "element-selected" }
        //   //   { type: "element-active" }
        // ],

        statistic: {
          title: false,
          content: {
            style: {
              color: "#CFDCFF",
              whiteSpace: "pre-wrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              fontSize: "12px"
            }
          }
        }
      });

      piePlot.render();
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
    line-height: 40px;
    font-size: 14px;
    font-weight: 500;
    color: #cfdcff;
  }
}
</style>


