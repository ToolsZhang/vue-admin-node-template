<template>
  <div class="app-container">
<el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
          <el-form-item label="诉求编号" prop="sequence">
            <el-input
              v-model="queryParams.sequence"
              placeholder="请输入诉求编号"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="诉求类别" prop="classes">
            <el-select
              v-model="queryParams.classes"
              placeholder="诉求类别"
              clearable
              size="small"
              style="width: 240px"
            >
            <el-option
              v-for="dict in classesOptions"
              :key="dict.dict_value"
              :label="dict.dict_label"
              :value="dict.dict_value"
            />
            </el-select>
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
              v-hasPermi="['system:user:remove']"
            >删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
              v-hasPermi="['system:user:export']"
            >导出</el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="appealList" @selection-change="handleSelectionChange" @row-click="appealDetail">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="诉求编号" align="center" key="sequence" prop="sequence" v-if="columns[0].visible" width="150"/>
          <el-table-column label="申请人" align="center" key="masses" :formatter="massesFormat" v-if="columns[1].visible" width="230"/>
          <el-table-column label="家庭住址" align="center" key="address" :formatter="addressFormat" v-if="columns[2].visible" width="230"/>
          <el-table-column label="诉求类型" align="center" prop="classes" :formatter="classesFormat" v-if="columns[3].visible" :show-overflow-tooltip="true" />
          <el-table-column label="诉求状态" align="center" prop="state" :formatter="stateFormat" v-if="columns[4].visible" width="120" />
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
              <el-button
                v-if="scope.row._id !== 1"
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click.native.stop="handleDelete(scope.row)"
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
    <!-- 诉求详情对话框 -->
    <el-dialog :title="'诉求详情'" :visible.sync="detailOpen" width="1200px" append-to-body>
      <el-row :gutter="20">
        <el-col :span="7" :xs="24">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>当事人信息</span>
            </div>
            <div>
              <ul class="list-group list-group-striped">
                <li class="list-group-item">
                  姓    名
                  <div class="pull-right">{{ userdatail.name }}</div>
                </li>
                <li class="list-group-item">
                  住    址
                  <div class="pull-right"  v-if="userdatail.habitation">{{ userdatail.habitation.address_name }}</div>
                </li>
                <li class="list-group-item">
                  身份证号
                  <div class="pull-right">{{ userdatail.idCard }}</div>
                </li>
                <li class="list-group-item">
                  所属部门
                  <div class="pull-right" v-if="userdatail.habitation">{{ userdatail.habitation.address_name }} 诉求处理部门</div>
                </li>
                <li class="list-group-item">
                  创建日期
                  <div class="pull-right">{{ dateFormatISO(userdatail.createdAt,fmt = 'YYYY-mm-dd') }}</div>
                </li>
              </ul>
            </div>
          </el-card>
        </el-col>
        <el-col :span="17" :xs="24">
          <el-card>
            <div slot="header" class="clearfix">
              <span>诉求详情</span>
              <el-button v-if="operateButton.finish" @click="finishAppealDialog(userdatail.appeal)" icon="el-icon-finished" style="float: right; padding: 3px 2px" type="text">诉求完结</el-button> 
              <el-button v-if="operateButton.part" @click="partAppealDialog(userdatail.appeal)" icon="el-icon-chat-line-square" style="float: right; padding: 3px 0" type="text">部分完结</el-button>
              <el-button v-if="operateButton.superior" @click="superiorAppealDialog(userdatail.appeal)" icon="el-icon-top" style="float: right; padding: 3px 0" type="text">提交上级</el-button>
              <el-button v-if="operateButton.handle" @click="handleAppeal(userdatail.appeal)" icon="el-icon-top" style="float: right; padding: 3px 0" type="text">立即处理</el-button>
            </div>
            <div>
              <ul class="list-group list-group-striped">
                <li class="list-group-item">
                  诉求状态:
                  <span class="pull-right">{{ stateFormatByState(userdatail.state) }}</span>
                </li>
                <li class="list-group-item ">
                  诉求内容:
                  <el-card shadow="always">
                    {{ userdatail.content }}
                  </el-card>
                </li>
                <li class="list-group-item" v-if="userdatail.money">
                  诉求金额:
                  <div>{{ userdatail.money }}</div>
                </li>
                <li class="list-group-item" v-if="userdatail.solution && userdatail.solution !== ''">
                  解决办法:
                  <el-card shadow="always">
                    {{ userdatail.solution }}
                  </el-card>
                </li>
                <li class="list-group-item" v-if="userdatail.repay">
                  解决金额:
                  <div>{{ userdatail.repay }}</div>
                </li>
                <li class="list-group-item">
                  诉求进度:
                  <!-- <el-steps :active="appealProcessList.length" align-center>
                    <el-step :title="stateFormatByState(process.state)" :description="deptFormatByDept(process.dept)" v-for="process in appealProcessList" :key="process._id"></el-step>
                  </el-steps> -->
                  <el-timeline>
                    <el-timeline-item :type="'primary'" :size="'large'" :icon="process.icon" :timestamp="dateFormatISO(process.createdAt,fmt = 'YYYY/mm/dd')" placement="top" v-for="(process, index) in appealProcessList" :key="index">
                      <el-card>
                        <h3>{{ stateFormatByState(process.state) }}</h3>
                        <p v-if="process.solution && process.solution !== ''">
                          处理结果 : {{ process.solution }}
                        </p>
                        <p v-if="process.state === 'submitted' && index == 0">用户 提交于 {{ dateFormatISO(process.createdAt) }} </p>
                        <p v-else-if="process.state === 'evaluation'">用户 评价于 {{ dateFormatISO(process.createdAt) }} </p>
                        <p v-else>{{ deptFormatByDept(process.state,process.dept) }} {{ dateFormatISO(process.createdAt) }} </p>
                      </el-card>
                    </el-timeline-item>
                  </el-timeline>
                </li>
              </ul>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 提交上级对话框 -->
    <el-dialog :title="'诉求提交至上级部门'" :visible.sync="superiorOpen" width="600px" append-to-body>
      <el-form ref="superiorForm" :model="superiorForm" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级部门" prop="dept">
              <el-input v-model="superiorForm.deptname" :disabled="true" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="提交原因" prop="solution">
              <el-input v-model="superiorForm.solution" type="textarea" placeholder="请输入提交原因" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitSuperiorForm">确 定</el-button>
        <el-button @click="cancelSuperiorForm">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 诉求完结对话框 -->
    <el-dialog :title="'诉求完结'" :visible.sync="finishOpen" width="600px" append-to-body>
      <el-form ref="finishForm" :model="finishForm" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="解决办法" prop="solution">
              <el-input v-model="finishForm.solution" type="textarea" placeholder="请输入诉求最终解决办法" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFinishForm">确 定</el-button>
        <el-button @click="cancelFinishForm">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 部分完结对话框 -->
    <el-dialog :title="'诉求部分完结'" :visible.sync="partOpen" width="600px" append-to-body>
      <el-form ref="partForm" :model="partForm" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="部分完结原因" prop="solution">
              <el-input v-model="partForm.solution" type="textarea" placeholder="请输入部分完结原因" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="已偿还金额" prop="repay">
              <el-input v-model="partForm.repay" type="input" placeholder="请输入偿还金额" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitPartForm">确 定</el-button>
        <el-button @click="cancelPartForm">取 消</el-button>
      </div>
    </el-dialog>
    
    <!-- 群众办诉求处理对话框 -->
    <el-dialog :title="'分配归属部门'" :visible.sync="handleOpen" width="600px" append-to-body>
      <el-form ref="handleForm" :model="handleForm" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="归属部门" >
              <el-select v-model="handleForm.handleDept" placeholder="选择归属部门" >
                <el-option
                  v-for="item in handleDeptOptions"
                  :key="item._id"
                  :label="item.dept_name"
                  :value="item._id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitHandleForm">确 定</el-button>
        <el-button @click="cancelHandleForm">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { handleListAppeal, listAppealProcess, getAppeal, updateAppeal, delAppeal, exportAppeal, changeAppealStatus, handleAppealById, superiorAppeal, partAppeal ,finishAppeal ,departmentAppeal} from "@/api/appeal/appeal";
