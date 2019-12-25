<template>
  <el-container class="home-page">
    <el-header>
      <!-- logo区域 -->
      <div class="logo">
        <img class="logo-pic" src="../assets/logo.png" alt="" />
        <span class="logo-title">信息管理系统</span>
      </div>
      <!-- 退出登录按钮 -->
      <el-button type="info" size="small" plain @click="logOut">退出</el-button>
    </el-header>
    <el-container>
      <!-- 左边树形栏 -->
      <el-aside :width="isCollapse ? '64px':'200px'">
        <!-- 折叠按钮 -->
        <div class="btn-collpase" @click="changeCollpase">||||</div>
        <!-- 树形菜单 -->
        <el-menu
          background-color="#455a64"
          text-color="#fff"
          active-text-color="#409eff"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router='true'
          :default-active ="activeNavState"
        >
          <!-- 一级菜单  -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menuData"
            :key="item.id"
          >
            <template slot="title">
              <i class="iconfont" :class="iconList[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!--  二级菜单  -->
            <el-menu-item
              :index="'/'+child.path"
              v-for="child in item.children"
              :key="child.id"
              @click="changeActiveNavStates()"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ child.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体区 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  created() {
    this.getList();
    this.changeActiveNavStates();
  },
  data() {
    return {
      menuData: null,
      iconList: {
        "125": "icon-users",
        "103": "icon-tijikongjian",
        "101": "icon-shangpin",
        "102": "icon-danju",
        "145": "icon-baobiao"
      },
      isCollapse: false,
      activeNavState: '',
    };
  },
  methods: {
    //登出,删除token
    logOut() {
      window.sessionStorage.clear();
      this.$router.push("/login");
      this.$message("你已退出登录");
    },

    //获取列表信息;
    async getList() {
      const { data: res } = await this.$http.getMenuList();
      if (res.meta.status == 200) {
        this.menuData = res.data;
        // console.log(res.data);
      }
    },
    //导航栏折叠
    changeCollpase() {
      this.isCollapse = !this.isCollapse;
    },
    //  更新当前激活的导航项,显示样式
    changeActiveNavStates(){
      console.log(this.$route.path)
      this.activeNavState = this.$route.path;
    }
  }
};
</script>

<style lang="less">
.home-page {
  height: 100%;
}

.el-header {
  background: linear-gradient(
    to right,
    rgba(33, 33, 33, 1),
    rgba(38, 166, 154, 1)
  );
  display: flex;
  justify-content: space-between;
  align-items: center;
  .logo {
    display: flex;
    align-items: center;
    .logo-pic {
      width: 30px;
    }
    .logo-title {
      font-size: 20px;
      font-weight: 700;
      margin-left: 6px;
      letter-spacing: 0.2rem;
      color: azure;
    }
  }
}
.el-aside {
  transition: width 400ms ease-in;
  background-color: #455a64;
  .el-menu {
    border-right: none;
  }
  .el-submenu__title {
    font-size: 16px;

    .iconfont {
      margin-right: 16px;
      font-size: 20px;
    }
  }
  .el-menu-item {
    font-size: 16px;
  }
}
.btn-collpase {
  background-color: #32373a;
  font-size: 16px;
  height: 24px;
  color: aliceblue;
  text-align: center;
  cursor: pointer;
  }
.btn-collpase:hover{
  color: orangered;
}
</style>
