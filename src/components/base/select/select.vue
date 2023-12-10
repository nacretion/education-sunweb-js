<template>
  <select class="select" @input="$emit('select', $event.target.value)">
    <option
      v-for="option in options"
      :key="option"
      :value="option"
    >
      {{ option }}
    </option>
  </select>
</template>

<script>

export default {
  name: 'VueSelect',
  props: {
    options: {
      type: Array,
      default: () => []
    }
  }

}
</script>

<style src="./select.css">

</style>