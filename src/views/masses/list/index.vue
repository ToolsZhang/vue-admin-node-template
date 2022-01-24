<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--地址数据-->
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input
            v-model="deptName"
            placeholder="请输入地址"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px"
          />
        </div>
        <div class="head-container">
          <el-tree
            :data="addressOptions"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree"
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <!--群众数据-->
      <el-col :span="20" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
          <el-form-item label="群众姓名" prop="name">
            <el-input
              v-model="queryParams.name"
              placeholder="请输入群众姓名"
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
            <el-button type="info" icon="el-icon-position" size="mini" v-if="queryParams.habitation" >{{ addressFormat({habitation : queryParams.habitation}) }}</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="danger"
              plain
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['masses:list:remove']"
            >删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
              v-hasPermi="['masses:list:export']"
            >导出</el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="addressList" @selection-change="handleSelectionChange" @row-click="massesDetail">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="群众编号" align="center" key="_id" prop="_id" v-if="columns[0].visible" width="250"/>
          <el-table-column label="群众姓名" align="center" key="name" prop="name" v-if="columns[1].visible" width="250"/>
          <el-table-column label="群众身份证" align="center" key="idCard" prop="idCard" v-if="columns[2].visible" :show-overflow-tooltip="true" />
          <el-table-column label="群众住址" align="center" prop="habitation" :formatter="addressFormat" v-if="columns[3].visible" :show-overflow-tooltip="true"  width="200"/>
          <el-table-column label="联系电话" align="center" key="mobile" prop="mobile" v-if="columns[4].visible" width="120" />
          <el-table-column label="创建时间" align="center" prop="createTime" v-if="columns[5].visible" width="160">
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
              <!-- <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click.native.stop="handleUpdate(scope.row)"
                v-hasPermi="['masses:list:edit']"
              >修改</el-button> -->
              <el-button
                v-if="scope.row._id !== 1"
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click.native.stop="handleDelete(scope.row)"
                v-hasPermi="['masses:list:remove']"
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
    <!-- 修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="群众编号" prop="sequence">
              <el-input v-model="form.sequence" :disabled="true" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="群众者" prop="ownerIdcard">
              <el-input v-model="form.ownerIdcard" :disabled="true" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="form.repay">
          <el-col :span="12">
            <el-form-item label="群众金额" prop="money">
              <el-input v-model="form.money" :disabled="true"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="解决金额" prop="repay">
              <el-input v-model="form.repay" :disabled="true"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" >
            <el-form-item label="家庭住址" :span="24" >
              <el-select v-model="form.dept" placeholder="暂无" :disabled="true">
                <el-option
                  v-for="item in addressOptions"
                  :key="item.dict_value"
                  :label="item.dict_label"
                  :value="item.dict_value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="群众内容">
              <el-input v-model="form.content" type="textarea" placeholder="请输入内容" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="解决办法">
              <el-input v-model="form.solution" type="textarea" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 群众详情对话框 -->
    <el-dialog :title="title" :visible.sync="useropen" width="600px" append-to-body>
      <el-form ref="userForm" :model="userForm" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="userForm.name" :disabled="true" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="身份证号" prop="idCard">
              <el-input v-model="userForm.idCard" :disabled="true" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="手机号" prop="mobile">
              <el-input v-model="userForm.mobile" :disabled="true" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="居住地" prop="habitation">
              <el-input v-model="userForm.habitation" :disabled="true" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="详细居住地" prop="habitationInfo">
              <el-input v-model="userForm.habitationInfo" :disabled="true" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listAppeal, listAppealProcess, getAppeal, updateAppeal, delAppeal, exportAppeal, changeAppealStatus } from "@/api/appeal/appeal";
import { getDeptIdByUser, importTemplate , getAddressIdByUser} from "@/api/system/user";
import { treeselect, tableAddress} from "@/api/system/address";
import { listMasses, getMasses, delMasses } from "@/api/masses/massesMapping";
import { listRole } from "@/api/system/role";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import Vue from 'vue'

