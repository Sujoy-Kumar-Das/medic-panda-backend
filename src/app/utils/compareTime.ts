export const compareTime = (
  lastAttemptTime: Date,
  coolDownMinutes: number,
): boolean => {
  if (!lastAttemptTime) return false;

  const now = new Date();
  const coolDownEndTime = new Date(
    lastAttemptTime.getTime() + coolDownMinutes * 60 * 1000,
  );

  return now >= coolDownEndTime;
};
