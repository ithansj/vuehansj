<template>
  <div>
    <!-- 条件查询表单 -->
    <el-form
      ref="searchForm"
      :inline="true"
      :model="searchMap"
      class="demo-form-inline"
      style="margin-top:20px"
    >
      <el-form-item prop="username">
        <el-input v-model="searchMap.username" placeholder="员工帐号" style="width:150px"></el-input>
      </el-form-item>
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="员工姓名" style="width:150px"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchStaffData()" icon="el-icon-search">查询</el-button>
        <el-button
          type="primary"
          @click="$refs['searchForm'].resetFields();"
          icon="el-icon-reset"
        >重置</el-button>
        <el-button type="primary" icon="el-icon-edit" @click="handleAdd">新增</el-button>
      </el-form-item>
    </el-form>

    <!-- 新增弹出框or编辑 -->
    <el-dialog title="员工编辑" :visible.sync="dialogFormVisible" width="500px">
      <el-form
        :rules="rules"
        status-icon
        ref="staffForm"
        :model="staff"
        label-width="100px"
        label-position="right"
        style="width:400px"
      >
        <el-form-item prop="username" label="员工账号">
          <el-input v-model="staff.username"></el-input>
        </el-form-item>
        <el-form-item prop="name" label="员工姓名">
          <el-input v-model="staff.name"></el-input>
        </el-form-item>
        <el-form-item prop="age" label="员工年龄">
          <el-input v-model="staff.age"></el-input>
        </el-form-item>
        <el-form-item prop="salary" label="员工工资">
          <el-input v-model="staff.salary"></el-input>
        </el-form-item>
        <el-form-item prop="mobile" label="员工电话">
          <el-input v-model="staff.mobile"></el-input>
        </el-form-item>
        <el-form-item prop="entryDate" label="员工入职时间">
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="staff.entryDate"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="staff.id===null?addStaffData('staffForm'):updateStaffData('staffForm')"
        >确 定</el-button>
      </div>
    </el-dialog>

    <!-- 渲染staff列表部分 -->
    <el-table :data="staffList" height="380" border style="width: 100%">
      <!-- 这里的type是序号 -->
      <el-table-column type="index" label="序号" width="60"></el-table-column>
      <!-- 这里的prop指的是接收需要渲染的数据选项 -->
      <el-table-column prop="username" label="账号" width="120"></el-table-column>
      <el-table-column prop="name" label="员工姓名"></el-table-column>
      <el-table-column prop="age" label="员工年龄"></el-table-column>
      <el-table-column prop="salary" label="员工工资" width="113"></el-table-column>
      <el-table-column prop="mobile" label="员工电话" width="113"></el-table-column>
      <el-table-column prop="entryDate" label="入职时间" width="113"></el-table-column>
      <el-table-column label="操作" width="150">
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
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
import staffApi from "@/api/staff";
export default {
  data() {
    return {
      staffList: [],
      currentPage: 1,
      pageSize: 10,
      searchMap: {
        username: "",
        name: ""
      },
      total: 0,
      dialogFormVisible: false,
      staff: {
        id: null,
        username: "",
        name: "",
        age: 10,
        mobile: "",
        salary: 1,
        entryDate: ""
      },
      rules: {
        username: [
          { required: true, message: "员工账号不能为空", trigger: "blur" }
        ],
        name: [{ required: true, message: "员工姓名不能为空", trigger: "blur" }]
      }
    };
  },
  created() {
    this.fetchStaffData();
  },
  methods: {
    fetchStaffData() {
      staffApi
        .searchStaff(this.currentPage, this.pageSize, this.searchMap)
        .then(response => {
          let resp = response.data;
          if (resp.flag) {
            this.staffList = resp.data.rows;
            this.total = resp.data.total;
          } else {
            console.log("获取数据失败！");
          }
        });
    },
    handleEdit(id) {
      console.log("编辑", id);
      this.handleAdd();
      staffApi.getStaffById(id).then(response => {
        let resp = response.data;
        if (resp.flag) {
          this.staff = resp.data;
        } else {
          console.log("获取数据失败！");
        }
      });
    },
    handleDelete(id) {
      console.log("删除", id);
      this.$confirm("确认删除这条记录吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          staffApi.deleteStaffById(id).then(response => {
            let resp = response.data;
            this.$message({
              type: resp.flag ? "success" : "error",
              message: resp.message
            });
            if (resp.flag) {
              this.fetchStaffData();
            }
          });
        })
        .catch(() => {});
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchStaffData();
    },
    handleCurrentChange(val) {
      console.log(val);
    },
    handleAdd() {
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["staffForm"].resetFields();
      });
    },
    addStaffData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          staffApi.addStaff(this.staff).then(response => {
            let resp = response.data;
            if (resp.flag) {
              this.fetchStaffData();
              this.dialogFormVisible = false;
            } else {
              this.$message({
                type: "warning",
                message: resp.message
              });
            }
          });
        }
      });
    },
    updateStaffData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          staffApi.updateStaff(this.staff).then(response => {
            let resp = response.data;
            if (resp.flag) {
              this.fetchStaffData();
              this.dialogFormVisible = false;
            } else {
              this.$message({
                type: "warning",
                message: resp.message
              });
            }
          });
        }
      });
    }
  }
};
</script>