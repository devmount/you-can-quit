// Build date format yyyy-mm-dd
export const getDate = (year, month, day) => {
  return year + '-' + ('0' + month).slice(-2) + '-' + ('0' + day).slice(-2);
};
