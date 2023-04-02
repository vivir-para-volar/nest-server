import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { CreateRoleDto } from "./dto/create-role.dto";
import { Role } from "./roles.model";

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role) private roleRepository: typeof Role) {}

  async getAllRoles(): Promise<Role[]> {
    const roles = await this.roleRepository.findAll();
    return roles;
  }

  async getRoleByValue(value: string): Promise<Role> {
    const role = await this.roleRepository.findOne({ where: { value } });
    return role;
  }

  async createRole(createRoleDto: CreateRoleDto): Promise<Role> {
    const role = await this.roleRepository.create(createRoleDto);
    return role;
  }
}
