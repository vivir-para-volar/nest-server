import { User } from './../users/users.models';
import { ApiProperty } from "@nestjs/swagger";
import {
  Model,
  Table,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";

interface ProfileCreationAttrs {
  surname: string;
  name: string;
  phone: string;
  userId: number;
}

@Table({ tableName: "profiles" })
export class Profile extends Model<Profile, ProfileCreationAttrs> {
  @ApiProperty({ example: "1", description: "Уникальный идентификатор" })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: "Иванов", description: "Фамилия" })
  @Column({ type: DataType.STRING, allowNull: false })
  surname: string;

  @ApiProperty({ example: "Иван", description: "Имя" })
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @ApiProperty({ example: "89201234567", description: "Номер телефона" })
  @Column({ type: DataType.STRING, allowNull: false })
  phone: string;

  // Профиль принадлежит одному конкретному пользователю
  @ApiProperty({ example: '1', description: 'Уникальный идентификатор пользователя' })
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  userId: number;

  @BelongsTo(() => User)
  user: User;
}
