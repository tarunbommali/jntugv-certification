// src/configs/enrollmentFormConfigs.js

export const editEnrollmentFormConfig = {
  status: {
    label: "Status",
    type: "select",
    options: [
      { value: "SUCCESS", label: "Success" },
      { value: "PENDING", label: "Pending" },
      { value: "FAILED", label: "Failed" },
    ],
    required: true,
  },
  paidAmount: {
    label: "Paid Amount",
    type: "number",
    step: "0.01",
    required: true,
  },
  paymentMethod: {
    label: "Payment Method",
    type: "select",
    options: [
      { value: "offline", label: "Offline" },
      { value: "online", label: "Online" },
      { value: "free", label: "Free" },
    ],
    required: true,
  },
  paymentReference: {
    label: "Payment Reference",
    type: "text",
    placeholder: "Transaction ID, Receipt No., etc.",
    required: false,
  },
};

export const manualEnrollmentFormConfig = {
  userId: {
    label: "Select User *",
    type: "select",
    required: true,
  },
  courseId: {
    label: "Select Course *",
    type: "select",
    required: true,
  },
  status: {
    label: "Enrollment Status",
    type: "select",
    options: [
      { value: "SUCCESS", label: "Success" },
      { value: "PENDING", label: "Pending" },
      { value: "FAILED", label: "Failed" },
    ],
    required: true,
  },
  paymentMethod: {
    label: "Payment Method",
    type: "select",
    options: [
      { value: "offline", label: "Offline" },
      { value: "online", label: "Online" },
      { value: "free", label: "Free" },
    ],
    required: true,
  },
  paymentReference: {
    label: "Payment Reference",
    type: "text",
    placeholder: "Transaction ID, Receipt No., etc.",
    required: false,
  },
};