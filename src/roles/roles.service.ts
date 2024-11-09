import { Injectable } from '@nestjs/common';
import { Role } from './schemas/role.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateRoleDto } from './dtos/role.dto';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role.name) private RoleModel: Model<Role>) {}

  async createRole(role: CreateRoleDto) {
    //Todo: Validate unigue names
    return this.RoleModel.create(role);
  }

  async getRoleById(roleId: string) {
    return this.RoleModel.findById(roleId);
  }
}
