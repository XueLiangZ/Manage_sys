<template>
  <div class="rights-wrap">
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card class="card-box">
      <el-table height="80vh" :data="rolesData" :border="true" :stripe="true">
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column
          prop="level"
          label="权限等级
        "
        >
          <template slot-scope="data">
            <el-tag type="success" v-if="data.row.level === '0'">一级</el-tag>
            <el-tag type="warning" v-else-if="data.row.level === '1'"
              >二级</el-tag
            >
            <el-tag type="danger" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getRolesList();
  },
  data() {
    return {
      //角色列表数据
      rolesData: []
    };
  },
  methods: {
    //获取权限列表数据

    async getRolesList() {
      const { data: res } = await this.$http.rolesList("list");
      // console.log(res);
      if (res.meta.status == 200) {
        this.rolesData = res.data;
      } else {
        this.$message.info(res.meta.msg);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.rights-wrap {
  .card-box {
    overflow-y: auto;
    margin-top: 20px;
  }
}
</style>
