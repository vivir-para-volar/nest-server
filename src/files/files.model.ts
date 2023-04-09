import { ApiProperty } from "@nestjs/swagger";
import { Model, Table, Column, DataType } from "sequelize-typescript";

interface FileCreationAttrs {
  name: string;
  essenceTable?: string;
  essenceId?: number;
}

@Table({ tableName: "files" })
export class FileInfo extends Model<FileInfo, FileCreationAttrs> {
  @ApiProperty({ example: "1", description: "Уникальный идентификатор" })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: "file.jpg", description: "Название" })
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  name: string;

  @ApiProperty({ example: "Textblock", description: "Сущность, где используется" })
  @Column({ type: DataType.STRING })
  essenceTable: string;

  @ApiProperty({ example: 1, description: "Уникальный идентификатор сущности" })
  @Column({ type: DataType.INTEGER })
  essenceId: number;
}
