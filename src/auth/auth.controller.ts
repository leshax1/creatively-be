import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  Req,
  Redirect,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: AuthDto) {
    return this.authService.signup(dto);
  }

  @Post('signin')
  signin(@Body() dto: AuthDto) {
    return this.authService.signin(dto);
  }

  @Get('linkedinLogin')
  @UseGuards(AuthGuard('linkedin'))
  linkedinLogin() {
    return 'linkedInLogin';
  }

  @Get('linkedinCallback')
  @UseGuards(AuthGuard('linkedin'))
  linkedinCallback(@Req() req) {
    const token = this.authService.signToken(req.user.id, req.user.email);
    console.log(token);
    return token;
  }

  @Get('deleteAll')
  deleteAll() {
    return this.authService.deleteAllUsers();
  }

  @Get('r')
  @Redirect('https://www.google.com/', 301)
  r() {
    console.log('REDIRECT');
    return 'OK';
  }
}
