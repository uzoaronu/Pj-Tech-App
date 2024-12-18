import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ProductsModule } from './products/products.module';
import { GlobalModule } from './global/global.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RolesModule } from './roles/roles.module';
import config from './config/config';
import { LoggerMiddleware } from './middlewares/logger.middleware';

//AppModule is the root module of our application:
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config) => ({ secret: config.get('jwt.secret') }),
      global: true,
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      // imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('database.connectionString'),
      }),
      inject: [ConfigService],
    }), // MongooseModule.forRootAsync() is thesame as mongoose.connect in express
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: [config], //thisis the config fxn in config.ts
    }), //NB: this configModule provides us with a configService automatically wc allows us to read / access our configuratons  from config.ts and also read from .env file

    //configService provides a get() method for reading these configuration variables.

    // .forRoot() - Loads process environment variables(i.e. it goes to .env file and loads the variables there into process.env)  depending on the "ignoreEnvFile" flag and "envFilePath" value. Also, registers custom configurations globally.......................... It also registered and created a provider called ConfigService that we can use to load our Configurations and env variables.

    UserModule,
    ProductsModule,
    GlobalModule,
    AuthModule,
    RolesModule,
  ],
  controllers: [AppController],
  providers: [AppService, Logger], //remove AppService from here.its not doing anything in the provider.check first
  exports: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
