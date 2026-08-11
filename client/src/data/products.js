const products = [
  {
    id: 1,
    name: "Luxury Senator Wear",
    brand: "Mandilas Fashion",
    category: "Men's Fashion",
    seller: "Mandilas Fashion Hub",
    sellerId: 101,

    price: 25000,
    oldPrice: 35000,
    discount: 30,

    stock: 20,
    rating: 4.8,
    reviews: 245,

    sku: "MM-SEN-001",
    warranty: "6 Months",
    delivery: "Nationwide",
    returnPolicy: "7 Days Return Policy",

    image: "/products/product1.jpg",

    images: [
      "/products/product1.jpg",
      "/products/product1.jpg",
      "/products/product1.jpg",
      "/products/product1.jpg",
    ],

    description:
      "Luxury Senator Wear made with premium quality fabric. Suitable for weddings, church services, office meetings and special occasions. Designed for comfort, elegance and durability.",

    specifications: {
      material: "Premium Cotton",
      colour: "Black",
      sizes: ["S", "M", "L", "XL"],
      weight: "1kg",
      condition: "Brand New",
    },
  },

  {
    id: 2,
    name: "Classic Men's Shoe",
    brand: "Mandilas Footwear",
    category: "Shoes",
    seller: "Mandilas Fashion Hub",
    sellerId: 101,

    price: 18000,
    oldPrice: 25000,
    discount: 28,

    stock: 35,
    rating: 4.7,
    reviews: 180,

    sku: "MM-SHOE-002",
    warranty: "3 Months",
    delivery: "Nationwide",
    returnPolicy: "7 Days Return Policy",

    image: "/products/product2.jpg",

    images: [
      "/products/product2.jpg",
      "/products/product2.jpg",
      "/products/product2.jpg",
      "/products/product2.jpg",
    ],

    description:
      "Classic men's shoe made from premium leather for office, weddings and casual outings.",

    specifications: {
      material: "Leather",
      colour: "Brown",
      sizes: ["40", "41", "42", "43", "44"],
      weight: "1.2kg",
      condition: "Brand New",
    },
  },

  {
    id: 3,
    name: "Women's Handbag",
    brand: "Mandilas Bags",
    category: "Bags",
    seller: "Mandilas Fashion Hub",
    sellerId: 102,

    price: 15000,
    oldPrice: 22000,
    discount: 32,

    stock: 18,
    rating: 4.9,
    reviews: 310,

    sku: "MM-BAG-003",
    warranty: "6 Months",
    delivery: "Nationwide",
    returnPolicy: "7 Days Return Policy",

    image: "/products/product3.jpg",

    images: [
      "/products/product3.jpg",
      "/products/product3.jpg",
      "/products/product3.jpg",
      "/products/product3.jpg",
    ],

    description:
      "Elegant ladies handbag suitable for office, parties and everyday fashion.",

    specifications: {
      material: "Leather",
      colour: "Red",
      sizes: ["Medium"],
      weight: "800g",
      condition: "Brand New",
    },
  },

  {
    id: 4,
    name: "Luxury Wrist Watch",
    brand: "Mandilas Time",
    category: "Watches",
    seller: "Mandilas Fashion Hub",
    sellerId: 103,

    price: 32000,
    oldPrice: 45000,
    discount: 29,

    stock: 12,
    rating: 4.8,
    reviews: 154,

    sku: "MM-WATCH-004",
    warranty: "12 Months",
    delivery: "Nationwide",
    returnPolicy: "7 Days Return Policy",

    image: "/products/product4.jpg",

    images: [
      "/products/product4.jpg",
      "/products/product4.jpg",
      "/products/product4.jpg",
      "/products/product4.jpg",
    ],

    description:
      "Luxury wrist watch with stainless steel body and water-resistant design.",

    specifications: {
      material: "Stainless Steel",
      colour: "Silver",
      sizes: ["Standard"],
      weight: "350g",
      condition: "Brand New",
    },
  },

  {
    id: 5,
    name: "Native Cap",
    brand: "Mandilas Traditional",
    category: "Men's Fashion",
    seller: "Mandilas Fashion Hub",
    sellerId: 101,

    price: 8000,
    oldPrice: 12000,
    discount: 25,

    stock: 45,
    rating: 4.6,
    reviews: 92,

    sku: "MM-CAP-005",
    warranty: "No Warranty",
    delivery: "Nationwide",
    returnPolicy: "7 Days Return Policy",

    image: "/products/product5.jpg",

    images: [
      "/products/product5.jpg",
      "/products/product5.jpg",
      "/products/product5.jpg",
      "/products/product5.jpg",
    ],

    description:
      "Premium traditional cap designed to complement native attire.",

    specifications: {
      material: "Wool",
      colour: "Black",
      sizes: ["Free Size"],
      weight: "250g",
      condition: "Brand New",
    },
  },

  {
    id: 6,
    name: "Female Gown",
    brand: "Mandilas Fashion",
    category: "Women's Fashion",
    seller: "Mandilas Fashion Hub",
    sellerId: 104,

    price: 22000,
    oldPrice: 30000,
    discount: 27,

    stock: 16,
    rating: 4.9,
    reviews: 287,

    sku: "MM-GOWN-006",
    warranty: "6 Months",
    delivery: "Nationwide",
    returnPolicy: "7 Days Return Policy",

    image: "/products/product6.jpg",

    images: [
      "/products/product6.jpg",
      "/products/product6.jpg",
      "/products/product6.jpg",
      "/products/product6.jpg",
    ],

    description:
      "Elegant female gown crafted with premium fabric for weddings, parties and special events.",

    specifications: {
      material: "Silk",
      colour: "Royal Blue",
      sizes: ["S", "M", "L"],
      weight: "900g",
      condition: "Brand New",
    },
  },
];

export default products;