<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" v-show="showSearch" :inline="true">
      <el-form-item label="公告标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入公告标题"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="公告状态"
          clearable
          size="small"
          style="width: 240px"
        >
        <el-option
            :key="'0'"
            :label="'启用'"
            :value="'0'"
          />
          <el-option
            :key="'1'"
            :label="'停用'"
            :value="'1'"
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
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:banner:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:banner:edit']"
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
          v-hasPermi="['system:banner:remove']"
        >删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="bannerList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="公告标题" align="center" prop="title" :show-overflow-tooltip="true"  />
      <el-table-column label="公告类别" align="center" prop="classes" :formatter="classesFormat"/>
      <el-table-column label="公告封面" align="center" prop="cover" :show-overflow-tooltip="true" > 
        <template slot-scope="scope">
          <el-image 
            style="height: 100px"
            :src="scope.row.cover" 
            :preview-src-list="[scope.row.cover]">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="公告内容" align="center" prop="content" />
      <el-table-column label="状态" align="center" >
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-value="0"
            inactive-value="1"
            @change="handleStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createdAt">
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
            v-hasPermi="['system:banner:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:banner:remove']"
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

    <!-- 添加或修改公告配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form"  :rules="rules" label-width="120px">
        <el-form-item label="公告标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入公告标题" />
        </el-form-item>
        <el-form-item label="公告类别" prop="classes" >
          <el-select v-model="form.classes" placeholder="选择公告类别" >
            <el-option
              v-for="item in classesOptions"
              :key="item.dict_value"
              :label="item.dict_label"
              :value="item.dict_value"
            ></el-option>
          </el-select>
        </el-form-item>    
        <el-form-item label="公告封面"  prop="cover">
          <el-image 
            style="width: 100px; height: 100px"
            :src="form.cover" 
            :preview-src-list="[form.cover]"
            :z-index="9999">
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
          <el-upload
            action="#"
            :show-file-list="false"
            :http-request="requestUpload"
            :before-upload="beforeUpload"
            >
            <el-button size="small">
              选择
              <i class="el-icon-upload el-icon--right"></i>
            </el-button>
          </el-upload>
        </el-form-item>  
        <el-form-item label="公告内容" prop="content">
          <el-input v-model="form.content"  type="textarea"  placeholder="请输入公告内容" />
        </el-form-item> 
        <el-form-item label="接收类型" prop="receive" v-if="form.classes ==='workOrder'">
          <el-select v-model="form.receive" placeholder="选择公告接收类型" >
            <el-option
              v-for="item in receiveOptions"
              :key="item.dict_value"
              :label="item.dict_label"
              :value="item.dict_value"
            ></el-option>
          </el-select>
        </el-form-item>  
        <el-form-item label="接收单位" prop="workUnits" v-if="form.receive ==='some'">
          <treeselect v-model="form.workUnits" :options="unitOptions" :show-count="true" placeholder="请选择接收工作单位" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio
              :key="'0'"
              :label="'0'"
            >启用</el-radio>
            <el-radio
              :key="'1'"
              :label="'1'"
            >停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import { listMessage, getMessage, delMessage, addMessage, updateMessage, } from "@/api/system/message";
import { imagesUpload } from "@/api/fileupload/fileupload";
import AuthJwt from "@/utils/auth";
import { treeselect} from "@/api/cadre/unit";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import Vue from 'vue'
export default {
  name: "Message",
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
      // 公告表格数据
      bannerList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 日期范围
      dateRange: [],
      // 状态数据字典
      statusOptions: [],
      // 公告类别字典
      classesOptions: [],
      // 公告接收类型字典
      receiveOptions: [],
      // 公告接收工作单位树选项
      unitOptions: undefined,
      // 查询参数
      queryParams: {
        page: 1,
        limit: 10,
        title: undefined,
        status: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        title: [
          { required: true, message: "公告标题不能为空", trigger: "blur" }
        ],
        content: [
          { required: true, message: "公告内容不能为空", trigger: "blur" }
        ],
        classes: [
          { required: true, message: "请选择公告类别", trigger: "change" }
        ],
      },
      plusVisible: true,
      file:'',
      dialogImageUrl: '',
      dialogVisible: false,
      headers: { Authorization: 'Bearer ' + AuthJwt.jwt }
    };
  },
  created() {
    this.getList();
    this.getTreeselect();
    this.getDicts("sys_message_classes").then(response => {
      this.classesOptions = response;
    });
    this.getDicts("sys_message_receive").then(response => {
      this.receiveOptions = response;
    });
  },
  methods: {
    /** 查询公告列表 */
    getList() {
      this.loading = true;
      listMessage(this.addDateRange(this.queryParams, this.dateRange)).then(
        response => {
          this.bannerList = response.docs;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    /** 查询工作单位下拉树结构 */
    getTreeselect() {
      treeselect().then(response => {
        this.unitOptions = response;
      });
    },
    // 公告状态修改
    handleStatusChange(row) {
      let text = row.status === "0" ? "启用" : "停用";
      this.$confirm('确认要"' + text + '""' + row.title + '"公告吗?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return changeMessageStatus(row._id, row.status);
        }).then(() => {
          this.msgSuccess(text + "成功");
        }).catch(function() {
          row.status = row.status === "0" ? "1" : "0";
        });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    /**公告类别翻译 */
    classesFormat(row) {
      if(row.classes && row.classes !== undefined) {
        let classes = this.classesOptions.filter(d=>{ 
          if(row.classes === d.dict_value)
            return d;
        });
        if(classes && classes.length > 0)
          return classes[0]['dict_label']
      }
      return '暂无公告类别';
    },
    // 表单重置
    reset() {
      if (this.$refs.menu != undefined) {
        this.$refs.menu.setCheckedKeys([]);
      }
      this.form = {
        _id: undefined,
        title: undefined,
        order: 0,
        status: "0",
        cover: undefined,
        content: undefined,
        receive: 'all',
        workUnits: undefined,
        classes: undefined,
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
        page: 1,
        limit: 10,
        title: undefined,
        status: undefined
      }
      this.getList();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item._id)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加公告";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const bannerId = row._id || this.ids
      getMessage(bannerId).then(response => {
        this.form = response;
        this.open = true;
        this.title = "修改公告";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          imagesUpload(this.file).then(response => {
            if(response && response.url) this.form.cover = response.url;
            if (this.form._id != undefined) {
              updateMessage(this.form).then(response => {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addMessage(this.form).then(response => {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              });
            }  
          });
          
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const bannerIds = row._id || this.ids;
      this.$confirm('是否确认删除公告id为"' + bannerIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delMessage(bannerIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    requestUpload(file){
      console.log(file);
    },
    beforeUpload(file){
      this.file = file;
      if (file.type.indexOf("image/") == -1) {
        this.msgError("文件格式错误，请上传图片类型,如：JPG，PNG后缀的文件。");
      } else {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.form.cover = reader.result;
        };
      }
    },
  }
};
</script>