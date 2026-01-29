const baseUrl = import.meta.env.BASE_URL;

export const products = [
    {
        id: 1,
        title: "Just Bunch of Designs",
        price: { USD: 25, EUR: 22, DZD: 3500 },
        image: `${baseUrl}assets/images/shop/Poster3.webp`,
        category: "Print",
        badge: "New"
    },
    {
        id: 2,
        title: "What Kind of World",
        price: { USD: 30, EUR: 28, DZD: 4200 },
        image: `${baseUrl}assets/images/shop/Poster2.webp`,
        category: "Editorial",
        badge: "Limited"
    },
    {
        id: 3,
        title: "Bauhaus Exhibition 1919",
        price: { USD: 28, EUR: 26, DZD: 3900 },
        image: `${baseUrl}assets/images/shop/Poster1.webp`,
        category: "Art"
    }
];
