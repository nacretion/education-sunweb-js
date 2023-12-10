<template>
  <VueModal
      :class="{'modal--show': show}"
      @close="$emit('close')"
  >
    <form class="form">
      <div class="form__radio-group">
        <VueInput
            :type="'radio'"
            :name="'gender'"
            :value="'male'"
            id="male"
            :checked="data.gender === 'Мужской'"
            @input="inputHandler($event)"
        >
          Мужской
        </VueInput>
        <VueInput
            :type="'radio'"
            :name="'gender'"
            :value="'female'"
            id="female"
            :checked="data.gender === 'Женский'"
            @input="inputHandler($event)"
        >
          Женский
        </VueInput>
      </div>
      <VueInput
          v-for="input in inputs"
          :key="input.placeholder"
          :type="input.type"
          :name="input.name"
          :value="data[input.name]"
          :id="input.name"
          @input="inputHandler($event)"
          :isError="errors[input.name]"
          :errorMessage="input.errorMessage"
      >
        {{ input.placeholder }}
      </VueInput>
    </form>
    <div class="controls">
      <VueButton @click="$emit('close')" :variant="'secondary-sized'">
        Закрыть
      </VueButton>
      <VueButton @click="$emit('save', collectData())" :variant="'primary-sized'">
        {{ isEdit? 'Изменить': 'Сохранить' }}
      </VueButton>
    </div>
  </VueModal>
</template>

<script>
import VueModal from "@/components/base/modal/modal.vue";
import VueButton from "@/components/base/button/button.vue";
import VueInput from "@/components/base/input/input.vue";

export default {
  name: 'EditModal',
  components: {VueInput, VueButton, VueModal},
  props: {
    show: {
      type: Boolean,
      default: false
    },
    errors: {
      type: Object
    },
    selectedUser: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      inputs: [
        {placeholder: 'Имя', type: 'text', name: 'first_name', errorMessage: 'Некорректное имя'},
        {placeholder: 'Фамилия', type: 'text', name: 'last_name', errorMessage: 'Некорректная фамилия'},
        {placeholder: 'Дата рождения', type: 'date', name: 'date_of_birth', errorMessage: 'Некорректная дата'},
        {placeholder: 'Электронная почта', type: 'email', name: 'email', errorMessage: 'Некорректная почта'},
        {placeholder: 'Адрес', type: 'text', name: 'street', errorMessage: 'Некорректный адрес'},
      ],

      isEdit: Object.keys(this.selectedUser).length !== 0,
      data: {
        first_name: '',
        last_name: '',
        date_of_birth: '',
        gender: 'male',
        email: '',
        street: '',
        ...this.selectedUser,
      }
    }
  },
  methods: {
    inputHandler(event) {
      this.data[event.target.name] = event.target.value
    },
    collectData() {
      return {
        isEdit: Object.keys(this.selectedUser).length !== 0,
        first_name: this.data.first_name,
        last_name: this.data.last_name,
        date_of_birth: new Date(this.data.date_of_birth).toLocaleDateString('en-US'),
        gender: this.data.gender,
        email: this.data.email,
        street: this.data.street
      }
    }
  },
  watch: {
    selectedUser(newValue) {
      if (!Object.keys(newValue).length) {
        this.data = {
          first_name: '',
          last_name: '',
          date_of_birth: '',
          gender: 'male',
          email: '',
          street: '',
        }
        return
      }
      this.data = {
          ...this.selectedUser,
          date_of_birth: new Date(this.selectedUser.date_of_birth).toISOString().split('T')[0]
      }
    }
  }
}
</script>

<style>
.form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.form__radio-group {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 30px;
}
</style>