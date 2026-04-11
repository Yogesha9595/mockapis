export const articles = [
  {
    slug: "what-is-api",
    title: "What is an API? (Complete Beginner Guide 2026)",
    description:
      "Learn what an API is, how it works, with real-world examples, diagrams, and beginner-friendly explanation.",

    keywords: [
      "what is api",
      "api meaning",
      "how api works",
      "api example",
      "api explained for beginners"
    ],

    category: "basics",
    readingTime: "6 min",

    content: `
Imagine you're using a food delivery app. When you place an order, the app communicates with a server to fetch restaurant data. This communication happens through an API.

API stands for Application Programming Interface. It allows different systems to communicate with each other.

How it works:
Client → API → Server → Database → Response

Example request:
GET /api/users

Example response:
{
  "id": 1,
  "name": "John Doe"
}

APIs are used in:
- Mobile apps
- Web applications
- Payment systems
- Social media integrations
    `,

    faqs: [
      {
        question: "What is an API in simple terms?",
        answer: `
An API is a bridge that allows two systems to communicate with each other. 
For example, when you use a mobile app, it fetches data from a server using APIs. 
This communication happens in the background through requests and responses.
        `
      },
      {
        question: "How does an API work step by step?",
        answer: `
An API works by sending a request from a client to a server. The server processes it and sends back a response. 
For example, clicking a button may trigger a GET request that returns JSON data.
        `
      },
      {
        question: "What are real-world examples of APIs?",
        answer: `
Examples include Google Maps API, payment gateways like Stripe, and login systems like Google OAuth. 
These APIs allow developers to use external services easily.
        `
      },
      {
        question: "Why are APIs important in development?",
        answer: `
APIs allow modular development, faster integration, and reuse of services. 
They help developers avoid building everything from scratch.
        `
      },
      {
        question: "What is REST API?",
        answer: `
REST API is a type of API that uses HTTP methods like GET, POST, PUT, DELETE. 
It is widely used because it is simple and scalable.
        `
      },
      {
        question: "What is API response format?",
        answer: `
Most APIs return data in JSON format. JSON is lightweight and easy to parse in JavaScript.
        `
      }
    ]
  },

  {
    slug: "crud-api",
    title: "CRUD Operations in API (Complete Guide with Examples)",
    description:
      "Learn CRUD operations in APIs with examples, HTTP methods, and real-world use cases.",

    keywords: [
      "crud api",
      "what is crud operations",
      "crud in rest api",
      "api create read update delete",
      "crud example api"
    ],

    category: "development",
    readingTime: "7 min",

    content: `
CRUD stands for Create, Read, Update, Delete.

These are the four basic operations used in APIs.

Mapping with HTTP methods:

POST → Create  
GET → Read  
PUT → Update  
DELETE → Delete  

Example:

POST /api/users  
GET /api/users  
PUT /api/users/1  
DELETE /api/users/1  

CRUD is the foundation of REST APIs.
    `,

    faqs: [
      {
        question: "What is CRUD in API?",
        answer: `
CRUD represents four basic operations: Create, Read, Update, Delete. 
These operations are used to manage data in APIs.
        `
      },
      {
        question: "Which HTTP methods are used in CRUD?",
        answer: `
POST is used to create data, GET to read data, PUT to update data, and DELETE to remove data.
        `
      },
      {
        question: "Why is CRUD important?",
        answer: `
CRUD operations form the backbone of most web applications and APIs. 
They allow managing data efficiently.
        `
      },
      {
        question: "What is CRUD example?",
        answer: `
A user API where you can create users, fetch user data, update user details, and delete users.
        `
      },
      {
        question: "Is CRUD used in REST API?",
        answer: `
Yes, CRUD is the core concept behind REST APIs.
        `
      },
      {
        question: "Can CRUD be used in databases?",
        answer: `
Yes, CRUD operations are also used in databases like SQL and NoSQL.
        `
      }
    ]
  },

  {
    slug: "idempotent-api",
    title: "What is Idempotent API? (With Examples & HTTP Methods)",
    description:
      "Learn idempotent API concepts, HTTP methods, and why idempotency is important in APIs.",

    keywords: [
      "idempotent api",
      "what is idempotency",
      "idempotent http methods",
      "api idempotency example",
      "put vs post idempotent"
    ],

    category: "advanced",
    readingTime: "6 min",

    content: `
Idempotent means performing the same operation multiple times produces the same result.

Example:

PUT /api/user/1

If you call it multiple times, the result remains the same.

Idempotent methods:
- GET
- PUT
- DELETE

Non-idempotent:
- POST

Why it matters:
- Prevents duplicate operations
- Ensures consistency
    `,

    faqs: [
      {
        question: "What is idempotent API?",
        answer: `
An idempotent API ensures that making the same request multiple times does not change the result.
        `
      },
      {
        question: "Which HTTP methods are idempotent?",
        answer: `
GET, PUT, and DELETE are idempotent methods.
        `
      },
      {
        question: "Is POST idempotent?",
        answer: `
No, POST is not idempotent because it creates new resources each time.
        `
      },
      {
        question: "Why is idempotency important?",
        answer: `
It prevents duplicate operations and ensures system stability.
        `
      },
      {
        question: "Where is idempotency used?",
        answer: `
Used in payment systems, APIs, and distributed systems.
        `
      },
      {
        question: "What is idempotency key?",
        answer: `
A unique key used to prevent duplicate requests in APIs.
        `
      }
    ]
  }
]