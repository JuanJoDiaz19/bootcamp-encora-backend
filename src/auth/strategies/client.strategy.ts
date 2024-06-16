import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Role } from "../entities/role.entity";
import { User } from "../entities/user.entity";
import { Repository } from "typeorm";
import { Reflector } from "@nestjs/core";

@Injectable()
export class ClientStrategy extends PassportStrategy(Strategy, 'client') {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private reflector: Reflector
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    //console.log('Inside JWT Strategy Validate');
    const userId = payload.id;
    const user = await this.userRepository.createQueryBuilder("user")
    .leftJoinAndSelect("user.role", "role")
    .where("user.id = :userId", { userId })
    .andWhere("role.role = :roleName", { roleName: "CLIENT" })
    .getOne();
    console.log(user);

    return (user?true: false);
  }
}