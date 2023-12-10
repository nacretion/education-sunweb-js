<template>
  <div class="modal" :class="{ 'modal--show': show }">
    <div class="modal__content">
      <slot/>
    </div>
  </div>
</template>
<script>

export default {
  name: 'VueModal',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
    }
  }
}
</script>

<style src="./modal.css">

</style>