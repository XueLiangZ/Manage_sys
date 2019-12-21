<template>
  <el-container class="home-page">
    <el-header>
      <!-- logo区域 -->
      <div class="logo">
           <img class="logo-pic" src="../assets/logo.png" alt="">
           <span class="logo-title">信息管理系统</span>
      </div>
      <!-- 退出登录按钮 -->
      <el-button type="info" size="small" plain @click="logOut">退出</el-button>
    </el-header>
    <el-container>
      <!-- 左边树形栏 -->
      <el-aside width="200px">Aside</el-aside>
      <!-- 主体区 -->
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  methods:{
    logOut(){
      window.sessionStorage.setItem('token','');
      this.$router.push('/login');
    }
  }
};
</script>

<style lang="less" scoped >
.home-page{
  height: 100%;
}

.el-header{
  background: linear-gradient(to right ,rgba(33,33,33,1),rgba(38,166,154,1));
  display: flex;
  justify-content: space-between;
  align-items: center;
  .logo{
    display: flex;
    align-items: center;
    .logo-pic{
      width: 30px;
    }
    .logo-title{
      font-size: 20px;
      font-weight: 700;
      margin-left: 6px;
      letter-spacing: 0.2rem;
      color: azure
    }
  }
};
.el-aside{
  background-color: rgba(33,33,33,0.6);
}
</style>
