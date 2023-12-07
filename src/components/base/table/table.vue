<template>
  <table class="table">
    <thead>
      <tr>
        <th scope="col" v-for="column in Object.keys(items[0])" :class="sorts[column]" :key="column" @click="$emit('sort', column)">
          {{ replacements? replacements[column] : column }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in items" :key="item[Object.keys(item)[0]]" @click="$emit('rowSelect', item)">
        <td v-for="key in Object.keys(item)" :key="item[key]">
          {{ replaceValue(key, item[key]) }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: 'VueTable',
  components: {
  },
  props: {
    items: {
      type: Array,
      required: true
    },
    replacements: {
      type: Object
    },
    valuesReplacements: {
      type: Object
    },
    sorts: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
    }
  },
  computed: {
  },
  methods: {
    replaceValue: function (key, field) {
      if (!this.valuesReplacements) {
        return field
      }

      const replaceValue = this.valuesReplacements[key] || this.valuesReplacements.default
      return replaceValue(field)
    }
  },
  watch: {
  },
  mounted () {
  }
}
</script>

<style src="./table.css">
</style>