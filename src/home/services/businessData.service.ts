import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial } from "typeorm";
import { BusinessData } from "../entities/businessData.entity";
import BusinessDataCustomRepository from "../repositories/businessData.custom.repository";
import HomeService from "./home.service";

@Injectable()
export default class BusinessDataService {
  constructor(
    @InjectRepository(BusinessDataCustomRepository)
    private readonly businessDataRepository: BusinessDataCustomRepository,
    private readonly homeService: HomeService
  ) {}

  async generateBusinessDataForHome(
    homeUuid: string,
    initialOfferPrice: number,
    finalOfferPrice: number,
    targetSalePrice: number,
    negociationMargin:number,
    serviceFees:number,
  ): Promise<BusinessData> {
    
     function computeNegotiationMargin(targetSalePrice: number, finalOfferPrice: number,maxNegociationMargin=0.07){
     negociationMargin = Math.min((targetSalePrice/finalOfferPrice)-1 ,maxNegociationMargin)
    }
     
  function computeServiceFees(finalOfferPrice:number, zipCode:number){
       if (zipCode === 95) {
        serviceFees = computeLilleServiceFees(finalOfferPrice);
       }
       else if([75,92,93,94].includes(zipCode)) {
        serviceFees = computeParisServiceFees(finalOfferPrice);
       }
       else if (zipCode === 44 ) {
        serviceFees = computeNantesServiceFees(finalOfferPrice);
       }
   }
     function computeLilleServiceFees(finalOfferPrice: number):number{ 
      if(finalOfferPrice<100000)  return 15000;
      else if(100000<=finalOfferPrice && finalOfferPrice<145000)  return 19000;
      else if (145000<=finalOfferPrice && finalOfferPrice<200000) return 20000;
      else if (200000<=finalOfferPrice && finalOfferPrice<400000) return finalOfferPrice*0.1;
      else if (4000000<=finalOfferPrice && finalOfferPrice<650000) return finalOfferPrice*0.08;
      else  return  finalOfferPrice*0.3;
    }
    function computeParisServiceFees(finalOfferPrice: number):number{ 
      if(finalOfferPrice<100000)  return 20000;
        else if(100000<=finalOfferPrice && finalOfferPrice<145000)  return 22000;
        else if (145000<=finalOfferPrice && finalOfferPrice<200000) return 23000;
        else if (200000<=finalOfferPrice && finalOfferPrice<400000) return finalOfferPrice*0.11;
        else if (4000000<=finalOfferPrice && finalOfferPrice<650000) return finalOfferPrice*0.08;
        else  return  finalOfferPrice*0.1;
    }

     function computeNantesServiceFees(finalOfferPrice: number):number {
      if(finalOfferPrice<100000)  return 20000;
      else if(100000<=finalOfferPrice && finalOfferPrice<145000)  return 22000;
      else if (145000<=finalOfferPrice && finalOfferPrice<200000) return 23000;
      else if (200000<=finalOfferPrice && finalOfferPrice<400000) return finalOfferPrice*0.11;
      else if (4000000<=finalOfferPrice && finalOfferPrice<650000) return finalOfferPrice*0.08;
      else  return  finalOfferPrice*0.099;
    }
     
    const businessData = await this.createBusinessData({
      homeUuid,
      initialOfferPrice,
      finalOfferPrice,
      targetSalePrice,
      serviceFees,
      negociationMargin
    });
    await this.homeService.updateHome(homeUuid, {
      businessDataUuid: businessData.uuid,
    });
    return businessData;
  }

  async findBusinessDataByHomeUuid(homeUuid: string): Promise<BusinessData> {
    const results = await this.businessDataRepository.find({ homeUuid });
    if (results.length !== 1) {
      throw Error(
        `Could not find business data from home with uuid ${homeUuid}`
      );
    }
    return results[0];
  }

  async findBusinessData(uuid: string): Promise<BusinessData> {
    const results = await this.businessDataRepository.findByIds([uuid]);
    if (results.length !== 1) {
      throw Error(`Could not find business data with uuid ${uuid}`);
    }
    return results[0];
  }

  async createBusinessData(
    inputBusinessData: DeepPartial<BusinessData>
  ): Promise<BusinessData> {
    const businessData = await this.businessDataRepository.create(
      inputBusinessData
    );
    return this.businessDataRepository.save(businessData);
  }

  async deleteBusinessData(uuid: string): Promise<number> {
    const result = await this.businessDataRepository.delete({ uuid: uuid });
    if (!result.affected) {
      throw Error(`Could not delete business data with uuid ${uuid}`);
    }
    return result.affected;
  }
}
