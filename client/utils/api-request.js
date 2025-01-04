export const apiRequest = async (requestFunction, errorMessage) => {
  try {
    const response = await requestFunction();
    if (response.status >= 200 && response.status < 300) {
      return Promise.resolve(response.data);
    }
    return Promise.reject(new Error(errorMessage));
  } catch (err) {
    if (err.response && err.response.data && err.response.data.msg) {
      return Promise.reject(new Error(err.response.data.msg));
    }
    return Promise.reject(new Error(errorMessage));
  }
};
