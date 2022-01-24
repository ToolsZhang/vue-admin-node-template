<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" v-show="showSearch" :inline="true">
      <el-form-item label="轮播图名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入轮播图名称"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="轮播图状态"
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
      <el-table-column label="轮播图名称" align="center" prop="name" :show-overflow-tooltip="true"  />
      <el-table-column label="所在位置" align="center" prop="position" :formatter="positionFormat"/>
      <el-table-column label="轮播图" align="center" prop="image" :show-overflow-tooltip="true" > 
        <template slot-scope="scope">
          <el-image 
            style="height: 100px"
            :src="scope.row.image" 
            :preview-src-list="[scope.row.image]">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="跳转路由" align="center" prop="routerLink" />
      <el-table-column label="跳转参数" align="center" prop="params"  />
      <el-table-column label="显示顺序" align="center" prop="order"  />
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

    <!-- 添加或修改轮播图配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form"  :rules="rules" label-width="120px">
        <el-form-item label="轮播图名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入轮播图名称" />
        </el-form-item>
        <el-form-item label="轮播图位置" prop="position" >
          <el-select v-model="form.position" placeholder="选择轮播图位置" >
            <el-option
              v-for="item in positionOptions"
              :key="item.dict_value"
              :label="item.dict_label"
              :value="item.dict_value"
            ></el-option>
          </el-select>
        </el-form-item>    
        <el-form-item label="轮播图片"  prop="image">
          <el-image 
            style="width: 100px; height: 100px"
            :src="form.image" 
            :preview-src-list="[form.image]"
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
        <el-form-item label="跳转路由" prop="routerLink">
          <el-input v-model="form.routerLink" placeholder="请输入跳转路由" />
        </el-form-item> 
        <el-form-item label="跳转参数" prop="params">
          <el-input v-model="form.params" placeholder="请输入跳转参数" />
        </el-form-item>
        <el-form-item label="轮播图顺序" prop="order">
          <el-input-number v-model="form.order" controls-position="right" :min="0" />
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
import { listBanner, getBanner, delBanner, addBanner, updateBanner, exportRole, dataScope, changeRoleStatus } from "@/api/system/banner";
import { bannerUpload } from "@/api/fileupload/fileupload";
import AuthJwt from "@/utils/auth";
export default {
  name: "Banner",
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
      // 轮播图表格数据
      bannerList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 日期范围
      dateRange: [],
      // 状态数据字典
      statusOptions: [],
      // 轮播图位置字典
      positionOptions: [],
      // 查询参数
      queryParams: {
        page: 1,
        limit: 10,
        name: undefined,
        status: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [
          { required: true, message: "轮播图名称不能为空", trigger: "blur" }
        ],
        position: [
          { required: true, message: "请选择轮播图位置", trigger: "change" }
        ],
        image: [
          { required: true, message: "请上传轮播图", trigger: "change" }
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
    this.getDicts("sys_banner_position").then(response => {
      this.positionOptions = response;
    });
  },
  methods: {
    /** 查询轮播图列表 */
    getList() {
      this.loading = true;
      listBanner(this.addDateRange(this.queryParams, this.dateRange)).then(
        response => {
          this.bannerList = response.docs;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    // 轮播图状态修改
    handleStatusChange(row) {
      let text = row.status === "0" ? "启用" : "停用";
      this.$confirm('确认要"' + text + '""' + row.name + '"轮播图吗?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return changeBannerStatus(row._id, row.status);
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
    /** 轮播位置翻译 */
    positionFormat(row) {
      if(row.position && row.position !== undefined) {
        let position = this.positionOptions.filter(d=>{ 
          if(row.position === d.dict_value)
            return d;
        });
        if(position && position.length > 0)
          return position[0]['dict_label']
      }
      return '暂无轮播位置';
    },
    // 表单重置
    reset() {
      if (this.$refs.menu != undefined) {
        this.$refs.menu.setCheckedKeys([]);
      }
      this.form = {
        _id: undefined,
        name: undefined,
        order: 0,
        status: "0",
        image: undefined,
        routerLink: undefined,
        params: undefined,
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
        page: 1,
        limit: 10,
        name: undefined,
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
      this.title = "添加轮播图";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const bannerId = row._id || this.ids
      getBanner(bannerId).then(response => {
        this.form = response;
        this.open = true;
        this.title = "修改轮播图";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          bannerUpload(this.file).then(response => {
            if(response && response.url) this.form.image = response.url;
            if (this.form._id != undefined) {
              updateBanner(this.form).then(response => {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addBanner(this.form).then(response => {
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
      this.$confirm('是否确认删除轮播图id为"' + bannerIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delBanner(bannerIds);
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
          this.form.image = reader.result;
        };
      }
    },
  }
};
</script>