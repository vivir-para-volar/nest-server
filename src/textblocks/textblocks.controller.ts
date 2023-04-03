import { RolesGuard } from "src/auth/roles.guard";
import { Roles } from "./../auth/roles-auth.decorator";
import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { TextblocksService } from "./textblocks.service";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { UpdateTextblockDto } from "./dto/update-textblock.dto";
import { CreateTextblockDto } from "./dto/create-textblock.dto";
import { GetTextblockDto } from "./dto/get-textblock.dto";

@ApiTags("Текстовые блоки")
@Controller("textblocks")
export class TextblocksController {
  constructor(private textblocksService: TextblocksService) {}

  @ApiOperation({ summary: "Получение всех текстовых блоков" })
  @ApiResponse({ status: 200, type: [GetTextblockDto] })
  @UseGuards(JwtAuthGuard)
  @Get()
  getAll(): Promise<GetTextblockDto[]> {
    return this.textblocksService.getAllTextblocks();
  }

  @ApiOperation({ summary: "Получение текстовых блоков по группе" })
  @ApiParam({ name: "group", description: "Группа", example: "main-page" })
  @ApiResponse({ status: 200, type: [GetTextblockDto] })
  @UseGuards(JwtAuthGuard)
  @Get("/group/:group")
  getByGroup(@Param("group") group: string): Promise<GetTextblockDto[]> {
    return this.textblocksService.getTextblocksByGroup(group);
  }

  @ApiOperation({ summary: "Получение текстового блока по уникальному названию" })
  @ApiParam({ name: "name", description: "Уникальное название для поиска", example: "main-hero-text" })
  @ApiResponse({ status: 200, type: GetTextblockDto })
  @UseGuards(JwtAuthGuard)
  @Get(":name")
  getByName(@Param("name") name: string): Promise<GetTextblockDto> {
    return this.textblocksService.getTextblockByName(name);
  }

  @ApiOperation({ summary: "Создание тектового блока" })
  @ApiResponse({ status: 201, type: GetTextblockDto })
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @Post()
  @UseInterceptors(FileInterceptor("image"))
  createTextBlock(
    @Body() createTextblockDto: CreateTextblockDto,
    @UploadedFile() image: any
  ): Promise<GetTextblockDto> {
    return this.textblocksService.createTextblock(createTextblockDto, image);
  }

  @ApiOperation({ summary: "Изменение текстового блока" })
  @ApiParam({ name: "id", description: "Id текстового блока", example: 1 })
  @ApiResponse({ status: 200, type: GetTextblockDto })
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @Put(":id")
  @UseInterceptors(FileInterceptor("image"))
  update(
    @Param("id") id: number,
    @Body() updateTextblockDto: UpdateTextblockDto,
    @UploadedFile() image?: any
  ): Promise<GetTextblockDto> {
    return this.textblocksService.updateTextblock(
      id,
      updateTextblockDto,
      image
    );
  }

  @ApiOperation({ summary: "Удаление текстового блока" })
  @ApiParam({ name: "id", description: "Id текстового блока", example: 1 })
  @ApiResponse({ status: 204 })
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @Delete(":id")
  delete(@Param("id") id: number): void {
    this.textblocksService.deleteTextblock(id);
  }
}
