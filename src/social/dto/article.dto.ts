import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class ArticleDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(5000)
  text: string;
}
