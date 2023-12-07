<template>
  <div id="app">
    <VueTable :items="items" :replacements="tableFieldsReplacements" :valuesReplacements="tableValuesReplacements"></VueTable>
  </div>
</template>

<script>
import VueTable from './components/base/table/table.vue'
import { UsersApi } from '../ajax'

const api = new UsersApi(
    'https://api.slingacademy.com/v1/sample-data/users',
    'https://jsonplaceholder.typicode.com/users'
)

export default {
  name: 'App',
  components: {
    VueTable
  },
  data() {
    return {
      items: [{}],
      tableFields: [
          'id',
          'first_name',
          'last_name',
          'date_of_birth',
          'gender',
          'email',
          'street'
      ],
      tableFieldsReplacements: {
        id: '#',
        first_name: 'Имя',
        last_name: 'Фамилия',
        date_of_birth: 'Дата рождения',
        gender: 'Пол',
        email: 'Электронная почта',
        street: 'Улица'
      },
      tableValuesReplacements: {
        default: (field) => field,
        date_of_birth: (field) => new Date(field).toLocaleDateString('en-US'),
        gender: (field) => field.trim().toLowerCase() === 'male' ? 'Мужской' : 'Женский',
      }
    }
  },
  computed: {
  },
  methods: {
  },
  mounted() {
    api.getUsers({fields: this.tableFields}).then(users => {
      this.items = users
    })
  }
}
</script>

<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
  }
  body{
    font-family: Helvetica, sans-serif;
    -webkit-font-smoothing: antialiased;
    background: rgba( 71, 147, 227, 1);
  }
</style>
