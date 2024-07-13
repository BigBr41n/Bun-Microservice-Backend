import mongoose from "mongoose";
import type { Document } from "mongoose";


export interface IProduct {
    name: string;
    description: string;
    price: number;
}

export interface IProductDocument extends Document {
    _id : mongoose.Types.ObjectId;
} ;


const ProductSchema = new mongoose.Schema({
    name: {
        type : String,
        required: true,
        unique: true,
    },
    description: {
        type : String,
        required: true,
        maxlength: 200,
    },
    price: {
        type : Number,
        required: true,
        min: 0,
    },
} , {timestamps: true});



const Product = mongoose.model<IProductDocument>("Product", ProductSchema);
export default Product ;