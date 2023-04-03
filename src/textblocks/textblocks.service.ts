import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Textblock } from "./textblocks.model";
import { CreateTextblockDto } from "./dto/create-textblock.dto";
import { UpdateTextblockDto } from "./dto/update-textblock.dto";
import { FilesService } from "src/files/files.service";
import { GetTextblockDto } from "./dto/get-textblock.dto";

@Injectable()
export class TextblocksService {
  constructor(
    @InjectModel(Textblock) private textblockRepository: typeof Textblock,
    private filesService: FilesService
  ) {}

  async getAllTextblocks(): Promise<GetTextblockDto[]> {
    const result: GetTextblockDto[] = []

    const textblocks = await this.textblockRepository.findAll();

    for (let textblock of textblocks){
      const fileInfo = await this.filesService.getFile("textblock", textblock.id);
      result.push(new GetTextblockDto(textblock, fileInfo.name))
    }

    return result;
  }

  async getTextblocksByGroup(group: string): Promise<GetTextblockDto[]> {
    const result: GetTextblockDto[] = []

    const textblocks = await this.textblockRepository.findAll({ where: { group } });

    for (let textblock of textblocks){
      const fileInfo = await this.filesService.getFile("textblock", textblock.id);
      result.push(new GetTextblockDto(textblock, fileInfo.name))
    }

    return result;
  }

  async getTextblockByName(name: string): Promise<GetTextblockDto> {
    const textblock = await this.textblockRepository.findOne({ where: { name } });
    const fileInfo = await this.filesService.getFile("textblock", textblock.id);
    return new GetTextblockDto(textblock, fileInfo.name);
  }

  private async getTextblockById(id: number): Promise<Textblock> {
    return await this.textblockRepository.findOne({ where: { id } });
  }

  async createTextblock(createTextblockDto: CreateTextblockDto, image: any): Promise<GetTextblockDto> {
    const textblock = await this.textblockRepository.create(createTextblockDto);
    const fileInfo = await this.filesService.saveFile(image, "textblock", textblock.id);
    return new GetTextblockDto(textblock, fileInfo.name);
  }

  async updateTextblock(id: number, updateTextblockDto: UpdateTextblockDto, image: any) {
    if (id != updateTextblockDto.id) {
      throw new HttpException("Id не совпадают", HttpStatus.BAD_REQUEST);
    }

    const textblock = await this.getTextblockById(id);
    if (!textblock) {
      throw new HttpException(
        "Текстовый блок не найден",
        HttpStatus.BAD_REQUEST
      );
    }

    for (let key in updateTextblockDto) {
      textblock[key] = updateTextblockDto[key];
    }
    textblock.save();


    let fileInfo;
    if(image){
      fileInfo = await this.filesService.updateFile(image, "textblock", textblock.id);
    } else{
      fileInfo = await this.filesService.getFile("textblock", textblock.id);
    }
    return new GetTextblockDto(textblock, fileInfo.name);
  }

  async deleteTextblock(id: number): Promise<void> {
    const textblock = await this.getTextblockById(id);
    if (!textblock) {
      throw new HttpException(
        "Текстовый блок не найден",
        HttpStatus.BAD_REQUEST
      );
    }

    await this.filesService.deleteFile("textblock", textblock.id);
    await this.textblockRepository.destroy({ where: { id } });
  }
}
