<template>
  <button
      class="button"
      :class="`button--${variant}`"
      :type="type"
      @click="$emit('click')"
  >
    <slot/>
  </button>
</template>

<script>
export default {
  name: 'VueButton',
  props: {
    type: {
      type: String,
      default: 'submit'
    },
    variant: {
      type: String,
      default: 'primary'
    }
  },
  data () {
    return {
    }
  }
}
</script>

<style src="./button.css">

</style>