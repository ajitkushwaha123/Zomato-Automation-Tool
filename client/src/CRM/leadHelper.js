export const formatDate = (dateString) => {
  if (!dateString) return "-";

  const date = new Date(dateString);
  if (isNaN(date)) return "-";

  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear().toString().slice(-2);

  return `${day} ${month} ${year}`;
};

export const generateUniqueId = () => {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 6);
  return `${timestamp}-${randomPart}`.toUpperCase();
};

export const getStatusColor = (status) => {
  switch (status) {
    case "New":
      return "bg-blue-500 text-white whitespace-nowrap";
    case "In Progress":
      return "bg-yellow-500 text-black whitespace-nowrap";
    case "Closed":
      return "bg-green-500 text-white whitespace-nowrap";
    default:
      return "bg-gray-500 text-white whitespace-nowrap";
  }
};

export const statusOptions = [
  {
    title: "New",
    uid: "new",
  },
  {
    title: "In Progress",
    uid: "inProgress",
  },
  {
    title: "Closed",
    uid: "closed",
  },
];
