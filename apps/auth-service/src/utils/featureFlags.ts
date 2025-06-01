export const isGuestLoginEnabled = () => {
  return process.env.ENABLE_GUEST_LOGIN === 'true';
};
