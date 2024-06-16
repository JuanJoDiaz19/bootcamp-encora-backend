import { Module } from '@nestjs/common';
import { AuthClientController } from './controllers/auth-client.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthClientService } from './services/auth-client.service';
import { AuthAdminController } from './controllers/auth-admin.controller';
import { AuthAdminService } from './services/auth-admin.service';
import { AdminStrategy } from './strategies/admin.strategy';
import { ClientStrategy } from './strategies/client.strategy';

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
        TypeOrmModule.forFeature([User]),
        TypeOrmModule.forFeature([Role]),
    ],
    controllers: [AuthClientController, AuthAdminController],
    providers: [AuthClientService, AuthAdminService, AdminStrategy, JwtStrategy, ClientStrategy ]
})
export class AuthModule {}
