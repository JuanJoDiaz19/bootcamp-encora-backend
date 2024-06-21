import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { LoginUserDto } from '../dto/login-user.dto';
import { CreateClientDto } from '../dto/create-client.dto';
import { Role } from '../entities/role.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly jwtService: JwtService,
  ) {}

  async createAdmin(createUserDto: CreateClientDto) {
    try {
      const { password, ...userData } = createUserDto;

      const clientRole = await this.roleRepository.findOne({
        where: { role: 'ADMIN' },
      });

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
        role: clientRole,
      });

      await this.userRepository.save(user);

      return {
        ...user,
        token: this.jwtService.sign({ id: user.id }),
      };
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async createClient(createUserDto: CreateClientDto) {
    try {
      const { password, ...userData } = createUserDto;

      const clientRole = await this.roleRepository.findOne({
        where: { role: 'CLIENT' },
      });

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
        role: clientRole,
      });

      await this.userRepository.save(user);

      return {
        ...user,
        token: this.jwtService.sign({ id: user.id }),
      };
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    //console.log(loginUserDto)

    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['role'],
    });

    // console.log(user);

    if (!user)
      throw new UnauthorizedException('Credentials are not valid (email)');

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Credentials are not valid (password)');

    //console.log(user)
    return {
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        birth_date: user.birth_date,
        role: user.role.role,
      },
      token: this.jwtService.sign({ id: user.id }),
    };
  }

  async findUserById(id_user: string) {
    try {
      const user = await this.userRepository.findOneBy({
        id: id_user,
      });

      if (!user) {
        throw new NotFoundException('User not found in the system');
      }

      return user;
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async verifyToken(token: string) {
    try {
      const decoded = this.jwtService.verify(token);

      const user = await this.userRepository.findOne({
        where: { id: decoded.id },
        relations: ['role'],
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return {
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          birth_date: user.birth_date,
          role: user.role.role,
        },
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private handleDBErrors(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    console.log(error);

    throw new InternalServerErrorException('Please check server logs');
  }
}
