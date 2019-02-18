<template>
    <ul class="pagination" v-show="allpage > 1">
        <li>
            <button v-bind:disabled="current <=1 " @click="current-- && goto(current)"
              type="button">&laquo;</button>
        </li>
        <li v-for="index in pages" @click="goto(index)" :class="{'active':current == index}" :key="index">
            <button type="button">{{index}}</button>
        </li>
        <li>
            <button v-bind:disabled="current >= allpage" @click="current++ && goto(current++)"
              type="button">&raquo;</button>
        </li>
        <li><span class="showPage">共 {{allpage}} 页</span></li>
    </ul>
</template>

<script>
export default {
    name: 'pagination',
    data: function() {
        return {
            current: 1,   //当前页数
            showItem: 5,  //显示行数
            allpage: 1   //分页数量
        }
    },
    props: {
        userCount: {
            type: Number,
            default: 1
        }
    },
    computed: {
        pages: function() {
            var pag = [];
            if (this.current < this.showItem) { //如果当前的激活的项 小于要显示的条数
                //总页数和要显示的条数那个大就显示多少条
                var i = Math.min(this.showItem, this.allpage);
                while (i) {
                    pag.unshift(i--);
                }
            } else { //当前页数大于显示页数了
                var middle = this.current - Math.floor(this.showItem / 2),//从哪里开始
                    i = this.showItem;
                if (middle > (this.allpage - this.showItem)) {
                    middle = (this.allpage - this.showItem) + 1
                }
                while (i--) {
                    pag.push(middle++);
                }
            }
            return pag
        }
    },
    methods: {
        goto: function(index) {
            // if (index == this.current) return;
            this.current = index;
            this.$emit('pagination', this.current);
        }
    },
    watch: {
        userCount: function(newVal) {
            this.current = 1;
            this.allpage = Math.ceil(newVal/10 );  //根据实际情况来
        }
    }
}
</script>

<style type="text/css">


.pagination li {
    display: inline-block;
    margin: 0 5px;
}

.pagination li button {
    position: relative;
    float: left;
    padding: 6px 12px;
    margin-left: -1px;
    line-height: 1.42857143;
    color: #337ab7;
    text-decoration: none;
    background-color: #fff;
    border: 1px solid #ddd;
    outline: none;
}

.pagination li button:disabled {
    cursor: not-allowed;
    background-color: #ccc;
}
.pagination li .showPage{
  font-size: 14px;
  vertical-align: super;
}
.pagination li.active button {
    background: #0E90D2;
    color: #fff;
}
</style>

