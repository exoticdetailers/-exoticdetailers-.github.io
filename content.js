// This file allows you to update website content without touching HTML.
// Just change the text inside the quotes or numbers.

window.siteContent = {
    pricing: {
        title: "Transparent Pricing",
        subtitle: "Choose the package that fits your needs.",
        packages: [
            {
                name: "Exterior Detail",
                price: "$75 - $150",
                features: [
                    "Foam Cannon Wash",
                    "Wheel Deep Clean",
                    "Bug & Tar Removal",
                    "Tire Dressing"
                ]
            },
            {
                name: "Interior Reset",
                price: "$100 - $150",
                features: [
                    "Deep Vacuum",
                    "Leather Conditioning",
                    "Window Cleaning",
                    "Door Jambs"
                ]
            },
            {
                name: "Full Deep Clean",
                price: "$150 - $200",
                popular: true,
                features: [
                    "Everything in Exterior",
                    "Everything in Interior",
                    "Engine Bay Wipe"
                ]
            }
        ],
        addons: [
            {
                name: "Car Seat Cleaning",
                desc: "Deep cleaning for spills and stains.",
                price: "$25",
                unit: "/ seat",
                icon: "fa-baby-carriage"
            },
            {
                name: "Pet Hair Removal",
                desc: "Thorough removal of embedded pet hair.",
                price: "$15",
                unit: "flat fee",
                icon: "fa-dog"
            }
        ]
    },
    reviews: [
        {
            stars: 5,
            text: "Fast and convenient! My car looked and smelled brand new!",
            author: "Laura P.",
            service: "Full Detail"
        },
        {
            stars: 5,
            text: "These guys were quick, professional, and did a great job on my VW!",
            author: "Anonymous",
            service: "Full Detail"
        },
        {
            stars: 5,
            text: "They did an amazing job on my Jeep! Next time I will remember to put the doors on to get an exterior detail as well!",
            author: "Lucas N.",
            service: "Interior Reset"
        }
    ],
    team: [
        {
            name: "Owen Mathews",
            image: "images/owen.jpg.JPG",
            bio: "Owen is a co-owner known for his attention to detail and commitment to doing every job the right way. He’s also the brain behind day-to-day operations—organizing schedules, refining the process, and communicating clearly with customers to ensure every service runs smoothly from start to finish.",
            tags: ["Operations", "Customer Communication", "Commitment to Detail"]
        },
        {
            name: "Aidan Erkes",
            image: "images/aidan.jpg.JPG",
            bio: "Aidan is a co-owner who leads product selection and inventory management, ensuring the team uses the right materials for every service and stays fully stocked for mobile appointments.",
            tags: ["Inventory", "Customer Communication", "Product Selection"]
        }
    ]
};


