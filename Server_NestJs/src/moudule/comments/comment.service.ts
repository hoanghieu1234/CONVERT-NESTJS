import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment } from './comment.entity';
import { CreateCommentDto } from './comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
  ) {}

  // create a comment
  async createComment(createCommentDto: CreateCommentDto, res: any) {
    const { idUser, idProduct, content, rating } = createCommentDto;
    const idUserConvert = new Types.ObjectId(idUser);
    const idProductConvert = new Types.ObjectId(idProduct);
    const newComment = new this.commentModel({
      idUser: idUserConvert,
      idProduct: idProductConvert,
      content: content,
      rating: rating,
    });
    try {
      const saveComment = await newComment.save();
      return res.status(200).json(saveComment);
    } catch (error) {
      return res.status(500).json({ message: 'Error Server' });
    }
  }

  // get a comment
  async getComment(idProduct: any, res: any):Promise<Comment[]> {
    const convertIdProduct = new Types.ObjectId(idProduct);
    try {
      const getComment = await this.commentModel
        .find({ idProduct: convertIdProduct })
        .populate('idUser')
        .exec();
      return res.status(200).json(getComment);
    } catch (error) {
      return res.status(500).json({msg:'Error Server'},error)
    }
  }
}
