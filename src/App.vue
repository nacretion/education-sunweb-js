<template>
  <div id="app">
    <div class="notifyContainer">
      <VueNotify
          v-for="notify in notifies"
          :key="notify.hash"
          :variant="notify.variant"
          :message="notify.message"
          :timeToLive="notify.timeToLive"
          @close="removeNotify(notify)"
      />
    </div>
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
        :sorts="sorts"
        :items="users"
        :fieldToSort="fieldToSort"
        :replacements="tableFieldsReplacements"
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
import VueNotify from "@/components/base/notify/notify.vue";

const api = new UsersApi(
    'https://api.slingacademy.com/v1/sample-data/users',
    'https://jsonplaceholder.typicode.com/users'
)

export default {
  name: 'App',
  components: {
    VueNotify,
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
      notifies: [],
      tableFieldsReplacements: {
        id: '#',
        first_name: 'Имя',
        last_name: 'Фамилия',
        date_of_birth: 'Дата рождения',
        gender: 'Пол',
        email: 'Электронная почта',
        street: 'Улица'
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
      fieldToSort: '',

      showModal: false,
      showRowModal: false,
      validators: {
        default: /[A-Za-zА-Яа-яЁ]{3,30}/,
        date_of_birth: /\d{1,2}\/\d{1,2}\/\d{2,4}/,
        gender: /Мужской|Женский/,
        street: /^(\d+) ?([A-Za-z](?= ))? (.*?) ([^ ]+?) ?((?<= )APT)? ?((?<= )\d*)?$/,
        email: /^[\w\-.]+@([\w-]+\.)+[\w-]{2,4}$/
      },
    }
  },
  methods: {
    removeNotify(notify) {
      const index = this.notifies.indexOf(notify)
      this.notifies.splice(index, 1)
    },
    addNotify(notify) {
      this.notifies.push({
        ...notify,
        hash: Math.random()*1000
      })
    },

    handleSort(column) {
      this.sorts[column] = this.sorts[column] === 'asc' ? 'desc' : 'asc'
      this.fieldToSort = column
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
      const method = user.isEdit ? 'изменен' : 'создан'

      api.saveUser(user).then(() => {
        this.toggleModal()
        this.getUsers()
        this.addNotify({
          variant: 'success',
          message: `Пользователь ${user.first_name} ${method}!`,
          timeToLive: 3000
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
        const regex = this.validators[key] || this.validators.default
        if (!regex.test(user[key])) {
          this.errors[key] = true
        }
      })

      return !Object.keys(this.errors).some(key => this.errors[key])
    },
    getUsers() {
      api.getUsers({offset: this.offset, fields: this.tableFields, limit: this.limit, search: this.search}).then(users => {
        if (!users.length) {
          this.addNotify({
            variant: 'error',
            message: `Пользователи не найдены!`,
            timeToLive: 8000
          })
          this.users = [{}]
          return
        }
        users.forEach(user => {
          user.date_of_birth = new Date(user.date_of_birth).toLocaleDateString('en-US')
          user.gender = user.gender.trim().toLowerCase() === 'male' ? 'Мужской' : 'Женский'
        })
        this.users = users
      })
    },
    deleteUser(id) {
      api.deleteUser(id).then((res) => {
        if (!res) {
          return
        }
        this.showRowModal = false
        this.addNotify({
          variant: 'success',
          message: `Пользователь удален!`,
          timeToLive: 3000
        })
        this.getUsers()
      })
    }
  },
  mounted() {
    this.getUsers()
  },
  watch: {
    fieldToSort: function (newValue) {
      Object.keys(this.sorts).forEach(key => {
        if (key !== newValue) {
          this.sorts[key] = 'asc'
        }
      })
    },
    offset: function () {
      this.getUsers()
    },
    limit: function () {
      this.getUsers()
    },
    search: debounce(function () {
      this.getUsers()
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
  .notifyContainer {
    position: fixed;
    bottom: 10px;
    right: 10px;

    display: flex;
    flex-direction: column-reverse;
    justify-content: center;
    gap: 10px;
    padding: 20px;
  }

</style>
