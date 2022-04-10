

export function computeNegotiationMargin(targetSalePrice: number, finalOfferPrice: number,maxNegociationMargin=0.07){
    return Math.min((targetSalePrice/finalOfferPrice)-1 ,maxNegociationMargin)
  }
  
   export function computeServiceFees(finalOfferPrice:number, zipCode:string){
    if(finalOfferPrice<0) throw Error('Price cannot be negative');
    const depCode = zipCode.substring(0,2);
     if (depCode === '59') {
      return computeLilleServiceFees(finalOfferPrice);
     }
     else if(['75','92','93','94'].includes(depCode)) {
     return computeParisServiceFees(finalOfferPrice);
     }
     else if (['44','69'].includes(depCode) ) {
     return computeNantesServiceFees(finalOfferPrice);
     }
     else throw new Error('Departement code is not supported');
  }
  function computeLilleServiceFees(finalOfferPrice: number):number{ 
   if(finalOfferPrice<100000) return 15000;
   if(finalOfferPrice<145000) return 19000;
   if(finalOfferPrice<200000) return 20000;
   if(finalOfferPrice<400000) return finalOfferPrice*0.1;
   if(finalOfferPrice<650000) return finalOfferPrice*0.08;
   return  finalOfferPrice*0.3;
  }
  function computeParisServiceFees(finalOfferPrice: number):number{ 
      if(finalOfferPrice<100000) return 20000;
      if(finalOfferPrice<145000) return 22000;
      if(finalOfferPrice<200000) return 23000;
      if(finalOfferPrice<400000) return finalOfferPrice*0.11;
      if(finalOfferPrice<650000) return finalOfferPrice*0.08;
       return  finalOfferPrice*0.1;
  }
   function computeNantesServiceFees(finalOfferPrice: number):number {
    if(finalOfferPrice<100000)  return 20000;
    if(finalOfferPrice<145000)  return 22000;
    if(finalOfferPrice<200000) return 23000;
    if(finalOfferPrice<400000) return finalOfferPrice*0.11;
    if(finalOfferPrice<650000) return finalOfferPrice*0.08;
    return  finalOfferPrice*0.099;
  }