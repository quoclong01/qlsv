<template>
<div class="addbatch">
    
  <div class="bacth">
    <a-select 
    v-model:value="value"
    
    show-search
    placeholder="Select a batch"
    style="width: 200px"
    :options="options"
    :filter-option="filterOption"
    @change="handleChange"
    
  ></a-select>
  </div>
<div class="year">
  <a-space direction="vertical" :size="12">
     <a-date-picker   @change="onChange" v-model:value="value5" picker="year" />
   
  </a-space>

</div>

<a-button @click.prevent="clickAdd()"  class="btn-btach" type="primary">Submit</a-button>


</div>
</template>
<script>

import { defineComponent, ref } from 'vue';
export default defineComponent({

  // valuechange(){
  //   console.log()
  // },
    methods:{
        clickAdd(){
            this.$emit("save",this.listbatch)
            this.listbatch = {
              id:Math.floor(Math.random()*10000),
              batch:[],
              year:[],
            }
            
            
        }
 

    },
  data(){
      return{
          listbatch:{
              id:Math.floor(Math.random()*10000),
              batch:[],
              year:[],
          },
      //     list: [
      //   { id:1,
      //     batch:1,
      //     year:2022,
      //   },

      //   { id:2,
      //     batch:2,
      //     year:2023,
      //   },

      //   { id:3,
      //     batch:3,
      //     year:2024,
      //   }
      // ]//
          
      }
  },
  setup() {
    const options = ref([{
      value: '1',
      label: 'Đợt 1',
    }, {
      value: '2',
      label: 'Đợt 2',
    }, {
      value: '3',
      label: 'Đợt 3',
    }]);

    const handleChange = value => {
      console.log(`selected ${value}`);
    };

    const onChange = value5 => {
        console.log(`selected ${value5}`)
    };

    const filterOption = (input, option) => {
      return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    };

    

    return {
      
      value: ref(undefined),
      value5: ref(),
      filterOption,
      handleChange,
      onChange,
      options,
      
    };
  },

});
</script>

<style>

.addbatch {
    display: flex;
    justify-content: center;
    margin-left: 3.4px;
    margin-bottom: 2%;
}

button.ant-btn.ant-btn-primary.btn-btach {
    margin-left: 20px;
}
</style>