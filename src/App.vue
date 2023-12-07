<template>
  <div id="app">
    <EditModal
        :show="showModal"
        :errors="errors"
        :selectedUser="selectedUser"
        @close="toggleModal()"
        @save="handleSave($event)"/>
    <ChooseModal
        @delete="deleteUser(selectedUser.id)"
        @edit="toggleModal()"
        :show="showRowModal"
        :selectedUser="selectedUser"
        @close="toggleRowModal()"/>
    <div class="controls">
      <VueInput
          :placeholder="'Поиск'"
          :value="search"
          @input="search = $event.target.value"
      />
      <VueButton @click="toggleModal()">
        Добавить
      </VueButton>
    </div>
    <VueTable
        @rowSelect="toggleRowModal"
        @sort="handleSort($event)"
        :items="users"
        :replacements="tableFieldsReplacements"
        :valuesReplacements="tableValuesReplacements"
    />
    <div class="controls" v-if="Object.keys(users[0]).length">
      <VueButton :disabled="offset === 0" @click="handlePrev()">
        Назад
      </VueButton>
      <VueSelect :options="[10, 25, 50]" @select="limit = +$event"/>
      <VueButton @click="handleNext()">
        Дальше
      </VueButton>
    </div>
  </div>
</template>

<script>
import debounce from 'debounce';
import VueTable from './components/base/table/table.vue'
import VueInput from './components/base/input/input.vue'
import { UsersApi } from '../ajax'
import VueButton from "@/components/base/button/button.vue";
import EditModal from "@/components/EditModal.vue";
import VueSelect from "@/components/base/select/select.vue";
import ChooseModal from "@/components/ChooseModal.vue";

const api = new UsersApi(
    'https://api.slingacademy.com/v1/sample-data/users',
    'https://jsonplaceholder.typicode.com/users'
)

export default {
  name: 'App',
  components: {
    ChooseModal,
    VueSelect,
    EditModal,
    VueButton,
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
      offset: 0,
      limit: 10,

      selectedUser: {},

      errors: {
        first_name: false,
        last_name: false,
        date_of_birth: false,
        gender: false,
        email: false,
        street: false
      },

      sorts: {
        first_name: 'asc',
        last_name: 'asc',
        date_of_birth: 'asc',
        gender: 'asc',
        email: 'asc',
        street: 'asc'
      },

      showModal: false,
      showRowModal: false,
      validators: {
        default: /[a-zA-Z]{3,30}/,
        date_of_birth: /\d{1,2}\/\d{1,2}\/\d{2,4}/,
        gender: /Мужской|Женский/,
        street: /^(\d+) ?([A-Za-z](?= ))? (.*?) ([^ ]+?) ?((?<= )APT)? ?((?<= )\d*)?$/,
        email: /^[\w\-.]+@([\w-]+\.)+[\w-]{2,4}$/
      },

      getFormatFunc: {
        default: (field) => field,
        gender: (field) => field.trim().toLowerCase() === 'male' ? 'Мужской' : 'Женский',
        date_of_birth: (field) => new Date(field).toLocaleDateString('en-US')
      }
    }
  },
  methods: {
    handleSort(column) {
      this.sorts[column] = this.sorts[column] === 'asc' ? 'desc' : 'asc'
      this.users = this.users.sort((a, b) => {
        if (this.sorts[column] === 'asc') {
          return a[column] > b[column] ? 1 : -1
        }
        if (this.sorts[column] === 'desc') {
          return a[column] < b[column] ? 1 : -1
        }
        return 0
      })
    },
    handlePrev() {
      if (this.offset - this.limit < 0) {
        this.offset = 0
        return
      }
      this.offset -= this.limit
    },
    handleNext() {
      this.offset += this.limit
    },
    toggleModal() {
      if (!this.showRowModal) {
        this.selectedUser = {}
      }

      this.showRowModal = false
      this.showModal = !this.showModal
    },
    toggleRowModal(item) {
      this.selectedUser = item
      this.showRowModal = !this.showRowModal
    },

    handleSave(user) {
      if (!this.validateUser(user)) {
        return
      }
      api.saveUser(user).then(() => {
        this.toggleModal()
        api.getUsers({fields: this.tableFields}).then(users => {
          this.users = users
        })
      })
    },
    clearErrors() {
      Object.keys(this.errors).forEach(key => {
        this.errors[key] = false
      })
    },

    validateUser(user) {
      this.clearErrors()

      Object.keys(user).forEach(key => {
        const formatFunc = this.getFormatFunc[key] || this.getFormatFunc.default
        const formattedField = formatFunc(user[key])
        const regex = this.validators[key] || this.validators.default
        if (!regex.test(formattedField)) {
          this.errors[key] = true
        }
      })

      return !Object.keys(this.errors).some(key => this.errors[key])
    },
    getUsers() {
      api.getUsers({offset: this.offset, fields: this.tableFields, limit: this.limit, search: this.search}).then(users => {
        this.users = users
      })
    },
    deleteUser(id) {
      api.deleteUser(id).then((res) => {
        if (!res) {
          return
        }
        this.showRowModal = false
        this.getUsers()
      })
    }
  },
  mounted() {
    api.getUsers({fields: this.tableFields}).then(users => {
      this.users = users
    })
  },
  watch: {
    offset: function () {
      this.getUsers()
    },
    limit: function () {
      this.getUsers()
    },
    search: debounce(function () {
      api.getUsers({search: this.search, fields: this.tableFields}).then(users => {

        this.users = users.length? users : [{}]
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
    padding: 40px 5vw;
  }
  .controls {
    width: 100%;
    display: flex;
    justify-content: center;
    gap: 20px;
  }

</style>
