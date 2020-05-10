<template>
  <div class="goods_params">
    <!--  面包屑区域	-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card class="card_box">
      <!-- 信息提示框 -->
      <el-alert
        title="注:只允许为第三级分类设置参数"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- 级联选择器 选择商品分类 -->
      <el-cascader
        v-model="selectedCateId"
        :options="cateList"
        :props="cateProps"
        @change="selectCateId"
      ></el-cascader>
    </el-card>
  </div>
</template>

<script>
export default {
  mounted() {
    this.getCateList();
  },
  data() {
    return {
      cateList: [],
      cateProps: {
        expandTrigger: "hover",
        label: "cat_name",
        children: "children"
      },
      selectedCateId: []
    };
  },

  methods: {
    getCateList() {
      console.log("~~~~~~~~~~~~~~~");
      this.$http
        .getAllCateList()
        .then(({ data: res }) => {
          if (res.meta.status != 200) {
            //	获取分类失败
            this.$message.warning(res.meta.msg);
          } else {
            this.cateList = res.data;
            console.dir(this.cateList);
          }
        })
        .catch(err => err);
    }
  },
  /**
   * 监听联级选择器 选中分类id的变化
   */
  selectCateId() {}
};
</script>

<style>
.card_box {
  margin-top: 20px;
}
</style>
