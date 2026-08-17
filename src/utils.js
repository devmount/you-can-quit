// Build date format yyyy-mm-dd
export const getDate = (year, month, day) => {
  return year + '-' + ('0' + month).slice(-2) + '-' + ('0' + day).slice(-2);
};

// Get the earliest tracked date, or Unix epoch if there is no data yet
export const getMinDate = (statusData) => {
  const keys = Object.keys(statusData);
  if (keys.length === 0) {
    return new Date(1970, 0, 1);
  }
  return keys.reduce((min, v) => {
    const vd = new Date(v);
    return vd < min ? vd : min;
  }, new Date(keys[0]));
};

// Get number of successful days in a row directly preceding today
export const getCurrentStreak = (statusData) => {
  let streak = 0, undecided = true, n = new Date(), min = new Date(getMinDate(statusData)), key = '';
  while (min <= n) {
    n = new Date(n.setDate(n.getDate() - 1));
    key = getDate(n.getFullYear(), n.getMonth()+1, n.getDate());
    if (!(key in statusData) && undecided) continue;
    if (!(key in statusData) || (key in statusData && statusData[key] < 1)) break;
    else {
      undecided = false;
      streak++;
    }
  }
  return streak;
};