export default {
  name: "masses-list",
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
      // 群众表格数据
      addressList: null,
      // 弹出层标题
      title: "",
      // 部门树选项
      addressOptions: undefined,
      // 是否显示弹出层
      open: false,
      // 是否显示用户弹出层
      useropen: false,
      // 部门名称
      deptName: undefined,
      // 日期范围
      dateRange: [],
      // 群众进度数据
      appealProcessList : [],
      // 部门选择
      addressesOptions: [],
      // 表单参数
      form: {},
      // 用户表单参数
      userForm: {},
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 查询参数
      queryParams: {
        limit: 10,
        page: 1,
        name: undefined,
        habitation: undefined,
      },
      // 列信息
      columns: [
        { key: 0, label: `群众编号`, visible: true },
        { key: 2, label: `群众姓名`, visible: true },
        { key: 3, label: `群众身份证号`, visible: true },
        { key: 4, label: `住址`, visible: true },
        { key: 5, label: `手机号`, visible: true },
        { key: 6, label: `创建时间`, visible: true },
      ],
      // 表单校验
      rules: {
      },
    };
  },
  watch: {
    // 根据名称筛选部门树
    deptName(val) {
      console.log(val);
      this.$refs.tree.filter(val);
    }
  },
  created() {
    this.getAddresses();
    this.getList();
    this.getTreeselect();
  },
  methods: {
    /** 查询群众列表 */
    getList(param) {
      this.loading = true;
      getAddressIdByUser().then(response => {
        if(response) this.queryParams.habitation = response.res_address;
        if (param && param.habitation) 
          this.queryParams.habitation = param.habitation;
        else if(response && response.children && response.children.length > 0)
          this.queryParams.habitation_list = {$in : response.children};
        listMasses(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
            this.addressList = response.docs;
            this.total = response.total;
            this.loading = false;
          }
        ); 
      });
    },
    /** 查询所有地址 */
    getAddresses(){
      tableAddress({limit: 1000, populate: [{path:'parent'}]}).then(response => {
        this.addressesOptions = response.docs;
      });
    },
    /** 地址翻译 */
    addressFormat(row) {
      if(row.habitation && row.habitation !== undefined) {
        let habitation = this.addressesOptions.filter(d=>{ 
          if(row.habitation === d._id)
            return d;
        });
        if(habitation && habitation.length > 0)
          return habitation[0]['address_name']
      }
      else return '暂无地址信息';
    },
    /** 地址翻译(无table) */
    addressFormatByDept(habitation) {
      if(habitation && habitation !== undefined) {
        let habitation_ = this.addressesOptions.filter(d=>{ 
          if(habitation === d._id) return d;
        });
        if(habitation_ && habitation_.length > 0)
          return  habitation_[0]['parent']['address_name'] + '-' + habitation_[0]['address_name']
      }
      else return '暂无地址信息';
    },
    /** 查询地址下拉树结构 */
    getTreeselect() {
      treeselect().then(response => {
        this.addressOptions = response;
      });
    },
    massesDetail(row){
      const userId = row._id ;
      getMasses(userId).then(response => {
        this.userForm = response;
        this.userForm.habitation = this.addressFormatByDept(this.userForm.habitation)
        this.useropen = true;
        this.title = "群众详情";
      });
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.searchHabitation(data.id);
      this.getList({habitation : data.id});
    },
    // 节点点击触发级联查询
    searchHabitation(habitation){
      let allHabitation = [];
      for (const address of this.addressesOptions) {
        if (address._id == habitation || (address.parent && address.parent._id == habitation))
        allHabitation.push(address._id);
      }
      this.queryParams.habitation_list = {$in : allHabitation};
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 关闭按钮
    close() {
      this.useropen = false;
    },
    // 表单重置
    reset() {
      this.form = {
        _id: undefined,
        name: undefined,
        idCard: undefined,
        mobile: undefined,
        money: undefined,
        habitation: undefined,
        habitationInfo: undefined,
        habitation_list: undefined,
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
        idCard: undefined,
      },
      this.getList();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item._id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.getTreeselect();
      getAppeal().then(response => {
        this.open = true;
        this.title = "添加群众";
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getTreeselect();
      const userId = row._id || this.ids;
      getAppeal(userId).then(response => {
        this.form = response;
        // this.form.role = response.role;
        this.open = true;
        this.title = "修改群众";
        this.form.password = "";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form._id != undefined) {
            updateAppeal(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const massesIds = row._id || this.ids;
      this.$confirm('是否确认删除群众编号为"' +massesIds+ '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delMasses(massesIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有群众数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportAppeal(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    },
    /** 下载模板操作 */
    importTemplate() {
      importTemplate().then(response => {
        this.download(response.msg);
      });
    },
  }
};
</script>