import { Injectable } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import * as argon from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  login() {}

  async signup(dto: AuthDto) {
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
  }

  async deleteAllUsers() {
    console.log('deleted');
    await this.prisma.user.deleteMany();
  }
}