import { getDeptIdByUser } from "@/api/system/user";
import { treeselect, tableDept, tableHandleDept, getDept} from "@/api/system/dept";
import { listMasses } from "@/api/masses/massesMapping";
import { listRole } from "@/api/system/role";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import Vue from 'vue';
import AuthJwt from "@/utils/auth";
import { measureTextWidth } from '@antv/g2plot';

export default {
  name: "Appeal-handle",
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
      // 诉求表格数据
      appealList: null,
      // 诉求进度数据
      appealProcessList : [],
      // 弹出层标题
      title: "",
      // 部门树选项
      deptOptions: undefined,
      // 诉求处理部门树选项
      handleDeptOptions: undefined,
      // 是否显示弹出层
      open: false,
      // 是否显示诉求处理弹出层
      handleOpen: false,
      // 用户详情显示弹出层
      detailOpen: false,
      // 部分完结显示弹出层
      partOpen: false,
      // 诉求完结显示弹出层
      finishOpen: false,
      // 诉求提交上级显示弹出层
      superiorOpen: false,
      
      // 部门名称
      deptName: undefined,
      // 日期范围
      dateRange: [],
      // 状态数据字典
      stateOptions: [],
      // 诉求类型字典
      classesOptions: [] =[],
      // 部门选择
      deptsOptions: [],
      // 表单参数
      form: {},
      // 用户表单参数
      userForm: {},
      // 诉求处理表单参数
      handleForm: {},
      // 部分完结表单参数
      partForm: {},
      // 诉求完结表单参数
      finishForm: {},
      // 诉求提交上级表单参数
      superiorForm: {},
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 查询参数
      queryParams: {
        limit: 10,
        page: 1,
        sequence: undefined,
        classes: undefined,
        state: undefined,
        dept: undefined,
      },
      // 列信息
      columns: [
        { key: 0, label: `诉求编号`, visible: true },
        { key: 1, label: `诉求人姓名`, visible: true },
        { key: 2, label: `诉求人地址`, visible: true },
        { key: 3, label: `诉求类型`, visible: true },
        { key: 4, label: `诉求状态`, visible: true },
        { key: 5, label: `创建时间`, visible: true },
      ],
      // 表单校验
      rules: {
        solution: [
          { required: true, message: "提交原因/解决办法不能为空", trigger: "blur" }
        ],
      },
      // 诉求详情
      userdatail : {
        name : '',
        idCard : '',
        createdAt: ''
      },
      // 诉求操作按钮
      operateButton : {
        superior : false,
        part: false,
        finish: false,
        handle: false
      }
    };
  },
  watch: {
    // 根据名称筛选部门树
    deptName(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    this.getList();
    this.getDepts();
    this.getHandleDepts();
    this.getTreeselect();
    this.getDicts("sys_appeal_state").then(response => {
      this.stateOptions = response;
    });
    this.getDicts("sys_appeal_category", {dict_value: { $ne : 'debt'}}).then(response => {
      this.classesOptions = response;
    });
  },
  methods: {
    /** 查询诉求列表 */
    getList(param) {
      this.loading = true;
      getDeptIdByUser().then(response => {
        this.queryParams.dept = response;
        if(param && param.dept) this.queryParams.dept = param.dept;
        handleListAppeal(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
            this.appealList = response.docs;
            this.total = response.total;
            this.loading = false;
          }
        );        
      });
    },
    /** 查询用户所属部门id */
    getDeptId() {
      getDeptIdByUser().then(response => {
        this.queryParams.dept = response;
      });
    },
    /** 查询所有部门 */
    getDepts(){
      tableDept({is_deal_appeal : "0", limit: 1000}).then(response => {
        this.deptsOptions = response.docs;
      });
    },
    /** 查询群众办需要分配的诉求处理部门 */
    getHandleDepts(){
      tableHandleDept({is_deal_appeal : "1", dept_name : { $ne: "系统管理员" } , limit: 1000}).then(response => {
        this.handleDeptOptions = response.docs;
      });
    },
    /** 部门翻译 */
    deptFormat(row) {
      if(row.dept && row.dept !== undefined) {
        let dept = this.deptsOptions.filter(d=>{ 
          if(row.dept === d._id)
            return d;
        });
        if(dept && dept.length > 0)
          return dept[0]['dept_name']
      }
      else return '总部门';
    },
    /** 部门翻译(无table) */
    deptFormatByDept(state, dept) {
      if(dept && dept !== undefined) {
        let dept_ = this.deptsOptions.filter(d=>{ 
          if(dept === d._id)
            return d;
        });
        if(dept_ && dept_.length > 0) {
          if (state === "submitted")
            return dept_[0]['dept_name'] + ` 诉求处理部门 接收于`
          else 
            return dept_[0]['dept_name'] + ` 诉求处理部门 处理于`
        }
      }
      else return '未知部门 处理于';
    },
    /** 诉求人信息翻译 */
    massesFormat(row, column) {
      if(row.masses && row.masses !== undefined)
        return row.masses.name;
      else return '未知错误';
    },
    /** 诉求人地址翻译 */
    addressFormat(row, column) {
      if(row.masses && row.masses !== undefined && row.masses.habitation){
        row.masses.habitationInfo = row.masses.habitationInfo ? row.masses.habitationInfo : "";
        return row.masses.habitation.address_name + row.masses.habitationInfo;
      }
      else return '未知住址';
    },
    /** 诉求类别翻译 */
    classesFormat(row, column) {
      if(row.classes && row.classes !== undefined) {
        let classes = this.classesOptions.filter(d=>{ 
          if(row.classes === d.dict_value)
            return d;
        });
        if(classes && classes.length > 0)
          return classes[0]['dict_label']
      }
      else return '暂无类别';
    },
    /** 诉求类别翻译 */
    stateFormat(row) {
      if(row.state && row.state !== undefined) {
        let state = this.stateOptions.filter(d=>{ 
          if(row.state === d.dict_value)
            return d;
        });
        if(state && state.length > 0)
          return state[0]['dict_label']
      }
      else return '暂无类别';
    },
    /** 诉求类别翻译 (无table)*/
    stateFormatByState(state) {
      if(state && state !== undefined) {
        let state_ = this.stateOptions.filter(d=>{ 
          if(state === d.dict_value)
            return d;
        });
        if(state_ && state_.length > 0)
          return state_[0]['dict_label']
      }
      else return '暂无类别';
    },
    /** 根据id查询部门信息 */
    loadDept(deptid){
      getDept(deptid).then(response => {
        return response;
      })
    },
    /** 诉求详情 */
    appealDetail(row, event, column){
      this.appealProcessList  = [];
      this.userdatail = {
        name : '',
        idCard : '',
        createdAt: ''
      };
      this.operateButton = {
        superior : false,
        part: false,
        finish: false,
        handle: false
      }
      listMasses({idCard : row.ownerIdcard, populate: [{ path : 'habitation'}]}).then(response => {
        this.userdatail = response.docs[0];
        this.userdatail['content'] = row.content;
        this.userdatail['state'] = row.state;
        this.userdatail['appeal'] = row;
        if( row.money ) this.userdatail['money'] = row.money;
        if( row.repay ) this.userdatail['repay'] = row.repay;
        this.userdatail['solution'] = row.solution;
        if (row.dept)
          this.userdatail['dept'] = this.loadDept(row.dept) ;
        this.buttonState();
        this.getAppealProcess(row._id);
        this.detailOpen = true; 
      });
    },
    /** 控制诉求处理按钮显示 */
    buttonState(){
      if(AuthJwt.hasRoles('super')) return;
      if(AuthJwt.hasRoles('admin_county')) {
          this.operateButton.handle = true;
          return;
      }
      if(!AuthJwt.hasRoles('admin_towns') && !AuthJwt.hasRoles('admin_village'))
        return;
      switch (this.userdatail.state) {
        case 'submitted':
          this.operateButton.handle = true;
          break;
        case 'processing':
          // this.operateButton.part = true;
          this.operateButton.finish = true;
          this.operateButton.superior = true;
          break;
        case 'partiallyCompleted':
          // this.operateButton.part = true;
          this.operateButton.finish = true;
          this.operateButton.superior = true;
          break;
        default:
          break;
      }
    },
    /** 查询诉求处理流程 */
    getAppealProcess(appealID) {
      listAppealProcess({appeal : appealID , sort:'createdAt'}).then(response => {
        this.appealProcessList = response.docs;
        if(this.appealProcessList.length <= 0) return;
        for (let process of this.appealProcessList) {
          switch (process.state) {
            case 'submitted':
              process.icon = 'el-icon-document-checked';
              break;
            case 'processing':
              process.icon = 'el-icon-time';
              break;
            case 'completed':
              process.icon = 'el-icon-finished';
              break;
            case 'partiallyCompleted':
              process.icon = 'el-icon-chat-line-square';
              break;
            case 'evaluation':
              process.icon = 'el-icon-document';
              break;
            default:
              process.icon = 'el-icon-document-checked';
              break;
          }
        }
      });
    },

    /** 查询部门下拉树结构 */
    getTreeselect() {
      treeselect({is_deal_appeal : "0"}).then(response => {
        this.deptOptions = response;
      });
    },
    // 打开诉求全部完结对话框
    finishAppealDialog(appeal) {
      if(AuthJwt.hasRoles('admin_county') || AuthJwt.hasRoles('super'))
        return;
        this.finishForm = {
          appeal: appeal._id,
          solution : ""
        }
        this.finishOpen = true;
    },
    // 诉求全部完结
    submitFinishForm (){
      if(this.finishForm.solution == "" || !this.finishForm.solution) return;
      finishAppeal(this.finishForm).then(response => {
        this.finishOpen = false; 
        this.detailOpen = false; 
        this.getList();
        this.msgSuccess("操作成功!");
      });
    },
    // 关闭诉求全部完结对话框
    cancelFinishForm (){
        this.partForm = {
          appeal: "",
          solution : ""
        }
        this.finishOpen = false;
    },

    // 打开诉求部分完结对话框
    partAppealDialog(appeal) {
      if(AuthJwt.hasRoles('admin_county') || AuthJwt.hasRoles('super'))
        return;
        this.partForm = {
          appeal: appeal._id,
          repay : "",
          solution : ""
        }
        this.partOpen = true;
    },
    // 诉求部分完结
    submitPartForm (){
      if(this.partForm.solution == "" || !this.partForm.solution) return;
      if(this.partForm.repay == "" || !this.partForm.repay) return;
      partAppeal(this.partForm).then(response => {
        this.partOpen = false; 
        this.detailOpen = false; 
        this.getList();
        this.msgSuccess("操作成功!");
      });
    },

    // 关闭诉求部分完结对话框
    cancelPartForm (){
        this.partForm = {
          appeal: "",
          repay : "",
          solution : ""
        }
        this.partOpen = false;
    },
    
    // 打开诉求提交上级对话框
    superiorAppealDialog(appeal) {
      if(AuthJwt.hasRoles('admin_county') || AuthJwt.hasRoles('super'))
        return;
      getDept(appeal.dept).then(response => {
        let dept = response;
        if ( !dept.parent ) return;
        this.superiorForm = {
            appeal: appeal._id,
            dept : dept.parent,
            deptname : this.deptFormat({dept : dept.parent}),
            solution : ""
        }
        this.superiorOpen = true;
      })
    },
    // 诉求提交上级
    submitSuperiorForm (){
      if(this.superiorForm.solution == "" || !this.superiorForm.solution) return;
      superiorAppeal(this.superiorForm).then(response => {
        this.superiorOpen = false; 
        this.detailOpen = false; 
        this.getList();
        this.msgSuccess("诉求已成功提交至上级部门处理!");
      });
    },
    // 关闭诉求提交上级对话框
    cancelSuperiorForm (){
      this.superiorForm = {
          appeal: "",
          dept : "",
          deptname : "",
          solution : ""
      }
      this.superiorOpen = false;
    },
    // 诉求处理
    handleAppeal(appeal) {
      if(AuthJwt.hasRoles('admin_county')) {
        this.handleForm = {
          appeal: appeal._id,
          handleDept : ""
        }
        this.handleOpen = true;
        return;
      }
      let that = this;
      this.$confirm('确认要开始处理此诉求吗?', "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return handleAppealById(appeal._id);
        }).then(function() {
          that.msgSuccess("已开始处理诉求");
          that.detailOpen = false;
          that.getList();
          that.reloadAppealCount();
        }).catch(function() {
        });
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
        dept: undefined,
        sequence: undefined,
        content: undefined,
        money: undefined,
        processor: undefined,
        solution: undefined,
        repay: undefined,
        state: '0',
        ownerIdcard: undefined,
      };
      this.resetForm("form");
    },
    // 取消按钮
    cancelHandleForm() {
      this.handleOpen = false;
      this.handleForm = {
        appeal: "",
        handleDept : ""
      }
      this.handleReset();
    },
    submitHandleForm(){
      if(this.handleForm.handleDept == "" || !this.handleForm.handleDept) return;
      departmentAppeal(this.handleForm).then(response => {
        this.handleOpen = false; 
        this.detailOpen = false; 
        this.getList();
        this.msgSuccess("诉求已成功提交至所属部门处理!");
        this.reloadAppealCount();
      });
    },
    // 重新加载待处理诉求数量
    reloadAppealCount(){
      this.$store.dispatch('GetAppealCount');
    },
    // 表单重置
    handleReset() {
      this.handleForm = {};
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
        sequence: undefined,
        classes: undefined,
        state: undefined,
        dept: undefined,
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
      const userId = row._id || this.ids;
      getAppeal(userId).then(response => {
        this.form = response;
        // this.form.role = response.role;
        this.open = true;
        this.title = "修改诉求";
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
      const appealIds = row._id || this.ids;
      this.$confirm('是否确认删除诉求编号为"' + row.sequence + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return updateAppeal(appealIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有诉求数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportAppeal(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    }
  }
};
</script>