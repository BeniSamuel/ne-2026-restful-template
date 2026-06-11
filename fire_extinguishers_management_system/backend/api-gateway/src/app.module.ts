import { Module } from '@nestjs/common';
import { UserModule } from './module/users/users.module';
import { AuthModule } from './module/auth/auth.module';
import { ExtinguishersModule } from './module/extinguishers/extinguishers.module';
import { InspectionsModule } from './module/inspections/inspections.module';
import { MaintenanceModule } from './module/maintenance/maintenance.module';
import { ReportsModule } from './module/reports/reports.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET_KEY ?? 'fire-exam-secret',
      signOptions: { expiresIn: '1d' },
    }),
    UserModule,
    AuthModule,
    ExtinguishersModule,
    InspectionsModule,
    MaintenanceModule,
    ReportsModule,
  ],
})
export class AppModule {}
