<template>
  <input
      class="input"
      :type="type"
      :placeholder="placeholder"
      :value="value"
      @input="$emit('input', $event.target.value)"
  >
</template>

<script>
export default {
  name: 'VueInput',
  props: {
    type: {
      type: String,
      default: 'text'
    },
    placeholder: {
      type: String
    },
    value: {
      type: String
    }
  },
  data () {
    return {
    }
  }
}
</script>

<style src="./input.css">
</style>