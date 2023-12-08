<template>
  <div
      class="notify"
      @click="$emit('close')"
      :class="`notify--${variant}`"
  >
    {{ message}}
    <div class="notify__time" :style="`width: ${timeAlive/timeToLive * 100}%;`"></div>
  </div>
</template>

<script>
export default {
  name: 'VueNotify',
  props: {
    variant: {
      type: String,
      default: 'success'
    },
    show: {
      type: Boolean,
      default: true
    },
    message: {
      type: String,
      default: ''
    },
    timeToLive: {
      type: Number,
      default: 5000
    }
  },
  data () {
    return {
      timeAlive: 0,
      interval: null
    }
  },
  computed: {
  },
  watch: {
    timeAlive: function () {
      if (this.timeAlive > this.timeToLive) {
        this.$emit('close')
      }
    }
  },
  methods: {
    countAlive () {
      this.timeAlive += 100
    }
  },
  mounted () {
    this.interval = setInterval(this.countAlive, 100)
  },
  beforeDestroy () {
    clearInterval(this.interval)
  }
}
</script>

<style src="./notify.css">
</style>