import Product , {type IProductDocument } from "../models/product.model";
import { connectAMQP } from "../../../config/amqp.connect";
import logger from "../../../utils/logger";


export class ProductService {



    /**
    * Creates a new product in the database.
    *
    * @param name - A string representing the name of the product.
    * @param description - A string representing the description of the product.
    * @param price - A number representing the price of the product.
    *
    * @returns A Promise that resolves to the newly created product document.
    */
    static create = async (name : string , description : string , price : number) => {
        try {

            const newProduct = new Product({
                name,
                description,
                price,
            });
            newProduct.save();
            return newProduct;
            
        } catch (error : any) {
            throw error;
        } 
    }





    /**
    * This function simulates a purchase of products by sending their IDs and the user's email to an AMQP queue.
    * It listens for a response from the order microservice and returns the order details.
    *
    * @param {string} ids - An array of strings representing the IDs of the products to be purchased.
    * @param {string} email - A string representing the user's email.
    *
    * @returns A Promise that resolves to the order details received from the order microservice.
    * If no data is received from the queue, it logs an error message and returns `undefined`.
    */

    static buyProducts = async (ids : string[] , email : string) => {
        try {
            const {channel , connection} = await connectAMQP();

            logger.info("connected to AMQP");        
    
            const products = await Product.find({ _id: { $in: ids } });
    
            //sending the products to the order microservice
            channel.sendToQueue(
                "ORDER",
                Buffer.from(
                    JSON.stringify({
                        products,
                        userEmail: email,
                    })
                )
            );
    
            let order ;
            channel.consume("PRODUCT", (data) => {
                if (data !== null) {
                    order = JSON.parse(data.content.toString());
                    channel.ack(data);
                } else {
                logger.error("No data received from the queue");
                }
            })
            return order;
        } catch (error : any) {
            throw error;
        }
    }
}



