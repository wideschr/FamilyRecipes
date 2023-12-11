# FamilyRecipes

Welcome to **FamilyRecipes**, the place where all your cherished family recipes find a home.

## Overview

This platform is designed to help you collect, preserve, and share your family's culinary heritage. While it's still a work in progress and there are a few functionalities in development, the core features aim to facilitate a seamless experience in organizing and showcasing your family's recipes.

### Features Under Development

- **User Authentication:** Currently, anyone can edit or delete comments and recipes. As there's no login system yet, implementing proper user authentication would be a priority going forward.
- **Dummy Data** Currently, most of the data in the website is dummy data. This also makes that the images for the recipes are all the same if no custom recipes have been added.


## Technologies & Resources Used

### Backend Tools & Frameworks
- **Validation:** Leveraging [Express Validator](https://www.npmjs.com/package/express-validator) for data validation.
- **Sessions:** Utilizing [Express Session](https://github.com/expressjs/session) for session management.
- **Database:** Employing MongoDB and Mongoose for database interactions.
- **Data Generation:** Using [JSON Generator](https://json-generator.com/) to generate content.

### Learning Resources
- **Learning Materials:** Found valuable guidance from these YouTube playlists and tutorials:
  - [YouTube Playlist 1](https://www.youtube.com/playlist?list=PL55RiY5tL51oGJorjEgl6NVeDbx_fO5jR)
  - [YouTube Tutorial](https://www.youtube.com/watch?v=ofme2o29ngU)
- **Platforms for Queries:** Relying on Stack Overflow, Chat-GPT, and GitHub Copilot for problem-solving and coding assistance.

### Design & UI
- **Color Palette:** Using colors from [Color Hunt](https://colorhunt.co/palette/3951444e6c50aa8b56f0ebce) to create an engaging visual experience.
- **Layouts:** Employing [Flowbite](https://flowbite.com/) for designing intuitive and responsive layouts.

## Getting Started

To begin working with the project in your IDE, follow these steps:

1. Clone the repository from [GitHub](https://github.com/wideschr/FamilyRecipes).

2. Open your terminal and navigate to the project directory.

3. Run the following command to install the project dependencies:

    ```bash
    npm install
    ```

    This command will install all the required dependencies for the project.

4. Create a `.env` file in the project root directory and define the `MDB_USER` and `MDB_PASSWORD` variables. For example:

    ```
    MDB_USER=your_username
    MDB_PASSWORD=your_password
    ```

5. Once the `.env` file is set up, proceed to migrate the database. Run the following command in the terminal:

    ```bash
    node mongoDb_migrate_seed.js
    ```

    This command will handle the migration and seeding of the database according to the defined models and seeds.

6. After the database migration is complete, you can start the project. Run the following command:

    ```bash
    npm run watch
    ```

    This command will start the project.

Now the project should be set up, the database should be migrated with initial data, and the project should be running successfully.

Please note that while the project might have some incomplete functionalities due to time constraints, efforts have been made to establish a groundwork akin to the Laravel project's logic.