<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">
      <!-- <el-form-item label="工作单位名称" prop="unit_name">
        <el-input
          v-model="queryParams.unit_name"
          placeholder="请输入工作单位名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="工作单位状态" clearable size="small">
          <el-option
            :key="'0'"
            :label="'正常'"
            :value="'0'"
          />
          <el-option
            :key="'1'"
            :label="'停用'"
            :value="'1'"
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
          v-hasPermi="['cadre:unit:add']"
        >新增</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="unitList"
      row-key="_id"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="unit_name" label="工作单位名称" width="260"></el-table-column>
      <el-table-column prop="order_num" label="排序" width="200"></el-table-column>
      <el-table-column prop="is_deal_unit" align="center" label="是否直属工作单位" :formatter="isDealAppealFormat" width="300"></el-table-column>
      <el-table-column prop="status" label="状态" :formatter="statusFormat" width="100"></el-table-column>
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
            v-hasPermi="['cadre:unit:edit']"
          >修改</el-button>
          <el-button 
            size="mini" 
            type="text" 
            icon="el-icon-plus" 
            @click="handleAdd(scope.row)"
            v-hasPermi="['cadre:unit:add']"
          >新增</el-button>
          <el-button
            v-if="scope.row.parent != 0"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['cadre:unit:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改工作单位对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级工作单位" prop="parent">
              <treeselect v-model="form.parent" :options="unitOptions" :normalizer="normalizer" placeholder="选择上级工作单位" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工作单位名称" prop="unit_name">
              <el-input v-model="form.unit_name" placeholder="请输入工作单位名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="order_num">
              <el-input-number v-model="form.order_num" controls-position="right" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="负责人" prop="leader">
              <el-input v-model="form.leader" placeholder="请输入负责人" maxlength="20" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入联系电话" maxlength="11" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工作单位状态">
              <el-radio-group v-model="form.status">
                <el-radio :key="'0'" :label="'0'" >正常</el-radio>
                <el-radio :key="'1'" :label="'1'" >停用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否子级">
              <el-radio-group v-model="form.is_deal_unit">
                <el-radio :key="'0'" :label="'0'" >是</el-radio>
                <el-radio :key="'1'" :label="'1'" >否</el-radio>
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
import { listUnit, getUnit, delUnit, addUnit, updateUnit, listUnitExcludeChild } from "@/api/cadre/unit";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "Unit",
  components: { Treeselect },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 表格树数据
      unitList: [],
      // 工作单位树选项
      unitOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        unit_name: undefined,
        status: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        parent: [
          { required: true, message: "上级工作单位不能为空", trigger: "blur" }
        ],
        unit_name: [
          { required: true, message: "工作单位名称不能为空", trigger: "blur" }
        ],
        order_num: [
          { required: true, message: "显示排序不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
    // this.getDicts("sys_normal_disable").then(response => {
    //   this.statusOptions = response.docs;
    // });
  },
  methods: {
    /** 查询工作单位列表 */
    getList() {
      this.loading = true;
      listUnit(this.queryParams).then(response => {
        this.unitList = this.handleTree(response, "_id","parent");
        
        this.loading = false;
      });
    },
    /** 转换工作单位数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node._id,
        label: node.unit_name,
        children: node.children
      };
    },
    // 字典状态字典翻译
    statusFormat(row, column) {
      return row.status === '0' ? '正常' : '停用';
    },
    // 是否处理工作单位字典翻译
    isDealAppealFormat(row, column) {
      return row.is_deal_unit === '0' ? '是' : '否';
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
        unit_name: undefined,
        order_num: 0,
        leader: undefined,
        phone: undefined,
        email: undefined,
        is_deal_unit: "0",
        status: "0"
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
        unit_name: undefined,
        status: undefined
      }
      this.getList();
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset();
      if (row != undefined) {
        this.form.parent = row._id;
      }
      this.open = true;
      this.title = "添加工作单位";
      listUnit({}).then(response => {
        this.unitOptions = [];
        let unit = { _id: 0, unit_name: '于田县', children: [] };
        unit.children = this.handleTree(response, "_id","parent");
        this.unitOptions.push(unit);
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      getUnit(row._id).then(response => {
        this.form = response;
        this.open = true;
        this.title = "修改工作单位";
        listUnitExcludeChild(row._id).then(response => {
          this.unitOptions = [];
          let unit = { _id: 0, unit_name: '于田县', children: [] };
          unit.children = this.handleTree(response, "_id","parent");
          this.unitOptions.push(unit);
        });
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form._id != undefined) {
            updateUnit(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addUnit(this.form).then(response => {
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
      this.$confirm('是否确认删除名称为"' + row.unit_name + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delUnit(row._id);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    }
  }
};
</script>