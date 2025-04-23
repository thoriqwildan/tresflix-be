import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow('secret.access'),
    });
  }

  validate(payload: any): unknown {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (!payload.sub) {
      throw new UnauthorizedException();
    }
    return payload;
  }
}