import {
  BadRequestException,
  HttpException,
  HttpStatus,
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
import { CreateUserDto } from '../dto/create-user.dto';
import { Role } from '../entities/role.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ShoppingCartService } from '../../shopping_cart/services/shopping_cart.service';
import { OrdersService } from '../../orders/services/orders.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    private readonly shoppinCartService: ShoppingCartService,
    private readonly orderService : OrdersService,
  ) {}

  async handleUserOauth(createUserDto: CreateUserDto) {
    try{ 
      const user = this.userRepository.findOneBy({email: createUserDto.email });

      if(user){
        //The user is in the system
        
        const {email, password} = createUserDto;
        const userLogin: LoginUserDto = { email, password};
        return this.login(userLogin);

      } else { 
        //The user is not in the system
        
        return this.createUser(createUserDto);
        
      }

    } catch(error) { 
      console.log(error);
    }
  }

  async createUser(createUserDto: CreateUserDto) {
    try {
        const { password, ...userData } = createUserDto;

        const clientRole = await this.roleRepository.findOne({
            where: { role: createUserDto.role },
        });

        const user = this.userRepository.create({
            ...userData,
            password: bcrypt.hashSync(password, 10),
            role: clientRole,
        });

        const savedUser = await this.userRepository.save(user);

        const newCart = await this.shoppinCartService.createShoppingCart(savedUser.id);

        savedUser.shoppingCart = newCart;
        await this.userRepository.save(savedUser);

        return {
            ...savedUser,
            token: this.jwtService.sign({ id: savedUser.id }),
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

  async recoverPassword(emailObject: any) {
    try {

      const email = emailObject.email;
      const user = await this.userRepository.findOne({
        where: { email },
      });
      
      const new_random_password = this.generateRandomString(10);

      user.password = bcrypt.hashSync(new_random_password, 10);

      const userSaved = await this.userRepository.save(user);
      
      this.mailerService.sendMail({
        to: user.email,
        from: 'fitnestcorp@gmail.com',
        subject: 'Recuperación de tu contraseña de FitNest',
        text: `
          Estimado/a ${user.first_name},

  Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en FitNest. Entendemos lo importante que es la seguridad de tu cuenta y queremos asegurarnos de que puedas acceder a ella lo antes posible.

  Tu nueva contraseña temporal es: ${new_random_password}

  Por favor, inicia sesión en tu cuenta con esta nueva contraseña. Te recomendamos que cambies esta contraseña temporal por una nueva contraseña personalizada lo antes posible para garantizar la seguridad de tu cuenta. Puedes hacerlo accediendo a la configuración de tu perfil dentro del sistema.

  Si no has solicitado este cambio de contraseña, te pedimos que te pongas en contacto con nuestro equipo de soporte de inmediato para que podamos ayudarte a proteger tu cuenta.

  Gracias por tu comprensión y disculpa cualquier inconveniente que esto pueda causar.

  Saludos cordiales,

  El equipo de FitNest
  fitnestcorp@gmail.com
  3181234567
  fitnestcorp.com
        `,
        html: `
        <!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Restablecimiento de Contraseña</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f7f7f7;
            margin: 0;
            padding: 20px;
        }
        .container {
            background-color: #ffffff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            max-width: 600px;
            margin: 0 auto;
        }
        .header {
            background-color: #000000;
            color: white;
            text-align: center;
            padding: 20px;
            border-top-left-radius: 5px;
            border-top-right-radius: 5px;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            margin-bottom: 15px;
        }
        .header h2 {
            margin: 0;
            font-size: 18px;
        }
        .content {
            font-size: 16px;
            line-height: 1.5;
            color: #333333;
            padding: 20px;
        }
        .footer {
            background-color: #000000;
            color: white;
            text-align: center;
            padding: 20px;
            border-bottom-left-radius: 5px;
            border-bottom-right-radius: 5px;
            margin-top: 30px;
        }
        .footer p {
            margin: 5px 0;
        }
        .footer a {
            color: white;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔑 Restablecimiento de Contraseña 🔒</h1>
            <h2>FitNest</h2>
        </div>
        <div class="content">
            <p>Estimado/a ${user.first_name},</p>
            <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en FitNest. Entendemos lo importante que es la seguridad de tu cuenta y queremos asegurarnos de que puedas acceder a ella lo antes posible.</p>
            <p>Tu nueva contraseña temporal es: <strong>${new_random_password}</strong></p>
            <p>Por favor, inicia sesión en tu cuenta con esta nueva contraseña. Te recomendamos que cambies esta contraseña temporal por una nueva contraseña personalizada lo antes posible para garantizar la seguridad de tu cuenta. Puedes hacerlo accediendo a la configuración de tu perfil dentro del sistema.</p>
            <p>Si no has solicitado este cambio de contraseña, te pedimos que te pongas en contacto con nuestro equipo de soporte de inmediato para que podamos ayudarte a proteger tu cuenta.</p>
            <p>Gracias por tu comprensión y disculpa cualquier inconveniente que esto pueda causar. 🙏</p>
        </div>
        <div class="footer">
            <p>Saludos cordiales del Equipo FitNest</p>
            <p>Email: <a href="mailto:fitnestcorp@gmail.com">fitnestcorp@gmail.com</a></p>
            <p>Teléfono: 3181234567 ☎️</p>
            <p>Web: <a href="http://fitnestcorp.com">fitnestcorp.com</a> 🌐</p>
        </div>
    </div>
</body>
</html>
        `,
      });
      return {
        success: true,
        message: 'Password recovery email sent successfully.',
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to recover password.',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateUser(updateUserDto: UpdateUserDto, id_user: string) {
    const { role, ...userToUpdate } = updateUserDto;

    const user = await this.userRepository.preload({
      id: id_user,
      ...userToUpdate,
    });

    if (!user)
      throw new NotFoundException(`Professional with id: ${id_user} not found`);

    try {
      await this.userRepository.save(user);
      return user;
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async findUserById(id_user: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: id_user },
        relations: ['role', 'addresses', 'orders','orders.items','orders.items.product', 'reviews', 'shoppingCart'],
      });

      if (!user) {
        throw new NotFoundException('User not found in the system');
      }

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        this.handleDBErrors(error);
      }
    }
  }

  private generateRandomString(length: number) {
    const charset =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomString = '*';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      randomString += charset[randomIndex];
    }
    return randomString;
  }

  private handleDBErrors(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    console.log(error);

    throw new InternalServerErrorException('Please check server logs');
  }

  async retriveAllUsers() {
    return this.userRepository.find();
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
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new UnauthorizedException('Invalid token');
      }
    }
  }

  async userHasProductInApprovedOrders(userId: string, productId: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['orders', 'orders.items', 'orders.items.product', 'orders.status'],
    });

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const approvedStatus = await this.orderService.getStatusByName("APPROVED")

    if (!approvedStatus) {
      throw new NotFoundException(`Order status 'APPROVED' not found`);
    }

    for (const order of user.orders) {
      if (order.status.id === approvedStatus.id) {
        for (const item of order.items) {
          if (item.product.id === productId) {
            return true;
          }
        }
      }
    }

    return false;
  }

}
