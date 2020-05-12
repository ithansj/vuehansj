<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item class="line" :to="{ path: $route.path }">{{$route.meta.title}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<style scoped>
.el-breadcrumb{
    height: 10px;
    padding: 20px;
    border-radius: 4px;
    /* 投影 */
    box-shadow: 0px 2px 12px 0px rgba(0,0,0,1);
}
.line{
    border-left: 3px solid #31c17b;
    padding-left: 10px;
}
</style>