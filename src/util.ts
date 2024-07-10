export const groupBy = <T>(arr: T[], key: (i: T) => string) =>
  arr.reduce((groups, item) => {
    (groups[key(item)] ||= []).push(item);
    return groups;
  }, {} as Record<string, T[]>);

export const errorMessage = (message: string) => [
  {
    message: message,
  },
];
