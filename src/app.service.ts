import { Injectable } from '@nestjs/common';
import { ContextConfig } from './ContextConfig';
import { Client } from './Client';
import { ContextResponse } from './contextResponse';

var contextConfig : Object[] = require('../example-context-config.json');

@Injectable()
export class AppService {
  constructor(private readonly client: Client) {}

  healthCheck(): string {
    return 'Everything is working!';
  }

  async gatherContext(payload: any): Promise<ContextResponse[]> {


    var promises = contextConfig.map( (contextConfig: ContextConfig) => {
        return this.client.getContext(contextConfig)
    });

    return await Promise.all(promises)
           .then((result) => {
              return result.filter(context =>  context != null)
            })
            .catch((error) => {
              console.log('Error:');
              console.log(error);
              return []
    });
  }
}
