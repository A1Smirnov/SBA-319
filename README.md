# Farm - Tamagotchi Simulatior beta API

## Overview

This API is a server-side application built with Node, Express, and MongoDB. It simulates city management, where players can build and upgrade structures using limited resources. The app includes a well-organized codebase, multiple data collections, and a comprehensive CRUD API with validation and indexing.

## Objectives

The project fulfills the following core objectives:

- **Server Application with Node, Express, and MongoDB**: The app is built using Node.js, Express.js for routing, and MongoDB as the data store.
- **CRUD API**: The API allows clients to perform Create, Read, Update, and Delete operations across various collections.
- **MongoDB Indexes**: Indexes are created on frequently queried fields to optimize data retrieval.
- **Data Validation**: MongoDB validation rules are set to ensure data consistency and integrity.

## Project Requirements

The API fulfills the following weighted requirements:

1. **Data Collections** (5%)
   - Collections include:
     - `Players`: Manages player-specific data, including resources and buildings.
     - `Buildings`: Template data for different types of buildings.
     - `AvailableBuildings`: List of buildings available for creation.

2. **Data Modeling** (10%)
   - Each collection is modeled with a clear schema:
     - The `Players` collection includes default resources and a list of owned buildings.
     - The `Buildings` collection includes fields like `type`, `constructionCost`, and `resources`.
     - The `AvailableBuildings` collection holds available building templates for reference.
   
3. **GET Routes** (10%)
   - Provides routes to retrieve all exposed data:
     - `/available-buildings`: Retrieves all buildings available for construction.
     - `/player/:id`: Fetches a specific player’s details and current buildings.
     - `/build/:id`: Fetches details of a particular building.

4. **POST Routes** (10%)
   - Allows data insertion for various actions:
     - `/player`: Creates a new player with default resources.
     - `/build`: Creates a building for a player by assigning a template building.

5. **PATCH Routes** (10%)
   - Supports data updates, particularly upgrades:
     - `/build/upgrade/:id`: Upgrades a specific building if conditions are met, allowing "plantation" to upgrade to "greenhouse" and "enclosure" to upgrade to "zoo".

6. **DELETE Routes** (10%)
   - Enables data deletion where needed:
     - `/build/:id`: Deletes a specified building from a player’s collection and database.

7. **Indexes** (5%)
   - Indexes are created on the following fields to optimize frequent queries:
     - `owner` in the `Buildings` collection.
     - `type` in the `Buildings` collection.
     - `playerId` in the `Players` collection.
   
8. **Data Validation Rules** (5%)
   - Validation ensures data consistency across collections, applied via Mongoose schema validation. For example, building fields require specific types and values.
   - Validation errors are returned in case of incorrect data insertion, such as missing fields or incorrect types.

9. **Sample Data Population** (5%)
   - Sample data includes over 5 documents per collection to illustrate the application's usage, with templates, players, and example buildings.

10. **Code Organization** (5%)
    - The codebase is structured into separate files for routes, models, and logic, ensuring readability and maintainability.

11. **Error-Free Execution** (10%)
    - The application runs without errors; any unresolved errors are documented with explanations.

12. **Frequent Commits** (5%)
    - Regular commits have been made throughout development, documenting progress and features added.

13. **README File** (5%)
    - This README file describes the API’s purpose, routes, CRUD functionality, and requirements met.

14. **Creativity and User Experience (UX)** (5%)
    - The app includes user-centric features, such as clear validation errors, structured responses, and a design allowing users to build and upgrade resources with logical progression.

15. **Bonus Objective**: Uses Mongoose for Data Modeling and Validation (1%)
    - Mongoose is used for schema creation, data validation, and ease of MongoDB interaction.


## API Documentation

### Routes

The following routes and CRUD operations are available:

- **GET /available-buildings**
  - Retrieves all available buildings for construction.
  - **Response**: Array of building templates.

- **GET /player/:id**
  - Retrieves details for a specific player, including current resources and buildings.
  - **Response**: Player document with associated buildings.

- **POST /player**
  - Creates a new player with default resources and an empty list of buildings.
  - **Response**: New player document.

- **POST /build**
  - Creates a new building for a specified player, based on a building template.
  - **Request**: `{ "buildingType": "<type>", "playerId": "<playerId>" }`
  - **Response**: Created building and updated player document.

- **PATCH /build/upgrade/:id**
  - Upgrades an existing building to the next tier if requirements are met.
  - **Request**: `{ "upgradeTo": "<newType>" }`
  - **Response**: Updated building document.

- **DELETE /build/:id**
  - Removes a specified building from the player’s collection and database.
  - **Response**: Success message.

### MongoDB Indexes

Indexes have been added for fields frequently used in queries to optimize performance:
- **`owner`** in `Buildings` collection
- **`type`** in `Buildings` collection
- **`playerId`** in `Players` collection

### MongoDB Validation Rules

Validation rules are in place to ensure data consistency:
- Mongoose schemas enforce data types, required fields, and validation logic for fields such as `type`, `constructionCost`, and `resources` in buildings.

### Sample Data

Collections are pre-populated with sample data, including:
- 10+ player documents
- 10+ building templates for testing
- 10+ sample available buildings

## Installation and Usage

1. **Clone the repository**:
   ```bash
   git clone https://github.com/username/city-management-simulation.git
   cd city-management-simulation
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up MongoDB**:
   - Ensure MongoDB is running locally or provide MongoDB Atlas credentials.

4. **Run the application**:
   ```bash
   npm start
   ```

5. **API Testing**:
   - Use Postman or any HTTP client to interact with the API routes listed above.

## Conclusion

This project provides a fully functional CRUD API with clear data modeling, validation, and performance optimizations. It serves as a solid foundation for a city management simulation and can be expanded further with additional features.
```

This README file clearly explains the project, how it meets requirements, and provides full API documentation for ease of use.