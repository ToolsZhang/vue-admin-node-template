<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input
            v-model="deptName"
            placeholder="请输入部门名称"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px"
          />
        </div>
        <div class="head-container">
          <el-tree
            :data="deptOptions"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree"
            default-expand-all
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <!--诉求数据-->
      <el-col :span="20" :xs="24">
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
          <el-form-item label="诉求状态" prop="state">
            <el-select
              v-model="queryParams.state"
              placeholder="诉求状态"
              clearable
              size="small"
              style="width: 120px"
            >
            <el-option
              v-for="dict in stateOptions"
              :key="dict.dict_value"
              :label="dict.dict_label"
              :value="dict.dict_value"
            />
            </el-select>
          </el-form-item>
          <el-form-item label="满意度" prop="satisfaction">
            <el-select
              v-model="queryParams.satisfaction"
              placeholder="满意度"
              clearable
              size="small"
              style="width: 120px"
            >
            <el-option
              v-for="dict in satisfactionOptions"
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
            <el-button type="info" icon="el-icon-position" size="mini" v-if="queryParams.dept" >{{ deptFormat({dept : queryParams.dept}) }}</el-button>
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
          <el-table-column label="诉求人身份证号" align="center" key="ownerIdcard" prop="ownerIdcard" v-if="columns[1].visible" width="230"/>
          <el-table-column label="诉求类型" align="center" prop="classes" :formatter="classesFormat" v-if="columns[2].visible" :show-overflow-tooltip="true" />
          <el-table-column label="所属部门" align="center" prop="dept" :formatter="deptFormat" v-if="columns[3].visible" :show-overflow-tooltip="true"  width="200"/>
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
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click.native.stop="handleUpdate(scope.row)"
                v-hasPermi="['system:user:edit']"
              >修改</el-button>
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
      </el-col>
    </el-row>
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
                  所属单位
                  <div class="pull-right" v-if="userdatail.habitation">{{ userdatail.habitation.address_name }}</div>
                </li>
                <li class="list-group-item">
                  创建日期
                  <div class="pull-right">{{ dateFormatISO(userdatail.createdAt,fmt = 'YYYY-mm-dd') }}</div>
                </li>
                <!-- <li class="list-group-item">
                  <svg-icon icon-class="money" />债务金额
                  <div class="pull-right" v-if="appeal.money" >{{ appeal.money }}</div>
                </li> -->
              </ul>
            </div>
          </el-card>
        </el-col>
        <el-col :span="17" :xs="24">
          <el-card>
            <div slot="header" class="clearfix">
              <span>诉求详情</span>
            </div>
            <div>
              <ul class="list-group list-group-striped">
                <li class="list-group-item">
                  诉求状态
                  <div class="pull-right">{{ stateFormatByState(userdatail.state) }}</div>
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
                  <el-timeline>
                    <el-timeline-item :type="'primary'" :size="'large'" :icon="process.icon" :timestamp="dateFormatISO(process.createdAt,fmt = 'YYYY/mm/dd')" placement="top" v-for="(process, index) in appealProcessList" :key="index">
                      <el-card>
                        <h3>{{ stateFormatByState(process.state) }}</h3>
                        <p v-if="process.solution && process.solution !== ''">
                          处理结果 : {{ process.solution }}
                        </p>
                        <p v-if="process.state === 'submitted' && index == 0">用户 提交于 {{ dateFormatISO(process.createdAt) }} </p>
                        <p v-else-if="process.state === 'evaluation'">用户 评价于 {{ dateFormatISO(process.createdAt) }} </p>
                        <p v-else>{{ deptFormatByDept(process.state, process.dept) }} {{ dateFormatISO(process.createdAt) }} </p>
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
    <!-- 修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="诉求编号" prop="sequence">
              <el-input v-model="form.sequence" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="诉求状态">
              <el-select v-model="form.state" placeholder="请选择">
                <el-option
                  v-for="item in stateOptions"
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
            <el-form-item label="诉求者" prop="ownerIdcard">
              <el-input v-model="form.ownerIdcard" :disabled="true" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="诉求类型">
              <el-select v-model="form.classes" placeholder="暂无" :disabled="true">
                <el-option
                  v-for="item in classesOptions"
                  :key="item.dict_value"
                  :label="item.dict_label"
                  :value="item.dict_value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="满意度">
              <el-select v-model="form.satisfaction" placeholder="暂无" :disabled="true">
                <el-option
                  v-for="item in satisfactionOptions"
                  :key="item.dict_value"
                  :label="item.dict_label"
                  :value="item.dict_value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="form.repay">
          <el-col :span="12">
            <el-form-item label="诉求金额" prop="money">
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
            <el-form-item label="归属部门" :span="24" >
              <el-select v-model="form.dept" placeholder="暂无" :disabled="true">
                <el-option
                  v-for="item in deptOptions"
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
            <el-form-item label="诉求内容">
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
    <!-- 用户详情对话框 -->
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
    <!-- 诉求导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">
          <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的诉求数据
          <el-link type="info" style="font-size:12px" @click="importTemplate">下载模板</el-link>
        </div>
        <div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许导入“xls”或“xlsx”格式文件！</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listAppeal, listAppealProcess, getAppeal, updateAppeal, delAppeal, exportAppeal, changeAppealStatus } from "@/api/appeal/appeal";
