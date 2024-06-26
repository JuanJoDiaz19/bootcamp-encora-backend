import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AdminStrategy } from './strategies/admin.strategy';
import { ClientStrategy } from './strategies/client.strategy';
import { CommonModule } from 'src/common/common.module';
import { UserService } from './services/user.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { AuthUserController } from './controllers/auth-user.controller';
import { ShoppingCartModule } from 'src/shopping_cart/shopping_cart.module';
import { OrdersModule } from 'src/orders/orders.module';
import { GoogleStrategy } from './strategies/google.strategy';
import { AuthGoogleController } from './controllers/auth-google.controller';

@Module({
    imports: [
        PassportModule.register({defaultStrategy: 'jwt'}),
        JwtModule.registerAsync({
            imports: [ ConfigModule ],
            inject: [ ConfigService ],
            useFactory: ( configService: ConfigService ) => ({
                secret: configService.get('JWT_SECRET') || 'secret',
                signOptions: {expiresIn:'20h'}
            })
          }), 
        TypeOrmModule.forFeature([User, Role]),
        ShoppingCartModule, OrdersModule
    ],
    controllers: [AuthUserController, AuthGoogleController],
    providers: [ UserService, AdminStrategy, JwtStrategy, ClientStrategy, GoogleStrategy ],
    exports:[UserService]
})
export class AuthModule {}
