import { IsInt, IsNotEmpty } from 'class-validator';

export class AssignRoleDto {
  @IsInt()
  @IsNotEmpty()
  readonly vendorId: number;

  @IsInt()
  @IsNotEmpty()
  readonly roleId: number; // The role to assign
}
