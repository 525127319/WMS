<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 表格</el-breadcrumb-item>
                <el-breadcrumb-item>Vue表格组件</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="plugins-tips">
            vue-datasource：一个用于动态创建表格的vue.js服务端组件。
            访问地址：<a href="https://github.com/coderdiaz/vue-datasource" target="_blank">vue-datasource</a>
        </div>
        <div>
            <button @click="test()">按钮</button>

        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import Datasource from 'vue-datasource';
    export default {
        data(){
            return {
                arrayTest:[],
            }
        },
        created(){
           // this.test();


        },
        methods: {
            test(){
                let arrayTest = ['a','b','c','d'];
                let arraySort = [1,5,3,9,15,95,14,16,94];
                arraySort.map((item,index,args)=>{
                    debugger

                    console.log(item+"------------"+index+"------------"+args);
               

                });
            },
            changePage(values) {
                this.information.pagination.per_page = values.perpage;
                this.information.data = this.information.data;
            },
            onSearch(searchQuery) {
                this.query = searchQuery;
            }
        },
        computed:{
            getData(){
                const self = this;
                return self.information.data.filter(function (d) {
                    if(d.name.indexOf(self.query) > -1){
                        return d;
                    }
                })
            }
        }
    }
</script>

<style src="../../../static/css/datasource.css"></style>