<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--工作单位数据-->
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input
            v-model="UnitName"
            placeholder="请输入工作单位名称"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px"
          />
        </div>
        <div class="head-container">
          <el-tree
            :data="unitOptions"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree"
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <!--包联干部数据-->
      <el-col :span="20" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
          <el-form-item label="姓名" prop="name">
            <el-input
              v-model="queryParams.name"
              placeholder="请输入包联干部姓名"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="手机号码" prop="mobile">
            <el-input
              v-model="queryParams.mobile"
              placeholder="请输入手机号码"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="创建时间">
            <el-date-picker
              v-model="dateRange"
              size="small"
              style="width: 240px"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            <el-button type="info" icon="el-icon-position" size="mini" v-if="queryParams.workUnits" >{{ unitFormat({workUnits : queryParams.workUnits}) }}</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="success"
              plain
              icon="el-icon-edit"
              size="mini"
              :disabled="single"
              @click="handleUpdate"
              v-hasPermi="['system:user:edit']"
            >修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              plain
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['system:user:remove']"
            >删除</el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="cadreList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="包联干部编号" align="center" key="_id" prop="_id" v-if="columns[0].visible" />
          <el-table-column label="包联干部姓名" align="center" key="name" prop="name" v-if="columns[1].visible" :show-overflow-tooltip="true" />
          <el-table-column label="身份证号" align="center" key="idCard" prop="idCard" v-if="columns[2].visible" :show-overflow-tooltip="true" />
          <el-table-column label="工作单位" align="center" prop="workUnits" :formatter="unitFormat" v-if="columns[3].visible" :show-overflow-tooltip="true" />
          <el-table-column label="手机号码" align="center" key="mobile" prop="mobile" v-if="columns[4].visible" width="120" />
          <el-table-column label="职务" align="center" key="position" prop="position" v-if="columns[5].visible" width="120" />
          <el-table-column label="创建时间" align="center" prop="createTime" v-if="columns[6].visible" width="160">
            <template slot-scope="scope">
              <span>{{ dateFormatISO(scope.row.createdAt) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="160"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['system:user:edit']"
              >修改</el-button>
              <el-button
                v-if="scope.row._id !== 1"
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['system:user:remove']"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.page"
          :limit.sync="queryParams.limit"
          @pagination="getList"
        />
      </el-col>
    </el-row>

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="form.name" placeholder="请输入包联干部姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号码" prop="mobile">
              <el-input v-model="form.mobile" placeholder="请输入手机号码" maxlength="11" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="身份证号" prop="idCard">
              <el-input v-model="form.idCard" placeholder="请输入身份证号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="职务" prop="position">
              <el-input v-model="form.position" placeholder="请输入职务" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="工作单位" prop="workUnits">
              <treeselect v-model="form.workUnits" :options="unitOptions" :show-count="true" placeholder="请选择归属工作单位" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="form.info" type="textarea" placeholder="请输入内容"></el-input>
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
import { listCadre, getCadre, delCadre, addCadre, updateCadre, exportCadre } from "@/api/cadre/cadre";
import { treeselect, tableUnits} from "@/api/cadre/unit";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import Vue from 'vue'

export default {
  name: "User",
  components: { Treeselect },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 包联干部表格数据
      cadreList: null,
      // 弹出层标题
      title: "",
      // 工作单位树选项
      unitOptions: undefined,
      // 是否显示弹出层
      open: false,
      // 工作单位名称
      UnitName: undefined,
      // 默认密码
      initPassword: undefined,
      // 日期范围
      dateRange: [],
      // 岗位选项
      postOptions: [],
      // 工作单位选择
      unitsOptions: [],
      // 表单参数
      form: {},
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 查询参数
      queryParams: {
        limit: 10,
        page: 1,
        name: undefined,
        mobile: undefined,
        workUnits: undefined
      },
      // 列信息
      columns: [
        { key: 0, label: `包联干部编号`, visible: true },
        { key: 1, label: `包联干部姓名`, visible: true },
        { key: 2, label: `包联身份证号`, visible: true },
        { key: 3, label: `工作单位`, visible: true },
        { key: 4, label: `手机号码`, visible: true },
        { key: 5, label: `职务`, visible: true },
        { key: 6, label: `创建时间`, visible: true }
      ],
      // 表单校验
      rules: {
        name: [
          { required: true, message: "姓名不能为空", trigger: "blur" }
        ],
        idCard: [
          { required: true, message: "身份证号不能为空", trigger: "blur" }
        ],
        workUnits: [
          { required: true, message: "工作单位不能为空", trigger: "blur" }
        ],
      }
    };
  },
  watch: {
    // 根据名称筛选工作单位树
    UnitName(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    this.getList();
    this.getUnits();
    this.getTreeselect();
  },
  methods: {
    /** 查询包联干部列表 */
    getList() {
      this.loading = true;
      listCadre(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          this.cadreList = response.docs;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    /** 查询所有工作单位 */
    getUnits(){
      tableUnits({limit: 1000}).then(response => {
        this.unitsOptions = response.docs;
      });
    },
    /** 工作单位翻译 */
    unitFormat(row) {
      if(row.workUnits && row.workUnits !== undefined) {
        let unit = this.unitsOptions.filter(d=>{ 
          if(row.workUnits === d._id)
            return d;
        });
        if(unit && unit.length > 0)
          return unit[0]['unit_name']
      }
      else return '于田县';
    },
    /** 查询工作单位下拉树结构 */
    getTreeselect() {
      treeselect().then(response => {
        this.unitOptions = response;
      });
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.workUnits = data.id;
      this.searchUnits(data.id)
      this.getList();
    },
    // 节点点击触发级联查询
    searchUnits(workUnits){
      let allUnit = [];
      for (const unit of this.unitsOptions) {
        if (unit._id == workUnits || unit.parent == workUnits)
        allUnit.push(unit._id);
      }
      this.queryParams.workUnit_list = {$in : allUnit};
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
        workUnits: undefined,
        name: undefined,
        mobile: undefined,
        info: undefined,
        position: undefined,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.queryParams = {
        limit: 10,
        page: 1,
        name: undefined,
        mobile: undefined,
        workUnits: undefined,
        position: undefined,
      },
      this.getList();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item._id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getTreeselect();
      const userId = row._id || this.ids;
      getCadre(userId).then(response => {
        this.form = response;
        this.open = true;
        this.title = "修改包联干部";
        this.form.password = "";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form._id != undefined) {
            updateCadre(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addCadre(this.form).then(response => {
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
      const userIds = row._id || this.ids;
      this.$confirm('是否确认删除包联干部编号为"' + userIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delCadre(userIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有包联干部数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return updateCadre(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    },
  }
};
</script>