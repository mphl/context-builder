import { Injectable } from "@nestjs/common";
import { ContextConfig } from "./ContextConfig";
import { ContextResponse } from "./contextResponse";
import axios  from "axios";
import { validate } from 'jsonschema'
const circuitBreaker = require('opossum');


@Injectable()
export class Client {
    async getContext(config : ContextConfig): Promise<ContextResponse> {
          return this.fetchDataWithCircuitBreaker(config)
    }

    async fetchData(config : ContextConfig): Promise<ContextResponse> {
        try {
            console.log("fetching data from " + config.name)
            const response = await axios.get(config.endpoint);

            return this.createResponse(config.name, response);
          } catch(error) {
          console.log("error fetcing data");
          }
    }

    async fetchDataWithCircuitBreaker(config : ContextConfig): Promise<ContextResponse> {
        const options = {
            timeout: 3000, // If our function takes longer than 3 seconds, trigger a failure
            errorThresholdPercentage: 50, // When 50% of requests fail, trip the circuit
            resetTimeout: 30000 // After 30 seconds, try again.
          };
          const breaker = new circuitBreaker(this.fetchData(config), options);
          return await breaker.fire()
    }

    createResponse(contextName : string, response : any): Promise<ContextResponse>{
      
      if (response.status == 200 && this.checkMinimumFields(response.data)){
        return Object.assign({contextName}, response.data);
      }
    }

    checkMinimumFields (responseData: ContextResponse){
      if (responseData != null && responseData.elegible && responseData.applied){
        return responseData
      }
      console.log("missing mandatory response interface")
    }
}
