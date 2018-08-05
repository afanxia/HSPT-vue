<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form>
        <el-form-item>
          <el-button type="success" icon="plus" v-if="hasPerm('user:add')" @click="showCreate">添加角色
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
      <el-table-column align="center" label="角色" prop="roleName" width="150"></el-table-column>
      <el-table-column align="center" label="角色代码" prop="roleCode" width="150"></el-table-column>
      <el-table-column align="center" label="角色描述" prop="roleInfo" width="250"></el-table-column>
      <!--<el-table-column align="center" label="用户">
        <template slot-scope="scope">
          <div v-for="user in scope.row.users" :key="user.userName">
            <div v-text="user.userName" style="display: inline-block;vertical-align: middle;"></div>
          </div>
        </template>
      </el-table-column>-->
      <el-table-column align="center" label="菜单&权限" width="420">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.roleCode==='SYS_ADMIN'" type="success">全部</el-tag>
          <div v-else>
            <div v-for="(menu,_mIdx) in scope.row.menuPermissions" style="text-align: left" :key="menu.menuCode">
              <span style="width: 100px;display: inline-block;text-align: right" v-if="!isShowMenu(scope.$index, _mIdx)">{{menu.menuName}}</span>
              <el-tag v-for="perm in menu.permissions" :key="perm.permissionsName" v-text="perm.permissionsName"
                      v-if="perm.dr===0"
                      style="margin-right: 3px;"
                      type="primary"></el-tag>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="管理" width="220" v-if="hasPerm('role:update') ||hasPerm('role:delete') ">
        <template slot-scope="scope">
          <div v-if="scope.row.roleCode!='SYS_ADMIN'">
            <el-button type="primary" icon="edit" @click="showUpdate(scope.$index)" v-if="hasPerm('role:update')">修改
            </el-button>
            <el-button v-if=" scope.row.numUsers==='0' && hasPerm('role:delete')" type="danger"
                       icon="delete"
                       @click="removeRole(scope.$index)">
              删除
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form class="small-space" :model="tempRole" label-position="left" label-width="100px"
               style='width: 500px; margin-left:50px;'>
        <el-form-item label="角色名称" required>
          <el-input type="text" v-model="tempRole.roleName" style="width: 250px;">
          </el-input>
        </el-form-item>
        <el-form-item label="角色代码" required>
          <el-input type="text" v-model="tempRole.roleCode" style="width: 250px;">
          </el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input type="text" v-model="tempRole.roleInfo" style="width: 250px;">
          </el-input>
        </el-form-item>
        <el-form-item label="菜单&权限" required>
          <div v-for=" (menu,_mIdx) in list[currentIdx].menuPermissions" :key="menu.menuName">
            <span style="width: 75px;display: inline-block;">
              <el-button :type="isMenuNone(currentIdx, _mIdx)?'':(isMenuAll(currentIdx, _mIdx)?'success':'primary')" size="mini"
                         style="width:80px;"
                         @click="checkAll(currentIdx, _mIdx)">{{menu.menuName}}</el-button>
            </span>
            <div style="display: inline-block;margin-left:20px;">
              <el-checkbox-group v-model="tempRole.permissions">
                <el-checkbox v-for="perm in menu.permissions" :label="perm.pkPermissions" @change="checkRequired(perm, currentIdx, _mIdx)"
                             :key="perm.pkPermissions">
                  <span :class="{requiredPerm:perm.requiredPerm===1}">{{perm.permissionsName}}</span>
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
          <!--<p style="color:#848484;">说明:红色权限为对应菜单内的必选权限</p>-->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="success" @click="createRole">创 建</el-button>
        <el-button type="primary" v-else @click="updateRole">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import { getAllPermissions, getRoleInfos, addRole, updateRole, deleteRole } from '@/api/role'
  export default {
    data() {
      return {
        list: [], // 表格的数据
        // allPermission: [],
        listLoading: false, // 数据加载等待动画
        dialogStatus: 'create',
        dialogFormVisible: false,
        currentIdx: 0,
        textMap: {
          update: '编辑',
          create: '新建角色'
        },
        tempRole: {
          roleCode: '',
          roleName: '',
          roleInfo: '',
          pkRole: '',
          permissions: []
        }
        // adminName: '管理员'
      }
    },
    created() {
      this.getList()
      // this.getAllPermission()
    },
    methods: {
      getAllPermission() {
        // 查询所有权限
        getAllPermissions().then(data => {
          this.allPermission = data.data
        })
      },
      getList() {
        // 查询列表
        this.listLoading = true
        getRoleInfos().then(data => {
          this.listLoading = false
          this.list = data.data
        })
      },
      getIndex($index) {
        // 表格序号
        return $index + 1
      },
      showCreate() {
        // 显示新增对话框
        this.currentIdx = 1
        this.tempRole.roleCode = ''
        this.tempRole.roleName = ''
        this.tempRole.roleInfo = ''
        this.tempRole.pkRole = ''
        this.tempRole.permissions = []
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
      },
      showUpdate($index) {
        this.currentIdx = $index
        const role = this.list[$index]
        this.tempRole.roleCode = role.roleCode
        this.tempRole.roleName = role.roleName
        this.tempRole.roleInfo = role.roleInfo
        this.tempRole.pkRole = role.pkRole
        this.tempRole.permissions = []
        for (let i = 0; i < role.menuPermissions.length; i++) {
          const perm = role.menuPermissions[i].permissions
          for (let j = 0; j < perm.length; j++) {
            if (perm[j].dr === 0) {
              this.tempRole.permissions.push(perm[j].pkPermissions)
            }
          }
        }
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
      },
      createRole() {
        if (!this.checkRoleUnique()) {
          return
        }
        if (!this.checkPermissionNum()) {
          return
        }
        // 添加新角色
        addRole(this.tempRole).then(() => {
          this.getList()
          this.dialogFormVisible = false
        })
      },
      updateRole() {
        if (!this.checkRoleUnique(this.tempRole.pkRole)) {
          return
        }
        if (!this.checkPermissionNum()) {
          return
        }
        // 修改角色
        updateRole(this.tempRole).then(() => {
          this.getList()
          this.dialogFormVisible = false
        })
      },
      checkPermissionNum() {
        // 校验至少有一种权限
        if (this.tempRole.permissions.length === 0) {
          this.$message.error('请至少选择一种权限')
          return false
        }
        return true
      },
      checkRoleUnique(pkRole) {
        // 校验名称重复
        const roleCode = this.tempRole.roleCode
        const roleName = this.tempRole.roleName
        if (!roleName || !roleCode) {
          this.$message.error('请填写角色名称和角色代码')
          return false
        }
        const roles = this.list
        let result = true
        for (let j = 0; j < roles.length; j++) {
          if (!pkRole || roles[j].pkRole !== pkRole) {
            if (roles[j].roleCode === roleCode) {
              this.$message.error('角色代码已存在')
              result = false
              break
            }
            if (roles[j].roleName === roleName) {
              this.$message.error('角色名称已存在')
              result = false
              break
            }
          }
        }
        return result
      },
      removeRole($index) {
        this.$confirm('确定删除此角色?', '提示', {
          confirmButtonText: '确定',
          showCancelButton: false,
          type: 'warning'
        }).then(() => {
          const role = this.list[$index]
          deleteRole(role.pkRole).then(() => {
            this.getList()
          }).catch(e => {
          })
        })
      },
      isMenuNone(_rIdx, _mIdx) {
        // 判断本级菜单内的权限是否一个都没选
        const menu = this.list[_rIdx].menuPermissions
        let result = true
        for (let j = 0; j < menu[_mIdx].permissions.length; j++) {
          if (this.tempRole.permissions.indexOf(menu[_mIdx].permissions[j].pkPermissions) > -1) {
            result = false
            break
          }
        }
        return result
      },
      isShowMenu(_rIdx, _mIdx) {
        const menu = this.list[_rIdx].menuPermissions
        let result = true
        for (let j = 0; j < menu[_mIdx].permissions.length; j++) {
          if (menu[_mIdx].permissions[j].dr === 0) {
            result = false
            break
          }
        }
        return result
      },
      isMenuAll(_rIdx, _mIdx) {
        // 判断本级菜单内的权限是否全选了
        const menu = this.list[_rIdx].menuPermissions
        let result = true
        for (let j = 0; j < menu[_mIdx].permissions.length; j++) {
          if (this.tempRole.permissions.indexOf(menu[_mIdx].permissions[j].pkPermissions) < 0) {
            result = false
            break
          }
        }
        return result
      },
      checkAll(_rIdx, _mIdx) {
        // 点击菜单   相当于全选按钮
        const v = this
        if (v.isMenuAll(_rIdx, _mIdx)) {
          // 如果已经全选了,则全部取消
          v.noPerm(_rIdx, _mIdx)
        } else {
          // 如果尚未全选,则全选
          v.allPerm(_rIdx, _mIdx)
        }
      },
      allPerm(_rIdx, _mIdx) {
        // 全部选中
        const menu = this.list[_rIdx].menuPermissions
        for (let j = 0; j < menu[_mIdx].permissions.length; j++) {
          this.addUnique(menu[_mIdx].permissions[j].pkPermissions, this.tempRole.permissions)
        }
      },
      noPerm(_rIdx, _mIdx) {
        // 全部取消选中
        const menu = this.list[_rIdx].menuPermissions
        for (let j = 0; j < menu[_mIdx].permissions.length; j++) {
          const idIndex = this.tempRole.permissions.indexOf(menu[_mIdx].permissions[j].pkPermissions)
          if (idIndex > -1) {
            this.tempRole.permissions.splice(idIndex, 1)
          }
        }
      },
      addUnique(val, arr) {
        // 数组内防重复地添加元素
        const _index = arr.indexOf(val)
        if (_index < 0) {
          arr.push(val)
        }
      },
      checkRequired(_perm, _rIdx, _mIdx) {
        // 本方法会在勾选状态改变之后触发
        const permId = _perm.pkPermissions
        if (this.tempRole.permissions.indexOf(permId) > -1) {
          // 选中事件
          // 如果之前未勾选本权限,现在勾选完之后,tempRole里就会包含本pkPermissions
          // 那么就要将必选的权限勾上
          this.makeReuqiredPermissionChecked(_rIdx, _mIdx)
        } else {
          // 取消选中事件
          if (_perm.requiredPerm === 1) {
            // 如果是必勾权限,就把本菜单的权限全部移出
            // (其实也可以提示用户本权限是菜单里的必选,请先取消勾选另外几个权限,交互太麻烦,此处就直接全部取消选中了)
            this.noPerm(_rIdx, _mIdx)
          }
        }
      },
      makeReuqiredPermissionChecked(_rIdx, _mIdx) {
        // 将本菜单必选的权限勾上
        const menu = this.list[_rIdx].menuPermissions
        for (let j = 0; j < menu[_mIdx].permissions.length; j++) {
          const perm = menu[_mIdx].permissions[j]
          if (perm.requiredPerm === 1) {
            // 找到本菜单的必选权限,将其勾上
            this.addUnique(perm.pkPermissions, this.tempRole.permissions)
          }
        }
      }
    }
  }
</script>
<style scoped>
  .requiredPerm {
    color: #ff0e13;
  }
</style>
