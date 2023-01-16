import {IsEmail, IsOptional, IsString, Length} from 'class-validator';
export class CreateUserDto {
  @IsEmail({}, {message: 'This field must be a valid email address'})
  public email!: string;

  @IsString({message: 'Name is required'})
  @Length(1, 15, {message: 'Name length must be between 1 and 15 symbols'})
  public username!: string;

  @IsOptional()
  public avatarFile?: Buffer;

  @IsString({message: 'Password is required'})
  @Length(6, 12, {message: 'Password length must be between 6 and 12 symbols'})
  public password!: string;
}
