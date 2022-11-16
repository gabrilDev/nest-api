import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './../user/user.entity';
import { UserService } from './../user/user.service';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: `${process.env.JWT_SECRET}`,
        signOptions: {
          expiresIn: '30s',
        },
      }),
    }),
  ],
  providers: [AuthService, AuthResolver, UserService, JwtStrategy],
})
export class AuthModule {}
