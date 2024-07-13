// product.controller.js
import asyncHandler from 'express-async-handler';
import { ProductService } from '../services/product.services';

export class ProductController {

    static createProduct = asyncHandler(async (req, res) => {
        const { name, description, price } = req.body;
        const product = await ProductService.create(name, description, price);
        res.status(201).json(product);
    });


    static buyProducts = asyncHandler(async (req, res) => {
        const { ids, email } = req.body;
        const order = await ProductService.buyProducts(ids, email);
        res.status(200).json(order);
    });
}
