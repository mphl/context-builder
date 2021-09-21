import { Body, Controller, Get, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import { validate, ValidatorResult } from 'jsonschema'
var requestSchema = require('../context-builder-request-schema.json');


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  healthCheck(): string {
    return this.appService.healthCheck();
  }

  @Post('/context')
  async createContext(@Body() payload : any, @Res() res: Response): Promise<Response> {
    const requestValidation = this.validate(payload)
    if (!requestValidation.valid){
        return res.status(HttpStatus.BAD_REQUEST).json(requestValidation)
    }
    return res.status(HttpStatus.OK).json(await this.appService.gatherContext(payload))
  }

  validate(payload : any): ValidatorResult {
    return validate(payload, requestSchema)
  }
}
