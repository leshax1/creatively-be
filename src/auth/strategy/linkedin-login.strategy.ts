import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-linkedin-oauth2';

@Injectable()
export class LinkedInLoginStrategy extends PassportStrategy(
  Strategy,
  'linkedin-login',
) {
  constructor(private config: ConfigService, private prisma: PrismaService) {
    super({
      clientID: config.get('linkedinClientId'),
      clientSecret: config.get('linkedinSecret'),
      callbackURL: 'http://localhost:3333/social/linkedinCallback',
      scope: ['r_emailaddress', 'r_liteprofile', 'w_member_social'],
    });
  }

  async validate(accessToken, refreshToken, profile) {
    console.log('!!!!!!!!!');
    const in60daysDate = new Date(
      new Date(Date.now() + 86400000 * 60),
    ).toISOString();

    console.log('profile?.id', profile.id);
    console.log('profile', profile);
    const user = await this.prisma.user.upsert({
      where: {
        email: profile.emails[0].value,
      },
      update: {
        linkedinProfileId: profile?.id,
        linkedInAccessToken: accessToken,
        linkedInAccessTokenExpirationDate: in60daysDate,
        firstName: profile?.name?.givenName,
        lastName: profile?.name?.familyName,
      },
      create: {
        email: profile.emails[0].value,
        firstName: profile?.name.givenName,
        lastName: profile?.name.familyName,
        linkedinProfileId: profile?.id,
        linkedInAccessToken: accessToken,
        linkedInAccessTokenExpirationDate: in60daysDate,
      },
      select: {
        id: true,
        email: true,
      },
    });

    return user;
  }
}
//https://github.com/prisma/prisma/issues/6727
