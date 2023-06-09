import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-linkedin-oauth2';

@Injectable()
export class LinkedInGrantAccessStrategy extends PassportStrategy(
  Strategy,
  'linkedin-grant-access',
) {
  constructor(private config: ConfigService, private prisma: PrismaService) {
    super({
      clientID: config.get('linkedinClientId'),
      clientSecret: config.get('linkedinSecret'),
      callbackURL: 'http://localhost:4200/connections',
      scope: ['r_emailaddress', 'r_liteprofile'],
    });
  }

  async validate(accessToken) {
    console.log('accessToken linkedin-grant-access', accessToken);
    return accessToken;
  }
}
//https://github.com/prisma/prisma/issues/6727
