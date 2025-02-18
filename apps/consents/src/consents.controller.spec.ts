import { Test, TestingModule } from '@nestjs/testing';
import { ConsentsController } from './consents.controller';
import { ConsentsService } from './consents.service';

describe('ConsentsController', () => {
  let consentsController: ConsentsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ConsentsController],
      providers: [ConsentsService],
    }).compile();

    consentsController = app.get<ConsentsController>(ConsentsController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(consentsController.getHello()).toBe('Hello World!');
    });
  });
});
