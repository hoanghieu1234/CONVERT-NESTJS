export interface Product {
    _id: string;
    brand: string;
    title: string;
    image: string;
    description: string;
    price: number;
}
  
export interface ProductCardProps {
    grid: number;
    // comment: Comment[]; 
}

export interface SpecialProductProps {
    brand: string;
    title: string;
    price: number;
    discountDays: number;
    productCount: number;
}
