import { AuthService } from 'api/services';
import { BaseController } from './base.controller';

export class AuthController extends BaseController {
  constructor(private authService: AuthService) {
    super();
  }
}
