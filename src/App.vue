<template>
    <div id="app">
        <router-view :key="key"></router-view>
    </div>
</template>
<style>
    @import "../static/css/main.css";
    @import "../static/css/color-dark.css";     /*深色主题*/
    /*@import "../static/css/theme-green/color-green.css";   浅绿色主题*/
</style>



<script>
    export default {
        computed: {
            key: function () {
                return this.$route.name !== undefined ? this.$route.name + new Date() : this.$route + new Date()
            }
        }
    }
</script>