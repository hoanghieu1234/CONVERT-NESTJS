import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './comment.dto';

@Controller('/api/v1')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('post-comments')
  async createComment(
    @Body() CreateCommentDto: CreateCommentDto,
    @Res() res: Response,
  ) {
    return await this.commentService.createComment(CreateCommentDto, res);
  }
  @Get('get-comments/:id')
  async getComment(@Param() idProduct: string, @Res() res: Response) {
    return await this.commentService.getComment(idProduct, res);
  }
  @Get('get-all-comment')
  async getAllComments(@Res() res: Response) {
    return await this.commentService.getAllComments(res);
  }
}
