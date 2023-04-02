import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class CreateProfileDto {
  @ApiProperty({ example: "Иванов", description: "Фамилия" })
  @IsString({ message: "Должно быть строкой" })
  readonly surname: string;

  @ApiProperty({ example: "Иван", description: "Имя" })
  @IsString({ message: "Должно быть строкой" })
  readonly name: string;

  @ApiProperty({ example: "89201234567", description: "Номер телефона" })
  @IsString({ message: "Должно быть строкой" })
  readonly phone: string;

  @ApiProperty({
    example: "1",
    description: "Уникальный идентификатор пользователя",
  })
  @IsNumber({}, { message: "Должно быть числом" })
  userId: number;

  constructor(surname: string, name: string, phone: string, userId: number) {
    this.surname = surname;
    this.name = name;
    this.phone = phone;
    this.userId = userId;
  }
}
