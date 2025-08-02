export interface IUserInRoleDto {
  id: number;
  fullName: string;
  email: string;
  gender: string;
  dateOfBirth: string |null
}

export interface IRoleWithUsersDto {
  roleId: number | null;
  users: IUserInRoleDto | null;
}