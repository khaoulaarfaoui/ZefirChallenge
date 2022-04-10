import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import BusinessDataCustomRepository from "../business/repositories/businessData.custom.repository";
import HomeCustomRepository from "./repositories/home.custom.repository";
import UserCustomRepository from "../user/repositories/user.custom.repository";
import { HomeResolver } from "./resolvers/home.resolver";
import { UserResolver } from "../user/resolvers/user.resolver";
import BusinessDataService from "../business/services/businessData.service";
import HomeService from "./services/home.service";
import UserService from "../user/services/user.service";
import { BusinessDataResolver } from "src/business/resolvers/businessData.resolver";

@Module({
  imports: [
    TypeOrmModule.forFeature([HomeCustomRepository]),
    TypeOrmModule.forFeature([BusinessDataCustomRepository]),
    TypeOrmModule.forFeature([UserCustomRepository]),
  ],
  providers: [
    HomeService,
    HomeResolver,
    BusinessDataService,
    BusinessDataResolver,
    UserService,
    UserResolver,
  ],
  exports: [],
})
export class HomeModule {}
