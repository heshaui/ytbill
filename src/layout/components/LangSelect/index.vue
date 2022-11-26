<template>
    <el-dropdown trigger="click" class="international" @command="handleSetLanguage">
        <div>
            <svg-icon name="language" />
        </div>
        <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :disabled="language==='zh'" command="zh">
                中文
            </el-dropdown-item>
            <el-dropdown-item :disabled="language==='en'" command="en">
                English
            </el-dropdown-item>
            <!-- <el-dropdown-item :disabled="language==='es'" command="es">
                Español
            </el-dropdown-item>
            <el-dropdown-item :disabled="language==='ja'" command="ja">
                日本語
            </el-dropdown-item> -->
        </el-dropdown-menu>
    </el-dropdown>
</template>

<script>
export default {
    name: 'LangSelect',
    computed: {
        language() {
            return this.$store.state.settings.language
        }
    },
    methods: {
        handleSetLanguage(lang) {
            this.$i18n.locale = lang
            this.$store.dispatch('settings/setLanguage', lang)
            this.$message({
                message: 'Switch Language Success',
                type: 'success'
            })
        }
    }
}
</script>
