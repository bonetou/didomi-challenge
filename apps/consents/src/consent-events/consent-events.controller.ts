import { Body, Controller, Post } from '@nestjs/common';
import { ConsentEventsService } from './consent-events.service';
import { CreateConsentEventDto } from './dto/create-consent-event.dto';
import { EventPattern } from '@nestjs/microservices';
import { CreateUserDto } from './dto/create-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';

@Controller('events')
export class ConsentsController {
  constructor(private readonly consentsService: ConsentEventsService) {}

  @Post()
  processConsentEvent(@Body() consentEventDto: CreateConsentEventDto) {
    return this.consentsService.processConsentEvent(consentEventDto);
  }

  @EventPattern('user.created')
  async handleUserCreated(@Body() data: CreateUserDto) {
    await this.consentsService.createUser(data);
  }

  @EventPattern('user.deleted')
  async handleUserDeleted(@Body() data: DeleteUserDto) {
    await this.consentsService.softDeleteUser(data.userId);
  }
}
