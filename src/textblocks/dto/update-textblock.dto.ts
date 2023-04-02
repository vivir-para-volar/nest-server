import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class UpdateTextblockDto {
  @ApiProperty({ example: "1", description: "Уникальный идентификатор" })
  readonly id: number;

  @ApiProperty({ example: "main-hero-text", description: "Уникальное название для поиска" })
  @IsString({ message: "Должно быть строкой" })
  readonly name: string;

  @ApiProperty({ example: "main hero", description: "Название" })
  @IsString({ message: "Должно быть строкой" })
  readonly title: string;

  @ApiProperty({ example: "text", description: "Текст" })
  @IsString({ message: "Должно быть строкой" })
  readonly text: string;

  @ApiProperty({ example: "main-page", description: "Группа" })
  @IsString({ message: "Должно быть строкой" })
  readonly group: string;
}
