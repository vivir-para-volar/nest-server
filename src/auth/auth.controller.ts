import { Body, Controller, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto/auth.dto";

@ApiTags("Авторизация")
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: "Авторизация" })
  @ApiResponse({ status: 201, description: "Токен" })
  @Post("/login")
  login(@Body() authDto: AuthDto): Promise<{ token: string }> {
    return this.authService.login(authDto);
  }
}
