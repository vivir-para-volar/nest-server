import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Length } from "class-validator";

export class RegistrationDto {
  @ApiProperty({ example: "user@mail.ru", description: "Почтовый адрес" })
  @IsString({ message: "Должно быть строкой" })
  @IsEmail({}, { message: "Некорректный email" })
  readonly email: string;

  @ApiProperty({ example: "12345678", description: "Пароль" })
  @IsString({ message: "Должно быть строкой" })
  @Length(4, 16, { message: "Не меньше 4 и не больше 16 символов" })
  readonly password: string;

  @ApiProperty({ example: "Иванов", description: "Фамилия" })
  @IsString({ message: "Должно быть строкой" })
  readonly surname: string;

  @ApiProperty({ example: "Иван", description: "Имя" })
  @IsString({ message: "Должно быть строкой" })
  readonly name: string;

  @ApiProperty({ example: "89201234567", description: "Номер телефона" })
  @IsString({ message: "Должно быть строкой" })
  readonly phone: string;
}
