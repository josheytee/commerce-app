export class CreateAttributeDto {
  readonly name: string;
  readonly type: 'string' | 'number' | 'boolean' | 'date' | 'json';
  // readonly options?: any;
}
