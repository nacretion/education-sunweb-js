<template>
  <table class="table">
    <thead>
      <tr>
        <th scope="col" v-for="column in Object.keys(items[0])" :class="fieldToSort === column ? sorts[column] : ''" :key="column" @click="$emit('sort', column)">
          {{ replacements? replacements[column] : column }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr class='table__row' v-for="item in items" :key="item[Object.keys(item)[0]]" @click="$emit('rowSelect', item)">
        <td v-for="value in item" :key="value">
          {{ value }}
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
    },
    fieldToSort: {
      type: String
    }
  }
}
</script>

<style src="./table.css">
</style>