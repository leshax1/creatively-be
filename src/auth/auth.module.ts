import { Global, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { LinkedInLoginStrategy } from './strategy/linkedin-login.strategy';
import { HttpModule } from '@nestjs/axios';

@Global()
@Module({
  imports: [JwtModule.register({}), HttpModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LinkedInLoginStrategy],
  exports: [AuthService],
})
export class AuthModule {}
