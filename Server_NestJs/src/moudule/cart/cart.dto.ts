import { ObjectId } from "mongoose";

export class CartDto  {
  idUser: ObjectId;

  idProduct:ObjectId;

  quantity: number;
}