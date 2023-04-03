import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { FileInfo } from "./files.model";
import * as path from "path";
import * as fs from "fs";
import * as uuid from "uuid";
import { Op } from "sequelize";

@Injectable()
export class FilesService {
  constructor(
    @InjectModel(FileInfo)
    private fileRepository: typeof FileInfo
  ) {}

  async getFile(essenceTable: string, essenceId: number): Promise<FileInfo> {
    return await this.fileRepository.findOne({ where: { essenceTable, essenceId } });
  }

  async saveFile(file: any, essenceTable: string, essenceId: number): Promise<FileInfo> {
    const fileName = await this.writeFile(file);

    return await this.fileRepository.create({
      name: fileName,
      essenceTable: essenceTable,
      essenceId: essenceId,
    });
  }

  async updateFile(file: any, essenceTable: string, essenceId: number): Promise<FileInfo> {
    const fileInfo = await this.getFile(essenceTable, essenceId);

    // Удаляем старый файл
    await this.rmFile(fileInfo.name);

    // Сохраняем новый
    const fileName = await this.writeFile(file);

    fileInfo.name = fileName;
    await fileInfo.save();

    return fileInfo;
  }

  async deleteFile(essenceTable: string, essenceId: number): Promise<void> {
    const fileInfo = await this.getFile(essenceTable, essenceId);

    await this.rmFile(fileInfo.name);
    await this.fileRepository.destroy({ where: { id: fileInfo.id } });
  }

  async deleteUnusedFiles(): Promise<void> {
    const oneHourAgo = new Date(Date.now() - 3600 * 1000);
    const files = await this.fileRepository.findAll({ where: {
      [Op.and]: [
          { essenceTable: null },
          { essenceId: null },
          { createdAt: { [Op.lte]: oneHourAgo } },
        ],
    }});

    for (let file of files){
      await this.rmFile(file.name);
      await this.fileRepository.destroy({ where: { id: file.id } });
    }
  }

  private async writeFile(file: any): Promise<string> {
    try {
      const fileName = uuid.v4() + ".jpg";
      const filePath = path.resolve(__dirname, "..", "static");

      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
      }

      fs.writeFileSync(path.join(filePath, fileName), file.buffer);
      return fileName;
    } catch (e) {
      throw new HttpException(
        "Произошла ошибка при записи файла",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  private async rmFile(fileName: string): Promise<void> {
    try {
      const filePath = path.resolve(__dirname, "..", "static");
      fs.rmSync(path.join(filePath, fileName));
    } catch (e) {
      throw new HttpException(
        "Произошла ошибка при удаление файла",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
