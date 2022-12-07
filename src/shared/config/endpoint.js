const RESOURCES = {
  evaluations: "evaluations",
  auth: "auth",
  semesters: "semesters",
  students: "students",
  users: "users",
};

export const ENDPOINT = {
  evaluations: {
    index: `${RESOURCES.evaluations}`,
    type: `${RESOURCES.evaluations}/type`,
  },
  auth: {
    index: `${RESOURCES.auth}`,
    login: `${RESOURCES.auth}/login`,
    register: `${RESOURCES.auth}/register`,
    changePass: `${RESOURCES.auth}/change-password`,
  },
  semesters: {
    index: `${RESOURCES.semesters}`,
    type: `${RESOURCES.semesters}/type`,
    search: `${RESOURCES.semesters}/search`
  },
  students: {
    index: `${RESOURCES.students}`,
    addSemester: `${RESOURCES.students}/add-semester`
  },
  users: {
    index: `${RESOURCES.users}`,
    search: `${RESOURCES.users}/search`
  },
};
