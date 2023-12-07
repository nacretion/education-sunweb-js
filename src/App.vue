<template>
  <div id="app">
    <div class="controls">
      <VueInput
          :placeholder="'Поиск'"
          :value="search"
          @input="search = $event"
      />
    </div>
    <VueTable
        :items="users"
        :replacements="tableFieldsReplacements"
        :valuesReplacements="tableValuesReplacements"
    />
  </div>
</template>

<script>
import debounce from 'debounce';
import VueTable from './components/base/table/table.vue'
import VueInput from './components/base/input/input.vue'
import { UsersApi } from '../ajax'

const api = new UsersApi(
    'https://api.slingacademy.com/v1/sample-data/users',
    'https://jsonplaceholder.typicode.com/users'
)

export default {
  name: 'App',
  components: {
    VueTable,
    VueInput
  },
  data() {
    return {
      // параметры отображения
      users: [{}],
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
      },

      search: '',
    }
  },
  mounted() {
    api.getUsers({fields: this.tableFields}).then(users => {
      this.users = users
    })
  },
  watch: {
    search: debounce(function () {
      api.getUsers({search: this.search, fields: this.tableFields}).then(users => {
        this.users = users
      })
    }, 500),

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
  #app {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 20px;
    padding: 40px 0;
  }
</style>
