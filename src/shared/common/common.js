export const getData = (key, value) => {
  const data = JSON.parse(localStorage.getItem(key));
  return data ? data : value;
};

export const setData = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const getDataById = (data, id) => {
  if (id != 0) {
    return data.find((item) => item.value === id).label;
  }
  return "";
};

export const getIdTeacher = (data, teacher) => {
  if (teacher) {
    return data.find((item) => item.label.includes(teacher)).value;
  }
  return 0;
};
