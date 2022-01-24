<template>
    <section>
        <div class="title">于田县政务服务后台管理</div>
        <div class="right">
            <div class="iconList">
                <el-badge :value="3">
                    <img src="@/assets/images/icon_11.png">
                </el-badge>
            </div>
            <div class="iconList">
                <img src="@/assets/images/icon_12.png">
            </div>
            <div class="iconList">
                <img src="@/assets/images/icon_13.png">
            </div>
        </div>
    </section>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class HelloWorld extends Vue {
  @Prop()
  private msg!: string;
}
</script>

诉求处理
Appeal handling
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
section {
    height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .title {
    font-size: 22px;
    // font-family: SourceHanSansCN-Bold, SourceHanSansCN;
    font-weight: bold;
    color: #1e87f0;
    line-height: 33px;
    letter-spacing: 1px;
  }
  .right {
      display: flex;
      align-items: center;
    .iconList {
        margin-left: 20px;
      img {
        height: 27px;
      }
    }
  }
}
</style>
