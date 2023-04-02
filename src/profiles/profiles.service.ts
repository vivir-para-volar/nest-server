import { User } from "../users/users.model";
import { AuthService } from "./../auth/auth.service";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Profile } from "./profiles.model";
import { RegistrationDto } from "./dto/registration.dto";
import { AuthDto } from "src/auth/dto/auth.dto";
import { CreateProfileDto } from "./dto/create-profile.dto";
import { UsersService } from "src/users/users.service";
import { UpdateProfileDto } from "./dto/update-profile.dto";

@Injectable()
export class ProfilesService {
  constructor(
    @InjectModel(Profile) private profileRepository: typeof Profile,
    private usersService: UsersService,
    private authService: AuthService
  ) {}

  // Эндпоинт для регистрации (поучает и пароль и ФИО и телефон и пр).
  // Код профайла обращается к коду авторизации, получать ID_user и использовать его для создания профиля.
  // Благодаря этому код авторизации будет неизменным полностью, какие бы данные в профиле не были.
  async registration(registrationDto: RegistrationDto): Promise<Profile> {
    const authDto = new AuthDto(
      registrationDto.email,
      registrationDto.password
    );
    const user: User = await this.authService.registration(authDto);

    const createProfileDto = new CreateProfileDto(
      registrationDto.surname,
      registrationDto.name,
      registrationDto.phone,
      user.id
    );
    const profile = this.profileRepository.create(createProfileDto);
    return profile;
  }

  async getProfileById(id: number): Promise<Profile> {
    const profile = await this.profileRepository.findByPk(id);
    return profile;
  }

  async updateProfile(id: number, updateProfileDto: UpdateProfileDto): Promise<Profile> {
    if (id != updateProfileDto.id) {
      throw new HttpException("Id не совпадают", HttpStatus.BAD_REQUEST);
    }

    const profile = await this.getProfileById(id);
    if (!profile) {
      throw new HttpException("Профиль не найден", HttpStatus.BAD_REQUEST);
    }

    for (let key in updateProfileDto) {
      profile[key] = updateProfileDto[key];
    }
    profile.save();

    return profile;
  }

  async deleteProfileByIdWithUser(id: number): Promise<void> {
    const profile = await this.getProfileById(id);
    await this.usersService.deleteUserById(profile.userId);
    await this.profileRepository.destroy({ where: { id } });
  }
}
