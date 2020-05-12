<template>
  <div>
    <!-- 条件查询表单 -->
    <el-form
      v-if="!isDialog"
      ref="searchForm"
      :inline="true"
      :model="searchMap"
      class="demo-form-inline"
      style="margin-top:20px"
    >
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="商品名称" style="width:150px"></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input v-model="searchMap.code" placeholder="商品编号" style="width:150px"></el-input>
      </el-form-item>
      <el-form-item prop="supplierName">
        <el-input v-model="searchMap.supplierName" placeholder="供应商" style="width:150px"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="fetchSupplierData" icon="el-icon-search">查询</el-button>
        <el-button type="primary" @click="resetForm('searchForm')" icon="el-icon-reset">重置</el-button>
        <el-button type="primary" icon="el-icon-edit" @click="handleAdd">新增</el-button>
      </el-form-item>
    </el-form>

    <!-- 新增弹出框 -->
    <el-dialog title="供应商编辑" :visible.sync="dialogFormVisible" width="500px">
      <el-form
        :rules="rules"
        status-icon
        ref="supplierForm"
        :model="supplier"
        label-width="100px"
        label-position="right"
        style="width:400px"
      >
        <el-form-item prop="name" label="供应商名称">
          <el-input v-model="supplier.name"></el-input>
        </el-form-item>
        <el-form-item prop="linkman" label="联系人">
          <el-input v-model="supplier.linkman"></el-input>
        </el-form-item>
        <el-form-item prop="mobile" label="联系电话">
          <el-input v-model="supplier.mobile"></el-input>
        </el-form-item>
        <el-form-item prop="remark" label="备注">
          <el-input v-model="supplier.remark" :autosize="{minRows:2,maxRows:4}"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="supplier.id===null?addSupplierData('supplierForm'):updateSupplierData('supplierForm')"
        >确 定</el-button>
      </div>
    </el-dialog>

    <!-- 渲染supplier列表部分 -->
    <el-table
      :highlight-current-row="isDialog"
      @current-change="clickCurrentChange"
      :data="supplierList"
      height="380"
      border
      style="width: 100%"
    >
      <!-- 这里的type是序号 -->
      <el-table-column type="index" label="序号" width="60"></el-table-column>
      <!-- 这里的prop指的是接收需要渲染的数据选项 -->
      <el-table-column prop="name" label="供应商名称" width="120"></el-table-column>
      <el-table-column v-if="!isDialog" prop="linkman" label="联系人"></el-table-column>
      <el-table-column v-if="!isDialog" prop="mobile" label="联系电话"></el-table-column>
      <el-table-column v-if="!isDialog" prop="remark" label="备注" width="113"></el-table-column>
      <el-table-column v-if="!isDialog" label="操作" width="150">
        <template slot-scope="scope">
          <el-button @click="handleEdit(scope.row.id)" size="mini">编辑</el-button>
          <el-button @click="handleDelete(scope.row.id)" size="mini" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页部分 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 50]"
      :page-size="pageSize"
      :layout="!isDialog?'total, sizes, prev, pager, next, jumper':'prev, pager, next'"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
import supplierApi from "@/api/supplier"; //导入supplier API
export default {
  data() {
    return {
      supplierList: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      searchMap: {
        name: "",
        code: "",
        supplierName: ""
      },
      dialogFormVisible: false,
      rules: {
        name: [{ required: true, message: "供应商不能为空", trigger: "blur" }],
        linkman: [
          { required: true, message: "联系人不能为空", trigger: "blur" }
        ]
      },
      supplier: {
        id: null,
        name: "",
        linkman: "",
        mobile: "",
        remark: ""
      }
    };
  },
  created() {
    //一般在created钩子函数中获取到从后端请求来的数据
    this.fetchSupplierData();
  },
  //接受父组件传过来的数据
  props: {
    isDialog: Boolean
  },
  methods: {
    //获取supplier的列表的不分頁方法
    // fetchSupplierData() {
    //   //调用api中的获取supplier的方法
    //   supplierApi.getSupplierList().then(response => {
    //     let resp = response.data;
    //     if (resp.flag) {
    //       //如果成功，则将获取到的数据赋值给此页面的数据模型中的supplierList
    //       this.supplierList = resp.data;
    //     } else {
    //       console.log("获取数据失败!");
    //     }
    //   });
    // },

    //获取数据列表的分页方法
    fetchSupplierData() {
      supplierApi
        .searchSupplier(this.currentPage, this.pageSize, this.searchMap)
        .then(response => {
          let resp = response.data;
          //当获取到数据时，开始对相应的赋值
          if (resp.flag) {
            this.supplierList = resp.data.rows;
            this.total = resp.data.total;
          } else {
            console.log("获取数据失败!");
          }
        });
    },
    //编辑
    handleEdit(id) {
      this.handleAdd();
      supplierApi.getSupplierById(id).then(response => {
        let resp = response.data;
        this.supplier = resp.data;
      });
    },
    //删除
    handleDelete(id) {
      this.$confirm("确认删除这条记录吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          supplierApi.deleteById(id).then(response => {
            let resp = response.data;
            this.$message({
              type: resp.flag ? "success" : "error",
              message: resp.message
            });
            if (resp.flag) {
              this.fetchSupplierData();
            }
          });
        })
        .catch(() => {});
    },
    //当调整每页数据多少时触发处理函数
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchSupplierData();
    },
    //调整当前页时触发处理函数
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchSupplierData();
    },
    //重置表单
    resetForm(fromName) {
      this.$refs[fromName].resetFields();
    },
    //当添加按钮触发时，打开添加窗口，并重置表单
    handleAdd() {
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["supplierForm"].resetFields();
      });
    },
    //新增supplier处理函数
    addSupplierData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          supplierApi.addSupplier(this.supplier).then(response => {
            let resp = response.data;
            if (resp.flag) {
              this.fetchSupplierData();
              this.dialogFormVisible = false;
            } else {
              this.$message({
                message: resp.message,
                type: "warning"
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    updateSupplierData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          supplierApi.updateSupplier(this.supplier).then(response => {
            let resp = response.data;
            if (resp.flag) {
              this.fetchSupplierData();
              this.dialogFormVisible = false;
            } else {
              this.$message({
                type: "warning",
                message: resp.message
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    clickCurrentChange(currentRow) {
      console.log(currentRow);
      this.$emit("option-supplier", currentRow);
    }
  }
};
</script>