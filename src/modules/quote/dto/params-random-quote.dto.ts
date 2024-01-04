import { NumberFieldOptional } from '../../../decorators';

export class ParamRandomQuoteDto {
  @NumberFieldOptional({})
  readonly newBookId?: number;

  @NumberFieldOptional({})
  readonly currerntQuoteId?: number;
}
