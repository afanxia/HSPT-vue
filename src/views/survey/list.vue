<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form>
        <el-form-item>
          <el-button type="primary" icon="plus" @click="showCreate" v-if="hasPerm('survey:add')">添加
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="拼命加载中" border fit
              highlight-current-row>
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="问卷描述：">
              <span>{{ props.row.description }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column align="center" label="序号" width="80">
        <template slot-scope="scope">
          <span v-text="getIndex(scope.$index)"> </span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="surveyName" label="问卷标题" style="width: 60px;"></el-table-column>
      <el-table-column align="center" prop="pkSurveyType" label="问卷类型" style="width: 60px;"></el-table-column>
      <el-table-column align="center" prop="department" label="所属科室" style="width: 60px;"></el-table-column>
      <el-table-column align="center" prop="sendOnRegister" label="注册时发送" style="width: 60px;">
        <template slot-scope="scope">
          <span v-text="SOR(scope.$index)"> </span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="frequency" label="发送频率" style="width: 60px;">
        <template slot-scope="scope">
          <span v-text="FREQ(scope.$index)"> </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="管理" width="200" v-if="hasPerm('survey:update')">
        <template slot-scope="scope">
          <el-button type="primary" icon="edit" @click="showUpdate(scope.$index)">修改</el-button>
          <el-button type="danger" icon="delete" @click="removeSurvey(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="listQuery.pageNum"
      :page-size="listQuery.pageRow"
      :total="totalCount"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form class="small-space" :model="tempSurvey" label-position="left" label-width="120px"
               style='width: 600px; margin-left:50px;'>
        <el-form-item label="问卷标题">
          <el-input type="text" required v-model="tempSurvey.surveyName"> </el-input>
        </el-form-item>
        <el-form-item label="问卷类型">
          <el-select v-model="tempSurvey.pkSurveyType" placeholder="请选择">
            <el-option
              v-for="item in surveyTypelist"
              :key="item.pkSurveyType"
              :label="item.surveyTypeName"
              :value="item.pkSurveyType">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属科室">
          <el-input type="text" v-model="tempSurvey.department"> </el-input>
        </el-form-item>
        <el-form-item label="问卷描述">
          <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="tempSurvey.description"> </el-input>
        </el-form-item>
        <el-form-item label="注册时发送">
          <el-checkbox v-model="tempSurvey.sendOnRegister"></el-checkbox>
        </el-form-item>
        <el-form-item label="发送频率(间隔月)">
          <el-input-number v-model="tempSurvey.frequency" @change="handleChange" :min="1" :max="12"> </el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="success" @click="createSurvey">创 建</el-button>
        <el-button type="primary" v-else @click="updateSurvey">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import { getAllSurveyTypes, getSurveyInfos, addSurvey, updateSurvey, deleteSurvey } from '@/api/survey'
  export default {
    data() {
      return {
        totalCount: 0, // 分页组件--数据总条数
        list: [], // 所有问卷信息
        surveyTypelist: [], // 所有问卷类型，用于下拉菜单
        listLoading: false, // 数据加载等待动画
        listQuery: {
          pageNum: 1, // 页码
          pageRow: 50, // 每页条数
          name: ''
        },
        dialogStatus: 'create',
        dialogFormVisible: false,
        textMap: {
          update: '编辑问卷',
          create: '新建问卷'
        },
        tempSurvey: {
          pkSurvey: '',
          pkSurveyType: '',
          surveyName: '',
          department: '',
          description: '',
          sendOnRegister: '',
          frequency: ''
        }
      }
    },
    created() {
      this.getSurveyList()
      this.getSurveyTypeList()
    },
    methods: {
      getSurveyList() {
        // 查询问卷列表
        if (!this.hasPerm('survey:list')) {
          return
        }
        this.listLoading = true
        getSurveyInfos(this.listQuery).then(data => {
          this.listLoading = false
          this.list = data.data
          this.totalCount = data.data.length
        })
      },
      getSurveyTypeList() {
        // 查询问卷列表
        if (!this.hasPerm('surveyType:list')) {
          return
        }
        this.listLoading = true
        getAllSurveyTypes().then(data => {
          this.listLoading = false
          this.surveyTypelist = data.data
        })
      },
      handleSizeChange(val) {
        // 改变每页数量
        this.listQuery.pageRow = val
        this.handleFilter()
      },
      handleCurrentChange(val) {
        // 改变页码
        this.listQuery.pageNum = val
        this.getSurveyList()
      },
      getIndex($index) {
        // 表格序号
        return (this.listQuery.pageNum - 1) * this.listQuery.pageRow + $index + 1
      },
      showCreate() {
        // 显示新增对话框
        this.tempSurvey.pkSurvey = ''
        this.tempSurvey.pkSurveyType = ''
        this.tempSurvey.surveyName = ''
        this.tempSurvey.department = ''
        this.tempSurvey.description = ''
        this.tempSurvey.sendOnRegister = ''
        this.tempSurvey.frequency = ''
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
      },
      SOR($index) {
        return this.list[$index].sendOnRegister
      },
      FREQ($index) {
        return this.list[$index].frequency + '个月'
      },
      showUpdate($index) {
        // 显示修改对话框
        this.tempSurvey.pkSurvey = this.list[$index].pkSurvey
        this.tempSurvey.pkSurveyType = this.list[$index].pkSurveyType
        this.tempSurvey.surveyName = this.list[$index].surveyName
        this.tempSurvey.department = this.list[$index].department
        this.tempSurvey.description = this.list[$index].description
        this.tempSurvey.sendOnRegister = this.list[$index].sendOnRegister
        this.tempSurvey.frequency = this.list[$index].frequency
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
      },
      createSurvey() {
        // 添加问卷
        addSurvey(this.tempSurvey).then(() => {
          this.getSurveyList()
          this.dialogFormVisible = false
        })
      },
      updateSurvey() {
        // 修改问卷
        updateSurvey(this.tempSurvey).then(() => {
          this.getSurveyList()
          this.dialogFormVisible = false
        })
      },
      removeSurvey($index) {
        this.$confirm('确定删除此问卷?', '提示', {
          confirmButtonText: '确定',
          showCancelButton: false,
          type: 'warning'
        }).then(() => {
          const survey = this.list[$index]
          deleteSurvey(survey.pkSurvey).then(() => {
            this.getSurveyList()
          }).catch(e => {
          })
        })
      }
    }
  }
</script>
