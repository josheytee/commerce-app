export class CreateAndAssignPermissionsDto {
  userId: number;
  vendorId: number;
  roleName: number;
  roleDescription!: string;
  permissions: [];
}
