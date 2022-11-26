<template>
    <div class="homePage">
        <div class="info">
            <h1>welcome</h1>
            <h2>{{ title }}</h2>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        const _this = this
        return {
            title: _this.$title
        }
    }
}
</script>

<style lang="scss" scoped>
.homePage {
    .info {
        text-align: center;
        padding: 100px 0;
        & > h1 {
            font-size: 50px;
            color: #606266;
        }
        & > h2 {
            font-size: 30px;
            color: #777;
        }
    }
}
</style>
