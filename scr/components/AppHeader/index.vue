<template>
  <!-- 头部区域 -->
  <div class="header">
    <!-- 头部左侧logo和标题 -->
    <a href="#/">
      <img src="@/assets/logo.png" alt width="25px" class="logo" />
      <span class="company">会员管理系统</span>
    </a>
    <!-- 头部右侧下拉 -->
    <el-dropdown @command="handleCommand">
      <span class="el-dropdown-link">
        admin
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="a">修改密码</el-dropdown-item>
        <el-dropdown-item command="b">退出系统</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>


<script>
import {logout} from "@/api/login";
export default {
  methods: {
    handleCommand(command) {
      switch(command){
        case 'a':
          //修改密码
          break;
        case 'b':
          //退出系统
          logout(localStorage.getItem('hanshijiang-cms-token')).then(response=>{
            let logoutRes=response.data;
            //清除本地数据
            localStorage.removeItem('hanshijiang-cms-token');
            localStorage.removeItem('hanshijiang-cms-user');
            this.$router.push('/login');
          });
          break;
        default:
          break;
      }
    }
  }
};
</script>


<style scoped>
.logo {
  vertical-align: middle;
  padding: 0px 10px 0px 40px;
}
.company {
  position: absolute;
  color: white;
}
/* 下拉菜单 */
.el-dropdown {
  float: right;
  margin-right: 40px;
}
.el-dropdown-link {
  cursor: pointer;
  color: #fff;
}

</style>