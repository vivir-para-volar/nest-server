import { Role } from "./roles.models";
import { CreateRoleDto } from "./dto/create-role.dto";
import { RolesService } from "./roles.service";
import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Roles } from "src/auth/roles-auth.decorator";
import { RolesGuard } from "src/auth/roles.guard";

@ApiTags("Роли")
@Controller("roles")
export class RolesController {
  constructor(private roleService: RolesService) {}

  @ApiOperation({ summary: "Получение всех ролей" })
  @ApiResponse({ status: 200, type: [Role] })
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @Get()
  getAll(): Promise<Role[]> {
    return this.roleService.getAllRoles();
  }

  @ApiOperation({ summary: "Получение роли по значению" })
  @ApiParam({ name: "value", description: "Значение роли", example: "ADMIN" })
  @ApiResponse({ status: 200, type: Role })
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @Get("/:value")
  getByValue(@Param("value") value: string): Promise<Role> {
    return this.roleService.getRoleByValue(value);
  }

  @ApiOperation({ summary: "Создание роли" })
  @ApiResponse({ status: 201, type: Role })
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @Post()
  create(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
    return this.roleService.createRole(createRoleDto);
  }
}
