import {
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller({
  version: '1',
  path: 'users',
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':userId')
  async findByUserId(@Param('userId') userId: string) {
    return await this.usersService.findByUserId(userId);
  }

  @Patch(':userId')
  @UseInterceptors(FileInterceptor('file'))
  async patchByUserId(
    @Param('userId') userId: string,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000 }),
          new FileTypeValidator({ fileType: 'image/jpeg' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {}
}
