<template>
  <div class="categories-wrap">
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card class="card-box">
      <!-- 添加分类按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addCategory()">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 表单区域 -->
      <el-row class="table-contain">
        <el-col>
          <tree-table
            :data="cateList"
            :columns="columns"
            show-index
            index-text="序号"
            :selection-type="false"
            :expand-type="false"
            border
          >
            <!-- 是否有效列模板 -->
            <template slot="isok" slot-scope="data">
              <i
                class="el-icon-success"
                v-if="data.row.cat_deleted"
                style="color: lightgreen;font-Size: 16px;"
              ></i>
              <i
                class="el-icon-error"
                v-else
                style="color: red;font-Size: 16px;"
              ></i>
            </template>

            <!-- 排序列模板 -->
            <template slot="level" slot-scope="data">
              <el-tag type="warning" v-if="data.row.cat_level == 0"
                >一级</el-tag
              >
              <el-tag type="danger" v-else-if="data.row.cat_level == 1"
                >二级</el-tag
              >
              <el-tag type="success" v-else>三级</el-tag>
            </template>

            <!-- 操作列模板 -->
            <template slot="order" slot-scope="data">
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-edit"
                @click="editCatagroies(data.row)"
                >编辑</el-button
              >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="deleteCatagroies(data.row)"
                >删除</el-button
              >
            </template>
          </tree-table>
        </el-col>
      </el-row>

      <!-- 分页 -->
      <el-row>
        <el-col>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="queryInfo.pagenum"
            :page-sizes="[5, 8, 12]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalNum"
          >
          </el-pagination>
        </el-col>
      </el-row>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible="isShowCateDialog"
      width="80%"
      @close="handleClose"
    >
      <el-form
        :model="cateDate"
        :rules="cateRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="cateDate.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="分类父级:">
          <!-- 联级选择框 -->
          <el-cascader
            :options="parentCateList"
            :props="cascaderProps"
            v-model="selectedCateId"
            clearable
            @change="changeCateId"
          ></el-cascader>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowCateDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmAddCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  mounted() {
    this.getCateList();
  },
  data() {
    return {
      queryInfo: {
        type: null, //查询分类级别
        pagenum: 1, //当前页码
        pagesize: 5 //每页显示条数
      },
      cateList: [], //商品分类列表
      totalNum: 0, //商品总数据量
      // treetable 模板列数据
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
          minWidth: "150px"
        },
        {
          label: "是否有效",
          prop: "cat_deleted",
          minWidth: "100px",
          // 将当前定义为模板列
          type: "template",
          // 当前使用的模板名称
          template: "isok"
        },
        {
          label: "排序",
          minWidth: "100px",
          type: "template",
          template: "level"
        },
        {
          label: "操作",
          minWidth: "200px",
          type: "template",
          template: "order"
        }
      ],
      isShowCateDialog: false,
      //分类对话框  表单数据
      cateDate: {
        cat_name: "",
        cat_pid: 0, //父分类id
        cat_level: 0 //分类等级
      },
      cateRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
          {
            min: 3,
            max: 8,
            type: "string",
            message: "分类名称为 3 ~ 8 个字符",
            trigger: ["blur", "change"]
          }
        ]
      },
      //父级分类列表
      parentCateList: [],
      selectedCateId: [],
      //指定级联选择器的配置对象
      cascaderProps: {
        label: "cat_name",
        value: "cat_id",
        children: "children",
        expandTrigger: true,
        checkStrictly: true
      }
    };
  },
  methods: {
    getCateList() {
      this.$http.getCateList(this.queryInfo).then(({ data: res }) => {
        if (res.meta.status == 200) {
          this.cateList = res.data.result;
          this.totalNum = res.data.total;
          this.$message.success("获取商品数据成功");
        } else {
          this.$message.info(res.meta.msg);
        }
      });
    },
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val;
      this.getCateList();
    },
    handleSizeChange(val) {
      this.queryInfo.pagesize = val;
      this.getCateList();
    },
    //  添加 商品类别 按钮
    addCategory() {
      this.isShowCateDialog = true;

      var query = { type: 2 };
      this.$http
        .getCateList(query)
        .then(({ data: res }) => {
          if (res.meta.status == 200) {
            this.parentCateList = res.data;
            console.dir(res.data);
          }
        })
        .catch(err => err);
    },
    changeCateId() {
      if (this.selectedCateId.length != 0) {
        //设置父分类id
        var len = this.selectedCateId.length;
        this.cateDate.cat_pid = this.selectedCateId[len - 1];
        console.log(this.cateDate.cat_pid);

        // 设置分类等级
        this.cateDate.cat_level = len;
      } else {
        // 添加一级分类
        this.cateDte.cat_pid = 0;
        this.catDate.cat_level = 0;
      }
    },
    // 添加分类dialog 关闭前处理函数
    handleClose() {
      this.$refs["addCateFormRef"].resetFields();
      this.cateDate.cat_level = 0;
      this.cateDate.cat_name = "";
      this.selectedCateId = null;
    },
    //确认添加分类
    confirmAddCate() {
      //  表单校验
      this.$refs["addCateFormRef"].validate(valid => {
        if (!valid) return;
        this.$http
          .addCategory(this.cateDate)
          .then(({ data: res }) => {
            if (res.meta.status == 201) {
              this.$message.success(res.meta.msg);
              this.getCateList();
              this.isShowCateDialog = false;
            } else {
              this.$message.info(res.meta.msg);
            }
          })
          .catch(err => err);
      });
    },
      // 编辑删除效果未实现
    //  编辑 商品类别 按钮
    editCatagroies(cate) {
      console.log(cate);
    },
    //  删除 商品类别 按钮
    deleteCatagroies(cate) {}
  }
};
</script>

<style>
.card-box {
  margin-top: 20px;
}
.table-contain {
  margin: 20px 0;
}

.el-cascader {
  width: 100%;
}
.el-cascader-menu__list {
  max-height: 200px;
}
</style>
