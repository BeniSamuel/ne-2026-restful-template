export const isEmail = (value: string) => /\S+@\S+\.\S+/.test(value);

export const isStrongEnoughPassword = (value: string) => value.trim().length >= 6;

export const required = (value: string) => value.trim().length > 0;

export const dateRangeIsValid = (start: string, end: string) => {
  if (!start || !end) {
    return false;
  }

  return new Date(end) > new Date(start);
};
