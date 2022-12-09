import { defineStore } from "pinia";

export const useStudentStore = defineStore({
  id: "listStudent",
  state: () => ({
    listSemesterInternship: [],
    listSemesterGraduation: [],
  }),
  getters: {
    getListSemesterInternship: (state) => {
      return state.listSemesterInternship;
    },
    getListSemesterGraduation: (state) => {
      return state.listSemesterGraduation;
    },
  },
  actions: {
    addSemesterInternship(data) {
      this.listSemesterInternship = data;
    },
    addSemesterGraduation(data) {
      this.listSemesterGraduation = data;
    },
  },
});
