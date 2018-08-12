<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form>
        <el-form-item>
          <el-button type="primary" icon="plus" @click="showCreate" v-if="hasPerm('surveyType:add')">添加
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="拼命加载中" border fit
              highlight-current-row>
      <el-table-column align="center" prop="surveyTypeName" label="问卷类型" style="width: 60px;"></el-table-column>
      <el-table-column align="center" label="管理" width="200" v-if="hasPerm('surveyType:update')">
        <template slot-scope="scope">
          <el-button type="primary" icon="edit" @click="showUpdate(scope.$index)">修改</el-button>
          <el-button type="danger" icon="delete" @click="removeSurveyType(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form class="small-space" :model="tempSurveyType" label-position="left" label-width="120px"
               style='width: 600px; margin-left:50px;'>
        <el-form-item label="问卷类型名称">
          <el-input type="text" required v-model="tempSurveyType.surveyTypeName"> </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="success" @click="createSurveyType">创 建</el-button>
        <el-button type="primary" v-else @click="updateSurveyType">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import { getAllSurveyTypes, addSurveyType, updateSurveyType, deleteSurveyType } from '@/api/surveyType'
  export default {
    data() {
      return {
        list: [], // 所有问卷信息
        listLoading: false, // 数据加载等待动画
        dialogStatus: 'create',
        dialogFormVisible: false,
        textMap: {
          update: '编辑问卷类型',
          create: '新建问卷类型'
        },
        tempSurveyType: {
          pkSurveyType: '',
          surveyTypeName: ''
        }
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        // 查询问卷类型列表
        if (!this.hasPerm('surveyType:list')) {
          return
        }
        this.listLoading = true
        getAllSurveyTypes().then(data => {
          this.listLoading = false
          this.list = data.data
        })
      },
      showCreate() {
        // 显示新增对话框
        this.tempSurveyType.pkSurveyType = ''
        this.tempSurveyType.surveyTypeName = ''
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
      },
      showUpdate($index) {
        // 显示修改对话框
        this.tempSurveyType.pkSurveyType = this.list[$index].pkSurveyType
        this.tempSurveyType.surveyTypeName = this.list[$index].surveyTypeName
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
      },
      createSurveyType() {
        // 添加问卷类型
        addSurveyType(this.tempSurveyType).then(() => {
          this.getList()
          this.dialogFormVisible = false
        })
      },
      updateSurveyType() {
        // 修改问卷类型
        updateSurveyType(this.tempSurveyType).then(() => {
          this.getList()
          this.dialogFormVisible = false
        })
      },
      removeSurveyType($index) {
        this.$confirm('确定删除此问卷类型?', '提示', {
          confirmButtonText: '确定',
          showCancelButton: false,
          type: 'warning'
        }).then(() => {
          const survey = this.list[$index]
          deleteSurveyType(survey.pkSurveyType).then(() => {
            this.getList()
          }).catch(e => {
          })
        })
      }
    }
  }
</script>
