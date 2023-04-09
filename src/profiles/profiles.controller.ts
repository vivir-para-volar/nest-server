import { Roles } from "./../auth/roles-auth.decorator";
import { Body, Controller, Get, Param, Post, UseGuards, Delete, Put } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { RegistrationDto } from "./dto/registration.dto";
import { ProfilesService } from "./profiles.service";
import { Profile } from "./profiles.model";
import { JwtAuthGuard } from "./../auth/jwt-auth.guard";
import { RolesGuard } from "./../auth/roles.guard";
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
  getProfileById(@Param("id") id: number): Promise<Profile> {
    return this.profilesService.getProfileById(id);
  }

  @ApiOperation({ summary: "Получение профиля по id пользователя" })
  @ApiParam({ name: "id", description: "Id пользователя", example: 1 })
  @ApiResponse({ status: 200, type: Profile })
  @UseGuards(JwtAuthGuard)
  @Get("/user/:id")
  getProfileByUserId(@Param("id") id: number): Promise<Profile> {
    return this.profilesService.getProfileByUserId(id);
  }

  @ApiOperation({ summary: "Изменение профиля" })
  @ApiParam({ name: "id", description: "Id профиля", example: 1 })
  @ApiResponse({ status: 200, type: Profile })
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @Put(":id")
  updateProfile(@Param("id") id: number, @Body() updateProfileDto: UpdateProfileDto): Promise<Profile> {
    return this.profilesService.updateProfile(id, updateProfileDto);
  }

  @ApiOperation({ summary: "Удаление профиля (с пользователем)" })
  @ApiParam({ name: "id", description: "Id профиля", example: 1 })
  @ApiResponse({ status: 200 })
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @Delete(":id")
  deleteProfileByIdWithUser(@Param("id") id: number): void {
    this.profilesService.deleteProfileByIdWithUser(id);
  }
}
