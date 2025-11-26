/// User type used in the application, with converted dates.
export type User = {
  id: string,
  createdAt: Date,
  firstName: string,
  lastName: string,
  lastOnline: Date,
  username: string,
  password: string,
};

/// User type understood by the API, with all-string properties.
export type ApiUser = Record<keyof User, string>;

// conversion functions
export const userFromApiUser = (user: ApiUser): User => ({
  ...user,
  createdAt: new Date(user.createdAt),
  lastOnline: new Date(user.lastOnline)
});
export const apiUserFromUser = (user: User): ApiUser => ({
  ...user,
  createdAt: user.createdAt.toUTCString(),
  lastOnline: user.lastOnline.toUTCString()
});
