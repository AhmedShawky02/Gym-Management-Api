import * as clientType from "@prisma/client";


export type RolesWithUserAndPerson = {
  user_role_id: number;
  role_id: number | null;
  user_id: number | null;
  users: {
    id: number;
    email: string;
    gender_type_id: number | null;
    persons: {
      id: number;
      first_name: string;
      middle_name: string | null;
      last_name: string | null;
      date_of_birth: Date | null;
    }
  } | null;
  roles: {
    id: number;
    name: string;
  } | null;
}
