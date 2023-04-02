import { UserRoles } from "../roles/user-roles.model";
import { Role } from "../roles/roles.model";
import { ApiProperty } from "@nestjs/swagger";
import { Model, Table, Column, DataType, BelongsToMany } from "sequelize-typescript";

interface UserCreationAttrs {
  email: string;
  password: string;
}

@Table({ tableName: "users" })
export class User extends Model<User, UserCreationAttrs> {
  @ApiProperty({ example: "1", description: "Уникальный идентификатор" })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: "user@mail.ru", description: "Почтовый адрес" })
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  email: string;

  @ApiProperty({ example: "12345678", description: "Пароль" })
  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  // Связь многие ко многим (с какой сущностью связываемся, через какую таблицу это делаем)
  @BelongsToMany(() => Role, () => UserRoles)
  roles: Role[];
}
