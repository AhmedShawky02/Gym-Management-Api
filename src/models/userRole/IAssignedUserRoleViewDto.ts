export interface IAssignedUserRoleViewDto {
  user_role_id: number;
  user: {
    user_id: number;
    fullName: string;
    gender: "male" | "female";
    email: string;
    roles: {
      role_Id: number;
      role_Name: string;
    }[];
  };
}
