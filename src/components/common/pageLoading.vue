<template>
    <div class="pas-page-loading">
        <div class="box"><i class="fa fa-spinner" aria-hidden="true"></i></div>
    </div>
</template>
<script>
export default {
    data() {
        return {}
    },
    computed: {},
    methods: {},
    mounted() {}
}

</script>
<style lang="scss" scoped>
.pas-page-loading {
    width: 100%;
    height: 100%;
    position: relative;
    $h: 40px;
    .box {
        width: $h;
        height: $h;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -$h / 2;
        margin-top: -$h / 2;
        line-height: $h;
        text-align: center;
        font-size: $h;
    }
}

</style>
