# Zudoc API Documentation

This document describes all the backend API endpoints exposed by the Go search-service (`zudoc-search-api`) that are called by the React frontend (`prescription-ui`).

---

## ⚙️ Frontend Proxy Setup

To bypass CORS issues during development, the Vite dev server in the frontend (`prescription-ui`) proxies all `/api` routes to the backend service running at `http://localhost:3001` (configurable in [vite.config.ts](file:///c:/Users/Saravanan/Desktop/Zudoc/Dual%20Project/test-search-backend/services/prescription-ui/vite.config.ts)):

*   `/api/drugs` is rewritten to `/search` on the backend.
*   `/api/drafts` is proxied directly.
*   All other `/api/*` endpoints are proxied directly to the backend proxy service which routes them to the Java Snowstorm terminology server.

---

## 🌐 Exposing Ports via LocalXpose (`loclx`)

If you need to expose your local environment ports to the public internet (for external API testing, mobile devices, or remote access), you can use the **LocalXpose (`loclx`)** CLI tunnel.

### Prerequisites
1. Download the [LocalXpose CLI](https://localxpose.io).
2. Authenticate the CLI with your LocalXpose account:
   ```bash
   loclx account login
   ```

### Exposing the Frontend UI (Vite)
Expose the React frontend running on port `5173`:
```bash
loclx tunnel http --to localhost:5173
```
This yields a public tunnel URL (e.g., `https://xxxx.loclx.io`) to view the client interface.

### Exposing the Backend Search API (Go)
Expose the Go search backend running on port `3001`:
```bash
loclx tunnel http --to localhost:3001
```
This generates a public endpoint for the backend APIs.

> [!NOTE]
> If you expose the backend using `loclx`, make sure to update the API base URL in your frontend configuration/environment variables to point to the newly generated public `loclx.io` URL instead of `localhost:3001`.

---

## 📌 API Endpoints

### 1. Drug Search API
*   **Frontend Call:** `GET /api/drugs?q=<query>`
*   **Backend Endpoint:** `GET /search?q=<query>`
*   **Description:** Performs prefix-matching and fuzzy search against the OpenSearch drugs database.
*   **Query Parameters:**
    *   `q` (string, required): The search query term.
*   **Optimizations:**
    *   **Minimum Length Constraint:** If the query `q` is less than **3 characters**, the backend instantly returns an empty list (`[]`) without querying the database.
    *   **Caching & Coalescing:** The backend uses singleflight to coalesce concurrent identical queries and caches query results with a **1-hour TTL** since the medicine index is static.

#### Sample Request
```http
GET /api/drugs?q=paracetamol HTTP/1.1
Host: localhost:3000
```

#### Sample Response (`200 OK`)
```json
[
  {
    "id": "PROD100249",
    "name": "Paracetamol 500mg Oral Tablet",
    "marketer": "GSK Healthcare",
    "composition": "Paracetamol 500mg"
  },
  {
    "id": "PROD100523",
    "name": "Paracetamol 650mg Syrup",
    "marketer": "Cipla Ltd",
    "composition": "Paracetamol 650mg/5ml"
  }
]
```

---

### 2. Save Patient Draft
*   **Frontend Call:** `POST /api/drafts`
*   **Backend Endpoint:** `POST /api/drafts`
*   **Description:** Upserts (creates or updates) a prescription draft for a specific patient in the PostgreSQL database.
*   **Payload (`application/json`):**
    *   `patientId` (string, required): Unique identifier for the patient.
    *   `data` (object, required): A complete JSON payload representing the prescription structure.

#### Sample Request Payload
```json
{
  "patientId": "PT-7729102",
  "data": {
    "rxId": "TEMP-a8f3b2e",
    "timestamp": "2026-06-12T19:00:53Z",
    "symptoms": "Dry cough, mild fever for 2 days",
    "diagnoses": [
      {
        "id": "diag-1",
        "name": "Acute Bronchitis",
        "snomedId": "<< 10509002"
      }
    ],
    "medications": [
      {
        "id": "med-1",
        "drugName": "Dextromethorphan Syrup",
        "dose": "10ml",
        "frequency": "Three times a day (TID)",
        "duration": "5 Days",
        "route": "Oral",
        "instructions": "Post meals"
      }
    ]
  }
}
```

#### Sample Response (`200 OK`)
```json
{
  "success": true,
  "draft": {
    "id": "4e183204-c5b7-4c4f-9e6b-a8cf0cf5b2e9",
    "patientId": "PT-7729102",
    "data": {
      "rxId": "TEMP-a8f3b2e",
      "timestamp": "2026-06-12T19:00:53Z",
      "symptoms": "Dry cough, mild fever for 2 days",
      "diagnoses": [{"id": "diag-1", "name": "Acute Bronchitis", "snomedId": "<< 10509002"}],
      "medications": [{"id": "med-1", "drugName": "Dextromethorphan Syrup", "dose": "10ml", "frequency": "Three times a day (TID)", "duration": "5 Days", "route": "Oral", "instructions": "Post meals"}]
    },
    "createdAt": "2026-06-12T19:01:05.412Z",
    "updatedAt": "2026-06-12T19:01:05.412Z"
  }
}
```

---

### 3. Retrieve Patient Draft
*   **Frontend Call:** `GET /api/drafts/:patientId` (e.g. `http://localhost:3001/api/drafts/PT-7729102`)
*   **Backend Endpoint:** `GET /api/drafts/:patientId`
*   **Description:** Retrieves the active draft prescription associated with a given patient.
*   **Path Parameters:**
    *   `patientId` (string, required): The patient's unique ID.
*   **Behavior:** Returns the `Draft` object, or `null` if no draft is found.

#### Sample Response (`200 OK` - Draft Exists)
```json
{
  "id": "4e183204-c5b7-4c4f-9e6b-a8cf0cf5b2e9",
  "patientId": "PT-7729102",
  "data": {
    "rxId": "TEMP-a8f3b2e",
    "symptoms": "Dry cough, mild fever for 2 days"
  },
  "createdAt": "2026-06-12T19:01:05.412Z",
  "updatedAt": "2026-06-12T19:01:05.412Z"
}
```

#### Sample Response (`200 OK` - No Draft Exists)
```json
null
```

---

### 4. Snomed CT / Snowstorm Proxy API
*   **Frontend Call:** `GET /api/<snowstorm-endpoint-path>` (e.g., `GET /api/MAIN/concepts?term=cough&ecl=<<404684003`)
*   **Backend Endpoint:** `GET /api/*`
*   **Description:** Proxies terminology request headers, query parameters, and body payloads to the Java Snowstorm terminology server (configured via `SNOWSTORM_URL`, defaulting to `http://localhost:8080`).
*   **Path Parameters:**
    *   `*` (string, required): The target endpoint path in Snowstorm.
*   **Optimizations:**
    *   **Cacheable GET Queries:** Queries targeting `concepts` and `fhir` endpoints are cached on the backend with a **1-hour TTL** using singleflight request coalescing.
    *   **Minimum Term Length:** If the request is cacheable and a `term` query parameter is present with **less than 3 characters**, the backend instantly returns a matched empty search response to avoid slow or bad queries on Snowstorm.

#### Request Example (Concept Search)
```http
GET /api/MAIN/concepts?active=true&limit=15&ecl=%3C%3C+404684003&term=cough HTTP/1.1
Host: localhost:3000
```

#### Response Example (`200 OK`)
```json
{
  "items": [
    {
      "conceptId": "49727002",
      "active": true,
      "definitionStatus": "PRIMITIVE",
      "moduleId": "900000000000207008",
      "fsn": {
        "term": "Cough (finding)",
        "lang": "en"
      },
      "pt": {
        "term": "Cough",
        "lang": "en"
      },
      "idAndFsnTerm": "49727002 | Cough (finding) |"
    }
  ],
  "total": 1,
  "limit": 15
}
```

---

## 📦 Data Schema (Prescription Data Structure)

The draft `data` object structure is defined by the following React interfaces:

```typescript
export interface Prescription {
  rxId?: string;
  timestamp?: string;
  patient: Patient;
  doctor: Doctor;
  symptoms: string;
  diagnoses: Diagnosis[];
  disorders: Diagnosis[];
  medications: Medication[];
  labTests: LabTest[];
  radiologyOrders: RadiologyOrder[];
  surgeryOrders: SurgeryOrder[];
  ayushTreatments: Diagnosis[];
  dentalTreatments: Diagnosis[];
  nursingCare: Diagnosis[];
  vetDetails: Diagnosis[];
  patientAllergies: Diagnosis[];
  patientVaccinations: Diagnosis[];
  patientConditions: Diagnosis[];
  organDonorship: string;
  investigations: string;
  notes: string;
  followUp: string;
}
```
