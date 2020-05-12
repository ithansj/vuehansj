<template>
  <div>
    <!-- 选择供应商弹窗 -->
    <el-dialog title="供应商编辑" :visible.sync="dialogSupplierNameVisible" width="500px">
      <supplier @option-supplier="optionSupplier" :isDialog="true"></supplier>
    </el-dialog>
    <!-- 条件查询表单 -->
    <el-form
      ref="searchForm"
      :inline="true"
      :model="searchMap"
      class="demo-form-inline"
      style="margin-top:20px"
    >
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="商品名称" style="width:150px"></el-input>
      </el-form-item>
      <el-form-item prop="supplierName">
        <el-input
          readonly
          @click.native="dialogSupplierNameVisible=true"
          v-model="searchMap.supplierName"
          placeholder="供应商"
          style="width:150px"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchGoodsData" icon="el-icon-search">查询</el-button>
        <el-button
          type="primary"
          @click="$refs['searchForm'].resetFields();"
          icon="el-icon-reset"
        >重置</el-button>
        <el-button type="primary" icon="el-icon-edit" @click="handleAdd">新增</el-button>
      </el-form-item>
    </el-form>

    <!-- 新增弹出框or编辑 -->
    <el-dialog title="商品编辑" :visible.sync="dialogFormVisible" width="500px">
      <el-form
        :rules="rules"
        status-icon
        ref="goodsForm"
        :model="goods"
        label-width="100px"
        label-position="right"
        style="width:400px"
      >
        <el-form-item prop="name" label="商品名称">
          <el-input v-model="goods.name"></el-input>
        </el-form-item>
        <el-form-item prop="code" label="商品编号">
          <el-input v-model="goods.code"></el-input>
        </el-form-item>
        <el-form-item prop="spec" label="商品规格">
          <el-input v-model="goods.spec"></el-input>
        </el-form-item>
        <el-form-item prop="retailPrice" label="商品零售价">
          <el-input v-model="goods.retailPrice"></el-input>
        </el-form-item>
        <el-form-item prop="purchasePrice" label="商品进货价">
          <el-input v-model="goods.purchasePrice"></el-input>
        </el-form-item>
        <el-form-item prop="storageNum" label="商品库存数量">
          <el-input v-model="goods.storageNum"></el-input>
        </el-form-item>
        <el-form-item prop="supplierId" label="供应商">
          <el-input
            readonly
            @click.native="editSupplierOption"
            v-model="goods.supplierName"
            placeholder="供应商"
            style="width:150px"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="goods.id===null?addGoodsData('goodsForm'):updateGoodsData('goodsForm')"
        >确 定</el-button>
      </div>
    </el-dialog>

    <!-- 渲染goods列表部分 -->
    <el-table :data="goodsList" height="380" border style="width: 100%">
      <!-- 这里的type是序号 -->
      <el-table-column type="index" label="序号" width="60"></el-table-column>
      <!-- 这里的prop指的是接收需要渲染的数据选项 -->
      <el-table-column prop="name" label="商品名称" width="120"></el-table-column>
      <el-table-column prop="code" label="商品编号"></el-table-column>
      <el-table-column prop="spec" label="商品规格"></el-table-column>
      <el-table-column prop="retailPrice" label="零售价" width="113"></el-table-column>
      <el-table-column prop="purchasePrice" label="进货价" width="113"></el-table-column>
      <el-table-column prop="storageNum" label="库存数量" width="113"></el-table-column>
      <el-table-column prop="supplierName" label="供货商" width="113"></el-table-column>
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
import goodsApi from "@/api/goods";
import Supplier from "@/view/supplier";
export default {
  data() {
    return {
      goodsList: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      searchMap: {
        name: "",
        supplierName: "",
        supplierId: ""
      },
      goods: {
        id: null,
        name: "",
        code: "",
        spec: "",
        retailPrice: "",
        purchasePrice: "",
        storageNum: "",
        supplierName: "",
        supplierId: null
      },
      dialogFormVisible: false,
      dialogSupplierNameVisible: false,
      isEdit: false,
      rules: {
        name: [
          { required: true, message: "商品名称不能为空", trigger: "blur" }
        ],
        code: [
          { required: true, message: "商品编号不能为空", trigger: "blur" }
        ],
        retailPrice: [
          { required: true, message: "商品零售价不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.fetchGoodsData();
  },
  components: {
    Supplier
  },
  methods: {
    fetchGoodsData() {
      goodsApi
        .searchGoods(this.currentPage, this.pageSize, this.searchMap)
        .then(response => {
          let resp = response.data;
          if (resp.flag) {
            this.total = resp.data.total;
            this.goodsList = resp.data.rows;
          } else {
            console.log("获取数据失败！");
          }
        });
    },
    handleEdit(id) {
      this.handleAdd();
      goodsApi.getGoodsById(id).then(response => {
        let resp = response.data;
        if (resp.flag) {
          this.goods = resp.data;
        } else {
          this.$message({
            type: "warning",
            message: resp.message
          });
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
          goodsApi.deleteGoodsById(id).then(response => {
            let resp = response.data;
            this.$message({
              type: resp.flag ? "success" : "error",
              message: resp.message
            });
            if (resp.flag) {
              this.fetchGoodsData();
            }
          });
        })
        .catch(() => {});
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchGoodsData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchGoodsData();
    },
    optionSupplier(currentRow) {
      console.log("father", currentRow);
      if (this.isEdit) {
        this.goods.supplierId = currentRow.id;
        this.goods.supplierName = currentRow.name;
      } else {
        this.searchMap.supplierId = currentRow.id;
        this.searchMap.supplierName = currentRow.name;
      }
      this.isEdit = false;
      this.dialogSupplierNameVisible = false;
    },
    addGoodsData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          goodsApi.addGoods(this.goods).then(response => {
            let resp = response.data;
            if (resp.flag) {
              this.fetchGoodsData();
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
    updateGoodsData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          goodsApi.updateGoods(this.goods).then(response => {
            let resp = response.data;
            if (resp.flag) {
              this.fetchGoodsData();
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
    handleAdd() {
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["goodsForm"].resetFields();
      });
    },
    editSupplierOption() {
      this.isEdit = true;
      this.dialogSupplierNameVisible = true;
    }
  }
};
</script>