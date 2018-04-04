<template>
    <div class="pas-btnLoading">
        <i v-if="load" class="fa fa-spinner" aria-hidden="true"></i>
        <slot v-else></slot>
    </div>
</template>
<script>
export default {
    props: {
        load: Boolean
    },
    data() {
        return {}
    },
    computed: {},
    methods: {},
    mounted() {}
}

</script>
<style lang="scss" scoped>
.pas-btnLoading {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

</style>
