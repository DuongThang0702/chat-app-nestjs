import { Expose } from 'class-transformer';

export class CurrentDto {
  @Expose()
  _id: string;
  @Expose()
  lastname: string;
  @Expose()
  firstname: string;
  @Expose()
  email: string;
  @Expose()
  avatar: string;
}
