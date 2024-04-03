const db = require("./db")

db.addCollection("courses");
db.addCollection("users");

db.getCollection("users").insert({
    "firstName": "Sergei",
    "surname": "Rogov",
    "gender": "male",
    "email": "nnll@lel",
    "dateOfBirth": "",
    "nationality": "",
    "telephone": "+7910111111",
    "cardNumber": "",
    "country": "Cyprus",
    "region": "",
    "city": "Nicosia",
    "street": "",
    "house": "",
    "flat": "",
    "username": "sergeirogov",
    "password": "$2b$10$oBqtbwUwlz3pZXHCrKeDr.h8ddR20TaCx6rhXN/MG6rvXBocbrSzu",
    "cart": []
});

db.getCollection("courses").insert([
    {
        id: 1,
        title: "Introduction to React",
        description: "Learn the fundamentals of React.",
        lecturer: "Dr. Smith",
        details: "This course covers the basics of React development.",
        price: 100,
    },
    {
        id: 2,
        title: "Advanced JavaScript",
        description: "Master advanced JavaScript concepts.",
        lecturer: "Prof. Johnson",
        details: "This course dives deep into advanced JavaScript topics.",
        price: 250,
    },
    {
        id: 3,
        title: "Machine Learning",
        description: "ML course",
        lecturer: "Dr Parker",
        details: "The main objectives of the course are to:\n• Explain the basic concepts of data clustering and its applications.\n• Present the major algorithms of clustering.\n• Provide the characteristics of the basic types of clustering (hierarchical, partitioning, density)\n• Explain the principles and how association rules work.\n• Define the different types of anomaly detection methods.\n• Demonstrate a number of real-world applications about data clustering, association rulemining, and anomaly detection.\n• Demonstrate a set of tools that a practitioner can use in order to apply the algorithmspresented in the course.",
        price: 150,
    },
    {
        id: 4,
        title: "Machine Learning",
        description: "ML course",
        lecturer: "Dr Parker",
        details: "This course dives deep into advanced Machine Learning topics.",
        price: 100,
    },
    {
        id: 5,
        title: "Machine Learning",
        description: "ML course",
        lecturer: "Dr Parker",
        details: "Supervised Learning course",
        price: 350,
    },
    {
        id: 6,
        title: "Machine Learning",
        description: "ML course",
        lecturer: "Dr Parker",
        details: "Unsupervised Learning course",
        price: 50,
    },
    {
        id: 7,
        title: "Operating Systems",
        description: "Operating Systems course",
        lecturer: "Dr Parker",
        details: "",
        price: 200,
    },
    {
        id: 8,
        title: "Networks and Data Communication",
        description: "Networks and Data Communication course",
        lecturer: "Dr Parker",
        details: "",
        price: 150,
    },
    {
        id: 9,
        title: "Algorithms",
        description: "Algorithms course",
        lecturer: "Dr Parker",
        details: "",
        price: 150,
    },
    {
        id: 10,
        title: "Machine Learning",
        description: "ML course",
        lecturer: "Dr Parker",
        details: "",
        price: 150,
    }
]);

db.close();