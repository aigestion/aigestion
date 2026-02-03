import { Module } from '@nestjs/common';
import { SystemModule } from './system/system.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [SystemModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
