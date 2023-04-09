import { Controller, Delete } from "@nestjs/common";
import { FilesService } from "./files.service";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

// Контроллер для тестирования, тк реально доступ будет осуществляться из других модулей
// Получение, сохранение, обновление, удаление протестированы через textblocks

@ApiTags("Файлы")
@Controller("files")
export class FilesController {
  constructor(private filesService: FilesService) {}

  @ApiOperation({ summary: "Удаление файлов, которые нигде не используется и прошло больше часа с момента создания" })
  @ApiResponse({ status: 200 })
  @Delete("/unused")
  deleteUnusedFiles(): void {
    this.filesService.deleteUnusedFiles();
  }
}
