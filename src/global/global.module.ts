import { Global, Module } from '@nestjs/common';
import { ProductsModule } from 'src/products/products.module';
// import { RolesModule } from 'src/roles/roles.module';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';

@Global()
@Module({
  imports: [ProductsModule, UserModule],
  providers: [UserService],
  exports: [UserModule, ProductsModule],
})
export class GlobalModule {}
