<template>
  <div class="user-wrp">
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <!-- 搜索区域 -->

      <el-row :gutter="30">
        <el-col :span="8">
          <el-input
            class="search-box"
            size="small"
            v-model="params.query"
            clearable
            placeholder="请输入内容"
            @clear="getUserList"
          >
            <el-button
              slot="append"
              size="small"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" size="small" @click="isShowDialog = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>

      <!-- 表格区域 -->
      <el-table
        :data="userData.users"
        style="width: 100%"
        :stripe="true"
        :border="true"
      >
        <el-table-column type="index" label=""> </el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <!-- 作用域插槽   状态按钮列-->
          <template slot-scope="data">
            <el-switch
              v-model="data.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="uStateChange(data.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <!-- 作用域插槽   操作按钮列 -->
          <template slot-scope="data">
            <!-- 编辑 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editHandel(data.row)"
            ></el-button>
            <!-- 删除 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteHandel(data.row.id)"
            ></el-button>
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top-end"
              :enterable="false"
            >
              <!-- 分配角色 -->
              <el-button
                type="warning"
                icon="el-icon-s-tools"
                size="mini"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="params.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="params.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="userData.total"
      >
      </el-pagination>
    </el-card>
    <!-- 增加用户 dialog -->
    <el-dialog title="添加用户" :visible="isShowDialog" width="40%">
      <el-form
        :model="addFormData"
        :rules="addRules"
        ref="addFormRef"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addFormData.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addFormData.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addFormData.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addFormData.mobile"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelAddUser">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑用户 dialog -->
    <el-dialog title="编辑用户" :visible="isShowEditForm" width="40%">
      <el-form
        :model="editFormData"
        :rules="addRules"
        ref="editFormRef"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editFormData.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editFormData.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="editFormData.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelEditUser">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { async } from "q";
export default {
  data() {
    var checkEmail = (rule, val, cb) => {
      // 1.由大小写字母，数字，"_ - @" 组成；
      // 2.必须要有@，@两边都有内容，且两边的内容头尾均不为: " - _"
      // 3. " - _ ." 不允许连续使用
      // 4. 发现一般域名后缀 “.com”、".cn" 、".shop" ,新域名甚至会出现 “.cloud”、".fashion",至少2位

      var reg = /^[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*\.[a-z]{2,}$/;

      if (!val) {
        return cb(new Error("邮箱不能为空"));
      } else if (!reg.test(val)) {
        return cb(new Error("邮箱格式错误"));
      } else {
        return cb();
      }
    };

    var checkMobile = (rule, val, cb) => {
      // 表示以1开头，第二位可能是3/4/6/5/7/8/9等的任意一个，在加上后面的\d表示数字[0-9]的9位，总共加起来11位结束

      var reg = /^1[3|4|5|6|7|8|9]([0-9]{9})$/;

      if (!val) {
        return cb(new Error("电话不能为空"));
      } else if (!reg.test(val)) {
        return cb(new Error("电话格式错误"));
      } else {
        cb();
      }
    };

    return {
      params: {
        //搜索信息
        query: null,
        //当前页码
        pagenum: 1,
        //页容量
        pagesize: 5
      },
      userData: "",
      isShowDialog: false,
      // 添加用户数据
      addFormData: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      //添加用户表单校验规则
      addRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 9,
            message: "用户名在 3 ~ 9 个字符之间",
            trigger: "blur"
          }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            message: "密码应不少于 6 个字符",
            trigger: "blur"
          }
        ],
        email: [{ validator: checkEmail, trigger: "blur" }],
        mobile: [{ validator: checkMobile, trigger: "blur" }]
      },

      isShowEditForm: false,
      //编辑用户 数据
      editFormData: {
        id: "",
        username: "",
        email: "",
        mobile: ""
      }
    };
  },
  created() {
    this.getUserList();
  },

  methods: {
    async getUserList() {
      const { data: res } = await this.$http.userlist(this.params);

      if (res.meta.status == 200) {
        this.userData = res.data;
        console.log(res.data);
      } else {
        this.$message.error("获取用户信息失败");
      }
    },
    //改变页容量
    handleSizeChange(val) {
      console.log(val);
      this.params.pagesize = val;
      this.getUserList();
    },
    //改变当前页码
    handleCurrentChange(val) {
      console.log(val);
      this.params.pagenum = val;
      this.getUserList();
    },
    //改变用户状态
    async uStateChange(user) {
      //调用接口
      const { data: res } = await this.$http.userstate({
        uId: user.id,
        type: user.mg_state
      });
      // console.log(res)
      if (res.meta.status == 200) {
        return this.$message.success("修改用户状态成功");
      } else {
        return this.$message.error("修改用户状态失败");
      }
    },
    //添加用户

    addUser() {
      this.$refs["addFormRef"].validate(async valid => {
        // console.log(valid);
        if (valid) {
          const { data: res } = await this.$http.adduser(this.addFormData);
          // console.log(res);
          if (res.meta.status == 201) {
            this.$message.success(res.meta.msg);
            console.log(this.userData);
            //清除表单校验  和表单信息
            this.$refs["addFormRef"].resetFields();
          } else {
            this.$message(res.meta.msg);
            //清除表单校验
            this.$refs["addFormRef"].clearValidate();
          }
        } else {
          this.$message.error("添加失败");
        }
      });

      this.isShowDialog = false;
    },

    cancelAddUser() {
      this.isShowDialog = false;
      this.$refs["addFormRef"].resetFields();
    },

    editHandel(data) {
      this.editFormData = data;
      // console.log(data);
      this.isShowEditForm = true;
    },
    //编辑用户
    editUser() {
      //表单校验
      this.$refs["editFormRef"].validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http.edituser(this.editFormData);
          // console.log(res);
          if (res.meta.status == 200) {
            //重新获取用户数据列表
            this.getUserList();

            this.$refs["editFormRef"].clearValidate();
            this.isShowEditForm = false;

            return this.$message.success(res.meta.msg);
          } else {
            return this.$message.error(res.meta.msg);
          }
        }
      });
    },

    cancelEditUser() {
      this.isShowEditForm = false;
      //清除表单校验
      this.$refs["editFormRef"].clearValidate();
      this.$message.info("已取消修改");
    },

    //删除用户
    async deleteHandel(id) {
      //等待用户确认删除信息
      const result = await this.$messageBox
        .confirm("此操作将永久删除该文件, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .catch(res => res);

      if (result == "confirm") {
        //用户确认删除
        const { data: res } = await this.$http.deleteuser(id);
        console.log(res);
        if (res.meta.status == 200) {
          //删除成功
          this.$message.success(res.meta.msg);
          this.getUserList();
        } else {
          //删除失败
          this.$message.info(res.meta.msg);
        }
      } else {
        //用户取消删除
        this.$message.info("已取消删除");
      }
    }
  }
};
</script>

<style lang="less">
.el-card {
  margin-top: 20px;
  box-shadow: 0 1px 3px #eee !important;

  .search-box {
    font-size: 16px !important;
  }

  .el-table,
  .el-pagination {
    margin-top: 20px;

    .el-table_1_column_1 {
      text-align: center;
    }
  }
}
</style>
