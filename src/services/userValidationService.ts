const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const avatarRegex = /^https?:\/\/.+\..+/;
const passwordRules = [
  { regex: /.{8,}/, message: "Пароль должен содержать минимум 8 символов." },
  { regex: /[A-Z]/, message: "Пароль должен содержать хотя бы одну заглавную букву." },
  { regex: /[a-z]/, message: "Пароль должен содержать хотя бы одну строчную букву." },
  { regex: /[0-9]/, message: "Пароль должен содержать хотя бы одну цифру." },
  { regex: /[!@#$%^&*(),.?":{}|<>]/, message: "Пароль должен содержать хотя бы один специальный символ." },
];

export const validateRegisterData = (email: string, password: string, avatar?: string): string[] => {
  const errors: string[] = [];

  if (!emailRegex.test(email)) errors.push("Некорректный email.");
  if (avatar && !avatarRegex.test(avatar)) errors.push("Некорректный URL для аватара.");

  const passwordErrors = passwordRules
    .filter(rule => !rule.regex.test(password))
    .map(rule => rule.message);

  return [...errors, ...passwordErrors];
};
