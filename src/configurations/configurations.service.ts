import { Injectable } from '@nestjs/common';

import { ConfigurationsRepository } from './configurations.repository';

@Injectable()
export class ConfigurationsService {
  constructor(private configurationsRepository: ConfigurationsRepository) {}
  async findOne(name: string) {
    return await this.configurationsRepository.findOne(name);
  }
}
