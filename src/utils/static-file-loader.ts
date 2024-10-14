export const staticFileLoader = (url: string) => {
  return process.env.API_STATIC_FILES + "/" + url;
};
