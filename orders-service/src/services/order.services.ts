import Order from "../models/order.model";

export async function createOrder(products : any, userEmail : string) {
    let total = 0;
    products.forEach((product : any) => {
        total += product.price;
    });

    const newOrder = new Order({
        products,
        user: userEmail,
        total_price: total,
    });
    await newOrder.save();
    return newOrder;

}