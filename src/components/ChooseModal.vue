<template>
  <VueModal :show="show">
    <div class="controls">
      <VueButton @click="$emit('edit')">
        Изменить
      </VueButton>
      <VueButton @click="$emit('delete')" :variant="'danger'">
        Удалить
      </VueButton>
    </div>
    <VueButton @click="$emit('close')" :variant="'secondary-sized'">
      Закрыть
    </VueButton>
  </VueModal>

</template>

<script>
import VueModal from "@/components/base/modal/modal.vue";
import VueButton from "@/components/base/button/button.vue";

export default {
  name: 'ChooseModal',
  components: {VueButton, VueModal},
  props: {
    show: {
      type: Boolean,
      default: false
    }
  }

}
</script>
<style>

</style>