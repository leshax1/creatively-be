import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import * as argon from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signin(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto?.email,
      },
    });
    if (!user) throw new ForbiddenException('Credentials incorrect');

    const pwMatches = await argon.verify(user.password, dto.password);

    if (!pwMatches) throw new ForbiddenException('Credentials incorrect');

    console.log('user.id', user.id);
    console.log('user.email', user.email);

    return this.signToken(user.id, user.email);
  }

  async signup(dto: AuthDto) {
    try {
      const hash = await argon.hash(dto.password);

      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: hash,
          updatedAt: new Date(),
        },
        select: {
          email: true,
        },
      });
      return user;
    } catch (error) {
      if (error?.code == 'P2002') {
        throw new ForbiddenException(['Credentials Taken']);
      }
      throw error;
    }
  }

  async signToken(userId: number, email: string) {
    const payload = {
      sub: userId,
      email,
    };

    const access_token = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
      secret: this.configService.get('JWT_SECRET'),
    });

    console.log('sign_token', access_token);

    return { access_token };
  }

  async deleteAllUsers() {
    console.log('deleted');
    const user = await this.prisma.user.findUnique({
      where: {
        email: 'leshax@gmail.com',
      },
    });
    console.log('user', user);
    await this.prisma.user.deleteMany();
  }
}
