export const validateSignup = (userData: any) => {
  const { email, username, fullname, password, confirmPassword } = userData;
  const errors: string[] = [];

  // email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errors.push("Doğru formatda e-poçt daxil edin.");
  }

  // username
  const usernameRegex = /^[a-zA-Z0-9_-]+$/;
  if (username.length < 3) {
    errors.push("İstifadəçi adı ən azı 3 simvol olmalıdır.");
  }
  if (/\s/.test(username)) {
    errors.push("İstifadəçi adı boşluq ala bilməz.");
  }
  if (!usernameRegex.test(username)) {
    errors.push("İstifadəçi adı yalnız hərf, rəqəm, _ və - daxil etməlidir.");
  }

  // fullname
  if (!fullname.trim()) {
    errors.push("İstifadəçinin tam adı boş ola bilməz.");
  }

  // password
  if (password.length < 6) {
    errors.push("Şifrə ən azı 6 simvol olmalıdır.");
  }
  if (password !== confirmPassword) {
    errors.push("Şifrələr bir-biri ilə uyğun deyil.");
  }

  return errors;
};

export const validateSignin = (userData: any) => {
  const { email, password } = userData;
  const errors: string[] = [];

  // email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errors.push("Doğru formatda e-poçt daxil edin.");
  }

  // password
  if (password.length < 6) {
    errors.push("Şifrə ən azı 6 simvol olmalıdır.");
  }

  return errors;
};
