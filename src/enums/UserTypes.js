export const UserTypes = {
  USER: "user",
  ADMIN: "admin",
  ROOT: "root",
};

export function getUserTypes() {
  return Object.values(UserTypes);
}

export default UserTypes;
