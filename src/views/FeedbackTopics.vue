<template>
  <div class="feedback">
    <p>Đánh giá đồ án tốt nghiệp</p>
    <div class="form2">
      <SaveFeedback :itemEdit="listfeedbacks" @save="clickSave" />
      <div class="table2">
        <table>
          <tr>
            <th>STT</th>
            <th>Tên đề tài</th>
            <th>Điểm</th>
            <th>Ghi chú</th>
          </tr>
          <tr v-for="item in listfeedback" :key="item.id">
            <th>{{ item.id }}</th>
            <th>{{ item.topic }}</th>
            <th>{{ item.mark }}</th>
            <th>{{ item.note }}</th>

            <td class="btn-edit-delete">
              <button @click="editItem(item)" class="btn-edit">
                <edit-outlined /> Sửa
              </button>
              <button @click="deleteItem(item)" class="btn-delete">
                <delete-outlined /> Xóa
              </button>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import SaveFeedback from "../components/SaveFeedback.vue";
export default {
  components: {
    SaveFeedback,
  },
  methods: {
    clickSave(itemSave) {
        let index = this.listfeedback.findIndex ((c)=>c.id===itemSave.id)
        if(index>=0){
          this.listfeedback.splice(index,1,itemSave)
        }else{
        //   let max =0;
        //   let newId=0;
        //   for(let i=0;i<this.listfeedback.length;i++){
        //     if(this.listfeedback[i].id>max){
        //       max=this.listfeedback[i].id
        //     }
        //   }
        //   newId = max + 1;
        //   itemSave.id=newId
      this.listfeedback.push(itemSave);

        }
        return;

      // this.listaccout.push(itemSave)
    }, //clickSave
    deleteItem(item) {
      const i = this.listfeedback.findIndex((x) => x.id == item.id);
      this.listfeedback.splice(i, 1);
    },

    editItem(itemedit) {
      console.log(itemedit);
      this.listfeedbacks = itemedit;
    },
  },
  data() {
    return {
      listfeedbacks: {
        id: "",
        topic: "",
        mark: "",
        note: "",
      },
      listfeedback: [
        {
          id: "1",
          topic: "web bán hàng",
          mark: "10",
          note: "tốt",
        },

        

       
      ],
    }; //retuen
  }, //data
};
</script>

<style>


.form {
  width: 100%;
}
td {
  padding: 10px;
  text-align: center;
}
table {
  width: 95%;
}
table,
th,
td {
  border-collapse: collapse;
  border: 1px solid black;
  color: black;
}
th {
  color: black;
}
.form__search {
  text-align: initial;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: 40px;
}
input.inp-search {
  width: 20%;
  height: 30px;
}

th.size {
  width: 120px;
}
button.btn-search {
  height: 36px;
  /* border-radius: 7px; */
  cursor: pointer;
  margin-left: 5px;
  margin-right: 5px;
  color: white;
  background-color: rgb(66, 161, 238);
  border: 1px solid white;
}

button.btn-delete {
  width: 59px;
  color: white;
  border: 1px solid white;
  background-color: rgb(241, 80, 68);
  cursor: pointer;
}

button.btn-edit {
  width: 59px;
  margin-bottom: 5px;
  background-color: rgb(66, 161, 238);
  color: white;
  border: 1px solid white;
  cursor: pointer;
}


</style>