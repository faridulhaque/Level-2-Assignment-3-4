## To run this app locally, follow these steps

### step 1: Add a Mongodb URL

- Make sure that you have added a mongodb url properly.

### step 2: Command these in your terminal one by one

- yarn
- tsc
- nodemon ./dist/server.js

## API Documentation

### User Registration

- Route: api/auth/register
- POST
- Body
  <br/>
  {
  <br/>
  username: string, <br/>
  email: string,<br/>
  password: number,<br/>
  role: "user" | "admin"<br/>
  }

### User Login

- Route: api/auth/login
- POST
- Body
  <br/>
  {
  <br/>
  username: string,
  <br/>
  password: number,
  <br/>
  }
  <br/>

### Change Password

- Route: api/auth/login
- POST
- Body
  <br/>
  {
  <br/>
  currentPassword: string,
  <br/>
  newPassword: string",
  <br/>
  }
  <br/>
- headers
  <br/>
  {
  <br/>
  authorization: token;
  <br/>
  }
  <br/>
- Note: User will have a token after logging In.

### Create a Course

- Route: api/course
- POST
- Body
  <br/>
  {
  <br/>
  title: string,
  <br/>
  instructor: string,
  <br/>
  categoryId: string,
  <br/>
  price: number,
  <br/>
  tags: [
  <br/>
  { name: string, isDeleted: boolean },
  <br/>
  { name: string, isDeleted: boolean }
  <br/>
  ],
  <br/>
  startDate: string,
  <br/>
  endDate: string,
  <br/>
  language: string,
  <br/>
  provider: string,
  <br/>
  details: {
  <br/>
  level: string,
  <br/>
  description: string
  <br/>
  }
  <br/>
  }
  <br/>

- headers
  <br/>
  {
  <br/>
  authorization: token;
  <br/>
  }
  <br/>
- Note: User will have a token after logging In.

### Get courses by filtering

- Route: api/courses?sortBy={price}&sortedOrder=${sortedOrder}...
- GET
- Note: The courses can be filtered by multiple queries which are:

page: (Optional) Specifies the page number for paginated results. Default is 1. Example: ?page=2

limit: (Optional) Sets the number of items per page. Default is a predefined limit. Example: ?limit=10

sortBy: (Optional) Specifies the field by which the results should be sorted. Only applicable to the following fields: title, price, startDate, endDate, language, durationInWeeks. Example: ?sortBy=startDate

sortOrder: (Optional) Determines the sorting order, either 'asc' (ascending) or 'desc' (descending). Example: ?sortOrder=desc

minPrice, maxPrice: (Optional) Filters results by a price range. Example: ?minPrice=20.00&maxPrice=50.00

tags: (Optional) Filters results by the name of a specific tag. Example: ?tags=Programming

startDate, endDate: (Optional) Filters results by a date range. Example: ?startDate=2023-01-01&endDate=2023-12-31

language: (Optional) Filters results by the language of the course. Example: ?language=English

provider: (Optional) Filters results by the course provider. Example: ?provider=Tech Academy

durationInWeeks: (Optional) Filters results by the duration of the course in weeks. Example: ?durationInWeeks=8

level: (Optional) Filters results by the difficulty level of the course. Example: ?level=Intermediate

### Create Category by admin

- Route: api/categories
- POST
- Body:
  <br/>
  {
  <br/>
  name: string
  <br/>
  }
  <br/>
- Headers
  <br/>
  {
  <br/>
  authorization: token;
  <br/>
  }
  <br/>
- Note: User will have a token after logging In.

### Get All categories

- Route: api/categories
- GET

### Create a Review by user

- Route: api/review
- POST
- Body
  <br/>
  {
  <br/>
  courseId: string,
  <br/>
  rating: number,
  <br/>
  review: string,
  <br/>
  }
  <br/>
- headers
  <br/>
  {
  <br/>
  authorization: token;
  <br/>
  }
  <br/>
- Note: User will have a token after logging In.

### Update a Course by admin

- Route: /api/courses/:courseId
- PUT
- Body
  <br/>
  {
  <br/>
  level: string,
  <br/>
  price: number,
  <br/>
  }
  <br/>
- headers
  <br/>
  {
  <br/>
  authorization: token;
  <br/>
  }
  <br/>
- Note: Add any filed inside the body. Just ensure that the values are existed in the "Create course" values.

### Get Specific course and the reviews

- Route: api/courses/:courseId/reviews
- GET

### Get Best Course based on the rating

- Route: api/course/best
- GET
