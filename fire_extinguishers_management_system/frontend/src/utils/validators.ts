export const isEmail = (value: string) => /\S+@\S+\.\S+/.test(value);

export const isStrongEnoughPassword = (value: string) => value.trim().length >= 6;

export const required = (value: string) => value.trim().length > 0;

export const dateRangeIsValid = (start: string, end: string) => {
  if (!start || !end) {
    return false;
  }

  return new Date(end) > new Date(start);
};

export const isValidDate = (value: string) => {
  if (!value) return false;
  return !Number.isNaN(new Date(value).getTime());
};

export const isTodayOrFuture = (value: string) => {
  if (!isValidDate(value)) return false;
  const selected = new Date(value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return selected >= today;
};

export const isTodayOrPast = (value: string) => {
  if (!isValidDate(value)) return false;
  return new Date(value).getTime() <= Date.now();
};

export const expiryDateIsValid = (installationDate: string, expiryDate: string) => {
  if (!isValidDate(installationDate) || !isValidDate(expiryDate)) return false;
  return new Date(expiryDate) >= new Date(installationDate);
};
