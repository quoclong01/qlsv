<template>
  <div class="container-header">
    <div>
      <label for="">Tên đề tài :</label>
      <input class="ip-nametopic" v-model="feedback.topic" />
    </div>

    <div>
      <label for="">Điểm :</label>
      <input class="ip-score" v-model="feedback.mark" />
    </div>

    <div>
      <label for="">Ghi chú:</label>
      <input class="ip-note" v-model="feedback.note" />
      <!-- <a-textarea v-model="feedback.note" placeholder="Basic usage" :rows="4" /> -->
    </div>

    <a-button @click="clickAdd" type="primary" class="btn-accout"
      ><PlusOutlined
    /></a-button>
  </div>
</template>

<script>
import { PlusOutlined } from "@ant-design/icons-vue";
export default {
  props: {
    itemEdit: {
      type: Object,
      default: null,
    },
  },

  watch: {
    itemEdit() {
      if (this.itemEdit) {
        this.feedback = Object.assign({}, this.itemEdit);
      } else {
        this.feedback = {};
      }
    },
  },

  methods: {
    clickAdd() {
      this.$emit("save", this.feedback);
      console.log(this.feedback)
      this.feedback = {
        id: Math.floor(Math.random() * 10000),
        topic: "",
        mark: "",
        note: "",
      };
    },
  },
  components: {
    PlusOutlined,
  },
  data() {
    return {
      feedback: {
        id: Math.floor(Math.random() * 10000),
        topic: "",
        mark: "",
        note: "",
      },
    }; //return
  }, //data
};
</script>
