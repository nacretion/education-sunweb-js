<template>
  <div id="app">
  </div>
</template>

<script>
import { UsersApi } from '../ajax'
const api = new UsersApi(
    'https://api.slingacademy.com/v1/sample-data/users',
    'https://jsonplaceholder.typicode.com/users'
)

export default {
  name: 'App',
  components: {
  data() {
    return {
      items: [{}],
  mounted() {
    api.getUsers({fields: this.tableFields}).then(users => {
      this.items = users
    })
  }
}
</script>

<style>
</style>
