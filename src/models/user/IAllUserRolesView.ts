export interface IAllUserRolesView {
  user_id: number;
  fullName: string;
  gender: "male" | "female";
  email: string;
  roles: {
    role_Id: number;
    role_Name: string;
  }[];
}
