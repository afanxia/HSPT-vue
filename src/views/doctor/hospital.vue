<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form>
        <el-form-item>
          <el-button type="primary" icon="plus" @click="showCreate" v-if="hasPerm('hospital:add')">添加
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="拼命加载中" border fit
              highlight-current-row>
      <el-table-column align="center" prop="name" label="医院" style="width: 60px;"></el-table-column>
      <el-table-column align="center" label="管理" width="200" v-if="hasPerm('hospital:update')">
        <template slot-scope="scope">
          <el-button type="primary" icon="edit" @click="showUpdate(scope.$index)">修改</el-button>
          <el-button type="danger" icon="delete" @click="removeHospital(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form class="small-space" :model="tempHospital" label-position="left" label-width="120px"
               style='width: 600px; margin-left:50px;'>
        <el-form-item label="医院名称">
          <el-input type="text" required v-model="tempHospital.name"> </el-input>
        </el-form-item>
        <el-form-item label="医院所在地">
          <div class="linkage">
            <el-select v-model="sheng" @change="chooseProvince" placeholder="省">
              <el-option v-for="item in province" :key="item.id" :label="item.value" :value="item.id">
              </el-option>
            </el-select>
            <el-select v-model="shi" @change="chooseCity" placeholder="市">
              <el-option v-for="item in shi1" :key="item.id" :label="item.value" :value="item.id">
              </el-option>
            </el-select>
            <el-select v-model="qu" @change="chooseBlock" placeholder="区">
              <el-option v-for="item in qu1" :key="item.id" :label="item.value" :value="item.id">
              </el-option>
            </el-select>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="success" @click="createHospital">创 建</el-button>
        <el-button type="primary" v-else @click="updateHospital">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import { getAllHospitals, addHospital, updateHospital, deleteHospital } from '@/api/hospital'
  import axios from 'axios'
  export default {
    data() {
      return {
        list: [], // 所有问卷信息
        listLoading: false, // 数据加载等待动画
        dialogStatus: 'create',
        dialogFormVisible: false,
        textMap: {
          update: '编辑医院',
          create: '新建医院'
        },
        tempHospital: {
          hospitalId: '',
          cityId: '',
          name: ''
        },
        mapJson: '../static/json/map.json',
        province: '',
        sheng: '',
        shi: '',
        shi1: [],
        qu: '',
        qu1: [],
        city: '',
        cityId: '',
        block: ''
      }
    },
    created() {
      this.getCityData()
      this.getList()
    },
    methods: {
      getList() {
        // 查询医院列表
        if (!this.hasPerm('hospital:list')) {
          return
        }
        this.listLoading = true
        getAllHospitals().then(data => {
          this.listLoading = false
          this.list = data.data
        })
      },
      showCreate() {
        // 显示新增对话框
        this.tempHospital.hospitalId = ''
        this.tempHospital.name = ''
        this.tempHospital.cityId = ''
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
      },
      showUpdate($index) {
        // 显示修改对话框
        this.tempHospital.hospitalId = this.list[$index].hospitalId
        this.tempHospital.name = this.list[$index].name
        this.choosePCS(String(this.list[$index].cityId))
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
      },
      createHospital() {
        // 添加医院
        this.tempHospital.cityId = this.cityId
        addHospital(this.tempHospital).then(() => {
          this.getList()
          this.dialogFormVisible = false
        })
      },
      updateHospital() {
        // 修改医院
        this.tempHospital.cityId = this.cityId
        updateHospital(this.tempHospital).then(() => {
          this.getList()
          this.dialogFormVisible = false
        })
      },
      removeHospital($index) {
        this.$confirm('确定删除此医院?', '提示', {
          confirmButtonText: '确定',
          showCancelButton: false,
          type: 'warning'
        }).then(() => {
          const survey = this.list[$index]
          deleteHospital(survey.hospitalId).then(() => {
            this.getList()
          }).catch(e => {
          })
        })
      },
      // 加载china地点数据，三级
      getCityData: function() {
        var that = this
        axios
          .get(this.mapJson)
          .then(function(response) {
            if (response.status === 200) {
              var data = response.data
              that.province = []
              that.city = []
              that.block = []
              // 省市区数据分类
              for (var item in data) {
                if (item.match(/0000$/)) {
                  // 省
                  that.province.push({
                    id: item,
                    value: data[item],
                    children: []
                  })
                } else if (item.match(/00$/)) {
                  // 市
                  that.city.push({ id: item, value: data[item], children: [] })
                } else {
                  // 区
                  that.block.push({ id: item, value: data[item] })
                }
              }
              // 分类市级
              for (var index in that.province) {
                for (var index1 in that.city) {
                  if (
                    that.province[index].id.slice(0, 2) ===
                    that.city[index1].id.slice(0, 2)
                  ) {
                    that.province[index].children.push(that.city[index1])
                  }
                }
              }
              // 分类区级
              for (var item1 in that.city) {
                for (var item2 in that.block) {
                  if (
                    that.block[item2].id.slice(0, 4) ===
                    that.city[item1].id.slice(0, 4)
                  ) {
                    that.city[item1].children.push(that.block[item2])
                  }
                }
              }
            } else {
              console.log(response.status)
            }
          })
          .catch(function(error) {
            console.log(typeof +error)
          })
      },
      // 选省市区
      choosePCS: function(sid) {
        const pid = sid.substring(0, 2) + '0000'
        const cid = sid.substring(0, 4) + '00'
        for (var index1 in this.province) {
          if (pid === this.province[index1].id) {
            this.sheng = this.province[index1].value
          }
        }
        for (var index2 in this.city) {
          if (cid === this.city[index2].id) {
            this.shi = this.city[index2].value
          }
        }
        for (var index3 in this.block) {
          if (sid === this.block[index3].id) {
            this.qu = this.block[index3].value
          }
        }
      },
      // 选省
      chooseProvince: function(e) {
        for (var index2 in this.province) {
          if (e === this.province[index2].id) {
            this.shi1 = this.province[index2].children
            this.shi = this.province[index2].children[0].value
            this.qu1 = this.province[index2].children[0].children
            this.qu = this.province[index2].children[0].children[0].value
            this.cityId = this.qu1[0].id
            console.log(this.cityId)
          }
        }
      },
      // 选市
      chooseCity: function(e) {
        for (var index3 in this.city) {
          if (e === this.city[index3].id) {
            this.qu1 = this.city[index3].children
            this.qu = this.city[index3].children[0].value
            this.cityId = this.qu1[0].id
            console.log(this.cityId)
          }
        }
      },
      // 选区
      chooseBlock: function(e) {
        this.cityId = e
        console.log(this.cityId)
      }
    }
  }
</script>
