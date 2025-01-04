import toast from "react-hot-toast";
const showToast = (message) => {
  toast.error(message);
};

export const emailValidator = (email) => {
  const errors = {};
  if (!email) {
    errors.email = "Email is required";
    showToast(errors.email);
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    errors.email = "Email is invalid";
    showToast(errors.email);
  }

  return Object.keys(errors).length ? errors : null;
};

export const usernameValidator = (username) => {
  const errors = {};
  if (!username) {
    errors.username = "Username is required";
    showToast(errors.username);
  } else if (username.length < 4 || username.length > 20) {
    errors.username = "Username must be between 4 and 20 characters";
    showToast(errors.username);
  } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    errors.username =
      "Username can only contain letters, numbers, and underscores";
    showToast(errors.username); // Triggering toast error
  }

  return Object.keys(errors).length ? errors : null;
};

export const passwordValidator = (password) => {
  const errors = {};
  if (!password) {
    errors.password = "Password is required";
    showToast(errors.password);
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters";
    showToast(errors.password);
  }

  return Object.keys(errors).length ? errors : null;
};

export async function registerValidate(values) {
  const errors = {};

  const checkUserame = usernameValidator(values.username);
  console.log("checkUserame", checkUserame);
  if (checkUserame) {
    return checkUserame;
  }

  const checkEmail = emailValidator(values.email);

  if (checkEmail) {
    return checkEmail;
  }

  const checkPassword = passwordValidator(values.password);

  if (checkPassword) {
    return checkPassword;
  }

  return Object.keys(errors).length ? errors : null;
}

export async function registerWithOtpValidate(values) {
  const errors = {};

  registerValidate(values);

  if (!values.otp) {
    errors.otp = "OTP is required";
    showToast(errors.otp);
  } else if (values.otp.length !== 4) {
    errors.otp = "OTP must be 4 characters";
    showToast(errors.otp);
  }

  return Object.keys(errors).length ? errors : null;
}

export async function loginValidate(values) {
  const errors = {};

  if (!values.usernameOrEmail) {
    errors.usernameOrEmail = "Username or Email is required";
    showToast(errors.usernameOrEmail);
  }

  return Object.keys(errors).length ? errors : null;
}

export async function loginWithPasswordValidate(values) {
  const errors = {};

  if (!values.usernameOrEmail) {
    errors.usernameOrEmail = "Username or Email is required";
    showToast(errors.usernameOrEmail);
  } else if (!values.password) {
    errors.password = "Password is required";
    showToast(errors.password);
  }

  return Object.keys(errors).length ? errors : null;
}

export async function loginWithOtpValidate(values) {
  const errors = {};

  if (!values.usernameOrEmail) {
    errors.usernameOrEmail = "Username or Email is required";
    showToast(errors.usernameOrEmail);
  } else if (!values.otp) {
    errors.otp = "OTP is required";
    showToast(errors.otp);
  }

  return Object.keys(errors).length ? errors : null;
}

export async function resetPasswordValidate(values) {
  const errors = {};

  if (!values.password) {
    errors.password = "Password is required... !";
    showToast(errors.password);
  } else if (values.password.length < 6) {
    errors.password = "Password must be at least 6 characters... !";
    showToast(errors.password);
  } else if (!values.confirmPassword) {
    errors.confirmPassword = "Confirm Password is required... !";
    showToast(errors.confirmPassword);
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = "Password and confirm Password do not match... !";
    showToast(errors.confirmPassword);
  }

  return Object.keys(errors).length ? errors : null;
}
