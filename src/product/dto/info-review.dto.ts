import { Product } from "../entities/product.entity";
import { Review } from "../entities/review.entity";

export class InfoReviewDto{

    id: string;
    title: string;
    score: number;
    comment: string;
    user: string;
    publication_date: Date;
    product: Product;

    constructor(review:Review){
        this.id = review.id;
        this.title = review.title;
        this.score = review.score;
        this.comment = review.comment;
        this.user = `${review.user.first_name} ${review.user.last_name}`;
        this.publication_date = review.publication_date;
        this.product = review.product;
    }
}