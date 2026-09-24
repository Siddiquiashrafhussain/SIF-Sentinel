import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    const extractFromCookie = (req: any) => {
      let token = null;
      if (req && req.cookies) {
        token = req.cookies['sif_sentinel_auth'];
      }
      return token;
    };

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        extractFromCookie,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('AUTH_JWT_SECRET') || 'super-secret-key',
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, role: payload.role };
  }
}
