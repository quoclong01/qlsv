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
  },
  students: {
    index: `${RESOURCES.students}`,
  },
  users: {
    index: `${RESOURCES.users}`,
  },
};
