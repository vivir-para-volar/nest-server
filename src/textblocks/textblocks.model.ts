import { ApiProperty } from "@nestjs/swagger";
import { Model, Table, Column, DataType } from "sequelize-typescript";

interface TextblockCreationAttrs {
  name: string;
  title: string;
  text: string;
  group: string;
}

@Table({ tableName: "textblocks" })
export class Textblock extends Model<Textblock, TextblockCreationAttrs> {
  @ApiProperty({ example: "1", description: "Уникальный идентификатор" })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: "main-hero-text", description: "Уникальное название для поиска" })
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  name: string;

  @ApiProperty({ example: "main hero", description: "Название" })
  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @ApiProperty({ example: "text", description: "Текст" })
  @Column({ type: DataType.STRING, allowNull: false })
  text: string;

  @ApiProperty({ example: "main-page", description: "Группа" })
  @Column({ type: DataType.STRING, allowNull: false })
  group: string;
}
