import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ConfigService } from '@nestjs/config';
import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { AuthorizationGuard } from 'src/guards/authorization.guard';
import { Permissions } from 'src/decorators/permissions.decorators';
import { Resource } from 'src/roles/enums/resource.enum';
import { Action } from 'src/roles/enums/action.enum';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@UseGuards(AuthenticationGuard, AuthorizationGuard)
@ApiTags('Products')
@ApiBearerAuth('jwt') // This applies the JWT Bearer authentication to all endpoints in this controller
// insert role/permission needed to access this Cpntroller here:
@Controller('/products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    // private configService: ConfigService,
  ) {}

  // @Permissions([
  //   { resource: Resource.products, actions: [Action.upload] },
  //   // { resource: Resource.settings, actions: [Action.read] },
  // ])
  // @Get()
  // getCustomersFromTheProductController() {
  //   console.log('from .env file :' + this.configService.get('PORT'));
  //   console.log(
  //     'from config.ts file :' +
  //       this.configService.get('database.connectionString'),
  //   );
  // }

  @Permissions([
    { resource: Resource.products, actions: [Action.create, Action.delete] },
  ])
  @Post()
  create(@Body() createProduct: CreateProductDto) {
    return this.productsService.createProduct(createProduct);
  }

  @Permissions([
    { resource: Resource.products, actions: [Action.read] },
    // { resource: Resource.settings, actions: [Action.read] },
  ])
  @Get()
  async getAllProducts() {
    return this.productsService.getAllProducts();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.productsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
  //   return this.productsService.update(+id, updateProductDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.productsService.remove(+id);
  // }
}
