import { IsNotEmpty, Matches, MaxLength, MinLength } from 'class-validator';

export class AuthCredentialDto {
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{8,32}$/, {
    message:
      'Password must have at least 1 uppercase letter and 1 lowercase letter and at least 1 number',
  })
  password: string;
}
