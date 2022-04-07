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
    const zipcode=(await this.homeService.findHome(homeUuid)).zipcode;
    negociationMargin=this.computeNegotiationMargin(targetSalePrice,finalOfferPrice);
    serviceFees=this.computeServiceFees(finalOfferPrice, zipcode);
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

   computeNegotiationMargin(targetSalePrice: number, finalOfferPrice: number,maxNegociationMargin=0.07){
     return Math.min((targetSalePrice/finalOfferPrice)-1 ,maxNegociationMargin)
   }
    
    computeServiceFees(finalOfferPrice:number, zipCode:string){
   if(finalOfferPrice<0) throw Error('Price cannot be negative');
     const depCode = zipCode.substring(0,2);
      if (depCode === '59') {
       return this.computeLilleServiceFees(finalOfferPrice);
      }
      else if(['75','92','93','94'].includes(depCode)) {
      return this.computeParisServiceFees(finalOfferPrice);
      }
      else if (['44','69'].includes(depCode) ) {
      return this.computeNantesServiceFees(finalOfferPrice);
      }
      else throw new Error('Departement code is not supported');
  }
   computeLilleServiceFees(finalOfferPrice: number):number{ 
    if(finalOfferPrice<100000) return 15000;
    if(finalOfferPrice<145000) return 19000;
    if(finalOfferPrice<200000) return 20000;
    if(finalOfferPrice<400000) return finalOfferPrice*0.1;
    if(finalOfferPrice<650000) return finalOfferPrice*0.08;
    return  finalOfferPrice*0.3;
  }
   computeParisServiceFees(finalOfferPrice: number):number{ 
       if(finalOfferPrice<100000) return 20000;
       if(finalOfferPrice<145000) return 22000;
       if(finalOfferPrice<200000) return 23000;
       if(finalOfferPrice<400000) return finalOfferPrice*0.11;
       if(finalOfferPrice<650000) return finalOfferPrice*0.08;
        return  finalOfferPrice*0.1;
  }
    computeNantesServiceFees(finalOfferPrice: number):number {
     if(finalOfferPrice<100000)  return 20000;
     if(finalOfferPrice<145000)  return 22000;
     if(finalOfferPrice<200000) return 23000;
     if(finalOfferPrice<400000) return finalOfferPrice*0.11;
     if(finalOfferPrice<650000) return finalOfferPrice*0.08;
     return  finalOfferPrice*0.099;
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
