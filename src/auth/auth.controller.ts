import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  Req,
  Redirect,
  Query,
  ForbiddenException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { GetUser } from './decorators/get-user.decorator';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

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

  @Get('linkedinLogin')
  @UseGuards(AuthGuard('linkedin-login'))
  linkedinLogin() {
    return 'linkedInLogin';
  }

  @Get('linkedinCallback')
  @UseGuards(AuthGuard('linkedin-login'))
  @Redirect()
  async linkedinLoginCallback(@Req() req) {
    const token = await this.authService.signToken(req.user.id, req.user.email);

    return {
      url: 'http://localhost:4200/linkedinLogin?token=' + token.access_token,
    };
  }

  @Post('updateLinkedInAccessToken')
  @UseGuards(AuthGuard('jwt'))
  async updateLinkedInAccessToken(
    @GetUser() user: User,
    @Body() body: { code: string },
  ) {
    try {
      const redirect_uri =
        this.config.get('angularUrl') + '/linkedinUpdateAccessToken';

      const { data } = await firstValueFrom(
        this.httpService.post(
          'https://www.linkedin.com/oauth/v2/accessToken',
          {
            grant_type: 'authorization_code',
            code: body.code,
            redirect_uri,
            client_id: this.config.get('linkedinClientId'),
            client_secret: this.config.get('linkedinSecret'),
          },
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          },
        ),
      );

      if (data.access_token) {
        return await this.authService.updateLinkedInAccessToken(
          user.email,
          data.access_token,
        );
      } else {
        throw new ForbiddenException(['Unable to get access_token by code']);
      }
    } catch (e) {
      console.log(e);
      throw new ForbiddenException(['Unable to get access_token by code']);
    }
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
