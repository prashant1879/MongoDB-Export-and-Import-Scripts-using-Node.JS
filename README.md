# MongoDB Export and Import Scripts

This project contains Node.js scripts for exporting, importing, and dropping MongoDB collections. The scripts use Mongoose and native MongoDB methods to handle database operations efficiently.

## Prerequisites

- Node.js installed on your machine
- MongoDB instance running
- npm installed
- Environment variables configured in a `.env` file

## Setup

1. Clone the repository:
    ```bash
    git clone https://github.com/prashant1879/MongoDB-Export-and-Import-Scripts-using-Node.JS.git
    cd MongoDB-Export-and-Import-Scripts-using-Node.JS
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Create a `.env` file in the root directory with the following content:
    ```dotenv
    DB_URL=mongodb://localhost:27017
    EXPORT_DB_NAME=yourExportDatabaseName
    IMPORT_DB_NAME=yourImportDatabaseName
    DB_FOLDER_NAME=backup
    ```

## Usage

### Export Collections

This script exports all collections from the specified database to JSON files in the specified directory.

1. Run the export script:
    ```bash
    node exportCollections.js
    ```

2. JSON files for each collection will be saved in the directory specified by `DB_FOLDER_NAME` in your `.env` file.

### Import Collections

This script imports collections from JSON files in the specified directory to the specified database.

1. Run the import script:
    ```bash
    node importCollections.js
    ```

2. Collections will be imported to the database specified by `IMPORT_DB_NAME` in your `.env` file.

### Drop Database

This script drops the specified database.

1. Run the drop database script:
    ```bash
    node dropDatabase.js
    ```

2. The database specified by `DB_NAME` in your `.env` file will be dropped.

## Environment Variables

- `DB_URL`: MongoDB connection URL (e.g., `mongodb://localhost:27017`)
- `EXPORT_DB_NAME`: Name of the database to export
- `IMPORT_DB_NAME`: Name of the database to import
- `DB_FOLDER_NAME`: Directory name where JSON files are stored
- `DB_NAME`: Name of the database to drop

## License

This project is licensed under the MIT License.
