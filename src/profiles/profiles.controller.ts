import { Roles } from "./../auth/roles-auth.decorator";
import { Body, Controller, Get, Param, Post, UseGuards, Delete, Put } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { RegistrationDto } from "./dto/registration.dto";
import { ProfilesService } from "./profiles.service";
import { Profile } from "./profiles.model";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { RolesGuard } from "src/auth/roles.guard";
import { UpdateProfileDto } from "./dto/update-profile.dto";

@ApiTags("Профили пользователей")
@Controller("profiles")
export class ProfilesController {
  constructor(private profilesService: ProfilesService) {}

  @ApiOperation({ summary: "Регистрация" })
  @ApiResponse({ status: 201, type: [Profile] })
  @Post("/registration")
  registration(@Body() registrationDto: RegistrationDto): Promise<Profile> {
    return this.profilesService.registration(registrationDto);
  }

  @ApiOperation({ summary: "Получение профиля по id" })
  @ApiParam({ name: "id", description: "Id профиля", example: 1 })
  @ApiResponse({ status: 200, type: Profile })
  @UseGuards(JwtAuthGuard)
  @Get(":id")
  getById(@Param("id") id: number): Promise<Profile> {
    return this.profilesService.getProfileById(id);
  }

  @ApiOperation({ summary: "Изменение профиля по id" })
  @ApiParam({ name: "id", description: "Id профиля", example: 1 })
  @ApiResponse({ status: 200, type: Profile })
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @Put(":id")
  update(@Param("id") id: number, @Body() updateProfileDto: UpdateProfileDto): Promise<Profile> {
    return this.profilesService.updateProfile(id, updateProfileDto);
  }

  @ApiOperation({ summary: "Удаление профиля по id (с пользователем)" })
  @ApiParam({ name: "id", description: "Id профиля", example: 1 })
  @ApiResponse({ status: 204 })
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @Delete(":id")
  delete(@Param("id") id: number): void {
    this.profilesService.deleteProfileByIdWithUser(id);
  }
}
