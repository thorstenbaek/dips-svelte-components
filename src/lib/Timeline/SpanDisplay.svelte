<script lang="ts">
    import type Span from "./Span";

    export let value: Span;
</script>

<div>
    min: {value.min.getTime()} max: {value.max.getTime()}
</div>

<style>
    .span {
        height: 20px;
    }
</style>

