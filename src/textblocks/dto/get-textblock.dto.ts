import { Textblock } from './../textblocks.model';
import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class GetTextblockDto {
  @ApiProperty({ example: "1", description: "Уникальный идентификатор" })
  @IsNumber({}, { message: "Должно быть числом" })
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

  @ApiProperty({ example: "image", description: "Картинка" })
  @IsString({ message: "Должно быть строкой" })
  readonly image: string;

  constructor(textblock: Textblock, image: string){
    this.id = textblock.id;
    this.name = textblock.name;
    this.title = textblock.title;
    this.text = textblock.text;
    this.group = textblock.group;
    this.image = image;
  }
}
