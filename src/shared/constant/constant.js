export const ACCESS_TOKEN = "ACCESS_TOKEN";
export const PAGE_SIZE_LARGE = 1000000;

export const columnStudents = [
  {
    title: "STT",
    dataIndex: "stt",
    width: "5%",
    className: "text-center",
  },
  {
    title: "MSSV",
    dataIndex: "studentCode",
    className: "text-center",
  },
  {
    title: "Họ và tên",
    dataIndex: "name",
    className: "text-center",
  },
  {
    title: "Lớp",
    dataIndex: "className",
    className: "text-center",
  },
  {
    title: "Nơi thực tập",
    dataIndex: "internshipPlace",
    className: "text-center",
  },
  // {
  //   title: "ID thực tập",
  //   dataIndex: "internshipId",
  //   className: "text-center",
  // },
  {
    title: "Đề tài đồ án",
    dataIndex: "graduationTopic",
    className: "text-center",
  },
  // {
  //   title: "ID Đồ án",
  //   dataIndex: "graduationId",
  //   className: "text-center",
  // },
  {
    title: "Giáo viên hướng dẫn",
    dataIndex: "teacher",
    className: "text-center",
  },
  {
    title: "Chức năng",
    dataIndex: "operation",
    className: "text-center",
    slots: {
      customRender: "operation",
    },
  },
];

export const listClassName = [
  {
    value: "63IT1",
    label: "63IT1",
  },
  {
    value: "63IT2",
    label: "63IT2",
  },
  {
    value: "63IT3",
    label: "63IT3",
  },
  {
    value: "63IT4",
    label: "63IT4",
  },
  {
    value: "63TH1",
    label: "63TH1",
  },
  {
    value: "63TH2",
    label: "63TH2",
  },
  {
    value: "63TH3",
    label: "63TH3",
  },
];

export const optionStatus = [
  {
    value: "OPEN",
    label: "Open",
  },
  {
    value: "CLOSE",
    label: "Close",
  },
  {
    value: "ALL",
    label: 'All'
  }
];

export const columnStudentIntership = [
  {
    title: "STT",
    dataIndex: "stt",
    width: "5%",
    className: "text-center",
  },
  {
    title: "MSSV",
    dataIndex: "studentCode",
    className: "text-center",
  },
  {
    title: "Họ và tên",
    dataIndex: "name",
    className: "text-center",
  },
  {
    title: "Lớp",
    dataIndex: "className",
    className: "text-center",
  },
  // {
  //   title: "Nơi thực tập",
  //   dataIndex: "internshipPlace",
  //   className: "text-center",
  // },
  {
    title: "Chức năng",
    dataIndex: "operation",
    className: "text-center",
    slots: {
      customRender: "operation",
    },
  },
];
