# API Documentation

## Express REST API

Base URL: `http://localhost:5000`

### Endpoints

#### GET /
Returns API information and available endpoints.

**Response:**
```json
{
  "message": "Orbital AI Explorer - Express API",
  "version": "1.0.0",
  "endpoints": {
    "launches": "/launches",
    "rockets": "/rockets",
    "missions": "/missions",
    "stats": "/stats",
    "sync": "/sync"
  }
}
```

#### GET /launches
Get all launches (limited to 100 most recent).

**Response:**
```json
[
  {
    "id": "5eb87cd9ffd86e000604b32a",
    "name": "FalconSat",
    "date": "2006-03-24T22:30:00.000Z",
    "rocket": "5e9d0d95eda69955f709d1eb",
    "success": false,
    "details": "Engine failure at 33 seconds...",
    "launchpad": "5e9e4502f5090995de566f86",
    "crew": []
  }
]
```

#### GET /launches/:id
Get a specific launch by ID.

**Parameters:**
- `id` (path): Launch ID

**Response:**
```json
{
  "id": "5eb87cd9ffd86e000604b32a",
  "name": "FalconSat",
  "date": "2006-03-24T22:30:00.000Z",
  "rocket": "5e9d0d95eda69955f709d1eb",
  "success": false,
  "details": "Engine failure at 33 seconds...",
  "launchpad": "5e9e4502f5090995de566f86",
  "crew": []
}
```

#### GET /launches/recent/:count
Get recent launches.

**Parameters:**
- `count` (path): Number of launches to return (default: 10)

#### GET /rockets
Get all rockets.

**Response:**
```json
[
  {
    "id": "5e9d0d95eda69955f709d1eb",
    "name": "Falcon 9",
    "type": "Orbital",
    "active": true,
    "stages": 2,
    "boosters": 0,
    "cost_per_launch": 62000000,
    "success_rate_pct": 98.5,
    "first_flight": "2010-06-04",
    "country": "USA",
    "company": "SpaceX",
    "height": 70,
    "diameter": 3.7,
    "mass": 549054,
    "description": "Falcon 9 is a reusable..."
  }
]
```

#### GET /rockets/:id
Get a specific rocket by ID.

#### GET /rockets/filter/active
Get only active rockets.

#### GET /missions
Get all missions.

**Response:**
```json
[
  {
    "id": "artemis-1",
    "name": "Artemis I",
    "description": "First integrated test...",
    "start_date": "2022-11-16T06:47:00.000Z",
    "end_date": null,
    "spacecraft": "Orion",
    "objectives": ["Test deep space navigation", "Evaluate spacecraft systems"]
  }
]
```

#### GET /missions/:id
Get a specific mission by ID.

#### GET /stats
Get dashboard statistics.

**Response:**
```json
{
  "totalLaunches": 200,
  "successfulLaunches": 185,
  "activeRockets": 5,
  "upcomingMissions": 12,
  "successRate": 92.5
}
```

#### POST /sync
Synchronize data from external APIs (SpaceX, NASA).

**Response:**
```json
{
  "success": true,
  "message": "Data synchronized successfully",
  "stats": {
    "launches": 200,
    "rockets": 15
  }
}
```

## FastAPI AI Service

Base URL: `http://localhost:8000`

Interactive docs: `http://localhost:8000/docs`

### Endpoints

#### GET /
Returns API information.

**Response:**
```json
{
  "message": "Orbital AI Explorer - FastAPI AI Service",
  "version": "1.0.0",
  "endpoints": {
    "search": "/search",
    "insights": "/insights/{data_type}/{id}",
    "similar": "/similar/{data_type}/{id}"
  }
}
```

#### POST /search
Natural language search across all data.

**Request Body:**
```json
{
  "query": "successful Falcon 9 launches in 2023",
  "filters": {
    "dateFrom": "2023-01-01",
    "dateTo": "2023-12-31",
    "rocketType": "Falcon 9",
    "successOnly": true
  }
}
```

**Response:**
```json
{
  "launches": [...],
  "rockets": [...],
  "missions": [...],
  "totalResults": 45
}
```

#### GET /insights/{data_type}/{id}
Get AI-generated insights for a specific item.

**Parameters:**
- `data_type` (path): Type of data - `launch`, `rocket`, or `mission`
- `id` (path): Item ID

**Response:**
```json
{
  "summary": "Launch Falcon 9 analysis",
  "key_facts": [
    "Launch date: 2023-01-15",
    "Rocket: Falcon 9",
    "Status: Successful"
  ],
  "insights": "This launch represents a significant milestone..."
}
```

#### GET /similar/{data_type}/{id}
Find similar items using vector similarity.

**Parameters:**
- `data_type` (path): Type of data - `launch`, `rocket`, or `mission`
- `id` (path): Item ID

**Response:**
```json
{
  "similar_launches": [
    {
      "id": "...",
      "name": "...",
      "similarity_score": 0.95
    }
  ]
}
```

## Error Responses

All endpoints may return error responses in the following format:

**400 Bad Request**
```json
{
  "error": "Invalid request parameters"
}
```

**404 Not Found**
```json
{
  "error": "Resource not found"
}
```

**500 Internal Server Error**
```json
{
  "error": "Internal server error message"
}
```

## Rate Limiting

Currently, no rate limiting is implemented. In production, consider implementing rate limiting for the AI endpoints to manage costs.

## Authentication

Currently, no authentication is required. For production deployment, implement API key or OAuth authentication.
