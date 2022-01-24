<template>
  <el-container>
    <el-aside
      class="el-aside"
      width="200px"
    >
      <div class="logoBox">
        <div class="toggle">
          <img src="@/assets/images/icon_14.png">
        </div>
        <div class="avatar">
          <img src="@/assets/images/pic_1.png">
        </div>
      </div>
      <div class="menu">
        <div
          class="menu-item"
          v-for="(item,index) in menus"
          :key="index"
        >
          <router-link
            :to="item.path"
            tag="li"
            active-class="active"
          >
            <i>
              <img
                :src="item.icon"
                alt=""
              />
              <!-- <img src="@/assets/images/icon_1.png" alt=""> -->
            </i>
            <span>{{item.name}}</span>
          </router-link>
        </div>
      </div>
      <!-- <el-menu
                      mode="vertical"
                      class="el-menu-vertical-demo"
                      :collapse="isCollapse"
                      background-color="#0f3d5f"
                  >
                      <el-menu-item
                          v-for="(item,index) in menus"
                          :key="index"
                      >
                         
                      </el-menu-item>
                  </el-menu> -->
    </el-aside>
    <el-container>
      <el-header>
        <ToolBar></ToolBar>
      </el-header>
      <el-main>
        <div class="main">
          <router-view></router-view>
        </div>
      </el-main>
    </el-container>

    <el-dialog
      :visible.sync="dialogTableVisible"
      title="到期提醒"
      center
      width="80%"
      custom-class="dialog"
    >
    <Remind></Remind>
    </el-dialog>
  </el-container>
</template>

<script>
import ToolBar from "@/components/ToolBar.vue";
import Remind from "@/components/Remind.vue";
import { listMenu } from "@/api/system/menu";
export default {
  components: {
    ToolBar,
    Remind
  },
  data() {
    return {
      dialogTableVisible:true,
      isCollapse: false,
      activeIndex: "appeal",
      menus: [
        {
          name: "诉求处理",
          icon: require("@/assets/images/icon_1.png"),
          path: "appeal"
        },
        {
          name: "村/社区处理",
          icon: require("../assets/images/icon_2.png"),
          path: "village"
        },
        {
          name: "乡/街道处理",
          icon: require("../assets/images/icon_3.png"),
          path: "township"
        },
        {
          name: "职能部门处理",
          icon: require("@/assets/images/icon_4.png"),
          path: "department"
        },
        {
          name: "包联入户",
          icon: require("@/assets/images/icon_5.png"),
          path: "blrh"
        },
        {
          name: "干部人员管理",
          icon: require("@/assets/images/icon_6.png"),
          path: "cardmanage"
        },
        {
          name: "包联群众",
          icon: require("@/assets/images/icon_7.png"),
          path: "blqz"
        },
        {
          name: "系统设置",
          icon: require("@/assets/images/icon_8.png"),
          path: "system"
        },
        {
          name: "菜单管理",
          icon: require("@/assets/images/icon_8.png"),
          path: "menus"
        },
        {
          name: "chart1",
          icon: require("@/assets/images/icon_8.png"),
          path: "chart1"
        },
          {
          name: "chart2",
          icon: require("@/assets/images/icon_8.png"),
          path: "chart2"
        },
        {
          name: "chart3",
          icon: require("@/assets/images/icon_8.png"),
          path: "chart3"
        }
      ]
    };
  },
  created(){
    // this.showRemind()
    this.authJwt.signJwt('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDc4MDBkODhiMjE3MDhjYmZjNWZmMDUiLCJwcm92aWRlcnMiOltdLCJyb2xlcyI6WyJ1c2VyX2Nyb3dkIiwidXNlcl9jYWRyZXMiLCJhZG1pbl92aWxsYWdlIiwiYWRtaW5fdG93bnMiLCJhZG1pbl9jb3VudHkiLCJzdXBlciJdLCJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjE4NDc3MjcyLCJleHAiOjE2MTg0ODA4NzJ9.zoxevQTq6fUm2-RtTjAHAl8IdyO9Z0qsg8TrwH4dWSw');
    console.log(this.authJwt);
    listMenu({},{});
  },
  methods:{
    showRemind(){
      this.dialogTableVisible=true;
    }
  }
};
</script>

<style lang="scss" scoped>
.el-container {
  height: 100%;
  width: 100%;
  .el-aside {
    height: 100%;
    padding: 0;
    background: #0f3d5f;
    .logoBox {
      position: relative;
      height: 134px;
      background: #0f3d5f;
      display: flex;
      align-items: center;
      justify-content: center;
      border-bottom: 1px solid #fff;
      .toggle {
        position: absolute;
        top: 22px;
        right: 10px;
        img {
        }
      }
      .avatar {
        width: 78px;
        height: 78px;
        border-radius: 50%; // padding: 5px;
        // box-sizing: border-box;
        // background: rgba($color: #0f3d5f, $alpha: 0.7);
        img {
          width: 100%;
          height: 100%;
        }
        .box {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          padding: 5px;
          box-sizing: border-box;
          background: rgba($color: #0f3d5f, $alpha: 0.4);
        }
      }
    }
    .menu {
      // background: #0f3d5f;
      // height: 100%; //
      width: 100% !important;
      box-sizing: border-box; //   min-height: 400px;
      .menu-item {
        li {
          height: 100%;
          display: flex;
          align-items: center;
          padding: 0 25px;
          height: 50px;
          background: url("../assets/images/icon_10.png") no-repeat 170px center;
          background-size: auto 10px;
          cursor: pointer;
          i > img {
            height: 16px;
            width: 16px;
            margin-right: 10px;
          }
          span {
            font-size: 14px;
            color: rgb(191, 203, 217);
          }
        }
        li:hover {
          background: #051f33 url("../assets/images/icon_9.png") no-repeat 170px
            center;
          background-size: auto 10px;
          span {
            color: #fff;
            font-weight: 500;
          }
        }
        .active {
          background: #051f33 url("../assets/images/icon_9.png") no-repeat 170px
            center;
          background-size: auto 10px;
          span {
            color: #fff;
            font-weight: 500;
          }
        }
      }
    }
  }
  .el-header {
    background: #fff;
  }
  .el-container {
    background: #f2f5f8;
  }
  .main {
    background: #fff;
    height: 100%;
  }
 
}
</style>

