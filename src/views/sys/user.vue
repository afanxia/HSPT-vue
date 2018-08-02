<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form>
        <el-form-item>
          <el-button type="primary" icon="plus" v-if="hasPerm('user:add')" @click="showCreate">添加
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="拼命加载中" border fit
              highlight-current-row>
      <el-table-column align="center" label="序号" width="80">
        <template slot-scope="scope">
          <span v-text="getIndex(scope.$index)"> </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户名" prop="userCode" style="width: 60px;"></el-table-column>
      <el-table-column align="center" label="姓名" prop="userName" style="width: 60px;"></el-table-column>
      <el-table-column align="center" label="角色" width="100">
        <template slot-scope="scope">
          <el-tag type="success" v-text="scope.row.roleName" v-if="scope.row.roleCode==='SYS_ADMIN'"></el-tag>
          <el-tag type="primary" v-text="scope.row.roleName" v-else></el-tag>
        </template>
      </el-table-column>
      <!--<el-table-column align="center" label="创建时间" prop="createTime" width="170"></el-table-column>
      <el-table-column align="center" label="最近修改时间" prop="updateTime" width="170"></el-table-column>-->
      <el-table-column align="center" label="电子邮箱" prop="userEmail" width="170"></el-table-column>
      <el-table-column align="center" label="联系电话" prop="userPhone" width="170"></el-table-column>
      <el-table-column align="center" label="管理" width="220" v-if="hasPerm('user:update')">
        <template slot-scope="scope">
          <el-button type="primary" icon="edit" @click="showUpdate(scope.$index)">修改</el-button>
          <el-button type="danger" icon="delete" v-if="scope.row.pkUser!=pkUser "
                     @click="removeUser(scope.$index)">删除
          </el-button>
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
      <el-form class="small-space" :model="tempUser" label-position="left" label-width="80px"
               style='width: 300px; margin-left:50px;'>
        <el-form-item label="用户名" required v-if="dialogStatus=='create'">
          <el-input type="text" v-model="tempUser.userCode">
          </el-input>
        </el-form-item>
        <el-form-item label="姓名" required v-if="dialogStatus=='create'">
          <el-input type="text" v-model="tempUser.userName">
          </el-input>
        </el-form-item>
        <el-form-item label="电子邮箱">
          <el-input type="text" v-model="tempUser.userEmail">
          </el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input type="text" v-model="tempUser.userPhone">
          </el-input>
        </el-form-item>
        <el-form-item label="密码" v-if="dialogStatus=='create'" required>
          <el-input type="password" v-model="tempUser.userPassword">
          </el-input>
        </el-form-item>
        <el-form-item label="新密码" v-else>
          <el-input type="password" v-model="tempUser.userPassword" placeholder="不填则表示不修改">
          </el-input>
        </el-form-item>
        <el-form-item label="角色" required>
          <el-select v-model="tempUser.roleId" placeholder="请选择">
            <el-option
              v-for="item in roles"
              :key="item.pkRole"
              :label="item.roleName"
              :value="item.pkRole">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="success" @click="createUser">创 建</el-button>
        <el-button type="primary" v-else @click="updateUser">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  import { getAllUsers, getAllRolesInUserPage, addUser, updateUser, deleteUser } from '@/api/user'

  export default {
    data() {
      return {
        totalCount: 0, // 分页组件--数据总条数
        list: [], // 表格的数据
        listLoading: false, // 数据加载等待动画
        listQuery: {
          pageNum: 1, // 页码
          pageRow: 50 // 每页条数
        },
        roles: [], // 角色列表
        dialogStatus: 'create',
        dialogFormVisible: false,
        textMap: {
          update: '编辑',
          create: '新建用户'
        },
        tempUser: {
          userCode: '',
          userName: '',
          userEmail: '',
          userPhone: '',
          userPassword: '',
          roleId: '',
          pkUser: ''
        }
      }
    },
    created() {
      this.getList()
      if (this.hasPerm('user:add') || this.hasPerm('user:update')) {
        this.getAllRoles()
      }
    },
    computed: {
      ...mapGetters([
        'pkUser'
      ])
    },
    methods: {
      getAllRoles() {
        getAllRolesInUserPage().then(data => {
          this.roles = data.data
        })
      },
      getList() {
        // 查询列表
        this.listLoading = true
        getAllUsers(this.listQuery).then(data => {
          this.listLoading = false
          this.list = data.data
          this.totalCount = data.data.length
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
        this.getList()
      },
      handleFilter() {
        // 查询事件
        this.listQuery.pageNum = 1
        this.getList()
      },
      getIndex($index) {
        // 表格序号
        return (this.listQuery.pageNum - 1) * this.listQuery.pageRow + $index + 1
      },
      showCreate() {
        // 显示新增对话框
        this.tempUser.userCode = ''
        this.tempUser.userName = ''
        this.tempUser.userEmail = ''
        this.tempUser.userPhone = ''
        this.tempUser.userPassword = ''
        this.tempUser.roleId = ''
        this.tempUser.pkUser = ''
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
      },
      showUpdate($index) {
        const user = this.list[$index]
        this.tempUser = user
        this.tempUser.deleteStatus = '1'
        this.tempUser.userEmail = user.userEmail
        this.tempUser.userPhone = user.userPhone
        this.tempUser.userPassword = ''
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
      },
      createUser() {
        // 添加新用户
        addUser(this.tempUser).then(() => {
          this.getList()
          this.dialogFormVisible = false
        })
      },
      updateUser() {
        // 修改用户信息
        const _vue = this
        updateUser(this.tempUser).then(() => {
          let msg = '修改成功'
          this.dialogFormVisible = false
          if (this.pkUser === this.tempUser.pkUser) {
            msg = '修改成功,部分信息重新登录后生效'
          }
          this.$message({
            message: msg,
            type: 'success',
            duration: 1 * 1000,
            onClose: () => {
              _vue.getList()
            }
          })
        })
      },
      removeUser($index) {
        const _vue = this
        this.$confirm('确定删除此用户?', '提示', {
          confirmButtonText: '确定',
          showCancelButton: false,
          type: 'warning'
        }).then(() => {
          const user = _vue.list[$index]
          user.deleteStatus = '2'
          deleteUser(user.pkUser).then(() => {
            _vue.getList()
          }).catch(() => {
            _vue.$message.error('删除失败')
          })
        })
      }
    }
  }
</script>
