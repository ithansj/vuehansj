<template>
  <!-- <div>会员管理</div> -->
  <div>
    <!-- 新增弹出框 -->
    <el-dialog title="会员编辑" :visible.sync="dialogFormVisible" width="500px">
      <el-form
        :rules="rules"
        status-icon
        ref="pojoForm"
        :model="pojo"
        label-width="100px"
        label-position="right"
        style="width:400px"
      >
        <el-form-item prop="cardNum" label="会员卡号">
          <el-input v-model="pojo.cardNum"></el-input>
        </el-form-item>
        <el-form-item prop="name" label="会员姓名">
          <el-input v-model="pojo.name"></el-input>
        </el-form-item>
        <el-form-item prop="birthday" label="会员生日">
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="pojo.birthday"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item prop="phone" label="手机号码">
          <el-input v-model="pojo.phone"></el-input>
        </el-form-item>
        <el-form-item prop="money" label="开卡金额">
          <el-input v-model="pojo.money"></el-input>
        </el-form-item>
        <el-form-item prop="integral" label="可用积分">
          <el-input v-model="pojo.integral"></el-input>
        </el-form-item>
        <el-form-item prop="payType" label="支付类型">
          <el-select v-model="pojo.payType" placeholder="支付类型" style="width:110px">
            <el-option
              v-for="option in payTypeOptions"
              :key="option.type"
              :label="option.name"
              :value="option.type"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="address" label="会员地址">
          <el-input v-model="pojo.address" :autosize="{minRows:2,maxRows:4}" placeholder="请输入地址"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="pojo.id===null?addPojoData('pojoForm'):updatePojoData('pojoForm')"
        >确 定</el-button>
      </div>
    </el-dialog>

    <!-- 条件查询表单 -->
    <el-form
      ref="searchForm"
      :inline="true"
      :model="searchMap"
      class="demo-form-inline"
      style="margin-top:20px"
    >
      <el-form-item prop="cardNum">
        <el-input v-model="searchMap.cardNum" placeholder="会员卡号" style="width:150px"></el-input>
      </el-form-item>
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="会员姓名" style="width:150px"></el-input>
      </el-form-item>
      <el-form-item prop="payType">
        <el-select v-model="searchMap.payType" placeholder="支付类型" style="width:110px">
          <el-option
            v-for="option in payTypeOptions"
            :key="option.type"
            :label="option.name"
            :value="option.type"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="birthday">
        <el-date-picker
          value-format="yyyy-MM-dd"
          v-model="searchMap.birthday"
          type="date"
          placeholder="选择日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData" icon="el-icon-search">查询</el-button>
        <el-button type="primary" @click="resetForm('searchForm')" icon="el-icon-reset">重置</el-button>
        <el-button type="primary" icon="el-icon-edit" @click="handleAdd">新增</el-button>
      </el-form-item>
    </el-form>
    <!-- 显示列表 -->
    <!-- 这里的:data绑定的是 model中的data -->
    <el-table :data="list" height="380" border style="width: 100%">
      <!-- 这里的type是序号 -->
      <el-table-column type="index" label="序号" width="60"></el-table-column>
      <!-- 这里的prop指的是接收需要渲染的数据选项 -->
      <el-table-column prop="cardNum" label="会员卡号" width="100"></el-table-column>
      <el-table-column prop="name" label="会员姓名"></el-table-column>
      <el-table-column prop="birthday" label="会员生日"></el-table-column>
      <el-table-column prop="phone" label="会员电话" width="113"></el-table-column>
      <el-table-column prop="integral" label="可用积分"></el-table-column>
      <el-table-column prop="money" label="开卡金额"></el-table-column>
      <el-table-column prop="payType" label="支付类型">
        <!-- 这里使用过滤器将支付类型数字转换成文字 -->
        <template slot-scope="scope">
          <span>{{scope.row.payType|payTypeFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="会员地址" width="180"></el-table-column>
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
import memberApi from "@/api/member"; //引入获取会员列表的api

//此变量用来处理支付方式的现实问题，用来作为过滤器的参考值
let payTypeOptions = [
  { type: "1", name: "现金" },
  { type: "2", name: "微信" },
  { type: "3", name: "支付宝" },
  { type: "4", name: "银行卡" }
];
export default {
  data() {
    return {
      list: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      searchMap: {
        cardNum: "",
        name: "",
        birthday: "",
        payType: ""
      },
      payTypeOptions,
      dialogFormVisible: false,
      pojo: {
        id: null,
        cardNum: "",
        name: "",
        birthday: "",
        payType: "",
        phone: "",
        money: 0,
        address: "",
        integral: 0
      },
      rules: {
        cardNum: [{ required: true, message: "卡号不能为空", trigger: "blur" }],
        name: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
        payType: [
          { required: true, message: "支付方式不能为空", trigger: "change" }
        ]
      }
    };
  },
  //一般在created钩子函数中获取到后台传过来的数据
  created() {
    this.fetchData();
  },
  methods: {
    //获取会员列表的数据
    // fetchData() {
    //   memberApi.getMemberList().then(response => {
    //     let resp = response.data;
    //     //将获取到数组对象赋值给 本页的数据对象
    //     this.list = resp.data;
    //   });
    // },
    fetchData() {
      memberApi
        .search(this.currentPage, this.pageSize, this.searchMap)
        .then(response => {
          let resp = response.data.data;
          this.total = resp.total;
          this.list = resp.rows;
          // console.log(this.total,this.list);
        });
    },
    handleEdit(id) {
      console.log("编辑", id);
      //将修改表单显示出来，并且清空原来的数据
      this.handleAdd();
      //根据id来查询出数据
      memberApi.getById(id).then(response => {
        let resp = response.data;
        if (resp.flag) {
          //将查询出的数据赋值给pojo
          this.pojo = resp.data;
        }
      });
    },
    handleDelete(id) {
      this.$confirm("确认删除这条记录吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          memberApi.deleteMemberById(id).then(response => {
            let resp = response.data;
            this.$message({
              type: resp.flag ? "success" : "error",
              message: resp.message
            });
            if (resp.flag) {
              this.fetchData();
            }
          });
        })
        .catch(() => {});
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchData();
    },
    resetForm(fromName) {
      this.$refs[fromName].resetFields();
    },
    addPojoData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          memberApi.addMember(this.pojo).then(response => {
            let resp = response.data;
            if (resp.flag) {
              this.fetchData();
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
    handleAdd() {
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["pojoForm"].resetFields();
      });
    },
    //更新会员
    updatePojoData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          memberApi.updateMember(this.pojo).then(response => {
            let resp = response.data;
            if (resp.flag) {
              //刷新数据
              this.fetchData();
              //关闭编辑窗口
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
    }
  },
  //此处的过滤器用来将支付类型 转换成文字 增加可读性
  filters: {
    payTypeFilter(type) {
      // 这里的数组find方法，将返回一个符合条件的对象
      let obj = payTypeOptions.find(obj => {
        return obj.type === type;
      });
      //   如果返回的对象为非空 ，则返回name
      return obj ? obj.name : null;
    }
  }
};
</script>