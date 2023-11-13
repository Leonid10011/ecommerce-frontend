# E-Commerce Frontend in React with Material-UI

# Currently working on:
- [ ] Rework UI components for products
- [x] Create Documentation with typedoc
- [x] Rework handling of authentication. Introduce useAuthApi hook and adjust authContext.
- [x] Rework handling of OrderItems, useOrderApi hook. Next step remove old orderItems code and implement the hook in product context. 
- [x] Cleaning and Refactoring ProductContext. Introducing hooks for filtering.
- [x] Cleaning and structuring api call methods 
- [x] Reorganizing products, orderItems and favoriteItems, such they all interact seamless  with each other. Currently interaction is disturbed due to bad data structure.

# Preview
http://217.72.204.244/

Welcome to my E-Commerce Frontend project! This project serves as part of my portfolio for job applications. It complements the E-Commerce backend, which is also available on GitHub.

## Table of Contents
- [Documentation](#documentation)
- [Project Description](#project-description)
- [Features](#features)
- [Project Status](#project-status)
- [Todo](#todo)

## Documentation

I write the documentatin parallel while working on the project. As I didn't started it immediatley when I began the project, there is a lot missing. But I try to fill it up consitently while working on the project.


Link to docs: [Documentiation](https://github.com/Leonid10011/ecommerce-frontend/blob/main/docs.md) 

## Project Description

This project is a frontend application for an E-Commerce website built with React and Material-UI. It provides a user-friendly interface for browsing and purchasing products, managing the shopping cart, and more.

## Features
- Create and manage user account [ manage still to implement ]
- Browse products by category. [ only by name ]
- View product details, including images, descriptions, and prices.
- Add and remove products from the shopping cart. [ remove missing]
- Manage the shopping cart and proceed to checkout. [ still to implement ]
- Responsive and user-friendly design using Material-UI components.

## Project Status

The project is a work in progress, and I'm actively working on improving it. Some of the planned features and improvements include:

- **User Profile**: Implement user profiles with features like order history and account settings.
- **Category Selection**: Allow users to filter products by categories in the navigation bar.
- **Testing**: Write comprehensive tests to ensure the reliability of the application.

## Todo
### This to implement
**list**

- [x] Search bar functionality is very primitve and doesn't work well yet.
- [x] Reconstruct and adjust data structur of products, favItems and orderItems.
- [ ] Sorting products
- [ ] A mock transaction with PayPal and others
- [ ] Starting page, where sales and new products are showcased.
- [x] Filter products.
- [ ] User profile
- [ ] Favorite Products list
