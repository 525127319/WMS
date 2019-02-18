<template>
    <section class="wrap" ref="wrap">
        <div class="container">
            <header>
                <h6>选择人员</h6>
            </header>
            <div class="wrap-box">
                <div class="left-warp-box">
                    <div class="searchbox">
                        <input type="text" name="search" placeholder="请输入用户姓名" v-model="findOrgIdItem.searchName" @keyup.enter="findOrgIdData">
                        <button type="button" @click.stop="findOrgIdData"></button>
                    </div>
                    <vue-ztree :func='nodeClick' :list='ztreeDataSource' :is-open='false'></vue-ztree>
                </div>
                <div class="center-warp-box">
                    <div class="checkTable">
                        <table class="table table-bordered" style="margin-top: 0;">
                            <thead>
                                <tr >
                                    <th><input type="hidden" name="checkboxAll" @change='itemAllChange' ref="checkboxAll"></th>
                                    <!--<th><input type="hidden" name="checkboxAll"  ref="checkboxAll"></th>-->
                                    <th>工号</th>
                                    <th>姓名</th>
                                    <th>部门</th>
                                    <th>职位</th>
                                </tr>
                            </thead>
                            <tbody v-if="userListData.length>0">
                                <tr v-for="datail in userListData" :key="datail.userId">
                                    <th><input type="checkbox" name="checkboxItem" v-model="datail.isChecked" @change='itemChange(datail)'></th>
                                    <td v-text="datail.loginName"></td>
                                    <td v-text="datail.name"></td>
                                    <td v-text="datail.dept"></td>
                                    <td v-text="datail.position"></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <pagination @pagination="pagination" :userCount="userCount"></pagination>
                </div>
                <div class="right-warp-box">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th>姓名</th>
                                <th>管理</th>
                            </tr>
                        </thead>
                        <tbody v-if="selectedItemList.length > 0">
                            <tr v-for="detail in selectedItemList" :key="detail.userId">
                                <!-- <td v-text="detail.realName"></td> -->
                                <td v-text="detail.name"></td>
                                <td>
                                    <a href="javascript:void(0);" @click.stop="deteleItem(detail)">删除</a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="button-group">
                <button type="button" class="sure" @click.stop="confirm">确定</button>
                <button type="button" class="cancel" @click.stop="cancel">取消</button>
            </div>
        </div>
    </section>
</template>
<script>
import vueZtree from "./base/vue-ztree.vue";
import pagination from "./base/pagination.vue";
import { getOrganizationInfoList, getSysUserByOrgId } from "../../api/axiosapi";

export default {
  name: "start",
  created: function() {
    this.initData();
  },
  data: function() {
    return {
      userCount: 1,
      timeout: null,
      userListData: [],
      ztreeDataSource: [],
      selectedItemDict: {},
      selectedItemList: [],
      findOrgIdItem: {
        searchName:'',
        page: 1,
        limit: 10,
        offset: 0,
        orgId: ""
      } //orgId需要查询的id， pageSize默认分页为1；
    };
  },
  methods: {
    deteleItem(item) {
      for (let detail of this.userListData) {
        if (detail.loginName == item.loginName) {
          detail.isChecked = false;
        }
      }
      delete this.selectedItemDict[item.loginName];
      this.selectedItemList = Object.values(this.selectedItemDict) || [];
    },
    initData: function() {
      getOrganizationInfoList().then(response => {
        if (response.code == 200) {
          this.ztreeDataSource = response.data;
        }
      });
    },
    findOrgIdData: function() {
      if (this.timeout) window.clearTimeout(this.timeout);
      this.timeout = window.setTimeout(
        function() {
          getSysUserByOrgId(this.findOrgIdItem).then(response => {
            if (response.code == 200) {
              let userList = response.data.list;
              this.userCount = response.data.total;
              this.userListData = this.checkIsSelected(userList);
            }
          });
        }.bind(this),
        300
      );
    },
    checkIsSelected(userList) {
      for (let item of userList) {
        if (item.loginName in this.selectedItemDict) {
          item.isChecked = this.selectedItemDict[item.loginName].isChecked;
        } else {
          item.isChecked = false;
        }
      }
      return userList;
    },
    pagination: function(pageSize) {
      // this.findOrgIdItem.pageSize = pageSize;
      this.findOrgIdItem.page = pageSize;
      console.log(this.findOrgIdItem);
      this.findOrgIdData();
    },
    confirm() {
      let items = this.selectedItemList.map(function(item) {
        var data = new Object();
        data.userId = item.userId;
        data.loginName = item.loginName;
        // data.realName = item.realName;
        data.realName = item.name;
        
        return data;
      });
      this.$emit("user-info", items); // emit 向父组件返回数据
      this.$refs.wrap.style.display = "none";
    },
    cancel() {
      this.$refs.wrap.style.display = "none";
    },
    nodeClick: function(m) {
      const item = JSON.parse(JSON.stringify(m));
      this.findOrgIdItem.orgId = item.id;
      // this.findOrgIdItem.pageSize = 1;
      this.findOrgIdItem.page = 1;
      this.userCount = 1; //还原 关键字pagination.vue  watch
      this.$refs.checkboxAll.checked = false;
      this.findOrgIdData();
    },
    itemChange(detail) {
      if (detail.isChecked) {
        for (var i = 0; i < this.selectedItemList.length; i++) {
          delete this.selectedItemDict[this.selectedItemList[i].loginName];
          this.selectedItemList[i].isChecked = false; //将已选的取消勾选
        }
        this.selectedItemDict[detail.loginName] = detail;
      } else {
        delete this.selectedItemDict[detail.loginName];
      }
      this.selectedItemList = Object.values(this.selectedItemDict) || [];
    },
    itemAllChange(event) {
      if (this.userListData.length == 0) return;
      let isItemChecked = event.target.checked;
      this.userListData.forEach(function(item) {
        if (isItemChecked) {
          this.selectedItemDict[item.loginName] = item;
        } else {
          delete this.selectedItemDict[item.loginName];
        }
        item.isChecked = isItemChecked;
      }, this);
      this.selectedItemList = Object.values(this.selectedItemDict) || [];
    }
  },
  components: {
    vueZtree,
    pagination
  }
};
</script>