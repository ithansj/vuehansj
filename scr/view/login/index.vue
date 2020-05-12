<template>
  <div class="login-container">
    <el-form :rules="rules" ref="form" :model="form" label-width="80px" class="login-form">
      <h2 class="login-title">会员管理系统</h2>
      <el-form-item label="账号" prop="username">
        <el-input v-model="form.username" placeholder="请输入账号"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="form.password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('form')">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { login, getUserInfo } from "@/api/login";
export default {
  data: function() {
    return {
      form: {
        
      },
      rules: {
        username: [
          { required: true, message: "请输入有效账号", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入有效密码", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //验证账号和密码是否通过
          login(this.form.username, this.form.password).then(response => {
            let res = response.data;
            console.log(res);
            if (res.flag) {
              //获取用户信息
              getUserInfo(res.data.token).then(response => {
                let resUser = response.data;
                if (resUser.flag) {
                  localStorage.setItem(
                    "hanshijiang-cms-user",
                    JSON.stringify(resUser.data)
                  );
                  localStorage.setItem("hanshijiang-cms-token", res.data.token);
                  //前往首页,编程式导航
                  this.$router.push("/");
                } else {
                  //获取信息失败，弹出警告
                  this.$message({
                    message: resUser.message,
                    type: "warning"
                  });
                }
              });
            } else {
              //验证失败，弹出警告
              this.$message({
                message: res.message,
                type: "warning"
              });
            }
          });
        } else {
          console.log("error submit!");
          return false;
        }
      });
    }
  }
};
</script>

<style scoped>
.login-form {
  width: 350px;
  margin: 160px auto;
  background-color: rgb(255, 255, 255, 0.8);
  padding: 30px;
  border-radius: 20px;
}
.login-container {
  position: absolute;
  width: 100%;
  height: 100%;
  /* background: url(); */
  overflow: hidden;
}
.login-title {
  text-align: center;
  color: #303133;
}
</style>