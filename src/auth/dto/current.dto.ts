import { Expose } from 'class-transformer';

export class CurrentDto {
  @Expose()
  lastname: string;
  @Expose()
  firstname: string;
  @Expose()
  email: string;
  @Expose()
  avatar: string;
}
