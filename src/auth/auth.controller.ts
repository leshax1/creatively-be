import { Body, Controller, Post, Get, Redirect } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private httpService: HttpService,
    private config: ConfigService,
  ) {}

  @Post('signup')
  signup(@Body() dto: AuthDto) {
    return this.authService.signup(dto);
  }

  @Post('signin')
  signin(@Body() dto: AuthDto) {
    return this.authService.signin(dto);
  }

  @Get('deleteAll')
  deleteAll() {
    return this.authService.deleteAllUsers();
  }
}
