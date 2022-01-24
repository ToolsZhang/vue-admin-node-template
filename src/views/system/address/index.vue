<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">
      <!-- <el-form-item label="地址名称" prop="address_name">
        <el-input
          v-model="queryParams.address_name"
          placeholder="请输入地址名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <el-form-item label="状态" prop="state">
        <el-select v-model="queryParams.state" placeholder="地址状态" clearable size="small">
          <el-option
            :key="true"
            :label="'正常'"
            :value="true"
          />
          <el-option
            :key="false"
            :label="'停用'"
            :value="false"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:address:add']"
        >新增</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="addressList"
      row-key="_id"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="address_name" label="地址名称" width="260"></el-table-column>
      <el-table-column prop="order" label="排序" width="200"></el-table-column>
      <el-table-column prop="state" label="状态" :formatter="statusFormat" width="100"></el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="200">
        <template slot-scope="scope">
          <span>{{ dateFormatISO(scope.row.createdAt) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button 
            size="mini" 
            type="text" 
            icon="el-icon-edit" 
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:address:edit']"
          >修改</el-button>
          <el-button 
            size="mini" 
            type="text" 
            icon="el-icon-plus" 
            @click="handleAdd(scope.row)"
            v-hasPermi="['system:address:add']"
          >新增</el-button>
          <el-button
            v-if="scope.row.parent != 0"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:address:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改地址对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级地址" prop="parent">
              <treeselect v-model="form.parent" :options="addressOptions" :normalizer="normalizer" placeholder="选择上级地址" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="地址名称" prop="address_name">
              <el-input v-model="form.address_name" placeholder="请输入地址名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="order">
              <el-input-number v-model="form.order" controls-position="right" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="地址状态">
              <el-radio-group v-model="form.state">
                <el-radio :key="true" :label="true" >正常</el-radio>
                <el-radio :key="false" :label="false" >停用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listAddress, getAddress, delAddress, addAddress, updateAddress, listAddressExcludeChild } from "@/api/system/address";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "Address",
  components: { Treeselect },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 表格树数据
      addressList: [],
      // 地址树选项
      addressOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        address_name: undefined,
        state: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        parent: [
          { required: true, message: "上级地址不能为空", trigger: "blur" }
        ],
        address_name: [
          { required: true, message: "地址名称不能为空", trigger: "blur" }
        ],
        order: [
          { required: true, message: "显示排序不能为空", trigger: "blur" }
        ],
        email: [
          {
            type: "email",
            message: "'请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        phone: [
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询地址列表 */
    getList() {
      this.loading = true;
      listAddress(this.queryParams).then(response => {
        console.log(response);
        this.addressList = this.handleTree(response, "_id","parent");
        this.loading = false;
      });
    },
    /** 转换地址数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node._id,
        label: node.address_name,
        children: node.children
      };
    },
    // 字典状态字典翻译
    statusFormat(row, column) {
      return row.state === true ? '正常' : '停用';
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        _id: undefined,
        parent: undefined,
        address_name: undefined,
        order: undefined,
        state: true
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams = {
        address_name: undefined,
        state: false
      }
      this.getList();
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset();
      if (row != undefined) {
        this.form.parent = row._id;
      }
      console.log(this.form.parent);
      this.open = true;
      this.title = "添加地址";
      listAddress({}).then(response => {
        this.addressOptions = [];
        let address = { _id: 0, address_name: '于田诉求政务平台', children: [] };
        address.children = this.handleTree(response, "_id","parent");
        this.addressOptions.push(address);
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      getAddress(row._id).then(response => {
        this.form = response;
        this.open = true;
        this.title = "修改地址";
      });
      listAddressExcludeChild(row._id).then(response => {
        this.addressOptions = [];
        let address = { _id: 0, address_name: '于田诉求政务平台', children: [] };
        address.children = this.handleTree(response, "_id","parent");
        this.addressOptions.push(address);
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form._id != undefined) {
            updateAddress(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addAddress(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm('是否确认删除名称为"' + row.address_name + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delAddress(row._id);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    }
  }
};
</script>