import { getDeptIdByUser, importTemplate } from "@/api/system/user";
import { treeselect, tableDept} from "@/api/system/dept";
import { listMasses } from "@/api/masses/massesMapping";
import { listRole } from "@/api/system/role";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import Vue from 'vue'

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
      // 弹出层标题
      title: "",
      // 部门树选项
      deptOptions: undefined,
      // 是否显示弹出层
      open: false,
      // 是否显示用户弹出层
      useropen: false,
      // 用户详情显示弹出层
      detailOpen: false,
      // 部门名称
      deptName: undefined,
      // 日期范围
      dateRange: [],
      // 状态数据字典
      stateOptions: [],
      // 诉求类型字典
      classesOptions: [],
      // 诉求满意度字典
      satisfactionOptions: [],
      // 诉求进度数据
      appealProcessList : [],
      // 部门选择
      deptsOptions: [],
      // 表单参数
      form: {},
      // 用户表单参数
      userForm: {},
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 诉求导入参数
      upload: {
        // 是否显示弹出层（诉求导入）
        open: false,
        // 弹出层标题（诉求导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的诉求数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer "  },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/system/user/importData"
      },
      // 查询参数
      queryParams: {
        limit: 10,
        page: 1,
        sequence: undefined,
        classes: undefined,
        state: undefined,
        dept: undefined,
        satisfaction: undefined
      },
      // 列信息
      columns: [
        { key: 0, label: `诉求编号`, visible: true },
        { key: 1, label: `诉求人身份证号`, visible: true },
        { key: 2, label: `诉求类型`, visible: true },
        { key: 3, label: `所属部门`, visible: true },
        { key: 4, label: `诉求状态`, visible: true },
        { key: 5, label: `创建时间`, visible: true },
      ],
      // 表单校验
      rules: {
      },
      // 诉求详情
      userdatail : {
        name : '',
        idCard : '',
        createdAt: ''
      },
      // 诉求详情步骤Html
      stepHtml:''
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
    this.getList();
    this.getDepts();
    this.getTreeselect();
    this.getDicts("sys_appeal_satisfaction").then(response => {
      this.satisfactionOptions = response;
    });
    this.getDicts("sys_appeal_state").then(response => {
      this.stateOptions = response;
    });
    this.getDicts("sys_appeal_category").then(response => {
      this.classesOptions = response;
    });
  },
  methods: {
    /** 查询诉求列表 */
    getList(param) {
      this.loading = true;
      getDeptIdByUser().then(response => {
        this.queryParams.dept = response;
        if (param && param.dept) this.queryParams.dept = param.dept;
        listAppeal(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
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
    /** 诉求详情 */
    appealDetail(row, event, column){
      this.appealProcessList  = [];
      this.userdatail = {
        name : '',
        idCard : '',
        createdAt: ''
      };
      listMasses({idCard : row.ownerIdcard, populate: [{ path : 'habitation'}]}).then(response => {
        this.detailOpen = true;
        this.userdatail = response.docs[0];
        this.userdatail['content'] = row.content;
        this.userdatail['state'] = row.state;
        if( row.money ) this.userdatail['money'] = row.money;
        if( row.repay ) this.userdatail['repay'] = row.repay;
        this.userdatail['solution'] = row.solution;
        this.getAppealProcess(row._id);
      });
    },
    /** 查询诉求处理流程 */
    getAppealProcess(appealID) {
      listAppealProcess({appeal : appealID}).then(response => {
        this.appealProcessList = response.docs;
        console.log(this.appealProcessList);
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
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      // console.log(data);
      // this.queryParams.dept = data.id;
      this.getList({dept : data.id});
    },
    // 诉求状态修改
    handleStatusChange(row) {
      let text = row.state === '0' ? "启用" : "停用";
      this.$confirm('确认要"' + text + '""' + row.user_name + '"诉求吗?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return changeAppealStatus(row._id, row.state);
        }).then(() => {
          this.msgSuccess(text + "成功");
        }).catch(function() {
          row.state = row.state === '0' ? '1' : '0';
        });
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
        dept: undefined,
        sequence: undefined,
        content: undefined,
        money: undefined,
        satisfaction: undefined,
        processor: undefined,
        solution: undefined,
        repay: undefined,
        state: '0',
        ownerIdcard: undefined,
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
        sequence: undefined,
        classes: undefined,
        state: undefined,
        dept: undefined,
        satisfaction: undefined
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
        this.title = "添加诉求";
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
          return delAppeal(appealIds);
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
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "诉求导入";
      this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      importTemplate().then(response => {
        this.download(response.msg);
      });
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert(response.msg, "导入结果", { dangerouslyUseHTMLString: true });
      this.getList();
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    }
  }
};
</script>