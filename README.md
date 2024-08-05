# Job Scheduler Microservice

## Setup

1. Clone the repository
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2. Install dependencies
    ```bash
    npm install
    ```

3. Set up PostgreSQL database
    - Ensure PostgreSQL is installed and running.
    - Create a new database for your application.
    - Note down the database credentials (database name, user, password, host, and port).

4. Update `src/database.module.ts` with your database credentials

5. Run the application
    ```bash
    npm run start
    ```

## API Endpoints
**Swagger Documentation**: You can view the API documentation using Swagger by navigating to http://localhost:3002/api-docs in your browser.
- **GET /jobs**: List all jobs
  - **Description**: Retrieve a list of all scheduled jobs.
  - **Response**: An array of job objects.
  - **Example Response**:
    ```json
    [
      {
        "id": 1,
        "name": "Job 1",
        "schedule": "0 0 * * *",
        "status": "active"
      },
      {
        "id": 2,
        "name": "Job 2",
        "schedule": "0 0 * * 1",
        "status": "inactive"
      }
    ]
    ```

- **GET /jobs/:id**: Retrieve job details by ID
  - **Description**: Retrieve the details of a specific job using its ID.
  - **Parameters**: 
    - `id` (path parameter): The ID of the job.
  - **Response**: A job object.
  - **Example Response**:
    ```json
    {
      "id": 1,
      "name": "Job 1",
      "schedule": "0 0 * * *",
      "status": "active"
    }
    ```

- **POST /jobs**: Create a new job
  - **Description**: Create a new job with the provided details.
  - **Request Body**: A JSON object containing job details.
  - **Example Request Body**:
    ```json
    {
      "name": "Job 3",
      "schedule": "0 0 * * 2",
      "status": "active"
    }
    ```
  - **Response**: The created job object.
  - **Example Response**:
    ```json
    {
      "id": 3,
      "name": "Job 3",
      "schedule": "0 0 * * 2",
      "status": "active"
    }
    ```

## Publish Message Pattern

You can insert a job by publishing a message with the following pattern:

```json
{
  "name": "Email Notification",
  "lastRun": "2024-08-01T00:00:00.000Z",
  "nextRun": "2024-08-02T00:00:00.000Z",
  "interval": "daily",
  "details": "Send email notifications to users"
}
