<template>
  <b-form-input
    size="sm"
    @input="triggerUpdateLabel"
    :value="beforeLabel"
    class="header"
  ></b-form-input>
</template>

<script>
export default {
  name: 'Header',
  props: {
    beforeKey: String,
    beforeLabel: String,
  },
  methods: {
    triggerUpdateLabel(label) {
      this.$emit('updateHeader', this.beforeKey, label)
    },
  },
}
</script>
<style scoped>
.header {
  color: white;
  background-color: inherit;
  border: none;
}
</style>