import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super({
      datasources: {
        db: {
          url: 'postgres://qfqogtwmgbfjkk:893820c0f5c3d7247c851358ee86b14822fefe7439709fe80520d38eb04c40b3@ec2-3-208-74-199.compute-1.amazonaws.com:5432/dfrafqgmppktd8',
        },
      },
    });
  }
}
