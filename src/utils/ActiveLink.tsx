export const isActiveLink = (path: string, linkPath: string) => {
  return path === linkPath || path.startsWith(linkPath);
};
