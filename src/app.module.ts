import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { OrdersModule } from './orders/orders.module';
import { ShoppingCartModule } from './shopping_cart/shopping_cart.module';
import { ProductModule } from './product/product.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MailerModule.forRoot({
      transport: 'smtps://fitnestcorp@gmail.com:qnew upcg tcbv nggs@smtp.gmail.com',
      defaults: {
        from: '"Fitnest Corp" <fitnestcorp@gmail.com>',
      }
    }),
    TypeOrmModule.forRoot({
      type: 'postgres', 
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME, 
      username: process.env.DB_USER, 
      password: process.env.DB_PASSWORD, 
      autoLoadEntities: true, 
      synchronize: true 
    }),
    AuthModule, 
    CommonModule,
    OrdersModule, 
    ShoppingCartModule, 
    ProductModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
