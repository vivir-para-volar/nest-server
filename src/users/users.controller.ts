import { JwtAuthGuard } from "./../auth/jwt-auth.guard";
import { RolesGuard } from "./../auth/roles.guard";
import { Roles } from "./../auth/roles-auth.decorator";
import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { User } from "./users.model";
import { UsersService } from "./users.service";
import { AddRoleDto } from "./dto/add-role.dto";

@ApiTags("Пользователи")
@Controller("users")
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: "Получение всех пользователей" })
  @ApiResponse({ status: 200, type: [User] })
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @Get()
  getAll(): Promise<User[]> {
    return this.usersService.getAllUsers();
  }

  @ApiOperation({ summary: "Получение пользователя по id" })
  @ApiParam({ name: "id", description: "Id пользователя", example: 1 })
  @ApiResponse({ status: 200, type: User })
  @UseGuards(JwtAuthGuard)
  @Get(":id")
  getById(@Param("id") id: number): Promise<User> {
    return this.usersService.getUserById(id);
  }

  @ApiOperation({ summary: "Выдача роли" })
  @ApiResponse({ status: 201, type: User })
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @Post("/role")
  addRole(@Body() addRoleDto: AddRoleDto): Promise<User> {
    return this.usersService.addRole(addRoleDto);
  }
}
