<template>
  <div class="input__wrapper">
    <div class="input__with-label">
      <label
          v-if="id"
          class="input__label"
          :for="id"
      >
        <slot/>
      </label>
      <input
          class="input"
          :id="id"
          :type="type"
          :placeholder="placeholder"
          :value="value"
          :checked="checked"
          :name="name"
          :class="{'input--error': isError}"
          @input="$emit('input', $event)"
          @change="$emit('input', $event)"
      >
    </div>
    <div v-if="isError" class="input__error">
      {{ errorMessage }}
    </div>
  </div>
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
    },
    id: {
      type: String
    },
    name: {
      type: String
    },
    isError: {
      type: Boolean
    },
    checked: {
      type: Boolean
    },
    errorMessage: {
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