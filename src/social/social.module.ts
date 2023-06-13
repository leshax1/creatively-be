import { Module } from '@nestjs/common';
import { SocialController } from './social.controller';
import { SocialService } from './social.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [SocialController],
  providers: [SocialService],
  imports: [HttpModule],
})
export class SocialModule {}
