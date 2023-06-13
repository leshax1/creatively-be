import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Post,
  Redirect,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { ArticleDto } from 'src/social/dto/article.dto';
import { SocialService } from './social.service';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/auth/auth.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Controller('social')
export class SocialController {
  constructor(
    private socialService: SocialService,
    private authService: AuthService,
    private httpService: HttpService,
    private config: ConfigService,
  ) {}

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
      url:
        this.config.get('angularUrl') +
        '/linkedinLogin?token=' +
        token.access_token,
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
        await this.socialService.updateLinkedInAccessToken(
          user.email,
          data.access_token,
        );
        await this.socialService.updateLinkedInUserId(
          user.email,
          data.access_token,
        );
      } else {
        throw new ForbiddenException([
          'Unable to update linkedInCredentials, missing access token',
        ]);
      }
    } catch (e) {
      console.log(e);
      throw new ForbiddenException(['Unable to update linkedInCredentials']);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('linkedinPublish')
  async linkedinPublish(@GetUser() user: User, @Body() dto: ArticleDto) {
    await this.socialService.post(user, dto.text);
  }
}
