import { AuthService } from '../services/auth.service';
import { BaseController } from './base.controller';

export class AuthController extends BaseController {
  constructor(private authService: AuthService) {
    super();
  }
}
