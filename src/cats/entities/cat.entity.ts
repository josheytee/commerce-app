import { Cat as CatInterface } from '../interfaces/cat.interface';
export class Cat implements CatInterface {
  name: string = '';
  age: number = 0;
  breed: string = '';
}
