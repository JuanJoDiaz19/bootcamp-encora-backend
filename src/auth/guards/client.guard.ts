import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class ClientGuard extends AuthGuard('client') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    //console.log('Inside JWT AuthGuard canActivate');
    return super.canActivate(context);
  }
}