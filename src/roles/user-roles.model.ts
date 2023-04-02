import { ApiProperty } from "@nestjs/swagger";
import { User } from "../users/users.models";
import { Role } from "./roles.models";
import {
  Model,
  Table,
  Column,
  DataType,
  ForeignKey,
} from "sequelize-typescript";

// Убираем столбыцы createdAt(дата создания), updatedAt(дата обновления)
@Table({ tableName: "user_roles", createdAt: false, updatedAt: false })
export class UserRoles extends Model<UserRoles> {
  @ApiProperty({ example: "1", description: "Уникальный идентификатор" })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: "1", description: "Уникальный идентификатор пользователя" })
  @Column({ type: DataType.INTEGER })
  @ForeignKey(() => User)
  userId: number;

  @ApiProperty({ example: "1", description: "Уникальный идентификатор роли" })
  @Column({ type: DataType.INTEGER })
  @ForeignKey(() => Role)
  roleId: number;
}
