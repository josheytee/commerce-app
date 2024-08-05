export class CreateCustomRoleDto {
  readonly name: string;
  readonly vendor_id: number;
  readonly permissionIds: number[];
}
