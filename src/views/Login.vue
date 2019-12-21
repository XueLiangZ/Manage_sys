<template>
  <div class="login-page">
    <div class="container">
      <div class="pic">
        <img src="../assets/bg-4.jpg" alt="" />
      </div>
      <el-form
        class="form"
        :model="loginForm_data"
        size="medium"
        :rules="rules"
        ref="loginFormRef"
      >
        <!-- 账号 -->
        <el-form-item prop="username">
          <span class=""></span>
          <el-input
            v-model="loginForm_data.username"
            placeholder="请输入账号"
            prefix-icon="iconfont icon-user"
          >
          </el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm_data.password"
            placeholder="请输入密码"
            prefix-icon="iconfont icon-3702mima"
            type="password"
          ></el-input>
        </el-form-item>
        <!-- 按钮区 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //表单数据
      loginForm_data: {
        username: "admin",
        password: "123456"
      },
      //校验规则
      rules: {
        username: [
          { required: true, message: "请输入账号名", trigger: "blur" },
          { min: 3, max: 8, message: "长度在 3 到 8 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入登录密码", trigger: "blur" },
          { min: 6, message: "密码最少为 6 个字符", trigger: "blur" }
        ]
      }
    };
  },
  mounted() {
    // console.log(this)
  },
  methods: {
    //  重置表单 ($refs获得引用元素)
    resetForm() {
      this.$refs["loginFormRef"].resetFields();
    },

    //整个表单预校验 ,成功则发送请求
    login() {
      this.$refs["loginFormRef"].validate(async (valid, obj) => {
        //参一:校验结果(布尔值)
        if (valid) {
          const { data: res } = await this.$http.login(this.loginForm_data);
          // console.log(res);
          //登录  弹框
          if (res.meta.status == "200") {
            this.$message.success("登录成功");
            //保存登录成功的token值
            window.sessionStorage.setItem("token", res.data.token);
            //跳转页面
            this.$router.push("/home");
          } else {
            this.$message.error("登录失败");
            this.loginForm_data.username = "";
            this.loginForm_data.password = "";
          }
        }
      });
    }
  }
};
</script>

<style lang="less">
.login-page {
  width: 100%;
  height: 100%;
  background-color: #274a6c;

  .container {
    width: 630px;
    height: 420px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border: 1px solid #ccc;
    background-color: #fff;
    border-radius: 5px;

    .pic {
      width: 130px;
      height: 130px;
      padding: 20px;
      border-radius: 50%;
      box-shadow: 0 0 10px #999;
      margin: 0 auto;
      transform: translateY(-50%);
      background-color: #eee;

      img {
        height: 130px;
        width: 130px;
        border-radius: 50%;
      }
    }
    .form {
      padding: 0 80px;
      transform: translateY(-30px);
      .el-input__inner {
        height: 50px;
        font-size: 18px;
      }
      .btns {
        margin-top: 45px;
        display: flex;
        justify-content: flex-end;
      }
      .iconfont {
        padding-left: 5px;
      }
    }
  }
}
</style>
