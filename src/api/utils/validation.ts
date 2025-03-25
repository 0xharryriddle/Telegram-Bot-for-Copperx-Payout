export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateOtp = (otp: string): boolean => {
  // Validate OTP format - expecting 6 digits
  const otpRegex = /^\d{6}$/;
  return otpRegex.test(otp);
};

export const validateAmount = (amount: string): boolean => {
  // Validate amount format - expecting positive number with up to 8 decimal places
  const amountRegex = /^(0|[1-9]\d*)(\.\d{1,8})?$/;
  return amountRegex.test(amount);
};
