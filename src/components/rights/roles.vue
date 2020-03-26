<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card>
      <el-row class="add-btn-contain">
        <el-col>
          <!-- 添加按钮 -->
          <el-button type="primary" size="mini" @click="isShowAddForm = true" plain>添加角色</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <!-- 角色展示表单 -->
          <el-table :data="roleList" stripe border>
            <el-table-column type="expand">
              <template slot-scope="data">
                <el-row
                  class="vcenter"
                  v-for="(item1, index) in data.row.children"
                  :key="item1.id"
                  :class="index == 0 ? '' : 'bdtop'"
                >
                  <!-- 一级菜单 -->
                  <el-col :span="4">
                    <el-tag
                      type="danger"
                      closable
                      @close="remove(data.row, item1.id)"
                    >{{ item1.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="20">
                    <el-row
                      class="vcenter"
                      v-for="(i, index2) in item1.children"
                      :key="i.id"
                      :class="index2 == 0 ? '' : 'bdtop'"
                    >
                      <!-- 二级菜单 -->
                      <el-col :span="5">
                        <el-tag
                          type="success"
                          closable
                          @close="remove(data.row, i.id)"
                        >{{ i.authName }}</el-tag>
                        <i class="el-icon-caret-right"></i>
                      </el-col>

                      <el-col :span="19">
                        <!-- 三级菜单 -->
                        <el-tag
                          type="wraning"
                          v-for="i2 in i.children"
                          :key="i2.id"
                          closable
                          @close="remove(data.row, i2.id)"
                        >{{ i2.authName }}</el-tag>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </template>
            </el-table-column>

            <!-- 展开列 -->
            <el-table-column label="序号" type="index"></el-table-column>
            <el-table-column label="角色名称" prop="roleName"></el-table-column>
            <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
            <el-table-column label="操作" width="500px">
              <template slot-scope="data">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="editHandel(data.row)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="deleRoles(data.row.id)"
                >删除</el-button>
                <el-button
                  type="warning"
                  size="mini"
                  icon="el-icon-s-tools"
                  @click="manageRightsBtn(data.row)"
                >分配权限</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-card>

    <!-- 添加角色表单 -->
    <el-dialog title="添加角色" :visible.sync="isShowAddForm" :close-on-click-modal="true">
      <el-form :model="addFormData" :rules="addRules" ref="addFormRef" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addFormData.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addFormData.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowAddForm = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑用户表单 -->
    <el-dialog title="编辑用户" :visible.sync="isShowEditForm">
      <el-form :model="editFormData" :rules="editRules" ref="editFormRef" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editFormData.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editFormData.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowEditForm = false">取 消</el-button>
        <el-button type="primary" @click="editRoles">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 树形结构 分配权限 -->
    <el-dialog title="分配权限" :visible.sync="isShowRightsTree" @close="roleTreeClosed">
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        default-expand-all
        node-key="id"
        ref="tree"
        :default-checked-keys="defaultArr"
      ></el-tree>

      <span slot="footer" class="dialog-footer" @click="isShowRightsTree = false">
        <el-button>取 消</el-button>
        <el-button type="primary" @click="upDateRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    this.getRoleList();
    this.getAllRightsList();
  },
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
      roleList: null,
      rightsList: null,
      isShowAddForm: false,
      isShowEditForm: false,
      isShowRightsTree: false,
      addFormData: {
        roleName: null,
        roleDesc: null
      },
      //添加用户角色校验规则
      addRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          {
            min: 2,
            max: 9,
            message: "角色名在 2 ~ 9 个字符之间",
            trigger: "blur"
          }
        ],
        roleDesc: [
          {
            max: 20,
            message: "角色描述不多于 20 个字符之间",
            trigger: "blur"
          }
        ]
      },
      editFormData: {
        id: "",
        roleName: "",
        roleDesc: ""
      },
      editRules: {
        roleName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 2,
            max: 9,
            message: "用户名在 2 ~ 9 个字符之间",
            trigger: "blur"
          }
        ],
        roleDesc: [
          {
            min: 0,
            max: 20,
            message: "角色描述不多于 20 个字符之间",
            trigger: "blur"
          }
        ]
      },
      //树形结构数据
      treeProps: {
        label: "authName",
        children: "children"
      },
      //默认树形结构中需要勾选的项 集合;
      defaultArr: [],
      //当前分配权限的角色ID
      curRoleId: ""
    };
  },
  methods: {
    async getRoleList() {
      const { data: res } = await this.$http.rolesList();
      // console.log(res);
      if (res.meta.status == 200) {
        //获取成功
        this.roleList = res.data;
      }
    },
    //获取所有权限列表
    async getAllRightsList() {
      this.$http
        .rightsList("tree")
        .then(({ data: res }) => {
          this.rightsList = res.data;
        })
        .catch(err => err);
    },
    addRoles() {
      this.$refs["addFormRef"].validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http.addRoles(this.addFormData);
          console.log(res);
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
          //关闭添加表单
          this.isShowAddForm = false;
          //从新获取角色列表
          this.getRoleList();
        } else {
          this.$message.error("添加失败");
        }
      });
    },
    //保存要编辑数据
    editHandel(data) {
      for (let prop in this.editFormData) {
        this.editFormData[prop] = data[prop];
      }
      console.log(data);
      this.isShowEditForm = true;
    },
    //编辑角色
    editRoles() {
      this.$refs["editFormRef"].validate(async valid => {
        if (valid) {
          // console.log("编辑用户,发送请求",this.editFormData);
          const { data: res } = await this.$http.editRoles(this.editFormData);
          console.log(res);
          if (res.meta.status == 200) {
            this.$message.success("修改成功");
            this.$refs["editFormRef"].resetFields();

            this.getRoleList();
          } else {
            this.$message.error("修改失败");
            this.refs["editFormRef"].clearValidate();
          }
          this.isShowEditForm = false;
        }
      });
    },
    //删除角色
    deleRoles(id) {
      console.log(id);
      this.$http
        .deleRoles(id)
        .then(({ data: res }) => {
          console.log(res);
          this.$message.success(res.meta.msg);

          this.getRoleList();
        })
        .catch(err => {
          this.$message.error(err);
        });
    },
    //特定权限移除
    remove(role, id) {
      console.log(role.id, id);
      this.$http
        .removeRights(role.id, id)
        .then(({ data: res }) => {
          console.log(res);
          if (res.meta.status == "200") {
            this.$message.success(res.meta.msg);
            //更新数据,重新渲染
            role.children = res.data;
          }
        })
        .catch(err => err);
    },
    //权限分配按钮监听
    manageRightsBtn(role) {
      this.defaultArr = [];
      //获取选中的三级权限的id数组
      console.log(role);
      this.getKeyArr(role, this.defaultArr);
      console.dir(this.defaultArr);
      console.log(role.id);

      this.curRoleId = role.id;

      this.isShowRightsTree = true;
    },
    //获取默认需要勾选的树形结构中的第三级标签 id 值 ;
    getKeyArr(data, arr) {
      // 三姐节点不包含children属性
      if (!data.children) {
        return arr.push(data.id);
      }

      data.children.forEach(el => {
        this.getKeyArr(el, arr);
      });
    },
    //权限分配对话框的关闭 监听
    roleTreeClosed() {
      this.defaultArr = [];
      this.curRoleId = "";
      console.log("关闭权限分配");
    },
    //上传分配的权限数据
    async upDateRights() {
      console.log(this.$refs["tree"]);
      const keys = [
        ...this.$refs["tree"].getHalfCheckedKeys(),
        ...this.$refs["tree"].getCheckedKeys()
      ];
      const str = keys.join(",");
      const { data: res } = await this.$http.setRoleRights(this.curRoleId, str);
      if (res.meta.status == 200) {
        //重新获取角色数据
        this.getRoleList();

        this.$message.success("更新权限成功!");
      } else {
        this.$message.info(res.meta.msg);
      }

      this.isShowRightsTree = false;
    }
  }
};
</script>
<style lang="less" scoped>
.add-btn-contain {
  padding-bottom: 20px;
}
.el-breadcrumb {
  padding-bottom: 20px;
}
.el-tag {
  margin: 6px;
}
.vcenter {
  display: flex;
  align-items: center;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
</style>
