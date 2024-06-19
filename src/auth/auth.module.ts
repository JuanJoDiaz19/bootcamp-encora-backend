import { Module, forwardRef } from '@nestjs/common';
import { AuthClientController } from './controllers/auth-client.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthAdminController } from './controllers/auth-admin.controller';
import { AdminStrategy } from './strategies/admin.strategy';
import { ClientStrategy } from './strategies/client.strategy';
import { CommonModule } from 'src/common/common.module';
import { UserService } from './services/user.service';

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
    ],
    controllers: [AuthClientController, AuthAdminController],
    providers: [ UserService, AdminStrategy, JwtStrategy, ClientStrategy ]
})
export class AuthModule {}
