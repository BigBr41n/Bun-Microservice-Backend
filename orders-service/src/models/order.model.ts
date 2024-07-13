import mongoose , {type Document} from 'mongoose';

interface IOrder {
    products: {product_id : string}[];
    user: string;
    total_price: number;
}

export interface IOrderDocument extends IOrder, Document {
    _id : mongoose.Types.ObjectId;
} ;

const OrderSchema = new mongoose.Schema({
    products: [
        {
            product_id: String,
        },
    ],
    user: String,
    total_price: Number,

} , {timestamps : true});

const Order = mongoose.model<IOrderDocument>("order", OrderSchema);
export default Order ;