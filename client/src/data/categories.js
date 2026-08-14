const categories = [
  {
    id: 1,
    name: "Men's Wear",
    slug: "mens-wear",
    image: "/categories/men.jpg",
    subcategories: [
      {
        name: "Shirts",
        slug: "shirts",
      },
      {
        name: "Trousers",
        slug: "trousers",
      },
      {
        name: "Senator",
        slug: "senator",
      },
      {
        name: "Native Wear",
        slug: "native-wear",
      },
      {
        name: "Suits",
        slug: "suits",
      },
      {
        name: "Jackets",
        slug: "jackets",
      },
      {
        name: "Shorts",
        slug: "shorts",
      },
      {
        name: "Underwear",
        slug: "underwear",
      },
    ],
  },

  {
    id: 2,
    name: "Women's Wear",
    slug: "womens-wear",
    image: "/categories/women.jpg",
    subcategories: [
      {
        name: "Dresses",
        slug: "dresses",
      },
      {
        name: "Tops",
        slug: "tops",
      },
      {
        name: "Skirts",
        slug: "skirts",
      },
      {
        name: "Trousers",
        slug: "trousers",
      },
      {
        name: "Jumpsuits",
        slug: "jumpsuits",
      },
      {
        name: "Native Wear",
        slug: "native-wear",
      },
      {
        name: "Hijabs",
        slug: "hijabs",
      },
      {
        name: "Underwear",
        slug: "underwear",
      },
    ],
  },

  {
    id: 3,
    name: "Shoes",
    slug: "shoes",
    image: "/categories/shoes.jpg",
    subcategories: [
      {
        name: "Sneakers",
        slug: "sneakers",
      },
      {
        name: "Formal Shoes",
        slug: "formal-shoes",
      },
      {
        name: "Sandals",
        slug: "sandals",
      },
      {
        name: "Slippers",
        slug: "slippers",
      },
      {
        name: "Boots",
        slug: "boots",
      },
      {
        name: "Heels",
        slug: "heels",
      },
      {
        name: "Flats",
        slug: "flats",
      },
    ],
  },

  {
    id: 4,
    name: "Bags",
    slug: "bags",
    image: "/categories/bags.jpg",
    subcategories: [
      {
        name: "Handbags",
        slug: "handbags",
      },
      {
        name: "Backpacks",
        slug: "backpacks",
      },
      {
        name: "School Bags",
        slug: "school-bags",
      },
      {
        name: "Travel Bags",
        slug: "travel-bags",
      },
      {
        name: "Laptop Bags",
        slug: "laptop-bags",
      },
      {
        name: "Wallets",
        slug: "wallets",
      },
    ],
  },

  {
    id: 5,
    name: "Watches",
    slug: "watches",
    image: "/categories/watch.jpg",
    subcategories: [
      {
        name: "Men's Watches",
        slug: "mens-watches",
      },
      {
        name: "Women's Watches",
        slug: "womens-watches",
      },
      {
        name: "Smart Watches",
        slug: "smart-watches",
      },
      {
        name: "Luxury Watches",
        slug: "luxury-watches",
      },
      {
        name: "Sports Watches",
        slug: "sports-watches",
      },
    ],
  },

  {
    id: 6,
    name: "Native Wears",
    slug: "native-wears",
    image: "/categories/native.jpg",
    subcategories: [
      {
        name: "Agbada",
        slug: "agbada",
      },
      {
        name: "Senator",
        slug: "senator",
      },
      {
        name: "Ankara",
        slug: "ankara",
      },
      {
        name: "Kaftan",
        slug: "kaftan",
      },
      {
        name: "Traditional Dresses",
        slug: "traditional-dresses",
      },
      {
        name: "Native Accessories",
        slug: "native-accessories",
      },
    ],
  },

  {
    id: 7,
    name: "Kids Fashion",
    slug: "kids-fashion",
    image: "/categories/kids.jpg",
    subcategories: [
      {
        name: "Boys Clothing",
        slug: "boys-clothing",
      },
      {
        name: "Girls Clothing",
        slug: "girls-clothing",
      },
      {
        name: "Kids Shoes",
        slug: "kids-shoes",
      },
      {
        name: "Baby Clothing",
        slug: "baby-clothing",
      },
      {
        name: "Baby Accessories",
        slug: "baby-accessories",
      },
      {
        name: "Toys",
        slug: "toys",
      },
    ],
  },

  {
    id: 8,
    name: "Accessories",
    slug: "accessories",
    image: "/categories/accessories.jpg",
    subcategories: [
      {
        name: "Belts",
        slug: "belts",
      },
      {
        name: "Caps",
        slug: "caps",
      },
      {
        name: "Hats",
        slug: "hats",
      },
      {
        name: "Sunglasses",
        slug: "sunglasses",
      },
      {
        name: "Jewelry",
        slug: "jewelry",
      },
      {
        name: "Ties",
        slug: "ties",
      },
    ],
  },

  {
    id: 9,
    name: "Electronics",
    slug: "electronics",
    image: "/categories/electronics.jpg",
    subcategories: [
      {
        name: "TVs",
        slug: "tvs",
      },
      {
        name: "Laptops",
        slug: "laptops",
      },
      {
        name: "Computers",
        slug: "computers",
      },
      {
        name: "Gaming",
        slug: "gaming",
      },
      {
        name: "Cameras",
        slug: "cameras",
      },
      {
        name: "Audio",
        slug: "audio",
      },
      {
        name: "Electronics Accessories",
        slug: "electronics-accessories",
      },
    ],
  },

  {
    id: 10,
    name: "Phones & Tablets",
    slug: "phones-tablets",
    image: "/categories/phones.jpg",
    subcategories: [
      {
        name: "iPhones",
        slug: "iphones",
      },
      {
        name: "Android Phones",
        slug: "android-phones",
      },
      {
        name: "Tablets",
        slug: "tablets",
      },
      {
        name: "iPads",
        slug: "ipads",
      },
      {
        name: "Phone Accessories",
        slug: "phone-accessories",
      },
      {
        name: "Chargers",
        slug: "chargers",
      },
      {
        name: "Power Banks",
        slug: "power-banks",
      },
    ],
  },

  {
    id: 11,
    name: "Beauty & Personal Care",
    slug: "beauty-personal-care",
    image: "/categories/beauty.jpg",
    subcategories: [
      {
        name: "Skincare",
        slug: "skincare",
      },
      {
        name: "Hair Care",
        slug: "hair-care",
      },
      {
        name: "Makeup",
        slug: "makeup",
      },
      {
        name: "Perfumes",
        slug: "perfumes",
      },
      {
        name: "Body Care",
        slug: "body-care",
      },
      {
        name: "Hair Accessories",
        slug: "hair-accessories",
      },
    ],
  },

  {
    id: 12,
    name: "Home & Living",
    slug: "home-living",
    image: "/categories/home.jpg",
    subcategories: [
      {
        name: "Furniture",
        slug: "furniture",
      },
      {
        name: "Kitchen",
        slug: "kitchen",
      },
      {
        name: "Bedding",
        slug: "bedding",
      },
      {
        name: "Home Decor",
        slug: "home-decor",
      },
      {
        name: "Lighting",
        slug: "lighting",
      },
      {
        name: "Storage",
        slug: "storage",
      },
    ],
  },
];

export default categories;