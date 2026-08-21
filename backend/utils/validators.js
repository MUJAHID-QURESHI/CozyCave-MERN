const validateEmail = (email) => {
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

const validatePassword = (password) => {
  return password && password.length >= 6;
};

const validateMobile = (mobile) => {
  return mobile && mobile.trim().length >= 10;
};

module.exports = {
  validateEmail,
  validatePassword,
  validateMobile,
};
