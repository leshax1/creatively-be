import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class SocialService {
  constructor(private prisma: PrismaService) {}
  async post(user: User, text: string) {
    const accessToken = user.linkedInAccessToken;

    const headers = {
      Authorization: `Bearer ${accessToken}`,
      'LinkedIn-Version': '202304',
      'X-Restli-Protocol-Version': '2.0.0',
      'Content-Type': 'application/json',
    };

    const params = {
      author: `urn:li:person:${user.linkedinProfileId}`,
      commentary: text,
      visibility: 'PUBLIC',
      distribution: {
        feedDistribution: 'MAIN_FEED',
        targetEntities: [],
        thirdPartyDistributionChannels: [],
      },
      lifecycleState: 'PUBLISHED',
      isReshareDisabledByAuthor: false,
    };

    console.log('params', params);

    const postResp = await fetch('https://api.linkedin.com/rest/posts', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(params),
    });

    if (postResp.ok) {
      const postId = postResp.headers.get('x-restli-id');
    } else {
      throw new ForbiddenException([postResp.status, postResp.statusText]);
    }
  }

  async updateLinkedInAccessToken(email: string, accessToken: string) {
    const in60daysDate = new Date(
      new Date(Date.now() + 86400000 * 60),
    ).toISOString();

    const user = await this.prisma.user.update({
      where: {
        email: email,
      },
      data: {
        linkedInAccessToken: accessToken,
        linkedInAccessTokenExpirationDate: in60daysDate,
      },
    });

    console.log('updateLinkedInAccessToken', user);
    return user;
  }
  async updateLinkedInUserId(email: string, accessToken: string) {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      'LinkedIn-Version': '202304',
      'X-Restli-Protocol-Version': '2.0.0',
      'Content-Type': 'application/json',
    };

    // Get user ID and cache it.
    const apiResp = await fetch('https://api.linkedin.com/v2/me', {
      headers: headers,
    });
    const profile = await apiResp.json();

    const user = await this.prisma.user.update({
      where: {
        email: email,
      },
      data: {
        linkedinProfileId: profile.id,
      },
    });

    return user;
  }
}
