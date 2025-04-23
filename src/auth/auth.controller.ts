import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthSignUpDto } from './dto/auth-signup.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async SignUp(@Body() signupDto: AuthSignUpDto) {
    return this.authService.signUp(signupDto)
  }

  @Post('signin')
  async SignIn(@Body() signInDto: LoginDto) {
    return this.authService.signIn(signInDto)
  }
}
