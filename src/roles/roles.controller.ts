import { Role } from "./roles.model";
import { CreateRoleDto } from "./dto/create-role.dto";
import { RolesService } from "./roles.service";
import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Roles } from "./../auth/roles-auth.decorator";
import { RolesGuard } from "./../auth/roles.guard";

@ApiTags("Роли")
@Controller("roles")
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @ApiOperation({ summary: "Получение всех ролей" })
  @ApiResponse({ status: 200, type: [Role] })
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @Get()
  getAllRoles(): Promise<Role[]> {
    return this.rolesService.getAllRoles();
  }

  @ApiOperation({ summary: "Получение роли по значению" })
  @ApiParam({ name: "value", description: "Значение роли", example: "ADMIN" })
  @ApiResponse({ status: 200, type: Role })
  @Get(":value")
  getRoleByValue(@Param() param: { value: string }) {
    return this.rolesService.getRoleByValue(param.value);
  }

  @ApiOperation({ summary: "Создание роли" })
  @ApiResponse({ status: 201, type: Role })
  @Post()
  createRole(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
    return this.rolesService.createRole(createRoleDto);
  }
}
