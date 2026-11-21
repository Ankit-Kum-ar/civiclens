# Table of Contents

- ### <a href="#topic-1">1. System Design Fundamentals</a>
  - Monolithic Architecture vs Microservices Architecture
  - Latency vs Response Time
  - Throughput in System Design (RPS, QPS, TPS, Bottlenecks)
  - Scaling in System Design (Vertical vs Horizontal Scaling, Scale Out)
  - Load Balancer, Caching (Redis / Memcached), and Backend Architecture

- ### <a href="#topic-2">2. Database Engineering: SQL vs NoSQL, Indexing, Partitioning and Sharding</a>
  - SQL vs NoSQL: Core Differences, Advantages, and Decision Criteria
  - Database Indexing (B-Tree, Hash, Clustered, Composite)
  - Database Partitioning (Horizontal, Vertical, Range, Hash, List)
  - Database Sharding (Shard Keys, Architectural Topologies, Limitations)
  - Comparison: Indexing vs Partitioning vs Sharding
  - Real-World Case Study: Designing an E-Commerce Database
  - SDE-3 Quick Revision & Core Interview Questions

- ### <a href="#topic-3">3. Concurrency & Booking Systems: Bus Seat Reservation (RedBus Example)</a>
  - High-Level Architecture for High-Concurrency Ticket Booking
  - Distributed Locking with Redis (Atomic SETNX and TTL)
  - Preventing Race Conditions & Double Booking
  - Payment Flow, Expiry Timers, and Automatic Seat Release Lifecycle

- ### <a href="#topic-4">4. URL Shortener Platform (Bitly System Design)</a>
  - Functional & Non-Functional Requirements
  - System Overview & Component Design
  - Unique Alias Generation: Base62 Encoding vs MD5/SHA-256 Hashing
  - High-Speed Read Flow (URL Redirection) & Hot Cache with Redis
  - Asynchronous Analytics Ingestion using Apache Kafka
  - Batch Analytics Updates vs Direct Database Writes
  - Database Architecture, CDN Caching, and Horizontal DB Scaling

- ### <a href="#topic-5">5. Massive Real-Time Commenting System (YouTube Live / Twitch)</a>
  - Functional & Non-Functional Requirements (Sub-200ms Latency)
  - Database Layer: Apache Cassandra Architecture
  - Write Path: MemTables, CommitLogs, SSTables, and Compaction
  - LSM-Trees (Log-Structured Merge-Trees) & Row / Primary Key Structure
  - Kafka Comment Ingestion & Fan-Out Pipeline
  - Real-Time Communication Protocols: HTTP Polling vs SSE vs WebSockets
  - Distributed WebSocket Gateway Servers & Pub/Sub
  - Global Geo-Distribution: GeoDNS, Anycast, and Akamai CDN
  - End-to-End Write Path (Posting) vs Read Path (Broadcasting)
  - Scaling to Millions of Concurrent Viewers & Architectural Trade-offs

- ### <a href="#topic-6">6. Real-Time Video Conferencing Platform (Zoom / Google Meet)</a>
  - Problem Statement & Functional / Non-Functional Requirements
  - High-Level Architecture: Control Plane vs Media Plane
  - Client Layer & Client-Side Caching
  - API Gateway, Rate Limiting, and JWT Request Authentication
  - SSL/TLS Termination & Disabling Internal SSL for Load Balancing Optimization
  - L4 (Transport / UDP) vs L7 (Application / WebSocket) Load Balancing
  - Core Microservices: Auth, Meeting, Notification, Chat, and Recording
  - Media Management & WebRTC Signaling:
    - SDP (Session Description Protocol) Offer/Answer Exchange
    - VP8 Video Codec Deep Dive (Low-Latency, Packet Loss Resilience, Temporal Scalability)
    - NAT Traversal: ICE, STUN, and TURN Relay Servers
  - Media Servers Architecture: SFU (Selective Forwarding Unit) vs MCU (Multipoint Control Unit)
  - Multi-Tier Storage: PostgreSQL / MongoDB, Cassandra (Chat), and AWS S3 (Recordings)
  - End-to-End Flows: Joining a Meeting & Live In-Meeting Chat / Recording
  - Scalability Considerations & Comprehensive Interview Questions

---

<div id="topic-1"></div>

# System Design – Monolith vs Microservices

## 1. Monolithic Architecture

A **Monolithic Architecture** is a software architecture in which all the major components of an application are developed, maintained, and deployed as a single unit.

For example, in an e-commerce application, user authentication, product management, orders, payments, and notifications are part of one application.

### Structure

| Module | Responsibility |
|---|---|
| User Module | Registration, login, user profiles |
| Product Module | Product listing, search, inventory |
| Order Module | Order creation and tracking |
| Payment Module | Payment processing |
| Notification Module | Emails and SMS |

All these modules run inside the same application and are generally deployed together.

### Architecture Diagram

    Client
       |
    Monolithic App
       |
    +------------------------+
    | User Module            |
    | Product Module         |
    | Order Module           |
    | Payment Module         |
    | Notification Module    |
    +------------------------+
       |
    Database

### Advantages

- Simple to develop and deploy initially.
- Modules communicate through direct function calls.
- Easier database transactions.
- Easier debugging in smaller applications.
- Requires less infrastructure.

### Disadvantages

- Scaling one module requires scaling the entire application.
- A failure can affect the whole application.
- Large codebases become difficult to maintain.
- A small change may require redeploying the entire application.
- Modules can become tightly coupled.

---

## 2. Microservices Architecture

A **Microservices Architecture** divides an application into multiple small, independent services.

Each service handles a specific business responsibility and can be developed, deployed, and scaled independently.

For example, an e-commerce application can have separate services for users, products, orders, payments, and notifications.

### Structure

| Service | Responsibility | Database |
|---|---|---|
| User Service | Authentication and profiles | User DB |
| Product Service | Products and inventory | Product DB |
| Order Service | Order creation and tracking | Order DB |
| Payment Service | Payments and refunds | Payment DB |
| Notification Service | Emails and SMS | Notification DB (if needed) |

Each service owns its business logic and data. Services communicate using APIs or message brokers.

### Architecture Diagram

    Client
       |
    API Gateway
       |
    +----------------+----------------+
    |                |                |
    User Service  Product Service  Order Service
       |                |                |
     User DB         Product DB       Order DB
                                        |
                                  Payment Service
                                        |
                                    Payment DB

                                  Notification Service
                                        |
                                   Message Broker

### Advantages

- Independent deployment of services.
- Independent scaling of services.
- Better separation of business responsibilities.
- Failures can be isolated.
- Different technologies can be used for different services.
- Multiple teams can work independently.

### Disadvantages

- More complex infrastructure and deployment.
- Network communication introduces latency.
- Network failures must be handled.
- Distributed transactions are difficult.
- Monitoring and debugging become more complex.
- Requires strong DevOps and automation.

---

## 3. Monolith vs Microservices

| Feature | Monolithic | Microservices |
|---|---|---|
| Architecture | Single application | Multiple independent services |
| Deployment | Entire application deployed together | Services deployed independently |
| Scaling | Entire application is scaled | Individual services can be scaled |
| Communication | Direct function calls | APIs or message brokers |
| Database | Commonly shared database | Database ownership per service |
| Failure | Can affect the entire application | Can be isolated between services |
| Technology | Usually one technology stack | Different technology stacks possible |
| Testing | Simpler initially | Requires integration and contract testing |
| Transactions | Easier within one database | Distributed transactions are complex |
| Maintenance | Can become difficult as application grows | Services have separate responsibilities |
| Infrastructure | Relatively simple | More infrastructure required |
| Best suited for | Small and medium applications | Large, complex systems |

**Important:** Microservices are not always better. A well-structured monolith is often the better starting point. Microservices should be introduced when independent deployment, scaling, or team ownership provides real value.

---

## 4. Tightly Coupled vs Loosely Coupled

**Coupling** describes how much one module or service depends on another.

### A. Tightly Coupled

Two components are tightly coupled when one component depends heavily on the internal implementation or data structure of another component.

A change in one component can break the other.

**Example:**

Suppose the Order module directly accesses the Payment module's database tables.

- Payment changes its database schema.
- Order still expects the old schema.
- Order starts failing.

    Order Module
         |
         | Direct dependency on internals
         |
    Payment Module

### Problems

- Changes in one module affect other modules.
- Difficult to maintain.
- Difficult to test independently.
- Replacing one component becomes difficult.

### B. Loosely Coupled

Components are loosely coupled when they communicate through clearly defined interfaces or contracts without depending on each other's internal implementation.

**Example:**

Order Service communicates with Payment Service through an API.

    Order Service
         |
         | POST /payments
         |
    Payment Service

Payment Service can change its internal database structure without affecting Order Service, provided the API contract remains compatible.

### Benefits

- Independent development.
- Easier maintenance.
- Easier testing.
- Changes remain isolated.
- Services can evolve independently.

### Difference

| Tightly Coupled | Loosely Coupled |
|---|---|
| Depends on internal implementation | Depends on public interfaces |
| Changes can affect multiple modules | Changes are more isolated |
| Difficult to test independently | Easier to test independently |
| Less flexible | More flexible |
| Higher dependency | Lower dependency |

---

## 5. High Cohesion vs Low Cohesion

**Cohesion** describes how closely related the responsibilities inside a module are.

### A. High Cohesion

A module has high cohesion when all its functions are related to one specific responsibility.

**Example: Payment Service**

- Payment authorization
- Payment processing
- Refunds
- Payment status

All responsibilities are related to payments.

### B. Low Cohesion

A module has low cohesion when it contains unrelated responsibilities.

**Example: Utility Service**

- Payment processing
- User authentication
- Email sending
- Product search

These responsibilities should ideally belong to separate modules.

### Difference

| High Cohesion | Low Cohesion |
|---|---|
| Focused responsibilities | Unrelated responsibilities |
| Easier to maintain | Difficult to maintain |
| Clear module boundaries | Unclear module boundaries |
| Easier to understand | More complex structure |

**Design principle:**

High Cohesion + Loose Coupling = Good Software Design

- High cohesion within a module.
- Loose coupling between modules.

---

## 6. Database Ownership in Microservices

In microservices architecture, each service should own its database.

    User Service       -> User DB

    Order Service      -> Order DB

    Payment Service    -> Payment DB

    Product Service    -> Product DB

For example:

- Order Service should access its own Order DB.
- Payment Service should access its own Payment DB.
- Order Service should not directly query Payment DB.

If Order Service needs payment information, it should communicate with Payment Service through an API or receive an event.

### Why?

Sharing databases creates tight coupling. A database schema change in one service can break other services.

### Polyglot Persistence

Different services can use different database technologies depending on their requirements.

| Service | Database |
|---|---|
| User Service | PostgreSQL |
| Product Service | MongoDB |
| Analytics Service | Elasticsearch |
| Order Service | PostgreSQL |

This approach is called **Polyglot Persistence**.

---

## 7. Synchronous vs Asynchronous Communication

Microservices need to communicate with each other. Two common communication approaches are synchronous and asynchronous.

### A. Synchronous Communication

The caller sends a request and waits for the response.

**Common technologies:**
- REST APIs
- gRPC

**Example:**

Order Service calls Payment Service and waits for payment confirmation.

    Order Service
         |
         | Request
         |
    Payment Service
         |
         | Response
         |
    Order Service

### Advantages

- Immediate response.
- Simple request-response flow.
- Useful when the caller needs the result immediately.

### Disadvantages

- Caller waits for the other service.
- Increased latency.
- If the dependent service is unavailable, the request may fail.

### B. Asynchronous Communication

The sender publishes a message or event without waiting for the consumer to finish processing it.

**Common technologies:**
- Apache Kafka
- RabbitMQ

**Example:**

After an order is created, Order Service publishes an `OrderCreated` event.

Notification Service consumes the event and sends an email independently.

    Order Service
         |
         | OrderCreated Event
         |
    Message Broker
         |
         | Consumes Event
         |
    Notification Service
         |
      Send Email

### Advantages

- Sender does not need to wait for processing.
- Services can process tasks independently.
- Messages can be buffered by the broker.
- Useful for background processing and event-driven workflows.

### Disadvantages

- Processing may not happen immediately.
- Eventual consistency must be handled.
- Message duplication and delivery failures must be considered.
- Debugging distributed event flows can be difficult.

### Difference

| Synchronous | Asynchronous |
|---|---|
| Caller waits for response | Caller does not wait for processing |
| REST, gRPC | Kafka, RabbitMQ |
| Immediate response | Processing can happen later |
| More direct dependency | More decoupled communication |
| Useful for immediate results | Useful for background tasks and events |

---

## 8. Distributed Transactions and Saga Pattern

In a monolithic application, multiple database operations can often be handled using one database transaction.

In microservices, each service owns its database. Therefore, a single traditional database transaction cannot easily cover multiple services.

**Example: E-commerce Order**

1. Order Service creates an order.
2. Payment Service processes payment.
3. Inventory Service reserves the product.
4. Notification Service sends confirmation.

What happens if payment succeeds but inventory reservation fails?

This is where the **Saga Pattern** is useful.

### Saga Pattern

Saga manages a distributed business transaction through multiple local transactions.

If one step fails, compensating actions are executed to reverse earlier business operations where possible.

**Example:**

    Create Order
         |
    Process Payment
         |
    Reserve Inventory
         |
       Success?
       /      \
     Yes       No
      |         |
    Confirm   Refund Payment
    Order     Cancel Order

### Two Types of Saga

| Choreography | Orchestration |
|---|---|
| Services communicate through events | Central orchestrator controls the workflow |
| No central coordinator | Has a central coordinator |
| Services react to events | Orchestrator sends commands |
| Can become difficult to track in complex flows | Workflow is easier to visualize centrally |

---

## 9. Important SDE-3 Revision Points

| Concept | Remember |
|---|---|
| Monolith | One application, one deployment unit |
| Microservices | Independent services and deployments |
| Coupling | Dependency between components |
| Cohesion | Relatedness of responsibilities within a component |
| Loose coupling | Communicate through stable contracts |
| High cohesion | One focused responsibility per module |
| Database per service | Each service owns its data |
| API Gateway | Entry point that routes client requests |
| Kafka | Event streaming and asynchronous communication |
| Saga | Managing distributed transactions |
| Eventual consistency | Data may become consistent after some time |
| Modular Monolith | One deployment with clearly separated modules |

---

## 10. Interview Summary

A monolithic architecture combines multiple business modules into one deployable application. It is easier to develop and operate initially, but independent scaling and deployment become difficult as the system grows.

Microservices divide the application into independently deployable services, each responsible for a specific business capability. They improve independent scaling and team ownership but introduce distributed-system complexity.

Regardless of architecture, good design aims for **high cohesion within modules and loose coupling between modules**. A modular monolith is often a sensible starting point, with microservices introduced when there is a clear technical or organizational reason.


# Latency vs Response Time

## 1. Latency

**Latency** is the time taken for a request or data to travel from the source to the destination.

In simple terms, it measures the delay in communication between two systems.

**Example:**

A client sends a request to a server.

- Request takes 50 ms to reach the server.
- Server receives the request after 50 ms.

The network latency for this request is approximately 50 ms one-way.

### Example Diagram

```text
   Client
      |
      | Request (50 ms)
      |
    Server
```

### Factors Affecting Latency

- Network distance between client and server.
- Network congestion.
- DNS lookup time.
- Number of network calls.
- Server location and infrastructure.
- Network protocols and connection setup.

---

## 2. Response Time

**Response Time** is the total time taken from sending a request until receiving the complete response.

It includes network delays, server queue waiting time, and server-side processing time.

**Example:**

A client requests user data from an API.

| Operation | Time |
|---|---:|
| Request travels to server | 50 ms |
| Server processes request | 100 ms |
| Response travels to client | 50 ms |
| **Total Response Time** | **200 ms** |

### Example Diagram

```text
   Client
      |
      | Request: 50 ms
      |
    Server
      |
      | Processing: 100 ms
      |
    Server
      |
      | Response: 50 ms
      |
   Client
```

Total Response Time = 50 + 100 + 50 = 200 ms

---

## 3. Real-World Example: Ordering Food Online

Imagine you are in Delhi and open a food delivery app to search for "Paneer Tikka."

Your request travels from your phone in Delhi to the app's server in Mumbai.

| Stage | Metric Type | What Happens | Time Taken |
|---|---|---|---:|
| 1. Request Travel | Latency | Your request travels from your phone in Delhi to the app's server in Mumbai. | 30 ms |
| 2. Server Queue | Queue Waiting Time | The server is busy, so your request waits in line behind other users. | 15 ms |
| 3. Backend Work | Processing Time | The server searches the database for restaurants near you and ranks them. | 120 ms |
| 4. Response Travel | Latency | The list of restaurants travels back from Mumbai to your phone in Delhi. | 30 ms |

### Calculations

**Total Network Latency:**

30 ms (request travel) + 30 ms (response travel) = 60 ms

**Total Response Time:**

60 ms (network latency) + 15 ms (queue waiting) + 120 ms (processing) = 195 ms

Therefore:

- **Latency = 60 ms** (round-trip network latency).
- **Response Time = 195 ms** (total time until the response arrives).

**Important:** Server queue waiting time is not network latency. It is time spent waiting inside the server infrastructure.

---

## 4. Latency vs Response Time

| Feature | Latency | Response Time |
|---|---|---|
| Meaning | Communication delay | Total time to receive a response |
| Includes | Network delay | Network delay + queue waiting + processing |
| Scope | Network communication | Entire request-response cycle |
| Example | Request takes 50 ms to reach server | Request and response complete in 200 ms |
| Improvement | Better network, closer servers, fewer network hops | Optimize network, queue management and server processing |

**Important:** Latency can refer to one-way network delay or round-trip network delay, depending on context. Response time measures the complete request-response duration.

---

## 5. Latency in Microservices

In microservices, one user request may travel through multiple services.

Every network call can add latency.

**Example:**

An API request follows this flow:

```text
       Client
          |
          v
     API Gateway
          |
          v
     User Service
          |
          v
     Order Service
          |
          v
    Payment Service
          |
          v
   Response to Client
```

Suppose each network call takes 20 ms.

If there are 4 sequential network calls:

Total network latency = 4 × 20 = 80 ms

Server processing time must also be added to calculate the total response time.

### How to Reduce Latency

- Reduce unnecessary service-to-service calls.
- Use caching (Redis).
- Place services closer geographically.
- Use connection pooling.
- Use asynchronous communication where appropriate.
- Avoid unnecessary database queries.
- Use CDNs for static content.
- Use parallel processing when operations are independent.

---

## 6. Latency vs Throughput

These are two important system performance metrics.

| Latency | Throughput |
|---|---|
| Time taken to complete a request | Number of requests processed per unit of time |
| Measures speed of an individual operation | Measures system processing capacity |
| Usually measured in ms or seconds | Usually measured in requests/second |
| Lower is generally better | Higher is generally better |

**Example:**

- Latency = 100 ms per request.
- Throughput = 1,000 requests per second.

A system can have high throughput but still have high latency, depending on its workload and architecture.

---

## 7. SDE-3 Quick Revision

- **Latency:** Delay in communication between systems.
- **Response Time:** Total time from sending a request to receiving its response.
- **Processing Time:** Time taken by the server to execute the request.
- **Queue Waiting Time:** Time a request waits before server processing begins.
- **Throughput:** Number of requests processed per second.
- **Network Latency:** Delay caused by network communication.
- **High Latency:** Requests experience greater communication delays.
- **Low Latency:** Requests experience smaller communication delays.

### Interview Answer

Latency is the delay involved in transferring a request or data between systems, whereas response time is the total duration from sending a request until receiving the response. Response time includes network delays, queue waiting time and server-side processing. In distributed systems and microservices, multiple network calls can increase latency and consequently increase the overall response time.


# Throughput in System Design

## 1. What is Throughput?

**Throughput** is the number of requests or operations a system can successfully process within a given period of time.

In simple terms, it measures how much work a system can handle per second.

It tells us the processing capacity of a system.

**Example:**

Imagine an API receives 1,000 requests.

- The server successfully processes 800 requests in one second.
- Its throughput is 800 requests per second (RPS).

### Formula

Throughput = Total Successfully Processed Requests / Total Time

For example:

Throughput = 800 requests / 1 second

**Throughput = 800 RPS**

### Units of Throughput

| Unit | Meaning |
|---|---|
| RPS | Requests Per Second |
| QPS | Queries Per Second |
| TPS | Transactions Per Second |
| OPS | Operations Per Second |
| MB/s | Megabytes transferred per second |

These units are used depending on what the system is processing.

---

## 2. Real-World Example: Ordering Food Online

Imagine you are using a food delivery application.

Thousands of users are simultaneously searching for restaurants, placing orders and making payments.

Suppose the application receives 10,000 requests every second.

However, its backend infrastructure can successfully process only 8,000 requests per second.

| Metric | Value |
|---|---:|
| Incoming Requests | 10,000 requests/sec |
| Successfully Processed Requests | 8,000 requests/sec |
| Requests Waiting or Not Processed Immediately | 2,000 requests/sec |
| **Actual Throughput** | **8,000 RPS** |

**Explanation:**

- Incoming requests represent the workload arriving at the system.
- Processed requests represent the work the system successfully completes.
- Throughput represents the actual processing capacity achieved.

If incoming traffic continuously exceeds processing capacity, the queue may grow, response times may increase, and requests may eventually time out or fail.

---

## 3. Throughput Example Diagram

```text
       10,000 Requests/sec
                |
                v
        +---------------+
        |   API Gateway |
        +---------------+
                |
                v
        +---------------+
        | Backend Server|
        |               |
        | Capacity:     |
        | 8,000 RPS     |
        +---------------+
                |
                v
        8,000 Successfully
        Processed Requests/sec

        Remaining 2,000
        Requests/sec may
        wait or be rejected.
```

---

## 4. Throughput vs Latency vs Response Time

These are important performance metrics in System Design.

| Feature | Throughput | Latency | Response Time |
|---|---|---|---|
| Meaning | Amount of work processed per unit of time | Communication delay | Total time taken to receive a response |
| Measures | Processing capacity | Network delay | Request completion duration |
| Unit | RPS, QPS, TPS | ms, seconds | ms, seconds |
| Goal | Higher | Lower | Lower |
| Example | 10,000 requests/sec | 30 ms network delay | 195 ms total response time |

**Important:**

A system can have high throughput but also high latency.

For example, a server may process 10,000 requests per second while individual requests take 2 seconds to complete.

Throughput measures the overall processing capacity, whereas latency and response time measure delays.

---

## 5. Throughput in Microservices

In a microservices architecture, different services handle different operations.

For example, an e-commerce application may have:

- User Service
- Product Service
- Order Service
- Payment Service
- Notification Service

Each service has its own processing capacity.

### Example Architecture

```text
              Client
                 |
                 v
            API Gateway
                 |
       +---------+---------+
       |         |         |
       v         v         v
    User      Product    Order
   Service    Service   Service
                           |
                           v
                     Payment Service
                           |
                           v
                   Notification Service
```

Suppose the services have the following capacities:

| Microservice | Throughput |
|---|---:|
| User Service | 10,000 RPS |
| Product Service | 8,000 RPS |
| Order Service | 5,000 RPS |
| Payment Service | 2,000 TPS |
| Notification Service | 6,000 RPS |

If every request must pass through these services sequentially, the payment service may become the bottleneck.

The overall throughput of this request flow cannot exceed the capacity of its limiting component, assuming each request requires one operation at every service and there are no other constraints.

**Bottleneck:** A component that limits the overall processing capacity of a system.

---

## 6. Factors Affecting Throughput

### 1. Server Resources

CPU, RAM and disk performance affect how many operations a server can process.

### 2. Database Performance

Slow queries, missing indexes and database connection limits can reduce throughput.

### 3. Network Bandwidth

Limited network bandwidth restricts how much data can be transferred.

### 4. Concurrent Requests

The number of requests a system can handle simultaneously affects its processing capacity.

### 5. Application Code

Inefficient algorithms, unnecessary computations and blocking operations can reduce throughput.

### 6. External Dependencies

Third-party APIs, payment gateways and other external services can become bottlenecks.

### 7. Database Connection Pool

A limited number of database connections can restrict how many requests can execute database operations simultaneously.

---

## 7. How to Increase Throughput

### 1. Horizontal Scaling

Add more servers to distribute incoming traffic.

```text
             Load Balancer
                   |
          +--------+--------+
          |        |        |
          v        v        v
        Server 1 Server 2 Server 3
```

Instead of one server processing all requests, multiple servers share the workload.

### 2. Load Balancing

Distribute incoming requests across multiple servers.

Examples:
- Round Robin
- Least Connections
- Weighted Round Robin

### 3. Caching

Use Redis or in-memory caching to reduce repeated database queries.

### 4. Database Optimization

- Add proper indexes.
- Optimize SQL queries.
- Use connection pooling.
- Avoid unnecessary database operations.
- Use read replicas when appropriate.

### 5. Asynchronous Processing

Use message queues such as Kafka or RabbitMQ to process background tasks asynchronously.

Example:

```text
       Client Request
              |
              v
          API Server
              |
              v
          Kafka Queue
              |
       +------+------+
       |             |
       v             v
    Worker 1      Worker 2
       |             |
       v             v
    Database     External API
```

This allows the API to accept work without waiting for every background operation to finish.

### 6. Parallel Processing

Execute independent operations simultaneously instead of sequentially.

### 7. Optimize Application Code

Use efficient algorithms, avoid unnecessary computations and reduce blocking operations.

---

## 8. Throughput vs Concurrency

These two concepts are related but different.

| Throughput | Concurrency |
|---|---|
| Number of operations completed per unit of time | Number of operations being handled at the same time |
| Measures completed work | Measures simultaneous work |
| Unit: RPS, TPS | Number of concurrent requests |
| Higher throughput means more work completed per second | Higher concurrency means more work can be in progress simultaneously |

**Example:**

Imagine a server handles 500 concurrent requests and completes 2,000 requests every second.

- Concurrency = 500 requests.
- Throughput = 2,000 RPS.

Increasing concurrency does not always increase throughput. If CPU, memory or database capacity is exhausted, additional concurrency can increase waiting time without increasing completed work.

---

## 9. Throughput and Little's Law

Little's Law is an important concept in System Design.

It describes the relationship between:

- L = Average number of requests in the system.
- λ (Lambda) = Average throughput.
- W = Average time a request spends in the system.

### Formula

L = λ × W

**Example:**

Suppose:

- Throughput = 100 requests/second.
- Average response time = 2 seconds.

Then:

L = 100 × 2

L = 200 requests

This means approximately 200 requests are present in the system on average, including requests being processed and requests waiting.

**Important:** Little's Law applies to a stable system when measured over consistent boundaries and time intervals.

---

## 10. Throughput vs Bandwidth

These terms are often confused.

| Throughput | Bandwidth |
|---|---|
| Actual amount of work processed per unit of time | Maximum theoretical data transfer capacity |
| Measures actual processing performance | Measures available data transfer capacity |
| Can be measured in RPS, TPS, MB/s | Usually measured in Mbps or Gbps |
| Depends on system resources and workload | Depends on network capacity |

**Example:**

- Network bandwidth = 1 Gbps.
- Actual achieved network throughput = 700 Mbps.

The system is transferring data at 700 Mbps despite having a theoretical network capacity of 1 Gbps.

---

## 11. SDE-3 Quick Revision

- **Throughput:** Number of requests or operations successfully processed per unit of time.
- **RPS:** Requests processed per second.
- **QPS:** Queries processed per second.
- **TPS:** Transactions processed per second.
- **Concurrency:** Number of operations being handled simultaneously.
- **Bottleneck:** Component limiting overall system throughput.
- **Horizontal Scaling:** Adding more servers to increase processing capacity.
- **Load Balancer:** Distributes incoming traffic across multiple servers.
- **Caching:** Reduces repeated database operations and improves performance.
- **Kafka:** Helps handle asynchronous workloads through message queues.
- **Little's Law:** L = λ × W.

### Interview Answer

Throughput is the number of requests or operations a system can successfully process within a given period of time. It is generally measured in requests per second (RPS), queries per second (QPS), or transactions per second (TPS). In system design, throughput helps determine the processing capacity of an application. We can improve throughput through horizontal scaling, load balancing, caching, database optimization, parallel processing and asynchronous communication. However, the overall throughput can be limited by bottlenecks such as database performance, CPU capacity or external dependencies.



# Scaling in System Design

## 1. What is Scaling?

**Scaling** is the process of increasing or decreasing a system's resources to handle changes in workload, traffic, and user demand.

In simple terms, scaling means making an application capable of handling more users and requests without compromising performance.

**Example:**

Imagine you build a food delivery application.

Initially:
- 100 users use your application.
- One server handles all requests.
- The application works smoothly.

After some time:
- 100,000 users start using your application.
- More requests arrive simultaneously.
- The server becomes overloaded.
- Response time increases and requests may fail.

You need to increase the system's capacity.

This is where scaling comes in.

There are two main types of scaling:

1. Vertical Scaling (Scale Up)
2. Horizontal Scaling (Scale Out)

---

## 2. Vertical Scaling (Scale Up)

**Vertical Scaling** means increasing the resources of an existing server instead of adding more servers.

You upgrade the existing machine by adding:

- More RAM.
- More CPU cores.
- Faster processors.
- Faster storage (SSD/NVMe).

### Example

Suppose your application initially runs on:

| Resource | Initial Server |
|---|---|
| CPU | 2 Cores |
| RAM | 4 GB |
| Storage | 100 GB |

As traffic increases, you upgrade the same server.

| Resource | Upgraded Server |
|---|---|
| CPU | 16 Cores |
| RAM | 64 GB |
| Storage | 1 TB |

The application still runs on one server, but that server now has more computing power.

### Architecture Diagram

```text
       BEFORE SCALING

       +-------------+
       |   Server 1  |
       |             |
       | 2 CPU Cores |
       | 4 GB RAM    |
       +-------------+


       AFTER SCALING

       +----------------+
       |    Server 1    |
       |                |
       | 16 CPU Cores   |
       | 64 GB RAM      |
       +----------------+
```

### Advantages

- Easy to implement.
- No need to manage multiple application servers.
- No complex load-balancing configuration.
- Easier application deployment and management.
- Useful for applications that need powerful individual machines.

### Disadvantages

- Hardware has a maximum capacity.
- Upgrading hardware can be expensive.
- May require downtime during upgrades.
- Single point of failure if there is only one server.
- Eventually, you reach a limit beyond which you cannot upgrade further.

---

## 3. Horizontal Scaling (Scale Out)

**Horizontal Scaling** means increasing the number of servers instead of upgrading the resources of an existing server.

Instead of making one server more powerful, you add multiple servers to distribute the workload.

### Example

Initially, your application runs on one server.

As traffic increases, you add more servers.

| Server | CPU | RAM |
|---|---|---|
| Server 1 | 4 Cores | 8 GB |
| Server 2 | 4 Cores | 8 GB |
| Server 3 | 4 Cores | 8 GB |
| Server 4 | 4 Cores | 8 GB |

Now multiple servers handle incoming requests.

### Architecture Diagram

```text
                 Clients
                    |
                    v
             +--------------+
             | Load Balancer|
             +--------------+
                    |
          +---------+---------+
          |         |         |
          v         v         v
      +--------+ +--------+ +--------+
      |Server 1| |Server 2| |Server 3|
      |        | |        | |        |
      |4 CPU   | |4 CPU   | |4 CPU   |
      |8 GB RAM| |8 GB RAM| |8 GB RAM|
      +--------+ +--------+ +--------+
```

### How Does It Work?

1. Users send requests to the application.
2. Requests reach the Load Balancer.
3. The Load Balancer distributes requests among available servers.
4. Multiple servers process requests simultaneously.
5. Responses are returned to users.

### Advantages

- Can handle significantly more traffic.
- More servers can be added as demand increases.
- Better availability when properly configured.
- Workload is distributed across multiple machines.
- Supports large-scale distributed systems.

### Disadvantages

- Requires load balancing.
- More complex infrastructure.
- Servers may need shared storage or distributed databases.
- Session management becomes more complicated.
- Network communication between services can introduce additional latency.
- Distributed systems require additional monitoring and coordination.

---

## 4. Vertical Scaling vs Horizontal Scaling

| Feature | Vertical Scaling | Horizontal Scaling |
|---|---|---|
| Meaning | Increase resources of an existing server | Add more servers |
| Also Called | Scale Up | Scale Out |
| Infrastructure | One powerful machine | Multiple machines |
| CPU/RAM | Upgrade existing server | Add resources across servers |
| Load Balancer | Usually not required | Commonly required |
| Complexity | Relatively simple | More complex |
| Fault Tolerance | Limited with one server | Can provide better fault tolerance |
| Scalability | Limited by hardware capacity | Can expand across multiple machines |
| Cost | Powerful hardware can be expensive | Multiple smaller servers can be cost-effective |
| Best For | Small and medium workloads | Large and growing workloads |

---

## 5. Why Do Companies Use a Mix of Both?

In real-world system design, companies often use a combination of vertical and horizontal scaling.

**Why?**

Because both approaches solve different problems.

- Vertical scaling makes an individual server more powerful.
- Horizontal scaling increases the number of machines handling the workload.

Using both allows companies to balance performance, cost, complexity and availability.

### Real-World Example: Food Delivery Application

Imagine your application initially has 10,000 users.

You start with one server:

```text
          Clients
             |
             v
        +----------+
        | Server 1 |
        | 4 CPU    |
        | 8 GB RAM |
        +----------+
```

### Step 1: Vertical Scaling

As traffic increases, the server starts struggling.

You upgrade it:

```text
          Clients
             |
             v
        +-----------+
        | Server 1  |
        | 16 CPU    |
        | 64 GB RAM |
        +-----------+
```

Now the server can handle more requests.

However, it still has a maximum hardware capacity.

### Step 2: Horizontal Scaling

Traffic increases further.

Instead of continuously upgrading the same server, you add more servers.

```text
                 Clients
                    |
                    v
             +--------------+
             | Load Balancer|
             +--------------+
                    |
          +---------+---------+
          |         |         |
          v         v         v
       Server 1  Server 2  Server 3
       16 CPU    16 CPU    16 CPU
       64 GB     64 GB     64 GB
```

Now requests are distributed across multiple powerful servers.

### Why This Combination Works

| Approach | Purpose |
|---|---|
| Vertical Scaling | Make individual servers more powerful |
| Horizontal Scaling | Distribute workload across multiple servers |
| Combined Scaling | Improve capacity, flexibility and availability |

**Important:** Companies do not necessarily need to vertically scale every server before horizontally scaling. They choose the combination based on workload, cost and architecture.

---

## 6. Scaling in Real-World Architecture

A large application does not necessarily run everything on one server.

Different components can scale independently.

Example:

```text
                    Clients
                       |
                       v
                +-------------+
                | Load Balancer|
                +-------------+
                       |
                       v
                 API Gateway
                       |
          +------------+------------+
          |            |            |
          v            v            v
      User Service  Order Service  Product Service
          |            |            |
          v            v            v
       Database      Database      Cache
```

For example:

- Product Service may need more servers because of frequent searches.
- Order Service may need more resources during sales.
- Payment Service may need stronger processing capacity.
- Redis may need additional memory to support caching.

This is called **Independent Scaling**: increasing resources for specific components based on their individual workload.

In microservices architecture, each service can be scaled independently.

---

## 7. Auto Scaling

**Auto Scaling** is the process of automatically increasing or decreasing infrastructure resources based on predefined conditions.

Instead of manually adding servers, the infrastructure monitors workload and adjusts capacity.

### Example

Suppose your application has:

- 2 servers initially.
- CPU utilization threshold of 75%.
- Maximum of 10 servers.

When CPU utilization increases beyond the configured threshold, additional servers are launched.

When traffic decreases, unnecessary servers can be removed.

### Architecture Diagram

```text
             Incoming Traffic
                    |
                    v
              Load Balancer
                    |
          +---------+---------+
          |         |         |
          v         v         v
       Server 1  Server 2  Server 3
                    |
                    |
             CPU Usage > 75%
                    |
                    v
              Auto Scaling
                    |
                    v
              Add Servers
                    |
          +---------+---------+
          |         |         |
          v         v         v
       Server 4  Server 5  Server 6
```

### Types of Auto Scaling

| Type | Meaning |
|---|---|
| Horizontal Auto Scaling | Automatically adds or removes servers |
| Vertical Auto Scaling | Automatically increases or decreases server resources where supported |

### Benefits

- Handles sudden traffic spikes.
- Reduces unnecessary infrastructure costs.
- Maintains application performance.
- Reduces manual infrastructure management.

---

## 8. SDE-3 Quick Revision

- **Scaling:** Increasing or decreasing system resources to handle workload.
- **Vertical Scaling:** Increasing CPU, RAM or storage of an existing server.
- **Horizontal Scaling:** Adding more servers to distribute workload.
- **Scale Up:** Increase the capacity of one machine.
- **Scale Out:** Increase the number of machines.
- **Load Balancer:** Distributes incoming requests across multiple servers.
- **Auto Scaling:** Automatically adjusts infrastructure capacity based on demand.
- **Independent Scaling:** Scaling individual services based on their workload.
- **Fault Tolerance:** Ability of a system to continue operating despite component failures.
- **Bottleneck:** A component that limits the overall performance or capacity of a system.

### Interview Answer

Scaling is the process of increasing or decreasing system resources to handle changes in traffic and workload.

There are two primary approaches: vertical scaling and horizontal scaling.

Vertical scaling, also called scale up, means increasing the resources of an existing server, such as CPU and RAM.

Horizontal scaling, also called scale out, means adding multiple servers and distributing incoming traffic using a load balancer.

In real-world distributed systems, companies often combine both approaches. They use vertical scaling to improve individual server capacity and horizontal scaling to distribute workloads, improve availability and support increasing traffic.


<div id="topic-2"></div>

# SQL vs NoSQL, Indexing, Partitioning and Sharding

# 1. SQL vs NoSQL

Databases are broadly classified into two categories:

1. SQL (Relational Databases)
2. NoSQL (Non-Relational Databases)

Both are used to store, retrieve and manage application data, but they differ in how they organize data, handle relationships and scale.

---

## 1.1 SQL (Relational Database)

SQL stands for Structured Query Language.

SQL databases store data in the form of **tables consisting of rows and columns**.

Each table has a predefined structure called a schema.

Examples:
- PostgreSQL
- MySQL
- Microsoft SQL Server
- Oracle Database

### Example: Users Table

| user_id | name | email |
|---|---|---|
| 1 | Kartik | kartik@gmail.com |
| 2 | Rahul | rahul@gmail.com |
| 3 | Aman | aman@gmail.com |

### Example: Orders Table

| order_id | user_id | product |
|---|---|---|
| 101 | 1 | Laptop |
| 102 | 2 | Mobile |
| 103 | 1 | Keyboard |

Here:

- `user_id` in the Users table is the Primary Key.
- `user_id` in the Orders table is a Foreign Key.
- The Foreign Key establishes a relationship between users and their orders.

### SQL Relationship Diagram

```text
       USERS TABLE
    +----------------+
    | user_id (PK)   |
    | name           |
    | email          |
    +----------------+
            |
            | One-to-Many
            |
            v
       ORDERS TABLE
    +----------------+
    | order_id (PK)  |
    | user_id (FK)   |
    | product        |
    +----------------+
```

One user can have multiple orders.

### SQL Example

```sql
SELECT Users.name, Orders.product
FROM Users
JOIN Orders
ON Users.user_id = Orders.user_id;
```

This query retrieves users along with their orders by joining two tables.

---

## 1.2 NoSQL (Non-Relational Database)

NoSQL means Not Only SQL.

NoSQL databases do not necessarily store data in traditional relational tables.

They support different data models depending on the database.

Common NoSQL database types:

| Type | Description | Examples |
|---|---|---|
| Document Database | Stores data as documents, commonly JSON-like structures | MongoDB |
| Key-Value Database | Stores data as key-value pairs | Redis |
| Wide-Column Database | Stores data in column families | Cassandra |
| Graph Database | Stores data as nodes and relationships | Neo4j |

### Example: MongoDB Document

```json
{
  "user_id": 1,
  "name": "Kartik",
  "email": "kartik@gmail.com",
  "orders": [
    {
      "order_id": 101,
      "product": "Laptop"
    },
    {
      "order_id": 103,
      "product": "Keyboard"
    }
  ]
}
```

Unlike SQL, MongoDB can store related information together inside a document.

This is called **Embedding**.

### NoSQL Data Structure

```text
          USERS COLLECTION
                  |
                  v
          +----------------+
          | User Document  |
          +----------------+
          | user_id: 1     |
          | name: Kartik   |
          | email: ...     |
          |                |
          | orders: [      |
          |   Laptop       |
          |   Keyboard     |
          | ]              |
          +----------------+
```

---

# 2. SQL vs NoSQL: Main Differences

| Feature | SQL | NoSQL |
|---|---|---|
| Data Structure | Tables, rows and columns | Documents, key-value, graphs, etc. |
| Schema | Generally predefined | Often flexible or schema-less |
| Relationships | Supports foreign keys and JOINs | Often uses embedding, references or database-specific relationships |
| Query Language | SQL | Database-specific query interfaces |
| Transactions | Strong ACID transaction support | Depends on database; many support ACID transactions |
| Scaling | Traditionally vertically scaled; horizontal scaling is also possible | Often designed with horizontal scaling in mind |
| Data Consistency | Strong consistency commonly supported | Depends on database and configuration |
| Data Structure | Structured data | Structured, semi-structured or unstructured data |
| Joins | Strong support | Varies by database; often less central to data modeling |
| Flexibility | Changes to schema may require migrations | Flexible document structures are possible |
| Examples | PostgreSQL, MySQL, Oracle | MongoDB, Redis, Cassandra, Neo4j |

**Important:** SQL does not mean vertical scaling only, and NoSQL does not automatically mean horizontal scaling. Modern SQL databases can scale horizontally, and NoSQL databases can also have scaling limitations.

---

# 3. Advantages and Disadvantages of SQL

## Advantages of SQL

### 1. ACID Transactions

SQL databases commonly provide ACID transactions.

ACID stands for:

- Atomicity: Either the entire transaction succeeds or none of it does.
- Consistency: A transaction preserves database rules and constraints.
- Isolation: Concurrent transactions are isolated according to the configured isolation level.
- Durability: Committed data survives failures according to the database's durability guarantees.

**Example: Bank Money Transfer**

Suppose you transfer ₹1,000 from Account A to Account B.

Two operations must happen:

1. Deduct ₹1,000 from Account A.
2. Add ₹1,000 to Account B.

What if the first operation succeeds but the second fails?

Without a transaction, money could disappear.

With an ACID transaction, both operations succeed together or the transaction is rolled back.

```text
       Account A
       Balance: 5000
            |
            v
      Deduct ₹1000
            |
            v
       Account A
       Balance: 4000
            |
            v
       Account B
       Add ₹1000
            |
            v
       Account B
       Balance: 3000
```

If the second operation fails, the first operation is rolled back.

### 2. Strong Data Consistency

SQL databases can provide strong consistency.

After a successful transaction commits, subsequent reads within the relevant consistency guarantees can see the committed changes.

### 3. Relationships and JOINs

SQL makes it easy to retrieve related data from multiple tables.

Example:

- Users
- Orders
- Products
- Payments

You can join these tables to retrieve related information.

### 4. Data Integrity

SQL databases support:

- Primary Keys
- Foreign Keys
- UNIQUE constraints
- NOT NULL constraints
- CHECK constraints

These constraints help maintain valid data.

### 5. Complex Queries

SQL is powerful for:
- Reporting
- Aggregations
- Filtering
- Sorting
- Analytics
- Complex relationships

## Disadvantages of SQL

1. **Rigid Schema:** Structural changes may require migrations.
2. **Complex Joins:** Queries involving many tables can become expensive if not optimized.
3. **Horizontal Scaling Complexity:** Distributing relational data across multiple machines can introduce complexity.
4. **Expensive Scaling:** High-performance database hardware and infrastructure can become costly.
5. **Schema Coordination:** Applications and database migrations must remain compatible.

---

# 4. Advantages and Disadvantages of NoSQL

## Advantages of NoSQL

### 1. Flexible Schema

NoSQL document databases like MongoDB allow documents in the same collection to have different fields.

Example:

Document 1:

```json
{
  "name": "Kartik",
  "age": 24
}
```

Document 2:

```json
{
  "name": "Rahul",
  "age": 25,
  "city": "Delhi"
}
```

Both documents can exist in the same collection.

This is useful when application data evolves frequently.

### 2. Horizontal Scaling

Many NoSQL databases are designed to distribute data across multiple servers.

This helps applications handle large datasets and high traffic.

### 3. High Availability

Distributed NoSQL databases can maintain multiple replicas of data.

If one server fails, another replica may continue serving requests, depending on the database configuration.

### 4. Flexible Data Models

NoSQL databases support different data models:

- Documents
- Key-value pairs
- Wide-column storage
- Graphs

You can choose a database based on the application's requirements.

### 5. Efficient Data Access

Document databases can store related data together.

This can reduce the need for multiple queries and joins when the data access pattern matches the document structure.

## Disadvantages of NoSQL

1. **Data Duplication:** Denormalization can result in duplicated data.
2. **Complex Relationships:** Managing relationships across documents may require additional queries.
3. **Consistency Trade-offs:** Some distributed configurations allow eventual consistency or weaker read guarantees.
4. **Data Integrity:** Relational constraints such as foreign keys may not be available.
5. **Complex Data Updates:** Updating duplicated data across multiple documents can be difficult.
6. **Query Limitations:** Complex joins and relational queries may be less convenient, depending on the database.

**Important:** NoSQL does not mean No ACID. For example, MongoDB supports multi-document ACID transactions.

---

# 5. When Should You Use SQL vs NoSQL?

| Use Case | Recommended Database | Reason |
|---|---|---|
| Banking Applications | SQL | Strong transactions and data integrity |
| Financial Transactions | SQL | ACID guarantees and relational constraints |
| E-commerce Orders | SQL | Relationships between orders, users and payments |
| Social Media Feeds | NoSQL | Flexible data models and distributed workloads |
| Real-Time Caching | NoSQL (Redis) | Fast key-value access |
| Product Catalog | SQL or NoSQL | Depends on product structure and queries |
| Chat Applications | NoSQL or SQL | Depends on message storage and access patterns |
| Inventory Management | SQL | Transactional consistency |
| Recommendation Systems | Graph or NoSQL | Depends on relationships and access patterns |
| Analytics | SQL or NoSQL | Depends on workload and data architecture |

### Interview Answer

SQL databases are relational databases that store data in structured tables with predefined schemas. They provide strong transaction support, data integrity and powerful JOIN operations.

NoSQL databases use non-relational data models such as documents, key-value pairs, graphs and wide-column storage. They offer flexible data models and commonly support distributed horizontal scaling.

I would choose SQL when relationships, transactions and data integrity are critical, such as banking and order management. I would choose NoSQL when flexible data structures and distributed data access are important, such as caching and large-scale feeds.

The choice depends on the application's access patterns, consistency requirements and scalability needs.

---

# 6. What is Indexing?

**Indexing** is a database optimization technique used to retrieve records faster without scanning every row or document.

Think of an index like the index at the back of a book.

Without an index, you may need to read every page to find a particular topic.

With an index, you can directly locate the relevant page.

Databases use indexes to speed up data retrieval.

## Example Without Indexing

Suppose you have a Users table containing 1 million records.

You execute:

```sql
SELECT * FROM Users
WHERE email = 'kartik@gmail.com';
```

Without an index on the email column, the database may perform a Full Table Scan.

It checks records one by one until it finds the matching email.

```text
       USERS TABLE
             |
             v
        Check Row 1
             |
             v
        Check Row 2
             |
             v
        Check Row 3
             |
             v
           ...
             |
             v
        Check Row 1M
             |
             v
       Matching Record
```

This can be expensive for large datasets.

## Example With Indexing

Now create an index on the email column.

```sql
CREATE INDEX idx_users_email
ON Users(email);
```

The database maintains a separate index structure that helps locate the matching record.

Instead of scanning the entire table, it can search the index and retrieve the corresponding row.

```text
          EMAIL INDEX
               |
               v
       kartik@gmail.com
               |
               v
          Record Pointer
               |
               v
          USERS TABLE
               |
               v
         Matching Record
```

This can significantly reduce the number of records examined.

## How Does Indexing Work?

Many relational databases use a B-Tree or B+ Tree index structure.

A simplified example:

```text
                [50]
               /    \
              /      \
          [20,30]    [70,90]
```

If you search for 90:

1. Start at the root.
2. Compare 90 with 50.
3. Move to the right.
4. Find 90.

You avoid checking every record.

B-Tree-based indexes typically support efficient searching in approximately O(log N) time.

## Types of Indexes

| Index Type | Explanation |
|---|---|
| Primary Index | Index associated with the primary key; implementation varies by database |
| Unique Index | Prevents duplicate indexed values |
| Clustered Index | Determines the physical or logical organization of table data, depending on the database |
| Non-Clustered Index | Separate index structure containing keys and references to table rows |
| Composite Index | Index created using multiple columns |
| Full-Text Index | Optimizes text searching |
| Hash Index | Uses a hash structure for equality lookups |

## Composite Index Example

Suppose you frequently search users by city and age.

```sql
CREATE INDEX idx_city_age
ON Users(city, age);
```

This creates a composite index.

It is particularly useful for queries such as:

```sql
SELECT *
FROM Users
WHERE city = 'Delhi'
AND age = 24;
```

**Important:** Column order matters in a composite index. An index on `(city, age)` is generally useful for queries filtering by `city` or by both `city` and `age`, but it may not efficiently support a query filtering only by `age`.

## Advantages of Indexing

- Faster data retrieval.
- Reduces unnecessary full table scans.
- Improves search performance.
- Helps sorting and filtering.
- Can improve JOIN performance.

## Disadvantages of Indexing

- Requires additional storage.
- Slows down INSERT operations.
- Slows down UPDATE operations when indexed fields change.
- Slows down DELETE operations because indexes must be maintained.
- Too many indexes increase database maintenance overhead.

**Important:** Indexing improves read performance but introduces write and storage overhead.

---

# 7. What is Partitioning?

**Partitioning** is the process of dividing a large database table or dataset into smaller, manageable pieces called partitions.

These partitions may still belong to the same database.

The main purpose is to improve data management and query performance for large datasets.

### Example

Imagine an Orders table containing 100 million records.

Managing and querying such a large table can become difficult.

Instead, divide the table into multiple partitions based on the order date.

| Partition | Records |
|---|---|
| Orders_2024 | Orders from 2024 |
| Orders_2025 | Orders from 2025 |
| Orders_2026 | Orders from 2026 |

### Partitioning Diagram

```text
             ORDERS TABLE
           100 Million Rows
                  |
                  v
          +---------------+
          |  Partitioning |
          +---------------+
                  |
        +---------+---------+
        |         |         |
        v         v         v
    +--------+ +--------+ +--------+
    | 2024   | | 2025   | | 2026   |
    |Orders  | |Orders  | |Orders  |
    +--------+ +--------+ +--------+
```

Now, if you query orders from 2026, the database may only need to scan the 2026 partition.

This optimization is called **Partition Pruning**.

## Types of Partitioning

### 1. Range Partitioning

Data is divided based on ranges of values.

Example:

```text
Orders Table
     |
     +---- 2024 Orders
     |
     +---- 2025 Orders
     |
     +---- 2026 Orders
```

Useful for:
- Date-based records.
- Historical data.
- Time-series data.

### 2. List Partitioning

Data is divided based on specific predefined values.

Example:

```text
Users Table
     |
     +---- Delhi Users
     |
     +---- Mumbai Users
     |
     +---- Bangalore Users
```

Useful when data belongs to predefined categories.

### 3. Hash Partitioning

A hash function determines which partition stores a particular record.

Example:

```text
Partition = HASH(user_id) % 4
```

Possible output:

```text
user_id = 101 -> Partition 1
user_id = 102 -> Partition 2
user_id = 103 -> Partition 3
user_id = 104 -> Partition 0
```

Useful for distributing records relatively evenly across partitions.

## Advantages of Partitioning

- Makes large tables easier to manage.
- Can improve query performance through partition pruning.
- Simplifies archival and deletion of historical data.
- Can improve maintenance operations.
- Supports management of very large datasets.

## Disadvantages of Partitioning

- Adds database design complexity.
- Choosing the wrong partition key can cause uneven data distribution.
- Queries across multiple partitions may be expensive.
- Partition management requires additional maintenance.
- Partitioning does not automatically distribute data across multiple servers.

**Important:** Partitioning does not necessarily mean multiple servers. Multiple partitions can exist on the same database server.

---

# 8. What is Sharding?

**Sharding** is a horizontal database scaling technique in which a large dataset is divided into smaller subsets called shards and distributed across multiple database servers.

Each shard stores only a portion of the total dataset.

Unlike partitioning on a single database server, sharding distributes data across multiple machines.

### Example

Imagine your application has 100 million users.

Storing and processing all users on one database server may eventually become a bottleneck.

You divide users across four database servers.

| Shard | User IDs |
|---|---|
| Shard 1 | 1–25 Million |
| Shard 2 | 25–50 Million |
| Shard 3 | 50–75 Million |
| Shard 4 | 75–100 Million |

Each server stores a subset of the users.

### Sharding Architecture

```text
                Application
                     |
                     v
              Shard Router
                     |
          +----------+----------+
          |          |          |
          v          v          v
       Shard 1    Shard 2    Shard 3
       Server 1   Server 2   Server 3
          |
          |
          +--------------------+
                               |
                               v
                            Shard 4
                            Server 4
```

The Shard Router determines which database server contains the required data.

## How Does Sharding Work?

A shard key determines where a record is stored.

Example:

```text
user_id = 101
```

Suppose you have four shards.

Use:

```text
Shard Number = HASH(user_id) % 4
```

The hash function generates a value, and modulo 4 determines the destination shard.

Example:

```text
user_id = 101
HASH(101) % 4 = 2

Record stored in Shard 2.
```

When the application searches for user 101, the router uses the same shard key to identify the correct database server.

## Types of Sharding

### 1. Range-Based Sharding

Data is distributed based on ranges of values.

```text
Shard 1: User IDs 1–1000

Shard 2: User IDs 1001–2000

Shard 3: User IDs 2001–3000
```

Advantage:
- Range-based queries can be efficient.

Disadvantage:
- Uneven distribution can occur.
- Frequently accessed ranges may become hotspots.

### 2. Hash-Based Sharding

A hash function determines the shard.

```text
Shard = HASH(user_id) % 4
```

Advantage:
- Generally distributes data more evenly.

Disadvantage:
- Range queries may need to access multiple shards.
- Changing the number of shards can require data redistribution with simple modulo-based schemes.

### 3. Geographic Sharding

Data is distributed based on geographical regions.

```text
Delhi Users     -> India Database

London Users    -> Europe Database

New York Users  -> US Database
```

Advantages:
- Can reduce latency for geographically distributed users.
- Helps with regional data residency requirements.

Disadvantages:
- Cross-region queries become complex.
- Data synchronization and consistency require careful design.

## Advantages of Sharding

- Supports horizontal database scaling.
- Distributes storage across multiple servers.
- Distributes query workloads.
- Can improve throughput.
- Avoids relying on a single database server's storage capacity.
- Can improve availability when combined with replication and failover.

## Disadvantages of Sharding

- Increased architectural complexity.
- Cross-shard JOINs are difficult or expensive.
- Distributed transactions are more complicated.
- Choosing the wrong shard key can create hotspots.
- Rebalancing data between shards can be expensive.
- Application routing and monitoring become more complex.

**Important:** Sharding does not automatically provide high availability. Replication and failover mechanisms are generally needed to protect against individual shard failures.

---

# 9. Partitioning vs Sharding

This is an important System Design interview topic.

Both techniques divide large datasets into smaller pieces, but their infrastructure differs.

| Feature | Partitioning | Sharding |
|---|---|---|
| Meaning | Dividing a dataset into smaller partitions | Dividing a dataset across multiple database servers |
| Infrastructure | Can exist on one server | Distributed across multiple servers |
| Main Purpose | Data organization and query optimization | Horizontal database scaling |
| Data Location | Partitions may exist on the same server | Shards exist on different database instances or servers |
| Complexity | Relatively lower | Higher |
| Scaling | Does not inherently add machine capacity | Adds database machines and capacity |
| Routing | Database manages partition selection | Router or application identifies the shard |
| Example | Orders divided by year | Users divided across four database servers |

### Diagram

**Partitioning:**

```text
       Database Server 1
               |
          Orders Table
               |
       +-------+-------+
       |       |       |
       v       v       v
    Part 1  Part 2  Part 3
```

**Sharding:**

```text
          Shard Router
               |
       +-------+-------+
       |       |       |
       v       v       v
    Server 1 Server 2 Server 3
       |       |       |
       v       v       v
    Shard 1 Shard 2 Shard 3
```

**Remember:**

- Partitioning = Divide data into smaller pieces.
- Sharding = Distribute those pieces across multiple database servers.

Sharding is essentially horizontal partitioning across machines.

---

# 10. Indexing vs Partitioning vs Sharding

These three concepts solve different database problems.

| Feature | Indexing | Partitioning | Sharding |
|---|---|---|---|
| Main Purpose | Faster data retrieval | Divide large tables into smaller pieces | Distribute data across servers |
| Changes Data Storage | Adds a separate lookup structure | Divides a table into partitions | Divides data across database servers |
| Improves Reads | Yes, for suitable queries | Yes, for queries that can prune partitions | Can distribute query workload |
| Improves Write Capacity | Usually not; indexes add write overhead | Can help certain maintenance workloads | Can increase aggregate write capacity |
| Adds Servers | No | Not necessarily | Yes, across multiple database servers |
| Complexity | Low to moderate | Moderate | High |
| Example | Index on email | Orders divided by year | Users distributed across four servers |

### Can We Use All Three Together?

Yes!

A large-scale application can use:

1. Indexing to find records faster.
2. Partitioning to organize large tables.
3. Sharding to distribute data across multiple servers.

They are not mutually exclusive.

---

# 11. Real-World Example: Designing an E-Commerce Database

Imagine you are designing an e-commerce application like Amazon.

The application has:

- 100 million users.
- 500 million orders.
- Millions of products.
- Millions of searches every day.

You can use different database optimization techniques.

### Step 1: SQL Database

Use PostgreSQL for transactional data such as:

- Orders
- Payments
- Inventory
- Customer records

### Step 2: Indexing

Create indexes on frequently searched columns.

```sql
CREATE INDEX idx_users_email
ON Users(email);

CREATE INDEX idx_orders_user_id
ON Orders(user_id);
```

This improves suitable lookup queries.

### Step 3: Partitioning

Partition the Orders table by order date.

```text
Orders Table
     |
     +---- Orders 2024
     |
     +---- Orders 2025
     |
     +---- Orders 2026
```

This helps manage large historical datasets.

### Step 4: Sharding

When one database server is no longer sufficient, distribute users or orders across multiple database servers.

```text
                 Application
                      |
                      v
                Database Router
                      |
           +----------+----------+
           |          |          |
           v          v          v
        Shard 1    Shard 2    Shard 3
        Server 1   Server 2   Server 3
```

### Step 5: Replication

Maintain additional copies of database data on replica servers.

```text
             Primary Database
                    |
          +---------+---------+
          |                   |
          v                   v
       Replica 1           Replica 2
       (Read)              (Read)
```

Replication can improve read scalability and availability, depending on the configuration.

---

# 12. SDE-3 Quick Revision

| Concept | Meaning |
|---|---|
| SQL | Relational database using tables |
| NoSQL | Non-relational database using different data models |
| ACID | Atomicity, Consistency, Isolation, Durability |
| Indexing | Speeds up data retrieval |
| Full Table Scan | Examining rows throughout a table to find matching records |
| B-Tree | Tree-based structure commonly used for database indexes |
| Partitioning | Dividing a large table into smaller partitions |
| Partition Pruning | Skipping irrelevant partitions during a query |
| Sharding | Distributing data across multiple database servers |
| Shard Key | Determines where a record is stored |
| Shard Router | Directs requests to the appropriate shard |
| Replication | Maintaining copies of data on multiple servers |
| Denormalization | Duplicating or combining data to optimize read access |
| Normalization | Organizing relational data to reduce redundancy |
| Hotspot | A particular server or partition receiving disproportionate traffic |

---

# 13. Important Interview Questions

### Q1. Why would you choose SQL over NoSQL?

When relationships, complex queries, transactional consistency and data integrity are important, I would generally prefer SQL.

### Q2. Why would you choose NoSQL over SQL?

When flexible data structures, document-oriented access patterns and distributed horizontal scaling are important, NoSQL may be a better choice.

### Q3. What happens if we don't use indexing?

The database may perform full table scans, examining many records to find matching data. This can increase query execution time as the dataset grows.

### Q4. Can indexing slow down a database?

Yes. Every INSERT, UPDATE or DELETE operation may require index maintenance. Too many indexes increase write overhead and storage consumption.

### Q5. Why do we need partitioning?

Partitioning divides large tables into manageable pieces. It can improve query performance through partition pruning and simplify data maintenance.

### Q6. Why do we need sharding?

When a single database server cannot efficiently handle the application's storage or workload requirements, sharding distributes data across multiple database servers.

### Q7. Is partitioning the same as sharding?

No. Partitioning divides data into smaller pieces, potentially on the same server. Sharding distributes those pieces across multiple database servers.

### Q8. What is a shard key?

A shard key is the field or combination of fields used to determine which shard stores a particular record.

### Q9. Can SQL databases be sharded?

Yes. PostgreSQL and MySQL databases can be deployed in sharded architectures using suitable extensions, middleware or application-level routing.

### Q10. Can NoSQL databases support ACID transactions?

Yes. NoSQL does not mean transactions are impossible. For example, MongoDB supports multi-document ACID transactions.

---

# 14. Final Interview Summary

- **SQL vs NoSQL:** Choose based on data relationships, consistency, flexibility and access patterns.
- **Indexing:** Makes data retrieval faster by creating an optimized lookup structure.
- **Partitioning:** Divides large tables into smaller logical or physical partitions.
- **Sharding:** Distributes database data across multiple servers for horizontal scaling.
- **Replication:** Maintains copies of data to improve availability and read scalability.
- **Normalization:** Reduces redundant data.
- **Denormalization:** Combines or duplicates data to optimize read-heavy workloads.

**System Design Approach:**

Start with a database that satisfies the application's requirements.

As the dataset and workload grow:

1. Optimize queries.
2. Add appropriate indexes.
3. Introduce caching.
4. Use partitioning for large tables.
5. Add read replicas when read traffic increases.
6. Introduce sharding when a single database server becomes a capacity bottleneck.

**Remember:** Do not introduce sharding or complex distributed database architecture prematurely. First identify the actual bottleneck and choose the simplest solution that addresses it.


# System Design: Load Balancer, Caching, Redis and Backend Architecture

## 1. Understanding the Diagram

The diagram represents a scalable web application architecture where multiple backend servers handle incoming requests, a load balancer distributes traffic, and a caching layer (Redis / Memcached) stores frequently accessed data.

### Components

1. UI (User Interface)
2. Load Balancer
3. Multiple Backend Servers (S1, S2, S3)
4. Cache (Redis / Memcached)
5. Database (DB)
6. Hot Data

### Main Objective

- Handle a large number of concurrent users.
- Distribute incoming traffic across multiple servers.
- Reduce database load.
- Improve response time.
- Avoid repeatedly querying the database for the same data.
- Improve application scalability.

---

## 2. Load Balancer

### What is a Load Balancer?

A Load Balancer is a component that distributes incoming network traffic across multiple backend servers.

Instead of sending every request to one backend server, it distributes requests among multiple available servers.

### Without a Load Balancer

Imagine an application has only one backend server.

```text
             Users
               |
               v
         Backend Server
               |
               v
            Database
```

Suppose 10,000 users send requests simultaneously.

All 10,000 requests reach the same backend server.

**Problems:**
- High CPU and memory utilization.
- Increased response time.
- Server may become overloaded.
- Application may become unavailable if the server crashes.
- Limited scalability.

### With a Load Balancer

Now imagine we have three backend servers.

```text
                 Users
                   |
                   v
             Load Balancer
                   |
          +--------+--------+
          |        |        |
          v        v        v
        S1       S2       S3
          |        |        |
          +--------+--------+
                   |
                   v
                Database
```

The load balancer distributes incoming requests across S1, S2 and S3.

Example:

| Incoming Requests | Server |
|---|---|
| Request 1 | S1 |
| Request 2 | S2 |
| Request 3 | S3 |
| Request 4 | S1 |
| Request 5 | S2 |
| Request 6 | S3 |

This is an example of Round Robin load balancing.

The actual distribution depends on the selected load-balancing algorithm.

### Why Do We Need a Load Balancer?

**1. Traffic Distribution**

Distributes requests across multiple backend servers instead of overloading one server.

**2. High Availability**

If one backend server fails, the load balancer can stop sending requests to that server and route traffic to healthy servers.

```text
              Load Balancer
                    |
          +---------+---------+
          |         |         |
          v         v         v
         S1        S2        S3
       (Alive)   (Failed)  (Alive)
          |                   |
          +-------------------+
```

Requests are distributed between S1 and S3.

**3. Horizontal Scaling**

When traffic increases, we can add more backend servers.

```text
Initially:

Load Balancer
      |
   +--+--+
   |     |
   S1    S2


After Scaling:

Load Balancer
      |
  +---+---+---+
  |   |   |   |
  S1  S2  S3  S4
```

**4. Health Checks**

A load balancer periodically checks whether backend servers are healthy.

If a server becomes unhealthy, traffic is redirected to healthy servers.

### Types of Load Balancing Algorithms

| Algorithm | Explanation |
|---|---|
| Round Robin | Distributes requests sequentially among servers. |
| Weighted Round Robin | Servers with higher capacity receive more requests. |
| Least Connections | Sends requests to the server with the fewest active connections. |
| IP Hash | Uses the client's IP address to determine the server. |
| Least Response Time | Prefers servers with lower response times, depending on implementation. |

### Advantages

- Improves availability.
- Prevents individual servers from becoming overloaded.
- Supports horizontal scaling.
- Improves traffic distribution.
- Helps with fault tolerance.

### Disadvantages

- Adds infrastructure and operational complexity.
- Can become a bottleneck if not designed for high availability.
- Introduces additional infrastructure costs.
- Session management may become complicated if the application stores session data locally on individual servers.

---

## 3. Caching

### What is Caching?

Caching is the process of temporarily storing frequently accessed data in a faster storage layer so that future requests can retrieve that data without repeatedly accessing the original data source.

In a typical web application, the database is slower to query than an in-memory cache.

Therefore, we store frequently requested data in a cache.

### Real-World Example

Imagine an e-commerce application.

Every user visits the homepage.

The homepage displays:
- Popular products.
- Trending products.
- Categories.
- Featured products.

Suppose 10,000 users visit the homepage.

**Without Caching:**

```text
User 1  -----> Database
User 2  -----> Database
User 3  -----> Database
User 4  -----> Database
User 5  -----> Database
...
User 10000 --> Database
```

Every request queries the database for the same popular products.

This creates unnecessary database load.

**With Caching:**

```text
                  Users
                    |
                    v
                 Backend
                    |
                    v
                   Cache
                    |
             +------+------+
             |             |
          Cache Hit     Cache Miss
             |             |
             v             v
         Return Data    Database
                           |
                           v
                       Store in Cache
                           |
                           v
                       Return Data
```

The first request retrieves data from the database and stores it in the cache.

Subsequent requests retrieve the same data directly from the cache.

### Why Do We Need Caching?

**1. Reduce Database Load**

Instead of querying the database repeatedly, we serve frequently requested data from the cache.

**2. Improve Response Time**

In-memory storage is generally much faster than disk-based database queries.

**3. Improve Throughput**

Since the database handles fewer repeated queries, the overall system can handle more requests.

**4. Reduce Infrastructure Costs**

Caching can reduce the database resources required to serve repeated read requests.

---

## 4. Cache Hit vs Cache Miss

### Cache Hit

A cache hit occurs when the requested data already exists in the cache.

Example:

```text
User requests product 101
          |
          v
       Backend
          |
          v
      Check Cache
          |
          v
    Product Found
          |
          v
     Return Data
```

The backend does not need to query the database.

### Cache Miss

A cache miss occurs when the requested data does not exist in the cache.

Example:

```text
User requests product 101
          |
          v
       Backend
          |
          v
      Check Cache
          |
          v
     Product Not Found
          |
          v
       Database
          |
          v
    Retrieve Product
          |
          v
     Store in Cache
          |
          v
      Return Data
```

The backend queries the database, retrieves the data, stores it in the cache and returns it to the user.

### Cache Hit Ratio

Cache hit ratio measures how frequently requested data is found in the cache.

**Formula:**

Cache Hit Ratio = (Cache Hits / Total Cache Requests) * 100

Example:

- Total cache requests = 1,000
- Cache hits = 800
- Cache misses = 200

Cache Hit Ratio = (800 / 1000) * 100

Cache Hit Ratio = 80%

A higher cache hit ratio generally means the cache is serving more requests successfully.

However, a high hit ratio does not automatically mean the caching strategy is optimal. Data freshness and correctness also matter.

---

## 5. Redis

### What is Redis?

Redis stands for Remote Dictionary Server.

Redis is an open-source, in-memory data store that supports different data structures.

It is commonly used as:

- A caching layer.
- A session store.
- A rate limiter.
- A message broker.
- A real-time data store.

Redis stores data primarily in memory (RAM), allowing very fast data access.

### Why is Redis Fast?

Traditional databases commonly retrieve persistent data using disk-based storage.

Redis primarily operates on RAM.

RAM access is significantly faster than disk access.

Therefore, Redis is useful when an application needs to retrieve frequently accessed data quickly.

### Redis Architecture

```text
             Backend Server
                    |
                    v
                  Redis
                    |
          +---------+---------+
          |                   |
          v                   v
       Cache Key           Cache Value

       product:101         iPhone 17
       user:101            Kartik
       category:5          Electronics
```

Redis stores information using keys and values.

Example:

```redis
SET product:101 "iPhone 17"

GET product:101

DEL product:101
```

These are Redis commands, not JavaScript functions.

### Redis Data Structures

Redis supports several data structures.

| Data Structure | Use Case |
|---|---|
| String | Simple key-value storage, counters, cached responses |
| List | Queues and ordered collections |
| Set | Unique values, tags, unique users |
| Sorted Set | Leaderboards and ranking systems |
| Hash | Storing objects with multiple fields |
| Stream | Event streaming and message processing |

Example:

```redis
SET user:1 "Kartik"

HSET user:2 name "Rahul" age 24

GET user:1

HGETALL user:2
```

### Redis TTL (Time To Live)

TTL determines how long a key remains in Redis before it expires.

Example:

```redis
SET product:101 "iPhone 17" EX 300
```

Here:

- product:101 = Key
- iPhone 17 = Value
- EX 300 = Expiration after 300 seconds (5 minutes)

**Why do we need TTL?**

Imagine a product's price changes in the database.

If the old price remains in the cache indefinitely, users may see outdated information.

TTL helps limit how long cached information remains available.

However, TTL alone does not guarantee that cached data is always fresh.

---

## 6. Redis vs Memcached

Both Redis and Memcached are commonly used as in-memory caching technologies.

| Feature | Redis | Memcached |
|---|---|---|
| Storage | In-memory | In-memory |
| Data Structures | Strings, Lists, Sets, Hashes, Sorted Sets, Streams | Primarily simple key-value data |
| Persistence | Supports persistence | No built-in persistence |
| Replication | Supported | No native replication |
| TTL | Supported | Supported |
| Use Cases | Caching, sessions, counters, queues, etc. | Simple distributed caching |
| Complexity | More features and configuration options | Simpler caching model |

### When to Use Redis?

Use Redis when:

- You need advanced data structures.
- You need session storage.
- You need counters or rate limiting.
- You need caching with additional capabilities.
- You need persistence or replication features.

### When to Use Memcached?

Use Memcached when:

- You need straightforward key-value caching.
- Your use case does not require advanced data structures.
- You want a relatively simple distributed cache.

---

## 7. How Redis Works With a Backend and Database

This is the most important part of the diagram.

Consider a MERN application.

### Architecture

```text
                  USER
                    |
                    v
                FRONTEND
                    |
                    v
              LOAD BALANCER
                    |
          +---------+---------+
          |         |         |
          v         v         v
        Node 1    Node 2    Node 3
          |         |         |
          +---------+---------+
                    |
                    v
                 REDIS
                    |
              Cache Miss?
                    |
                    v
                DATABASE
                 MongoDB
```

### Step-by-Step Request Flow

Suppose a user requests:

GET /products/101

**Step 1: User sends a request**

The frontend sends an HTTP request to the backend.

**Step 2: Load Balancer receives the request**

The load balancer selects an available backend server.

For example, Node Server 2.

**Step 3: Backend checks Redis**

The backend checks whether product 101 exists in Redis.

```js
const cachedProduct = await redis.get("product:101");
```

**Step 4: Check whether data exists**

If data exists:

```js
if (cachedProduct) {
    return res.json(JSON.parse(cachedProduct));
}
```

This is a CACHE HIT.

The backend returns the cached data without querying MongoDB.

**Step 5: If data does not exist**

If Redis does not contain the product, the backend queries MongoDB.

```js
const product = await Product.findById("101");
```

This is a CACHE MISS.

**Step 6: Store the result in Redis**

After retrieving the product from MongoDB:

```js
await redis.set(
    "product:101",
    JSON.stringify(product),
    "EX",
    300
);
```

The product is stored in Redis for 300 seconds.

**Step 7: Return the response**

The backend returns the product to the frontend.

The next user requesting the same product may receive the response directly from Redis.

---

## 8. What is Hot Data?

Hot data refers to data that is accessed very frequently by users or applications.

Examples:

- Trending products.
- Popular videos.
- Frequently accessed user profiles.
- Homepage content.
- Popular posts.
- Frequently requested configuration data.

Cold data refers to data that is accessed infrequently.

### Example

Imagine an e-commerce platform:

| Data | Access Frequency | Category |
|---|---|---|
| Trending products | Very High | Hot Data |
| Popular categories | High | Hot Data |
| Old product listings | Low | Cold Data |
| Archived orders | Very Low | Cold Data |

### Why Cache Hot Data?

Suppose 50,000 users request the same trending product.

Without caching, the database may receive 50,000 similar queries.

With caching:

```text
50,000 User Requests
         |
         v
       Redis
         |
         v
    Cached Product
         |
         v
     Return Data
```

The database does not need to execute the same read query for every request.

This reduces database load significantly.

---

## 9. Cache Invalidation

Cache invalidation means removing or updating cached data when the original data changes.

This is important because cached data can become outdated.

Example:

Suppose a product price is ₹50,000.

Redis stores:

```text
product:101 = ₹50,000
```

Now the product price changes to ₹45,000 in MongoDB.

If Redis still contains ₹50,000, users may receive the old price.

We need a strategy to keep the cache consistent with the database.

### Common Cache Invalidation Strategies

| Strategy | Explanation |
|---|---|
| TTL | Cache automatically expires after a specified time. |
| Cache Deletion | Delete the cached key when database data changes. |
| Cache Update | Update the cached value after a successful database update. |
| Write-Through | Update the database and cache as part of the write operation. |

### Example: Cache Deletion

```js
// Update product in MongoDB
await Product.findByIdAndUpdate(
    productId,
    { price: 45000 }
);

// Invalidate cached product
await redis.del(`product:${productId}`);
```

The next request will fetch the updated product from MongoDB and populate Redis again.

**Important:** Database updates and cache updates are not automatically atomic. Production systems need to consider failures between these operations.

---

## 10. What is AWS ElastiCache?

In your diagram, Redis / Memcached is written inside a box labelled ElastiCache.

Amazon ElastiCache is an AWS managed in-memory caching service.

It supports:

- Redis-compatible caching through ElastiCache for Valkey or Redis OSS.
- Memcached.

Instead of manually managing cache servers, AWS manages much of the infrastructure.

### Without ElastiCache

```text
Backend
   |
   v
Self-Managed Redis Server
   |
   v
RAM
```

You are responsible for managing the Redis infrastructure.

### With ElastiCache

```text
Backend
   |
   v
AWS ElastiCache
   |
   v
Managed In-Memory Cache
```

AWS handles many infrastructure responsibilities, depending on the configuration.

**Benefits:**

- Managed infrastructure.
- Monitoring and metrics.
- Replication and availability options.
- Easier infrastructure management.

Important distinction:

Redis is the caching technology.

ElastiCache is an AWS managed service that can run Redis OSS or Valkey-compatible caching engines.

---

## 11. Complete Architecture: How Everything Works Together

Let's combine all the concepts from the diagram.

```text
                         USERS
                           |
                           v
                     FRONTEND (UI)
                           |
                           v
                     LOAD BALANCER
                           |
               +-----------+-----------+
               |           |           |
               v           v           v
             SERVER 1    SERVER 2    SERVER 3
               |           |           |
               +-----------+-----------+
                           |
                           v
                      BACKEND LOGIC
                           |
                           v
                     CHECK REDIS CACHE
                           |
                  +--------+--------+
                  |                 |
                  v                 v
               CACHE HIT        CACHE MISS
                  |                 |
                  v                 v
             RETURN DATA       QUERY DATABASE
                                    |
                                    v
                              FETCH DATA
                                    |
                                    v
                              STORE IN REDIS
                                    |
                                    v
                               RETURN DATA
                                    |
                                    v
                              FRONTEND (UI)
```

### Complete Request Lifecycle

1. A user sends a request from the UI.
2. The load balancer receives the incoming request.
3. It forwards the request to an available backend server.
4. The backend processes the request.
5. The backend checks Redis for the requested data.
6. If Redis contains the data, it returns the cached result.
7. If Redis does not contain the data, the backend queries the database.
8. The database returns the requested data.
9. The backend stores the result in Redis with an appropriate TTL.
10. The backend sends the response to the frontend.

---

## 12. Important Interview Questions

### Q1. Why do we need Redis if we already have a database?

A database is designed for persistent data storage and querying.

Redis provides fast in-memory access to frequently requested data.

Redis reduces repeated database queries, improves response times and reduces database load.

### Q2. Does every request go through Redis?

Not necessarily.

The application checks Redis for data that is suitable for caching.

Some requests directly access the database, especially when they require fresh data or complex database operations.

### Q3. Does Redis replace MongoDB?

No.

Redis and MongoDB have different primary purposes.

| Redis | MongoDB |
|---|---|
| Primarily in-memory data store | Document-oriented database |
| Commonly used for caching | Commonly used for persistent storage |
| Very fast key-based access | Supports flexible document queries |
| Data can expire using TTL | Data is generally retained persistently |

Redis is commonly used alongside MongoDB.

### Q4. What happens if Redis goes down?

The application may fall back to querying the database if the application is designed to handle cache failures.

However:

- Database load can increase significantly.
- Response times may increase.
- The database may become overloaded.

Therefore, applications should implement graceful cache-failure handling.

### Q5. Can multiple backend servers share one Redis cache?

Yes.

Multiple backend servers can connect to the same Redis deployment.

```text
       Node Server 1
             |
       Node Server 2 ------ REDIS
             |
       Node Server 3
```

This is particularly useful when horizontally scaling backend servers.

### Q6. Why not store everything in Redis?

Redis primarily uses RAM, which is more expensive per GB than typical persistent storage.

Storing everything in Redis can increase infrastructure costs.

Also, not all data needs extremely fast access.

We generally cache frequently accessed data rather than blindly caching everything.

### Q7. Is Redis a database or a cache?

Redis is an in-memory data store.

It can be used as a database, cache, message broker and more.

Its role depends on how the application uses it.

---

## 13. Quick Revision

| Concept | Meaning | Main Purpose |
|---|---|---|
| Load Balancer | Distributes traffic across servers | Scalability and availability |
| Backend Server | Processes application requests | Business logic |
| Database | Stores persistent application data | Data persistence |
| Cache | Stores frequently accessed data | Faster retrieval |
| Redis | In-memory data store | Fast data access |
| Memcached | In-memory key-value cache | Simple caching |
| Cache Hit | Data found in cache | Avoid database query |
| Cache Miss | Data not found in cache | Fetch from original source |
| Hot Data | Frequently accessed data | Good caching candidate |
| TTL | Time before a cache entry expires | Limit stale data |
| Cache Invalidation | Removing or updating outdated cache | Data consistency |
| ElastiCache | AWS managed caching service | Managed Redis/Valkey or Memcached |

## Remember These Three Things

1. **Load Balancer:** Distributes incoming traffic across multiple backend servers.

2. **Caching:** Stores frequently accessed data in a faster storage layer to avoid repeatedly querying the database.

3. **Redis:** An in-memory data store commonly used as a cache to improve application performance and reduce database load.

**Interview Takeaway:**

Load balancing helps scale request processing, while caching helps reduce the amount of work the database needs to perform.

Both can be used together to build scalable web applications.




<div id="topic-3"></div>

# System Design: Bus Seat Booking and Temporary Seat Reservation (RedBus Example)

## 1. Real-World Example

Consider a bus booking application like RedBus.

A user selects a seat (e.g., Seat A5) and proceeds to payment.

The application temporarily blocks the selected seat for 5–10 minutes so that another user cannot book the same seat while the first user is completing payment.

This is called **Temporary Seat Reservation / Seat Locking**.

Redis is commonly used to implement this because it supports fast in-memory operations and automatic key expiration through TTL.

---

## 2. How Does the System Work?

### Step 1: User Selects a Seat

The user selects Seat A5 for a particular bus and travel date.

The backend checks whether the seat is already booked or temporarily reserved.

### Step 2: Temporarily Lock the Seat in Redis

If the seat is available, the backend creates a temporary lock in Redis.

Example:

```text
Key: seat:BUS101:2026-11-20:A5
Value: user_123
TTL: 600 seconds (10 minutes)
```

Here:
- BUS101 = Bus ID
- 2026-11-20 = Journey date
- A5 = Seat number
- user_123 = User who reserved the seat
- TTL = 600 seconds (10 minutes)

Redis automatically expires the key after 10 minutes.

During this period, other users cannot reserve the same seat.

### Step 3: User Proceeds to Payment

Once the seat is temporarily locked, the user proceeds to the payment gateway.

```text
User
  |
  v
Select Seat A5
  |
  v
Backend Checks Availability
  |
  v
Lock Seat in Redis
  |
  v
TTL = 10 Minutes
  |
  v
Proceed to Payment
```

### Step 4: Check Payment Status

There are two possible scenarios.

#### Case A: Payment Successful

If payment is successful:

1. Payment gateway confirms successful payment.
2. Backend verifies the payment result.
3. Backend creates a permanent booking record in the database.
4. The temporary Redis lock is removed after the booking is safely confirmed.

```text
Payment Successful
        |
        v
Verify Payment
        |
        v
Save Booking in Database
        |
        v
Remove Temporary Redis Lock
        |
        v
Booking Confirmed
```

The database now contains the permanent booking information.

#### Case B: Payment Failed or Timeout

If payment fails or the user does not complete payment within 10 minutes:

1. The temporary Redis key expires automatically after its TTL.
2. The seat becomes available for other users, provided no permanent booking exists.
3. Another user can now reserve that seat.

```text
Payment Failed / Timeout
          |
          v
Temporary Redis Lock Expires
          |
          v
Seat Becomes Available
          |
          v
Another User Can Book
```

---

## 3. Complete Architecture

```text
                   USER
                     |
                     v
                FRONTEND UI
                     |
                     v
                LOAD BALANCER
                     |
                     v
                BACKEND SERVER
                     |
                     v
             CHECK SEAT AVAILABILITY
                     |
             +-------+-------+
             |               |
             v               v
        Seat Available    Seat Locked/
                          Already Booked
             |               |
             v               v
       Lock in Redis      Reject Request
             |
             v
        TTL = 10 Minutes
             |
             v
        PAYMENT GATEWAY
             |
       +-----+------+
       |            |
       v            v
   SUCCESS        FAILURE
       |            |
       v            v
 Verify Payment   Lock Expires
       |
       v
 Save Booking
 in Database
       |
       v
 Remove Redis Lock
       |
       v
 Booking Confirmed
```

---

## 4. Why Use Redis Instead of Directly Saving Temporary Locks in the Database?

| Redis | Database |
|---|---|
| Very fast in-memory operations | Generally slower for this use case |
| Supports automatic TTL expiration | Expiration usually needs additional logic or database features |
| Suitable for temporary seat locks | Suitable for permanent booking records |
| Reduces temporary lock-related database operations | Can increase database writes and cleanup work |

**Important distinction:**

- Redis is used for temporary seat reservations.
- The database is used for permanent confirmed bookings.
- Redis TTL automatically expires temporary locks.
- The database remains the source of truth for confirmed bookings.

---

## 5. Redis Commands Example

### Create a Temporary Seat Lock

```redis
SET seat:BUS101:2026-11-20:A5 user_123 NX EX 600
```

Explanation:

- SET = Create a Redis key.
- NX = Set only if the key does not already exist.
- EX 600 = Expire after 600 seconds.
- user_123 = User holding the temporary lock.

If the command succeeds, the seat is temporarily reserved.

If the key already exists, another user has already locked that seat.

### Check the Remaining Lock Time

```redis
TTL seat:BUS101:2026-11-20:A5
```

This returns the remaining time in seconds.

### Remove the Temporary Lock

```redis
DEL seat:BUS101:2026-11-20:A5
```

The lock should only be removed after verifying that the current user owns it and the booking process is safely completed or cancelled.

---

## 6. Important System Design Considerations

### A. Prevent Double Booking

Imagine two users try to book Seat A5 simultaneously.

Without proper locking:

- User 1 checks availability.
- User 2 checks availability.
- Both see the seat as available.
- Both proceed with payment.
- Both may attempt to book the same seat.

This creates a double-booking problem.

Redis NX provides an atomic way to acquire a temporary lock, ensuring that only one request successfully creates the lock.

### B. What If Payment Takes Longer Than 10 Minutes?

The Redis lock may expire while the payment is still being processed.

Another user could acquire the seat lock.

Therefore, the backend must handle lock expiration and payment confirmation carefully.

Possible approaches:
- Extend the lock using a controlled lease mechanism.
- Reject or refund a late payment if the seat has already been allocated.
- Verify seat availability again before confirming the booking.

### C. What If Payment Succeeds but the Database Fails?

This is an important failure scenario.

Payment succeeds, but the database is temporarily unavailable.

The application must not simply assume that the booking is confirmed.

It should:
- Record and track the payment transaction.
- Retry booking persistence safely.
- Use payment and booking idempotency.
- Reconcile successful payments with booking records.
- Refund the customer if the booking cannot ultimately be fulfilled.

### D. Atomic Lock Ownership

Never blindly delete a Redis lock.

For example, User 1's lock expires and User 2 acquires a new lock.

If User 1's delayed request executes DEL, it could accidentally delete User 2's lock.

Use a unique lock token and an atomic ownership check before deleting or extending a lock.

---

## 7. Final Understanding

| Component | Responsibility |
|---|---|
| Frontend | Allows the user to select a seat and make payment |
| Load Balancer | Distributes requests across backend servers |
| Backend | Handles booking logic and payment verification |
| Redis | Temporarily locks seats using TTL |
| Payment Gateway | Processes payment |
| Database | Stores permanent confirmed bookings |

**Remember:**

Redis handles temporary seat locking, while the database stores permanent bookings.

The 10-minute TTL ensures that abandoned reservations do not block seats indefinitely.

The system must also handle simultaneous requests, payment delays and failures to prevent double booking.




<div id="topic-4"></div>

# System Design: Bitly (URL Shortener)

## 1. Understanding Bitly

Bitly is a URL-shortening service that converts long URLs into short, shareable URLs.

Example:

**Original URL:**

https://www.amazon.in/electronics/mobile-phones/samsung-galaxy-s24-ultra

**Short URL:**

https://bit.ly/aB92xK

When someone clicks the short URL, the system redirects them to the original URL.

### What Are the Two Main Responsibilities of Bitly?

**1. URL Creation (Write Operation)**

- User submits a long URL.
- Backend generates a unique short alias.
- The long URL and short alias are stored in the database.
- The short URL is returned to the user.

**2. URL Redirection (Read Operation)**

- Someone clicks the short URL.
- Backend identifies the original URL using the short alias.
- Backend redirects the user to the original URL.
- The system also records click analytics.

### Why Is This System Read-Heavy?

Imagine:
- 1,000 users create short URLs.
- Those 1,000 URLs receive 1 million clicks.

The system performs:
- 1,000 URL creation operations.
- 1 million URL lookup and redirect operations.

Therefore, URL redirection happens much more frequently than URL creation.

This makes Bitly a read-heavy system.

---

# 2. Requirements

Before designing Bitly, we must clearly define what the system should do and how well it must perform.

## Functional Requirements

These describe the features users expect from the system.

- Shorten a given long URL into a unique, shorter alias.
- Redirect the user to the original URL when the shortened alias is accessed.
- Support optional expiry for short URLs.
- Track analytics such as number of hits, timestamps, country, device, and similar metrics (optional).
- Allow custom aliases so users can choose their own short codes (optional).

### Why These Functional Requirements Matter

| Requirement | Why It Matters |
|---|---|
| Unique short alias | Two different long URLs must never share the same alias. |
| Redirect | This is the main user-facing read path. |
| Expiry | Some links should become invalid after a date or duration. |
| Analytics | Product and marketing teams need click insights. |
| Custom aliases | Users often want readable links like `bit.ly/myportfolio`. |

## Non-Functional Requirements

These describe quality attributes of the system.

- **High availability:** The redirect service should remain available even during traffic spikes.
- **Low latency:** Clicking a short URL should redirect quickly.
- **Scalability:** The system must handle a large number of create and redirect requests.
- **Fault tolerance:** Failures in analytics or secondary components should not break redirection.
- **Consistency:** Users must always be redirected to the correct original URL.

### Why These Non-Functional Requirements Matter

Bitly is read-heavy. Millions of redirects can happen for a small number of created URLs.

Therefore:
- Redirect latency must stay low.
- Caching becomes important.
- Analytics should be asynchronous so it does not slow down redirects.
- Database design must prevent incorrect or duplicate mappings.

---

# 3. System Overview

At a high level, Bitly maps long URLs to short aliases and stores that mapping permanently.

Users interact with the system through:
- A web interface (React frontend), or
- An API

The backend:
1. Accepts a long URL.
2. Generates or accepts a short alias.
3. Stores the mapping in a database.
4. Serves redirects when short aliases are accessed.
5. Collects click analytics asynchronously.

```text
Long URL
   |
   v
Short Alias
   |
   v
Stored Mapping (Database)
   |
   v
Redirect + Analytics
```

The mapping is the core of the product. Everything else — Redis, Kafka, CDN, replicas — exists to make that mapping fast, reliable, and observable at scale.

---

# 4. High-Level Architecture

The system can be divided into the following layers:

## Frontend / UI Layer

A web interface or API client where users:
- Enter long URLs.
- Receive short aliases.
- Optionally view analytics and manage links.

## Backend Service

Handles business logic for:
- URL shortening.
- Redirection.
- Validation.
- Alias generation.
- Expiry checks.

## Database

Stores the permanent mapping between long URLs and short aliases.

## Cache (Redis)

Stores frequently accessed mappings so popular redirects do not hit the database every time.

## Load Balancer

Distributes incoming traffic across multiple backend instances for availability and scale.

### High-Level Architecture Diagram

```text
                USERS
                  |
                  v
             FRONTEND / API
                  |
                  v
            LOAD BALANCER
                  |
                  v
            BACKEND SERVICE
                  |
         +--------+--------+
         |                 |
         v                 v
       REDIS            DATABASE
    (hot mappings)   (permanent mappings)
         |
         v
   CLICK EVENTS (later via Kafka)
```

This high-level view is enough for interviews before diving into write flow, read flow, Base62, Redis, and Kafka.

---

# 5. Component Design

## 5.1 Frontend / UI

### Responsibilities

- Accept input for long URLs.
- Display the generated shortened URL.
- Optionally allow custom aliases and expiry settings.
- Provide analytics and management options if required.
- Call backend APIs such as `POST /shorten` and `GET /analytics/{shortUrl}`.

### Typical User Journey

1. User opens the web app.
2. User pastes a long URL.
3. Frontend sends `POST /shorten` to the backend.
4. Backend returns the short URL.
5. Frontend shows the short URL for copying and sharing.
6. Later, the user may open analytics for that short URL.

### Frontend Notes

- The frontend should validate basic URL format before calling the API.
- It should clearly show errors such as invalid URL or custom alias already taken.
- Static frontend assets (JS, CSS, images) can be served through a CDN for faster loads.
- The frontend does not perform Base62 encoding or database lookups. Those belong to the backend.

The backend service, APIs, database schema, Base62 alias generation, Redis caching, Kafka analytics, and scaling strategy are covered in the next sections.

---

# 6. Core Architecture

The architecture has two main flows:

1. Write Flow: Creating a short URL.
2. Read Flow: Redirecting a user to the original URL.

## A. Write Flow (URL Creation)

Suppose a user submits:

https://www.amazon.in/products/samsung-galaxy

The backend needs to generate a unique short alias.

### Step-by-Step Process

**Step 1: User submits a URL**

Frontend sends a POST request:

POST /shorten

Request body:

```json
{
  "longUrl": "https://www.amazon.in/products/samsung-galaxy"
}
```

**Step 2: Backend validates the URL**

The backend checks:
- Is the URL valid?
- Is it an allowed URL?
- Does it satisfy the application's requirements?

**Step 3: Generate a Unique ID**

The database generates a unique ID using its auto-increment mechanism.

Example:

```text
ID = 123456
```

**Step 4: Convert the ID into Base62**

Base62 uses 62 characters:

- 0–9 = 10 characters
- a–z = 26 characters
- A–Z = 26 characters

Total = 62 characters.

The generated numeric ID is encoded into Base62.

```text
123456 (Decimal)
      |
      v
    Base62
      |
      v
     W7E
```

The result is a shorter alias.

**Step 5: Store the Mapping in Database**

The database stores the relationship between the short alias and original URL.

| id | short_alias | long_url |
|---|---|---|
| 123456 | W7E | https://amazon.in/products/samsung-galaxy |

**Step 6: Return the Short URL**

Backend returns:

```json
{
  "shortUrl": "https://bit.ly/W7E"
}
```

The user can now share this short URL.

### Write Flow Diagram

```text
             USER
               |
               v
         Enter Long URL
               |
               v
           FRONTEND
               |
               v
         BACKEND SERVER
               |
               v
         Validate URL
               |
               v
       Generate Database ID
               |
               v
         Encode Base62
               |
               v
         Generate Alias
               |
               v
         Store in Database
               |
               v
       Return Short URL
```

---

# 7. Backend API Endpoints

These are the main endpoints required to build our Bitly-style application.

## A. POST /shorten

**Purpose:** Create a shortened URL.

Input:
- Long URL (required).
- Custom alias (optional).
- Expiry time (optional).

Example request:

```json
{
  "longUrl": "https://www.amazon.in/products/samsung-galaxy",
  "customAlias": "samsung",
  "expiryTime": "2026-12-31T23:59:59Z"
}
```

Here:
- longUrl = Original URL that needs shortening.
- customAlias = User-defined short alias.
- expiryTime = Date and time after which the short URL expires.

If the user does not provide a custom alias, the backend generates one automatically.

Example response:

```json
{
  "shortUrl": "https://bit.ly/W7E",
  "shortAlias": "W7E",
  "originalUrl": "https://www.amazon.in/products/samsung-galaxy",
  "expiryTime": "2026-12-31T23:59:59Z"
}
```

## B. GET /{shortUrl}

**Purpose:** Redirect the user to the original long URL.

Example:

```http
GET /W7E
```

Backend operations:

1. Extract the short alias (W7E).
2. Check Redis for the original URL.
3. If found, retrieve it from Redis.
4. If not found, query the database.
5. Check whether the URL has expired.
6. Return an HTTP redirect to the original URL.
7. Generate a click analytics event and send it to Kafka.

Example response:

```http
HTTP/1.1 302 Found
Location: https://www.amazon.in/products/samsung-galaxy
```

The browser automatically navigates to the original URL.

## C. GET /analytics/{shortUrl}

**Purpose:** Retrieve analytics for a particular shortened URL.

Example:

```http
GET /analytics/W7E
```

Possible response:

```json
{
  "shortAlias": "W7E",
  "totalClicks": 10000,
  "countries": {
    "India": 7000,
    "USA": 3000
  },
  "devices": {
    "Mobile": 7500,
    "Desktop": 2500
  }
}
```

This endpoint can return:
- Total clicks.
- Country-wise clicks.
- Device-wise clicks.
- Browser information.
- Referrer information.
- Click history over time.

### API Endpoint Summary

| Method | Endpoint | Purpose |
|---|---|---|
| POST | /shorten | Create a short URL |
| GET | /{shortUrl} | Redirect to original URL |
| GET | /analytics/{shortUrl} | Retrieve URL analytics |

---

# 8. Core Logic

## A. Generate Alias

The system needs to generate a unique alias for every long URL.

Process:

1. Generate a unique database ID.
2. Convert the ID into Base62.
3. Use the encoded value as the short alias.
4. Store the mapping in the database.

```text
Database ID
     |
     v
  Base62
     |
     v
 Short Alias
     |
     v
 bit.ly/W7E
```

### What If Two URLs Generate the Same Alias?

This is called a collision.

The system must ensure that every short alias is unique.

Possible solutions:

- Retry alias generation.
- Generate another unique ID.
- Append a random character if using a random alias-generation approach.
- Enforce a UNIQUE constraint on short_alias in the database.

The database uniqueness constraint is important because it protects against duplicate aliases even when multiple requests happen simultaneously.

## B. Redirection

When a user clicks a short URL:

1. Extract the alias.
2. Retrieve the corresponding long URL from Redis or the database.
3. Check expiry.
4. Redirect the user to the original URL.

## C. Custom Alias Handling

Users may want their own aliases.

Example:

```text
https://bit.ly/myportfolio
```

Instead of generating a random alias, the user provides `myportfolio`.

Backend must:
- Validate the alias format.
- Check whether it is already taken.
- Reserve it uniquely.
- Store it against the original URL.

If another user has already taken that alias, return an appropriate error.

Example:

```json
{
  "error": "Custom alias is already taken"
}
```

---

# 9. Database Design

We need to store the mapping between the original URL and its shortened alias.

## URLMappings Table

| Column | Data Type | Description |
|---|---|---|
| id | Primary Key (Auto-increment) | Unique ID for each URL |
| long_url | TEXT | Original URL |
| short_alias | VARCHAR | Unique shortened alias |
| creation_time | TIMESTAMP | Time when URL was created |
| expiry_time | TIMESTAMP, NULL | Expiry time of the short URL |
| hit_count | INTEGER | Number of redirects (optional) |

### Example Records

| id | long_url | short_alias | creation_time | expiry_time | hit_count |
|---|---|---|---|---|---|
| 1 | https://google.com | aB12 | 2026-11-17 | NULL | 500 |
| 2 | https://youtube.com | xY45 | 2026-11-17 | NULL | 1000 |
| 3 | https://amazon.in | pQ89 | 2026-11-17 | 2026-12-31 | 200 |

### Why Do We Need These Columns?

**id:**
- Unique identifier for every URL.
- Used to generate the Base62 alias.

**long_url:**
- Stores the original URL.
- This is where the short URL redirects.

**short_alias:**
- Stores the shortened identifier.
- Must be unique.

**creation_time:**
- Records when the short URL was created.

**expiry_time:**
- Determines when the short URL becomes invalid.
- NULL means the URL does not have an expiry time.

**hit_count:**
- Stores the number of redirects.
- Useful for basic analytics.

### Important Database Constraints

1. `id` must be a PRIMARY KEY.
2. `short_alias` must have a UNIQUE constraint.
3. `long_url` must not be NULL.
4. `expiry_time` should be nullable.
5. An index on `short_alias` helps retrieve URL mappings quickly.

Example SQL:

```sql
CREATE TABLE URLMappings (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    long_url TEXT NOT NULL,
    short_alias VARCHAR(20) UNIQUE NOT NULL,
    creation_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expiry_time TIMESTAMP NULL,
    hit_count BIGINT DEFAULT 0
);
```

### Important: Database ID vs Snowflake

For the database design described above, we use an auto-incrementing ID and encode it using Base62.

In a distributed architecture, Snowflake can be used as an alternative to database auto-incrementing IDs.

These are two different ID-generation approaches. We do not need to use both simultaneously.

---

# 10. Alias Generation: Base62

### Why Do We Need Base62?

Suppose the database generates:

```text
ID = 123456
```

We do not want to expose the entire numeric ID in the short URL.

Base62 converts the numeric ID into a shorter alphanumeric representation.

```text
Database ID
     |
     v
  Base62
     |
     v
  Short Alias
     |
     v
 bit.ly/W7E
```

### How Does Base62 Work?

Base62 uses 62 characters:

- 0–9
- a–z
- A–Z

Each character represents a digit in base 62.

For example:

```text
Decimal ID: 123456
Base62: W7E
```

The exact output depends on the Base62 encoding implementation and character ordering.

### Advantages

- Produces compact aliases.
- Uses letters and numbers.
- Supports a large number of unique aliases.
- Easy to use in URLs.

---

# 11. Read Flow (URL Redirection)

This is the most frequently executed operation in Bitly.

Suppose someone clicks:

https://bit.ly/W7E

The system needs to find the original URL and redirect the user.

### Step-by-Step Process

**Step 1: User clicks the short URL**

Browser sends:

```http
GET /W7E
```

**Step 2: Backend receives the request**

Backend extracts the alias:

```text
shortAlias = W7E
```

**Step 3: Check Redis Cache**

Before querying the database, the backend checks Redis.

```text
Key: url:W7E
Value: https://amazon.in/products/samsung-galaxy
```

**Step 4: Cache Hit or Cache Miss**

If the mapping exists in Redis:
- Retrieve the original URL.
- Avoid querying the database.
- Continue with the redirect.

If the mapping does not exist:
- Query the database.
- Retrieve the original URL.
- Check whether it has expired.
- Store the mapping in Redis.
- Continue with the redirect.

**Step 5: Redirect User**

Backend responds with an HTTP redirect.

Common status codes:

- 301: Permanent Redirect.
- 302: Temporary Redirect.

For our application, 302 is a reasonable default because it allows the redirect destination to remain changeable.

**Step 6: Send Analytics Event**

The backend also generates a click event containing information such as:

- Short URL ID.
- Timestamp.
- IP address or derived location.
- Device type.
- Browser information.
- Referrer.

This event is sent to Kafka for asynchronous processing.

### Read Flow Diagram

```text
              USER
                |
                v
       Click Short URL
                |
                v
         GET /W7E
                |
                v
         BACKEND SERVER
                |
                v
          CHECK REDIS
                |
         +------+------+
         |             |
         v             v
        HIT           MISS
         |             |
         |             v
         |          DATABASE
         |             |
         |             v
         |       Fetch Original URL
         |             |
         |             v
         |       Check Expiry
         |             |
         |             v
         |       Store in Redis
         |             |
         +------+------+
                |
                v
       Send Analytics Event
                |
                v
              KAFKA
                |
                v
        HTTP REDIRECT (302)
                |
                v
        ORIGINAL WEBSITE
```

Note: Analytics processing should happen asynchronously so that the redirect does not need to wait for analytics database writes.

---

# 12. Caching (Redis) - Hot URLs

### What is Hot Data in Bitly?

Hot URLs are short URLs that receive an unusually high number of clicks.

Example:

Imagine a celebrity shares a Bitly link on Instagram.

Within a few minutes:
- 100,000 users click the link.
- All requests ask for the same original URL.
- Without caching, the database receives repeated lookup queries.

This can create significant database load.

### Solution: Redis

Store frequently accessed URL mappings in Redis.

Example:

```text
Key: url:W7E

Value:
https://amazon.in/products/samsung-galaxy
```

When users request the same short URL:

```text
100,000 Requests
       |
       v
     Redis
       |
       v
 Cached URL Mapping
       |
       v
    Redirect
```

The database does not need to execute 100,000 identical lookup queries.

### Cache-Aside Strategy

Bitly can use the Cache-Aside pattern.

1. Backend checks Redis.
2. If data exists, return it.
3. If data does not exist, query the database.
4. Store the retrieved mapping in Redis.
5. Return the original URL.

### Redis TTL

We can assign an expiry time to cached URL mappings.

Example:

```redis
SET url:W7E "https://amazon.in/products/samsung-galaxy" EX 3600
```

The mapping remains in Redis for 3600 seconds (1 hour).

Important: Redis TTL is the cache expiration time, whereas the URL's expiry_time is the actual validity of the shortened URL. They are two different things.

The backend must always enforce the URL's actual expiry.

---

# 13. Kafka - Analytics Processing

## What is Kafka?

Apache Kafka is a distributed event-streaming platform.

In simple terms, Kafka allows one part of an application to generate events and another part to process those events asynchronously.

Instead of making the redirect API perform every analytics operation itself, it sends click events to Kafka.

Kafka stores these events in topics, allowing consumers to process them independently.

### Why Do We Need Kafka in Bitly?

Imagine 100,000 users click a short URL.

For every click, we want to record:
- Click count.
- Timestamp.
- Country or city.
- Device type.
- Browser.
- Referrer.

If the redirect API directly writes every analytics record to the database, it introduces additional work into the user's redirect request.

This can increase response time and database load.

**Solution: Kafka**

The redirect service sends click events to Kafka.

Kafka allows separate consumers to process those events without making the redirect API wait for analytics database operations.

### How Kafka Works in Bitly

```text
              USER
                |
                v
          Click Short URL
                |
                v
          BACKEND SERVER
                |
                v
          Fetch URL from Redis
                |
                v
          Send Click Event
                |
                v
              KAFKA
                |
         +------+------+
         |             |
         v             v
      Consumer 1    Consumer 2
         |             |
         v             v
    Click Counter   Analytics
         |           Processing
         |             |
         v             v
       Redis       Analytics DB
```

### Step-by-Step Process

**Step 1: User clicks the short URL**

A user clicks:

bit.ly/W7E

**Step 2: Backend retrieves the original URL**

Backend checks Redis and retrieves the original URL.

**Step 3: Backend generates a click event**

Example:

```json
{
  "shortAlias": "W7E",
  "timestamp": "2026-11-17T10:30:00Z",
  "country": "India",
  "device": "Mobile",
  "browser": "Chrome",
  "referrer": "Instagram"
}
```

**Step 4: Backend publishes the event to Kafka**

The event is published to a Kafka topic.

Example:

```text
Topic: url-click-events
```

Kafka stores the event so consumers can process it.

**Step 5: Kafka Consumers Process Events**

Consumer 1:
- Updates click counters.
- Maintains total clicks per short URL.
- Can aggregate counters in Redis.

Consumer 2:
- Processes location information.
- Groups clicks by country and city.
- Stores analytics in the analytics database.

Consumer 3:
- Processes device and browser information.
- Generates device-wise analytics.

**Step 6: Analytics Dashboard**

The frontend can request analytics from the backend.

Example:

```text
Short URL: W7E

Total Clicks: 100,000

Country:
India: 70,000
USA: 20,000
UK: 10,000

Devices:
Mobile: 75,000
Desktop: 25,000
```

The analytics data is processed and stored separately from the redirect operation.

---

# 14. Why Not Directly Store Every Click in the Database?

Consider 1 million clicks.

### Without Kafka

```text
1 Million Clicks
       |
       v
 Redirect Backend
       |
       v
 1 Million DB Writes
       |
       v
 Analytics Database
```

Problems:
- Additional database writes.
- Increased database load.
- Redirect API performs extra work.
- Analytics processing becomes tightly coupled with redirection.

### With Kafka

```text
1 Million Clicks
       |
       v
 Redirect Backend
       |
       v
      Kafka
       |
       v
  Kafka Consumers
       |
       v
 Batch / Aggregate Events
       |
       v
 Analytics Database
```

Benefits:
- Decouples analytics from URL redirection.
- Handles high-volume event streams.
- Allows asynchronous processing.
- Consumers can process events independently.
- Supports buffering and replaying events.
- Reduces the need for one database write per click.

### What is a Kafka Topic?

A topic is a named category in which Kafka stores events.

Example:

```text
url-click-events
```

All click events are published to this topic.

### What is a Kafka Producer?

A producer is an application component that sends events to Kafka.

In our system:

The URL Redirect Service acts as a Kafka producer.

### What is a Kafka Consumer?

A consumer reads and processes events from Kafka.

In our system:

Analytics services act as Kafka consumers.

### What is a Consumer Group?

A consumer group allows multiple consumers to work together to process partitions of a topic.

This helps distribute event processing across multiple consumers.

---

# 15. Batch Analytics Updates

Kafka and batching can work together.

Instead of writing every click individually to the analytics database, consumers can collect events and aggregate them.

Example:

Suppose 10,000 clicks happen within a short period.

Instead of performing 10,000 separate database writes:

1. Kafka receives the click events.
2. Consumers read the events.
3. Consumers aggregate clicks by URL, country and device.
4. Aggregated results are written to the analytics database in batches.

Example:

```text
Individual Events:

W7E -> India -> Mobile
W7E -> India -> Mobile
W7E -> USA   -> Desktop
W7E -> India -> Mobile
W7E -> USA   -> Desktop

             |
             v

Aggregated Data:

W7E:
    India:
        Mobile: 3

    USA:
        Desktop: 2
```

This reduces the number of database writes.

**Important:** Kafka does not automatically aggregate events. We implement aggregation in consumers or stream-processing applications.

Redis can also maintain frequently updated counters, while the analytics database stores longer-term aggregated information.

---

# 16. Database Architecture

We need to store URL mappings and analytics information.

### A. URLMappings Table

This table stores the original URL and its shortened alias.

| id | short_alias | long_url | creation_time | expiry_time | hit_count |
|---|---|---|---|---|---|
| 1 | aB12 | https://google.com | 2026-11-17 | NULL | 500 |
| 2 | xY45 | https://youtube.com | 2026-11-17 | NULL | 1000 |
| 3 | pQ89 | https://amazon.in | 2026-11-17 | 2026-12-31 | 200 |

### B. Analytics Table

| short_alias | country | device | clicks |
|---|---|---|---|
| aB12 | India | Mobile | 300 |
| aB12 | USA | Desktop | 100 |
| xY45 | India | Desktop | 500 |

Analytics data is stored separately so that heavy analytics processing does not unnecessarily affect URL lookup operations.

---

# 17. CDN (Content Delivery Network)

A CDN is a geographically distributed network of servers that delivers cached content closer to users.

In Bitly, a CDN can cache and serve:
- React frontend assets.
- CSS files.
- JavaScript bundles.
- Images.
- Static resources.

Example:

A user in India does not need to download frontend assets from a server located in the USA every time.

The CDN can serve cached assets from a nearby edge location.

**Important:** The CDN for frontend assets is different from Redis caching of URL mappings. Redirect responses can also be cached in suitable situations, but doing so requires careful consideration of link updates, expiration and analytics tracking.

---

# 18. Scaling the Database

Since redirects (reads) will far outnumber URL creations (writes), we need to optimize database access.

### A. Read-Write Separation

Because redirects are much more frequent than URL creations, we can route read queries to read-replica databases, keeping the primary database free for writes.

```text
              BACKEND
                 |
          +------+------+
          |             |
          v             v
        WRITES         READS
          |             |
          v             v
      PRIMARY DB    READ REPLICAS
```

- Primary database handles URL creation and updates.
- Read replicas handle URL lookup queries.

Note: Replication lag can cause newly created URLs to be temporarily unavailable on replicas. The system should account for this, for example by reading from the primary when necessary.

### B. Database Sharding

As our URL mapping table grows to billions of rows, partition the database so that no single database server becomes a bottleneck.

For example, shard by the first character of the short URL.

```text
Short Alias: W7E
       |
       v
 First Character = W
       |
       v
     Shard W
```

Different short-code ranges or hash values can be assigned to different shards.

---

# 19. Complete Bitly Architecture

```text
                         USERS
                           |
                           v
                      FRONTEND
                           |
                           v
                     LOAD BALANCER
                           |
                           v
                    BACKEND SERVERS
                           |
                 +---------+---------+
                 |                   |
                 v                   v
            WRITE FLOW           READ FLOW
                 |                   |
                 v                   v
          Validate URL           Check Redis
                 |                   |
                 v             +-----+-----+
          Generate DB ID       |           |
                 |             v           v
                 v            HIT         MISS
             Base62             |           |
                 |              |           v
                 v              |        Database
          Generate Alias         |           |
                 |               |           v
                 v               |       Fetch URL
          Store in DB             |           |
                 |               |           v
                 v               |       Check Expiry
          Return Short URL        |           |
                                  +-----+-----+
                                        |
                                        v
                                  Original URL
                                        |
                           +------------+------------+
                           |                         |
                           v                         v
                     HTTP REDIRECT              CLICK EVENT
                           |                         |
                           v                         v
                    ORIGINAL SITE                 KAFKA
                                                     |
                                        +------------+------------+
                                        |            |            |
                                        v            v            v
                                    Consumer 1  Consumer 2  Consumer 3
                                        |            |            |
                                        v            v            v
                                      Redis      Analytics DB  Device Stats
                                     Counters
                                        |
                                        v
                                 Analytics Dashboard
```

---

# 20. Technology Stack

Since we are building this using the MERN ecosystem:

| Component | Technology | Responsibility |
|---|---|---|
| Frontend | React.js | URL submission and analytics dashboard |
| Backend | Node.js + Express.js | URL creation, redirection and business logic |
| Database | MongoDB / PostgreSQL | Permanent URL mappings and analytics |
| Cache | Redis | Fast URL lookup and hot URL caching |
| Event Streaming | Apache Kafka | Asynchronous click-event processing |
| ID Generation | Database Auto-Increment | Unique URL mapping IDs |
| Encoding | Base62 | Convert numeric IDs into short aliases |
| CDN | Cloudflare / AWS CloudFront | Deliver frontend static assets |

---

# 21. Important Interview Questions

### Q1. Why is Bitly a read-heavy system?

Because URL redirection happens much more frequently than URL creation.

One short URL can receive millions of clicks but needs to be created only once.

### Q2. Why do we use Redis?

Redis caches frequently accessed URL mappings.

This avoids repeatedly querying the database for popular short URLs and improves redirect response time.

### Q3. Why do we use Kafka?

Kafka handles click analytics asynchronously.

Instead of making the redirect API perform analytics database writes, it publishes click events to Kafka, where separate consumers process them.

This reduces coupling between redirection and analytics processing.

### Q4. Does Kafka store the original URL?

No. In this architecture, the database stores the permanent URL mapping.

Kafka stores click events for asynchronous processing.

### Q5. Does Kafka replace Redis?

No.

| Redis | Kafka |
|---|---|
| In-memory data store | Distributed event-streaming platform |
| Used for caching | Used for event streaming |
| Stores frequently accessed URL mappings | Stores click events |
| Fast key-value lookups | Producers publish events and consumers process them |
| Supports TTL | Supports configurable event retention |

### Q6. Why not directly update click counts in MongoDB?

Directly updating the database for every click can create heavy write traffic.

Kafka allows us to buffer and process click events asynchronously.

Consumers can aggregate events and perform batch updates.

### Q7. Why use Base62?

Base62 converts numeric database IDs into compact alphanumeric aliases.

This makes URLs shorter and easier to share.

### Q8. What happens if Kafka goes down?

The redirect operation should not depend on successful analytics processing.

We can use durable event publishing, retries and a failure-handling mechanism so that analytics events are not silently lost.

The system should still prioritize completing the URL redirect.

### Q9. Can Redis and Kafka be used together?

Yes.

Redis handles fast URL lookups and counters, while Kafka handles asynchronous click-event processing.

They solve different problems and complement each other.

### Q10. What happens when a short URL expires?

The backend checks the expiry_time stored in the database.

If the URL has expired, it does not redirect the user and returns an appropriate response, such as HTTP 410 Gone.

The expired URL should also be removed from Redis or prevented from being served from the cache.

### Q11. Why do we need a unique constraint on short_alias?

Two users must never receive the same alias for different original URLs.

A UNIQUE constraint prevents duplicate aliases at the database level, even when multiple requests execute simultaneously.

### Q12. Why do we need a separate analytics endpoint?

URL redirection is a performance-critical operation.

Analytics queries may involve aggregation and larger datasets.

Keeping analytics separate prevents dashboard queries from unnecessarily affecting the redirect flow.

---

# 22. Quick Revision

| Concept | Purpose in Bitly |
|---|---|
| POST /shorten | Creates a short URL |
| GET /{shortUrl} | Redirects to original URL |
| GET /analytics/{shortUrl} | Retrieves URL analytics |
| URLMappings | Stores original URL and short alias |
| Auto-Increment ID | Generates unique database IDs |
| Base62 | Converts numeric IDs into short aliases |
| Redis | Caches frequently accessed URL mappings |
| Hot URLs | URLs receiving a very high number of clicks |
| Kafka | Processes click events asynchronously |
| Kafka Producer | Publishes click events |
| Kafka Consumer | Processes click events and analytics |
| Batch Processing | Aggregates events to reduce database writes |
| Read Replicas | Handle frequent URL lookup queries |
| Sharding | Distributes large URL mapping datasets |
| CDN | Serves frontend static assets closer to users |
| TTL | Controls how long cached mappings remain in Redis |
| Expiry Time | Determines when the actual short URL becomes invalid |

## Final Understanding

Bitly has three important operations:

**1. URL Creation:**

Long URL -> Validate -> Generate Database ID -> Base62 Encoding -> Store Mapping in Database -> Return Short URL.

**2. URL Redirection:**

Click Short URL -> Check Redis -> Database on Cache Miss -> Check Expiry -> Retrieve Original URL -> Redirect User.

**3. Analytics:**

Click Event -> Kafka -> Consumers -> Aggregation -> Redis Counters / Analytics Database -> Dashboard.

### Remember the Responsibility of Each Technology

- Base62 = Generate compact short aliases from numeric IDs.
- Redis = Retrieve frequently accessed URL mappings quickly.
- Database = Persist original URL mappings.
- Kafka = Process click events asynchronously.
- Consumers = Process analytics and aggregate click information.
- CDN = Deliver frontend static assets efficiently.

**Most Important Interview Point:**

Redis improves the speed of URL redirection, while Kafka separates analytics processing from the redirect request.

The database stores permanent URL mappings, Redis handles frequently accessed mappings, and Kafka handles the asynchronous analytics pipeline.

This allows the system to handle a large number of URL clicks without making every redirect wait for analytics database operations.



<div id="topic-5"></div>

# System Design: Live Video Commenting System (YouTube Live / Twitch)

## 1. Problem Statement

Design a highly scalable Live Video Commenting System where millions of users can watch a live video and exchange comments in real time.

Examples:
- YouTube Live Chat
- Twitch Chat
- Instagram Live Comments

The system must support millions of concurrent viewers and thousands of comments per second for a single live video.

The primary challenge is not just storing comments but broadcasting every new comment to millions of connected viewers with minimal latency.

---

# 2. Functional Requirements (FR)

Functional requirements describe WHAT the system should do.

## Core Requirements (In Scope)

| Requirement | Explanation |
|---|---|
| Post Comments | Viewers can post comments on a live video. |
| Real-Time Comments | Viewers can see new comments while watching the live video. |
| Historical Comments | Viewers can see comments posted before they joined the live stream. |

## Out of Scope

- Replying to specific comments (nested threads).
- Reacting to comments (likes, emojis).

---

# 3. Non-Functional Requirements (NFR)

Non-functional requirements describe HOW WELL the system should perform.

| Requirement | Explanation |
|---|---|
| Massive Scale | Support millions of concurrent viewers and thousands of comments per second per video. |
| High Availability | Prioritize availability over strong consistency. Eventual consistency is acceptable. |
| Low Latency | Broadcast comments to connected viewers in near real time, targeting less than 200ms. |

## Out of Scope

- Authentication and authorization.
- Content moderation and spam filtering.
- Hate speech detection and other content integrity checks.

---

# 4. High-Level Architecture

Before understanding individual components, let's understand how the entire system works.

## Architecture Diagram

```text
                   VIEWERS
                      |
                      v
              AKAMAI CDN / EDGE
                      |
                 +----+----+
                 |         |
                 v         v
             API Gateway  WebSocket
                 |         Gateway
                 |         |
                 v         v
              Comment   Active Viewer
               API      Connections
                 |
                 v
             KAFKA CLUSTER
                 |
          +------+------+
          |             |
          v             v
     Cassandra      Broadcast
     Consumer        Workers
          |             |
          v             v
      CASSANDRA      PUB/SUB
      DATABASE          |
                        v
                 WEBSOCKET GATEWAYS
                        |
                        v
                  MILLIONS OF
                  CONNECTED USERS
```

Additional components:

- GeoDNS / Anycast: Routes users to nearby regional infrastructure.
- Redis: Can maintain active video-to-gateway subscription information and other frequently accessed metadata.
- Akamai: Delivers video chunks and static assets through edge infrastructure.

## Component Responsibilities

| Component | Responsibility |
|---|---|
| Client / UI | Displays live video and comments. |
| GeoDNS / Anycast | Routes users to nearby infrastructure. |
| Akamai CDN | Delivers video chunks and static content. |
| API Gateway | Receives comment submission requests. |
| WebSocket Gateway | Maintains persistent connections with viewers. |
| Kafka | Buffers and distributes incoming comment events. |
| Cassandra | Persistently stores comments. |
| Broadcast Workers | Consume comment events and distribute them to viewers. |
| Redis (Optional) | Stores frequently accessed routing and subscription metadata. |

---

# 5. Database Layer: Apache Cassandra

## 5.1 What is Cassandra?

Apache Cassandra is a distributed NoSQL wide-column database designed to handle massive amounts of data across multiple servers.

It is particularly useful for:
- High write throughput.
- Horizontal scalability.
- Distributed data storage.
- High availability.
- Time-series workloads.

For a live commenting system, thousands of comments may arrive every second for a single video.

A traditional single-node database may struggle to handle this workload as traffic increases.

Cassandra allows us to distribute writes across multiple nodes.

## 5.2 Why Cassandra?

### 1. High Write Throughput

Cassandra is optimized for write-heavy workloads.

Our system continuously receives comments from millions of viewers.

Cassandra uses an LSM-Tree architecture, which makes sequential writes efficient.

### 2. Horizontal Scalability

We can add more Cassandra nodes to increase storage capacity and distribute workload.

```text
Initially:

      Cassandra Cluster
              |
          +---+---+
          |       |
         N1      N2


After Scaling:

      Cassandra Cluster
              |
      +-------+-------+
      |       |       |
      N1      N2      N3
```

Data is distributed across multiple nodes using partitioning and replication.

### 3. Decentralized / Masterless Architecture

Unlike traditional primary-replica architectures, Cassandra does not require one central master node for all writes.

Every node can coordinate requests.

Benefits:
- No single master bottleneck.
- Better fault tolerance.
- Distributed request handling.
- Easier horizontal scaling.

### 4. AP Characteristics

Under CAP theorem, a distributed system cannot simultaneously guarantee strong consistency, availability and partition tolerance during a network partition.

Our system prioritizes:

- Availability (A)
- Partition Tolerance (P)

Eventual consistency is acceptable because comments do not necessarily need to appear in exactly the same order for every viewer.

Cassandra supports tunable consistency levels, allowing us to choose consistency behavior according to the operation.

For example, lower consistency levels can favor availability and latency, while stronger levels provide stronger read/write guarantees.

Important: Cassandra is not simply an always-AP database. Its consistency behavior depends on configuration and the consistency level selected.

---

# 6. How Cassandra Handles Writes

One of Cassandra's biggest advantages is its write path.

To understand it, first understand two components:

1. Commit Log
2. MemTable

## 6.1 Commit Log

The Commit Log is an append-only disk log.

When a write arrives, Cassandra records the mutation in the Commit Log before acknowledging it (subject to the configured durability settings).

Instead of performing random disk updates, it appends data sequentially.

Sequential disk writes are generally more efficient than random disk seeks.

## 6.2 MemTable

A MemTable is an in-memory data structure that temporarily stores incoming writes.

After recording the mutation in the Commit Log, Cassandra updates the corresponding MemTable.

The MemTable allows efficient in-memory operations.

## Write Path

```text
       Incoming Comment
               |
               v
        Cassandra Node
               |
               v
          Commit Log
         (Disk Append)
               |
               v
           MemTable
             (RAM)
               |
               v
       Write Acknowledged
               |
               v
       MemTable Becomes Full
               |
               v
        Flush to Disk
               |
               v
           SSTable
```

### Step-by-Step

1. A comment arrives at a Cassandra node.
2. Cassandra appends the mutation to the Commit Log.
3. The mutation is inserted into the MemTable.
4. The write is acknowledged according to the configured consistency and durability requirements.
5. When the MemTable reaches its configured threshold, it is flushed to disk.
6. The flushed data becomes an immutable SSTable.

**Important:**

Cassandra does not need to update an existing disk record for every incoming comment.

It primarily appends writes to the Commit Log and stores them in memory before flushing them to immutable files.

This is why Cassandra is suitable for write-heavy workloads.

---

# 7. LSM-Tree (Log-Structured Merge-Tree)

Cassandra uses an LSM-Tree-based storage architecture.

An LSM-Tree is a data structure optimized for write-heavy workloads.

Instead of immediately modifying existing disk records, it accumulates writes in memory and periodically writes sorted immutable files to disk.

## How LSM-Tree Works

```text
         Incoming Writes
                |
                v
            MemTable
              (RAM)
                |
                v
          Flush to Disk
                |
                v
            SSTable 1
            SSTable 2
            SSTable 3
                |
                v
           Compaction
                |
                v
       Merged SSTables
```

### Important Components

**1. MemTable**

Stores recent writes in memory.

**2. SSTable (Sorted String Table)**

An immutable, sorted file written to disk when a MemTable is flushed.

Once created, an SSTable is not modified directly.

**3. Bloom Filter**

A probabilistic data structure used to determine whether an SSTable definitely does not contain a particular key.

It helps reduce unnecessary disk reads.

A Bloom filter can produce false positives, but not false negatives under normal operation.

**4. Compaction**

Cassandra periodically merges SSTables in the background.

During compaction:
- Multiple SSTables are merged.
- Duplicate or outdated versions of records are reconciled.
- Expired or deleted data can be cleaned up when safe.
- Tombstones can eventually be removed when Cassandra's safety conditions allow it.

### Why Is Compaction Needed?

Without compaction, Cassandra could accumulate many SSTables.

A read might need to check multiple files.

Compaction helps control the number and size of SSTables and improves storage efficiency.

### Why LSM-Tree for Live Comments?

Our system receives thousands of writes per second.

LSM-Trees optimize sequential writes and avoid expensive random disk updates.

This makes Cassandra suitable for continuous comment ingestion.

---

# 8. Cassandra Primary Key and Row Structure

A major challenge is retrieving historical comments for a specific video efficiently.

We need to:
- Fetch comments for a particular video.
- Retrieve comments in chronological order.
- Fetch comments within a specific time range.
- Avoid scanning the entire database.

For this, we use a Composite Primary Key.

## 8.1 Composite Primary Key

In Cassandra, a primary key consists of:

1. Partition Key
2. Clustering Columns

Example:

```sql
CREATE TABLE video_comments (
    video_id UUID,
    bucket TEXT,
    comment_timestamp TIMESTAMP,
    comment_id UUID,
    user_id UUID,
    comment_text TEXT,

    PRIMARY KEY (
        (video_id, bucket),
        comment_timestamp,
        comment_id
    )
) WITH CLUSTERING ORDER BY (
    comment_timestamp ASC,
    comment_id ASC
);
```

### Understanding the Key

| Component | Purpose |
|---|---|
| video_id | Identifies the live video. |
| bucket | Identifies the time bucket. |
| comment_timestamp | Orders comments chronologically. |
| comment_id | Uniquely distinguishes comments with the same timestamp. |

### Partition Key

```sql
(video_id, bucket)
```

The partition key determines which logical partition stores the data.

All comments belonging to the same video and time bucket are grouped together.

### Clustering Columns

```sql
(comment_timestamp, comment_id)
```

Clustering columns determine how rows are organized within a partition.

Here, comments are stored in chronological order.

The comment_id provides an additional ordering component when timestamps are equal.

## 8.2 Historical Comment Query

Suppose a viewer joins a live video and wants the latest 100 comments.

Example:

```sql
SELECT *
FROM video_comments
WHERE video_id = ?
AND bucket = ?
ORDER BY comment_timestamp DESC
LIMIT 100;
```

The query targets a specific partition and retrieves recent comments.

For a historical range spanning multiple buckets, the application queries the relevant buckets and merges the results.

**Important:** Cassandra queries should be designed around the primary key. We should not rely on unrestricted filtering across the entire table.

---

# 9. Partitioning and Sharding

## What is Sharding?

Sharding means distributing data across multiple machines or database partitions.

Instead of storing all comments on one database node, we distribute them across multiple nodes.

## Why Do We Need Sharding?

Imagine a celebrity starts a live stream.

Millions of users join simultaneously.

Thousands of comments arrive every second.

If all comments are written to one partition, that partition may become overloaded.

This is known as a Hot Partition.

## 9.1 Hot Partition Problem

```text
              LIVE VIDEO
                   |
                   v
              All Comments
                   |
                   v
             ONE PARTITION
                   |
                   v
               OVERLOADED
```

A single viral video can create a disproportionate amount of traffic.

We need to distribute this workload.

## 9.2 Sharding by Geography

We can distribute infrastructure across geographical regions.

Example:

```text
                  GLOBAL USERS
                       |
             +---------+---------+
             |         |         |
             v         v         v
           ASIA      EUROPE    AMERICA
             |         |         |
             v         v         v
          Cluster   Cluster   Cluster
```

Benefits:

- Users connect to nearby infrastructure.
- Regional traffic spikes are isolated.
- Network latency is reduced.
- Infrastructure can scale independently by region.

However, geographic partitioning alone does not solve a hot partition inside a region.

## 9.3 Sharding by Time Buckets

We can also divide comments into time-based buckets.

Example:

```text
Video ID: V101

10:00 - 10:05  -> Bucket 1
10:05 - 10:10  -> Bucket 2
10:10 - 10:15  -> Bucket 3
10:15 - 10:20  -> Bucket 4
```

Instead of storing the entire video's comments in one unlimited partition, we distribute them across time buckets.

Benefits:
- Partition sizes remain bounded.
- Historical queries can target specific time windows.
- Old data can be managed independently.
- Large datasets become easier to organize.

## 9.4 Combining Geography and Time Buckets

A possible partitioning strategy:

```text
          GLOBAL LIVE VIDEO
                  |
          +-------+-------+
          |               |
          v               v
       REGION A        REGION B
          |               |
      +---+---+       +---+---+
      |       |       |       |
      v       v       v       v
    10:00   10:05   10:00   10:05
    Bucket  Bucket  Bucket  Bucket
```

Example partition key:

```sql
PRIMARY KEY (
    (region, video_id, bucket),
    comment_timestamp,
    comment_id
)
```

This is a conceptual schema. Region-aware replication and routing must be designed separately from Cassandra's actual token-based partitioning.

### Important: Time Buckets Alone Are Not Enough

A celebrity stream can still generate thousands of writes per second inside one time bucket.

To distribute extremely hot videos further, we can introduce write shards.

Example:

```text
PRIMARY KEY (
    (video_id, bucket, shard_id),
    comment_timestamp,
    comment_id
)
```

Here, shard_id distributes comments across multiple logical partitions.

The application can assign comments to different shards.

The trade-off is that historical queries must read multiple shards and merge the results.

---

# 10. Kafka: Comment Ingestion and Fan-out

## What is Apache Kafka?

Apache Kafka is a distributed event streaming platform.

It is used to:
- Receive high volumes of events.
- Store events durably for a configured retention period.
- Allow multiple consumers to process events independently.
- Handle asynchronous processing.
- Decouple services.

In our system, every newly submitted comment becomes an event.

Kafka acts as a durable buffer between the comment API and downstream services.

## Why Do We Need Kafka?

Imagine 10,000 comments arrive every second.

The Comment API needs to accept incoming comments quickly.

If the API directly waits for:
1. Database storage.
2. Broadcasting to millions of viewers.

The request processing path becomes complicated and slower.

Instead, Kafka separates ingestion from downstream processing.

```text
             Comment API
                  |
                  v
                 Kafka
                  |
          +-------+-------+
          |               |
          v               v
      Cassandra       Broadcast
      Consumer         Workers
          |               |
          v               v
      Cassandra       WebSocket
      Database         Gateways
```

The API publishes the event to Kafka.

Two independent consumer paths process it:

1. Cassandra Consumer: Persists the comment.
2. Broadcast Workers: Distribute the comment to connected viewers.

## 10.1 Kafka Topics

Kafka stores events inside topics.

Example topic:

```text
live-video-comments
```

The topic can be divided into multiple partitions.

```text
Topic: live-video-comments

       +----------------+
       |   Partition 0  |
       +----------------+

       +----------------+
       |   Partition 1  |
       +----------------+

       +----------------+
       |   Partition 2  |
       +----------------+
```

Partitions allow Kafka to distribute data and consumer workload.

## 10.2 Partitioning Kafka by video_id

We can use video_id as the Kafka message key.

Example:

```text
Message Key: video_101
Message: Comment A

Message Key: video_101
Message: Comment B

Message Key: video_101
Message: Comment C
```

Kafka's partitioning strategy routes messages with the same key to the same partition, assuming the partition mapping remains stable.

This helps preserve ordering for a given key within that partition.

### Important Hot Partition Consideration

If a celebrity's video receives enormous traffic, using only video_id as the key may overload one Kafka partition.

A possible solution is:

```text
Kafka Key = video_id + shard_id
```

This distributes one video's comments across multiple partitions.

However, ordering across those partitions is no longer guaranteed.

We must decide whether strict ordering is required or whether timestamp-based ordering at the client is sufficient.

For this system, eventual consistency is acceptable, so limited ordering differences can be tolerated.

## 10.3 Kafka Consumer Groups

Kafka allows multiple consumers to process events independently.

Example:

```text
                 KAFKA
                   |
          +--------+--------+
          |                 |
          v                 v
    Consumer Group A   Consumer Group B
          |                 |
          v                 v
     Cassandra          Broadcast
      Service             Service
          |                 |
          v                 v
      Database          Viewers
```

Each consumer group independently reads the Kafka topic.

The Cassandra consumer stores comments.

The Broadcast consumer delivers comments to connected users.

This decouples persistence from real-time broadcasting.

---

# 11. Real-Time Communication: HTTP Polling vs WebSockets

The second diagram shows real-time comment delivery.

It mentions:
- HTTP polling.
- WebSockets.
- Server-Sent Events (SSE).

Let's understand their differences.

## 11.1 HTTP Polling

In HTTP polling, the client repeatedly sends requests to the server asking whether new comments are available.

Example:

```text
Client              Server
  |                    |
  |---- Request ------>|
  |<--- Response ------|
  |                    |
  |   Wait 2 Seconds   |
  |                    |
  |---- Request ------>|
  |<--- Response ------|
  |                    |
  |   Wait 2 Seconds   |
  |                    |
  |---- Request ------>|
```

### Problems with Polling

1. Repeated HTTP requests create overhead.
2. Most requests may return no new comments.
3. Additional network traffic is generated.
4. Comments may be delayed until the next polling request.
5. Millions of viewers create enormous request volume.

Example:

If 1 million viewers poll every 2 seconds:

1,000,000 / 2 = 500,000 requests per second.

This is unnecessary overhead for a real-time chat system.

## 11.2 WebSockets

WebSockets provide persistent, full-duplex communication between clients and servers.

Full-duplex means both client and server can send messages independently over the same connection.

Unlike HTTP polling, the client does not need to repeatedly request new comments.

The server can push new comments immediately.

### WebSocket Architecture

```text
       VIEWER CLIENT
             |
             | WebSocket Handshake
             v
       WEBSOCKET GATEWAY
             |
             | Persistent Connection
             |
             v
        Active Connection
```

### How It Works

1. Client initiates a WebSocket handshake using HTTP.
2. The server upgrades the connection to WebSocket.
3. The connection remains open.
4. The client can send comments through the connection.
5. The server can push new comments through the same connection.

### Why WebSockets?

| Feature | HTTP Polling | WebSockets |
|---|---|---|
| Connection | Repeated HTTP requests | Persistent connection |
| Communication | Request-response | Full-duplex |
| Server Push | Not native | Supported |
| Overhead | Higher for frequent polling | Lower per message after connection setup |
| Real-Time Suitability | Limited | Excellent |
| Large-Scale Chat | Less suitable | More suitable |

WebSockets are appropriate for our less-than-200ms broadcast target.

---

# 12. WebSocket Gateway Servers

## What is a WebSocket Gateway?

A WebSocket Gateway is a server responsible for maintaining persistent connections with viewers.

Imagine a live stream has 1 million concurrent viewers.

Each viewer establishes a WebSocket connection.

We cannot expect one server to handle every connection.

Therefore, we horizontally scale WebSocket Gateway servers.

```text
                 VIEWERS
                    |
          +---------+---------+
          |         |         |
          v         v         v
        WS-1      WS-2      WS-3
          |         |         |
          +---------+---------+
                    |
                    v
              Broadcast System
```

Each gateway maintains a subset of active viewer connections.

## 12.1 Video Subscription

When a viewer joins video V101:

1. The client connects to a WebSocket Gateway.
2. The client subscribes to video V101.
3. The gateway registers that connection as a subscriber of V101.
4. The gateway starts receiving broadcast events for V101.
5. New comments are pushed to that client.

Example:

```text
Video V101
    |
    +-------------------------+
    |                         |
    v                         v
  WS-1                      WS-2
    |                         |
    v                         v
  Viewer 1                  Viewer 3
  Viewer 2                  Viewer 4
  Viewer 5                  Viewer 6
```

Multiple gateways can contain viewers watching the same video.

## 12.2 Pub/Sub Routing

Pub/Sub means Publish/Subscribe.

A publisher sends a message to a channel.

Subscribers listening to that channel receive the message.

Example:

```text
             Broadcast Worker
                    |
                    v
             Publish Event
             Channel: V101
                    |
          +---------+---------+
          |         |         |
          v         v         v
        WS-1      WS-2      WS-3
          |         |         |
          v         v         v
       Viewers   Viewers   Viewers
```

The broadcast worker publishes the new comment.

All relevant gateway servers receive the event and forward it to their local WebSocket connections subscribed to V101.

Redis Pub/Sub can be used for this routing layer, or another distributed messaging mechanism can be used.

Important: Redis Pub/Sub is not durable. If a gateway is disconnected during publication, it may miss messages. Kafka remains the durable event log, while Pub/Sub is used for low-latency delivery.

---

# 13. Global Distribution: GeoDNS and Anycast

Our system supports millions of viewers globally.

If every user connects to one data center, network latency increases.

Example:

A user in India connects to a server in the United States.

The network round-trip time (RTT) may be significantly higher than connecting to a nearby Indian or Asian region.

We need to route users to nearby infrastructure.

## 13.1 GeoDNS

GeoDNS is a DNS-based routing technique that returns different server IP addresses depending on the user's geographical location.

Example:

```text
                 USER REQUEST
                       |
                       v
                    GeoDNS
                       |
          +------------+------------+
          |            |            |
          v            v            v
        INDIA        EUROPE        USA
          |            |            |
          v            v            v
       Asia DC      Europe DC     US DC
```

Benefits:
- Routes users to nearby infrastructure.
- Reduces network latency.
- Distributes regional traffic.
- Supports geographical traffic management.

## 13.2 Anycast

Anycast allows multiple geographically distributed servers to advertise the same IP address.

Network routing directs users to a nearby reachable location based on routing decisions.

```text
              SAME IP ADDRESS
                     |
          +----------+----------+
          |          |          |
          v          v          v
       India       Europe       USA
       Server      Server      Server
```

GeoDNS uses DNS responses for geographical routing.

Anycast uses network routing to select an appropriate destination.

Both can help direct users to nearby infrastructure.

---

# 14. Akamai CDN

## What is a CDN?

CDN stands for Content Delivery Network.

A CDN is a geographically distributed network of servers that delivers content from locations closer to users.

Akamai is a major CDN provider.

In our live video commenting architecture, Akamai can help with:

1. Static asset delivery.
2. Video chunk delivery.
3. Historical comment caching.
4. Edge TLS termination and connection management.

## 14.1 Static Asset Delivery

Our frontend contains:
- JavaScript files.
- CSS files.
- Images.
- Fonts.
- Other static resources.

Instead of every user downloading these assets from the origin server, Akamai can serve cached copies from nearby edge servers.

```text
             User
               |
               v
          Akamai Edge
               |
         Cache Hit?
          /       \
        Yes        No
         |          |
         v          v
      Return     Origin
      Asset      Server
```

This reduces origin server load.

## 14.2 Live Video Delivery (HLS / DASH)

Live video is generally delivered through segmented streaming protocols such as HLS or MPEG-DASH.

The video is divided into smaller chunks.

Example:

```text
Live Video
    |
    v
Video Encoder
    |
    v
HLS / DASH Chunks
    |
    v
Akamai CDN
    |
    +----------+----------+
    |          |          |
    v          v          v
  India      Europe       USA
 Viewer      Viewer      Viewer
```

Akamai distributes video chunks from edge locations closer to viewers.

This reduces origin bandwidth consumption and improves video delivery performance.

## 14.3 Historical Comment Caching

When a viewer joins an ongoing live stream, the application needs to show historical comments.

Instead of querying Cassandra every time, we can cache recent historical comment batches at the edge.

Example:

```text
         New Viewer Joins
                |
                v
          Akamai Edge
                |
          Cache Hit?
           /      \
         Yes       No
          |         |
          v         v
      Historical  Comment
      Comments     API
                    |
                    v
                 Cassandra
                    |
                    v
                Cache Result
                    |
                    v
                 Return
```

Historical comment payloads can be cached for a short period.

However, this should only apply to appropriately cacheable, non-personalized data.

## 14.4 TLS and WebSocket Connections

Akamai can support TLS termination and WebSocket proxying, depending on the selected product and configuration.

Benefits:
- Reduces TLS processing at origin infrastructure.
- Supports edge-level connection handling.
- Reduces some network overhead.
- Helps protect origin infrastructure.

Important: WebSocket connections must remain persistent through the CDN/proxy. They cannot be treated like ordinary cacheable HTTP responses.

Akamai does not replace the WebSocket Gateway. The gateway still manages application-level subscriptions and message delivery.

---

# 15. Complete Write Path: Posting a Comment

Now let's trace what happens when a viewer posts a comment.

Suppose a viewer sends:

"Hello everyone!"

on video V101.

### Write Path Diagram

```text
        VIEWER CLIENT
              |
              v
        AKAMAI / EDGE
              |
              v
         GEO ROUTING
              |
              v
          API GATEWAY
              |
              v
          COMMENT API
              |
              v
            KAFKA
              |
       +------+------+
       |             |
       v             v
  Cassandra      Broadcast
  Consumer        Workers
       |             |
       v             v
   CASSANDRA      PUB/SUB
   DATABASE          |
                     v
              WEBSOCKET GATEWAYS
                     |
                     v
                ALL VIEWERS
```

### Step-by-Step

**Step 1: User submits a comment**

The client sends a comment to the Comment API.

**Step 2: Geo routing**

The user is directed to nearby regional infrastructure.

**Step 3: API Gateway receives the request**

The API Gateway forwards the request to the Comment API.

**Step 4: Comment API creates an event**

The API generates:
- comment_id
- video_id
- user_id
- comment_text
- timestamp

**Step 5: Publish to Kafka**

The Comment API publishes the comment event to Kafka.

The event is acknowledged according to Kafka's producer durability configuration.

**Step 6: Cassandra Consumer**

The Cassandra Consumer reads the event and persists it in Cassandra.

**Step 7: Broadcast Worker**

The Broadcast Worker independently consumes the same event.

**Step 8: Publish to Pub/Sub**

The worker publishes the comment to the relevant video channel.

**Step 9: WebSocket Gateways**

All gateways with viewers subscribed to that video receive the event.

**Step 10: Deliver to viewers**

Each gateway pushes the comment to its connected viewers.

The comment appears in the live chat.

---

# 16. Complete Read and Broadcast Path

There are two different read scenarios.

1. A viewer joins an ongoing live stream and needs historical comments.
2. An already-connected viewer needs to receive new comments.

These should be handled separately.

## 16.1 Historical Comments (Catch-Up)

Suppose a viewer joins a stream at 10:15 AM.

The viewer should see comments posted before 10:15 AM.

### Flow

```text
          NEW VIEWER
               |
               v
          API Gateway
               |
               v
       Historical Comments API
               |
               v
          Cache / CDN
               |
          Cache Miss?
               |
               v
           Cassandra
               |
               v
        Return Recent Comments
               |
               v
           Frontend UI
```

### Steps

1. Viewer opens the live stream.
2. Client requests recent historical comments.
3. The application checks the cache.
4. If cached comments exist, return them.
5. Otherwise, query Cassandra for the required video and time buckets.
6. Return the historical comments in chronological order.
7. Establish or continue the WebSocket subscription for new comments.

## 16.2 Real-Time Broadcast

Once connected, the viewer should receive every new comment without repeatedly querying the API.

### Flow

```text
           KAFKA
              |
              v
       Broadcast Worker
              |
              v
          PUB/SUB
              |
      +-------+-------+
      |       |       |
      v       v       v
     WS1     WS2     WS3
      |       |       |
      v       v       v
   Viewers Viewers Viewers
```

### Steps

1. A new comment arrives in Kafka.
2. Broadcast Worker consumes the event.
3. Worker publishes the event to the video channel.
4. All relevant WebSocket Gateways receive it.
5. Gateways push the event to locally connected subscribers.
6. Viewers see the new comment in real time.

---

# 17. Latency: Achieving Less Than 200ms

Our target is to broadcast comments within 200ms.

The important thing is to minimize the time spent in each stage.

Example latency budget:

| Stage | Target Budget |
|---|---:|
| Client to API Gateway | 25ms |
| API processing and Kafka publishing | 25ms |
| Broadcast event processing | 30ms |
| Pub/Sub routing | 20ms |
| WebSocket Gateway to client | 50ms |
| Remaining network and processing overhead | 50ms |
| Total | 200ms |

These are illustrative budgets, not guaranteed performance figures.

### How Do We Achieve Low Latency?

1. Use nearby regional infrastructure.
2. Use persistent WebSocket connections.
3. Avoid HTTP polling.
4. Use Kafka for asynchronous event ingestion.
5. Keep broadcast workers lightweight.
6. Distribute WebSocket connections across multiple gateways.
7. Use efficient Pub/Sub routing.
8. Keep hot metadata and subscription information in memory.
9. Avoid waiting for Cassandra persistence before broadcasting when the durability policy permits it.

**Important:** The 200ms target should be measured as an end-to-end percentile, such as p95 or p99, rather than assuming every viewer will receive every comment within exactly 200ms.

---

# 18. Scaling to Millions of Concurrent Viewers

The biggest challenge is fan-out.

Suppose:
- 1 million concurrent viewers.
- One new comment arrives.
- Every viewer is watching the same video.

That single comment needs to be delivered to 1 million connections.

This is called Fan-out.

## Fan-out Architecture

```text
              ONE COMMENT
                   |
                   v
             BROADCAST WORKER
                   |
                   v
              PUB/SUB SYSTEM
                   |
       +-----------+-----------+
       |           |           |
       v           v           v
      WS1         WS2         WS3
       |           |           |
       v           v           v
   300K Users  350K Users  350K Users
```

Each WebSocket Gateway handles a subset of connected users.

The comment is delivered to all relevant gateways.

### Horizontal Scaling

When viewer connections increase, we add more WebSocket Gateway servers.

When comment ingestion increases, we scale Kafka consumers and Cassandra capacity.

When historical read traffic increases, we scale the read path and use caching.

Each layer can scale independently.

---

# 19. Important Architectural Trade-offs

| Decision | Benefit | Trade-off |
|---|---|---|
| Cassandra | High write throughput and distributed availability | More complex query modeling |
| Kafka | Durable buffering and independent consumers | Adds processing and delivery complexity |
| WebSockets | Low-latency server push | Persistent connections consume resources |
| Time Bucketing | Bounded partition sizes | Historical queries may need multiple buckets |
| Geographic Distribution | Lower network latency | Cross-region replication complexity |
| CDN | Reduced origin load and faster content delivery | Cache invalidation and configuration complexity |
| Pub/Sub | Fast message distribution | Traditional Pub/Sub is not durable |
| Write Sharding | Reduces hot partitions | Requires merging results and handling ordering |

---

# 20. Important Interview Questions

### Q1. Why Cassandra instead of MongoDB or MySQL?

Cassandra is optimized for distributed, write-heavy workloads and horizontal scalability.

Our system receives thousands of comments per second, so Cassandra's LSM-Tree write architecture and decentralized design are useful.

However, the best database depends on the workload, query patterns, operational requirements and consistency needs.

### Q2. Why Kafka if we already have Cassandra?

Cassandra stores comments persistently.

Kafka distributes comment events to multiple independent consumers.

Kafka separates ingestion from persistence and broadcasting.

They solve different problems.

### Q3. Why not directly broadcast comments from the API?

Direct broadcasting couples the API to the entire delivery infrastructure.

Kafka allows the API to publish an event once while independent consumers handle storage and broadcasting.

This improves decoupling and resilience.

### Q4. Why WebSockets instead of HTTP polling?

Polling repeatedly sends requests to check for new comments.

WebSockets maintain persistent connections and allow the server to push new comments immediately.

This reduces unnecessary request overhead and is more suitable for large-scale real-time communication.

### Q5. Why not use SSE?

Server-Sent Events (SSE) support server-to-client streaming over HTTP.

They are useful when communication is primarily one-way.

However, our application needs both:
- Client-to-server comment submission.
- Server-to-client comment broadcasting.

WebSockets provide full-duplex communication through one persistent connection.

### Q6. Why do we need Kafka if WebSockets already provide real-time communication?

Kafka and WebSockets solve different problems.

Kafka handles event ingestion, buffering, persistence and asynchronous consumption.

WebSockets handle real-time communication with connected clients.

Kafka is the internal event distribution layer.

WebSockets are the client delivery layer.

### Q7. Why do we need geographic partitioning?

Users located far from the origin experience higher network latency.

Regional infrastructure reduces network round-trip time and isolates regional traffic spikes.

### Q8. Why do we need time buckets in Cassandra?

Without time buckets, one live video could accumulate an extremely large partition.

Time buckets divide comments into smaller partitions and make historical queries more manageable.

### Q9. What happens if a WebSocket Gateway crashes?

Clients connected to that gateway lose their connections.

They should automatically reconnect to another healthy gateway.

After reconnecting, they can fetch missed historical comments and resume live subscriptions.

### Q10. What happens if Kafka is temporarily unavailable?

The Comment API may fail to publish events.

The system should use producer retries, appropriate timeouts and durable Kafka configuration.

It should not silently acknowledge comments that have not met the required durability guarantee.

### Q11. Can Kafka guarantee ordering?

Kafka preserves ordering within a partition.

It does not guarantee ordering across multiple partitions.

Using video_id as a key can preserve ordering for one video if all its events are routed to the same partition.

However, this can create hot partitions for extremely popular videos.

### Q12. Why is eventual consistency acceptable?

Different viewers may receive comments at slightly different times.

The system does not require every viewer to see every comment at precisely the same instant.

This allows us to prioritize availability, throughput and low latency.

---

# 21. Final Revision

| Technology / Concept | Why We Use It |
|---|---|
| Cassandra | Distributed, write-heavy comment storage |
| Commit Log | Durable sequential write logging |
| MemTable | In-memory write buffering |
| SSTable | Immutable on-disk storage |
| LSM-Tree | Optimized write architecture |
| Bloom Filter | Avoid unnecessary SSTable lookups |
| Compaction | Merge SSTables and clean obsolete data |
| Composite Primary Key | Efficient partitioning and time-range queries |
| Sharding | Distribute data across multiple nodes |
| Time Bucketing | Prevent unbounded partitions |
| Kafka | Durable asynchronous event ingestion |
| Consumer Groups | Independent event processing |
| WebSockets | Persistent, full-duplex communication |
| Pub/Sub | Distribute comments to multiple gateways |
| Redis | Fast routing metadata and optional Pub/Sub |
| GeoDNS | Geographical traffic routing |
| Anycast | Route traffic to nearby network endpoints |
| Akamai CDN | Edge delivery of static assets and video chunks |
| HLS / DASH | Segmented video streaming |
| Horizontal Scaling | Increase capacity by adding servers |

## Final Takeaway

The architecture separates three major responsibilities:

**1. Storage Layer — Cassandra**

Stores comments efficiently and supports historical comment retrieval.

**2. Event Processing Layer — Kafka**

Receives comment events and distributes them independently to storage and broadcasting services.

**3. Real-Time Delivery Layer — WebSockets**

Maintains persistent connections with millions of viewers and pushes new comments to them.

GeoDNS and Akamai improve geographical delivery, while sharding and horizontal scaling help the architecture handle massive traffic.

The central design principle is:

**Separate comment ingestion, persistent storage and real-time broadcasting so each component can scale independently.**





<div id="topic-6"></div>

# System Design: Real-Time Video Conferencing Platform (Zoom / Google Meet)

# 1. Problem Statement

Design a scalable, low-latency video conferencing platform similar to:

- Zoom
- Google Meet
- Microsoft Teams

The system should allow multiple users to join a meeting and communicate through real-time audio, video, screen sharing and text chat.

The system must support:
- Multiple participants in one meeting.
- Real-time audio and video communication.
- Screen sharing.
- In-meeting text chat.
- Meeting recording.
- Meeting invitations and notifications.
- Secure meeting access.
- Low-latency communication.

---

# 2. High-Level Architecture

Before understanding individual components, let's understand how the complete system works.

The architecture is divided into two major parts:

1. Control Plane
2. Media Plane

## 2.1 Control Plane

The Control Plane manages the application logic and meeting-related operations.

It handles:
- Authentication.
- Meeting creation.
- Participant management.
- Chat.
- Notifications.
- Recording management.
- Meeting metadata.

## 2.2 Media Plane

The Media Plane handles actual real-time audio and video communication.

It handles:
- Audio and video capture.
- WebRTC connections.
- Media transmission.
- Screen sharing.
- Audio/video forwarding.
- Audio/video mixing.

## 2.3 Complete Architecture Diagram

```text
                   CLIENT LAYER
       +-------------+-------------+
       |             |             |
       v             v             v
      WEB          MOBILE       DESKTOP
       |             |             |
       +-------------+-------------+
                     |
                     v
               WEBRTC ENGINE
                     |
          +----------+----------+
          |                     |
          v                     v
     CAMERA / MIC          MEDIA CAPTURE
          |                     |
          +----------+----------+
                     |
                     v
              API GATEWAY / EDGE
                     |
               LOAD BALANCER
                     |
          +----------+----------+
          |                     |
          v                     v
      CONTROL PLANE         MEDIA PLANE
          |                     |
    +-----+------+         +----+------+
    |     |      |         |           |
    v     v      v         v           v
   AUTH MEETING CHAT    SIGNALING    STUN/TURN
    |     |      |         |           |
    |     |      |         v           |
    |     |      |       WEBRTC        |
    |     |      |         |           |
    |     |      |         v           |
    |     |      |       SFU / MCU <---+
    |     |      |         |
    |     |      |         v
    |     |      |     PARTICIPANTS
    |     |      |
    |     |      v
    |     |   CASSANDRA
    |     |
    |     v
    |  POSTGRESQL
    |
    +-----> JWT / OAUTH

          NOTIFICATION SERVICE
                  |
                  v
              MESSAGE QUEUE
                  |
          +-------+-------+
          |               |
          v               v
        EMAIL            SMS
       PROVIDER         PROVIDER

          RECORDING SERVICE
                  |
                  v
              AWS S3
           / BLOB STORAGE
```

This diagram is a logical architecture. The control and media planes can use separate load balancers and network paths in production.

---

# 3. Client Layer

The client layer is the frontend application through which users interact with the conferencing platform.

### Supported Clients

1. Web browsers (Chrome, Firefox, Safari).
2. Mobile applications (Android / iOS).
3. Desktop applications (Windows / macOS).

All these clients provide a user interface to:
- Create meetings.
- Join meetings.
- Enable or disable microphones.
- Enable or disable cameras.
- Share screens.
- Send messages.
- View other participants.

## 3.1 Local Hardware Access

A video conferencing application needs access to the user's camera and microphone.

The browser or mobile application requests permission before accessing these devices.

Example:

When a user joins a Google Meet call:

1. The application requests camera permission.
2. The application requests microphone permission.
3. The device captures audio and video.
4. The WebRTC engine processes the captured media.
5. Audio and video are encoded before transmission.

### Example: Browser Camera Access

```javascript
const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
});

videoElement.srcObject = stream;
```

Here:

- getUserMedia() accesses the camera and microphone.
- video: true enables video capture.
- audio: true enables audio capture.
- The returned MediaStream contains the captured media tracks.

The application can then pass these tracks to WebRTC.

## 3.2 WebRTC Engine

### What is WebRTC?

WebRTC stands for Web Real-Time Communication.

It is a technology that enables real-time audio, video and data communication between browsers and applications.

It provides:
- Audio communication.
- Video communication.
- Screen sharing.
- Peer-to-peer communication.
- Real-time data channels.

WebRTC is designed for low-latency communication.

Unlike traditional video streaming, where users generally download video segments, WebRTC supports interactive real-time communication.

### Why Do We Need WebRTC?

Imagine 10 people joining a video conference.

Every participant needs to:
- Send their microphone audio.
- Send their camera video.
- Receive other participants' audio.
- Receive other participants' video.

WebRTC provides the media transport capabilities required for this communication.

### Important Point

WebRTC handles media transport, but it does not automatically manage the entire meeting.

We still need backend services for:
- Authentication.
- Meeting management.
- Participant management.
- Signaling.
- Media server selection.

---

# 4. Client-Side Caching

## What is Client-Side Caching?

Client-side caching means storing frequently required application data locally on the user's device.

Instead of repeatedly requesting the same information from the backend, the client can reuse locally stored data.

### Example

Suppose a user joins a meeting with 10 participants.

The client receives:

- Meeting ID.
- Meeting configuration.
- Participant information.
- User preferences.
- UI assets.
- Active session metadata.

This information can be retained locally for the duration of the meeting.

### Pin for the Session

In your architecture, "Pin for the Session" means keeping important meeting data available locally while the meeting is active.

Example:

```text
          User Joins Meeting
                  |
                  v
           Fetch Meeting Data
                  |
                  v
            Store Locally
                  |
                  v
          Active Meeting Session
                  |
          +-------+-------+
          |               |
          v               v
       Reuse Data     Update if Needed
```

### Why Do We Need It?

1. Reduces repeated API calls.
2. Improves UI responsiveness.
3. Reduces unnecessary network traffic.
4. Allows quick access to participant metadata.
5. Helps maintain a smoother meeting experience.

### What Should Be Cached?

| Data | Reason |
|---|---|
| Meeting ID | Required throughout the session |
| Participant Metadata | Display participant names and avatars |
| Meeting Configuration | Access meeting settings |
| UI Assets | Avoid repeated downloads |
| User Preferences | Remember microphone/camera settings |

Important: Session caching does not mean storing the entire meeting state permanently. Important changes must still be synchronized with the backend.

---

# 5. API Gateway

## What is an API Gateway?

An API Gateway is an entry point through which clients access backend APIs.

It receives incoming requests and routes them to the appropriate backend services.

In a video conferencing platform, it primarily handles control-plane API traffic.

Examples:

- Login requests.
- Create meeting requests.
- Join meeting requests.
- Fetch participant details.
- Send chat messages.
- Update meeting settings.

### Architecture

```text
             CLIENT
                |
                v
           API GATEWAY
                |
       +--------+--------+
       |        |        |
       v        v        v
      AUTH   MEETING    CHAT
     SERVICE SERVICE  SERVICE
```

## Responsibilities of API Gateway

### 1. Request Routing

The API Gateway identifies the requested API and forwards it to the appropriate backend service.

Example:

| Request | Destination |
|---|---|
| POST /login | Auth Service |
| POST /meetings | Meeting Service |
| GET /meetings/101 | Meeting Service |
| POST /chat | Chat Service |
| POST /recordings | Recording Service |

Note: Actual WebRTC media packets should not normally pass through the ordinary API Gateway.

Media traffic uses separate WebRTC networking paths.

### 2. Rate Limiting

Rate limiting controls how many requests a client can make within a particular time interval.

Example:

Suppose an unauthenticated user sends 10,000 login requests per second.

This could overload the backend.

The API Gateway can enforce:

```text
Maximum 10 Login Requests
Per Minute Per IP
```

If the limit is exceeded, additional requests are rejected or throttled.

Benefits:
- Prevents API abuse.
- Protects backend services.
- Helps mitigate certain DoS attacks.
- Controls excessive traffic.

### 3. SSL/TLS Termination

HTTPS encrypts communication between clients and servers using TLS.

SSL/TLS termination means the gateway or load balancer handles the TLS connection and decrypts incoming HTTPS traffic.

```text
       CLIENT
          |
          | HTTPS (Encrypted)
          v
   LOAD BALANCER / GATEWAY (SSL Termination)
          |
          | Plain HTTP / Unencrypted Internal Network
          v
      BACKEND SERVICES (Auth, Meeting, Triage)
```

Benefits:
- Offloads TLS processing from individual backend services.
- Centralizes certificate management.
- Simplifies backend communication.

#### How Disabling SSL / SSL Offloading Behind the Load Balancer Helps:
1. **Reduces Backend CPU Overhead**: Public-key cryptography (TLS handshake, encryption/decryption) is CPU intensive. By terminating SSL at the Load Balancer / API Gateway and forwarding plain HTTP to internal services inside a secure VPC, backend servers save 20%–35% CPU cycles.
2. **Deep Packet Inspection for Layer 7 Routing**: When SSL is terminated at the load balancer, the load balancer can read HTTP headers, paths, cookies, and JWT tokens in plain text. This allows intelligent content-based routing (e.g., routing `/meeting/join` to Meeting Service vs `/auth/login` to Auth Service).
3. **Optimized Connection Pooling**: The load balancer can keep long-lived persistent TCP connections (HTTP Keep-Alive) to backend servers without renegotiating TLS handshakes repeatedly, significantly reducing connection latency for authenticated requests.
4. **Simplified Horizontal Scaling**: Microservices do not need individual SSL certificates installed, rotated, or managed, allowing new backend replicas to spin up and register with the load balancer instantly.

Production systems should generally protect internal service communication too, using internal TLS or private VPC networks where appropriate.

### 4. Request Authentication

The API Gateway can validate JWTs before allowing requests to reach protected backend services.

However, services must still enforce their own authorization rules.

---

# 6. Load Balancer

## What is a Load Balancer?

A Load Balancer distributes incoming traffic across multiple backend server instances.

It prevents one server from receiving all incoming requests.

### Example

Suppose millions of users are joining meetings.

One backend server cannot efficiently handle every request.

We deploy multiple service instances.

```text
                 USERS
                   |
                   v
              LOAD BALANCER
                   |
          +--------+--------+
          |        |        |
          v        v        v
        Server 1 Server 2 Server 3
```

The load balancer distributes traffic among available servers.

### Why Do We Need It?

1. Traffic distribution.
2. Horizontal scaling.
3. High availability.
4. Health checks.
5. Fault tolerance.

## L4 vs L7 Load Balancer

| Feature | L4 Load Balancer | L7 Load Balancer |
|---|---|---|
| Layer | Transport Layer | Application Layer |
| Works With | TCP / UDP | HTTP / HTTPS |
| Routing | IP and port | URL, headers, hostnames |
| Processing | Less application-level processing | More application-level processing |
| Use Case | WebRTC media traffic and TCP connections | HTTP APIs and WebSocket routing |

### Stateful vs Stateless Traffic

**Stateless Control Plane Requests**

Examples:
- Create meeting.
- Fetch meeting details.
- Update user preferences.

These requests can generally be distributed across backend instances without requiring the same server every time.

**Stateful Signaling Connections**

WebSocket signaling connections remain persistent.

The load balancer must maintain the connection to the selected server.

It should not arbitrarily move an established connection to another instance.

If connection-level state is stored locally, reconnection and session recovery mechanisms are required.

---

# 7. Core Microservices

Our application uses microservices to separate different business responsibilities.

Each service handles a specific part of the application.

The main services are:

1. Auth Service.
2. Meeting Service.
3. Notification Service.
4. Chat Service.
5. Recording Service.
6. Media Management / Signaling Service.

---

# 8. Auth Service

## What is an Auth Service?

The Auth Service handles user authentication and authorization.

It verifies user identity and determines whether the user has permission to access a meeting.

### Technologies

- OAuth 2.0.
- JWT (JSON Web Token).

## 8.1 OAuth 2.0

OAuth 2.0 is an authorization framework.

It allows applications to obtain limited access to resources on behalf of a user.

For example:

A user can log in using Google.

Google handles the identity authentication process, and the conferencing application receives the required identity information through the configured login flow.

OpenID Connect is commonly used alongside OAuth 2.0 when the application needs standardized user authentication.

## 8.2 JWT (JSON Web Token)

JWT is a token format used to securely transmit claims between parties.

After successful authentication, the application can issue a JWT.

The client sends this token with subsequent requests.

Example:

```text
         USER LOGIN
              |
              v
          AUTH SERVICE
              |
         Verify Identity
              |
              v
          Generate JWT
              |
              v
          CLIENT STORES
              |
              v
       Sends JWT with Requests
```

A JWT generally contains:

- User ID.
- Issuer.
- Expiration time.
- Other relevant claims.

The token is digitally signed so that the receiving service can verify its integrity.

### Example JWT Payload

```json
{
  "userId": "U101",
  "role": "participant",
  "exp": 1790000000
}
```

This is an illustrative payload, not a complete secure token.

### How Does JWT Help in Meetings?

Suppose a user tries to join meeting M101.

The backend verifies:
1. Is the JWT valid?
2. Has it expired?
3. Does the user have permission to join M101?
4. Is the meeting accessible to this user?

Important:

A valid JWT does not automatically grant access to every meeting.

Meeting-level authorization must also be checked.

---

# 9. Meeting Service

## What is the Meeting Service?

The Meeting Service manages the lifecycle of a meeting.

It handles:

- Meeting creation.
- Room configuration.
- Participant management.
- Join and leave operations.
- Meeting settings.
- Screen-sharing coordination.
- Meeting termination.

### Example

Suppose Kartik creates a meeting.

The Meeting Service generates:

```text
Meeting ID: M101
Host: Kartik
Participants: 0
Status: Active
Screen Sharing: Disabled
```

When another user joins:

```text
Meeting ID: M101
Host: Kartik
Participants: 1
Status: Active
```

The Meeting Service maintains the authoritative meeting metadata.

## 9.1 Participant Management

The service tracks:

- Who joined.
- Who left.
- Who is the host.
- Who has permission to share the screen.
- Whether the meeting is active.

Example:

```text
             MEETING M101
                   |
          +--------+--------+
          |        |        |
          v        v        v
        User 1   User 2   User 3
         Host   Member   Member
```

Participant join/leave events can be distributed to other services through an event system.

## 9.2 Screen-Sharing Coordination

Suppose two participants try to share their screens.

The Meeting Service checks the meeting configuration and sharing permissions.

Depending on the product rules, it may allow one active screen sharer or multiple simultaneous screen shares.

The service coordinates the logical permissions.

The actual screen video is transmitted through the media plane using WebRTC.

**Important distinction:**

Meeting Service decides WHO can share.

WebRTC and the SFU handle HOW the screen-sharing media is transmitted.

---

# 10. Notification Service

## What is the Notification Service?

The Notification Service handles meeting-related notifications.

Examples:

- Meeting invitations.
- Meeting reminders.
- Participant joined notifications.
- Meeting started notifications.
- Meeting ended notifications.

It can deliver notifications through:

1. In-app notifications.
2. Email.
3. SMS.

### Architecture

```text
         MEETING SERVICE
                |
                v
       NOTIFICATION SERVICE
                |
                v
            MESSAGE QUEUE
                |
          +-----+-----+
          |           |
          v           v
        EMAIL         SMS
       PROVIDER     PROVIDER
```

Why use a message queue?

Imagine a host creates a meeting and invites 500 people.

We should not make the Meeting Service wait for all 500 emails and SMS messages to be delivered.

Instead:

1. Meeting Service creates the meeting.
2. It publishes a notification event.
3. Notification Service consumes the event.
4. It sends messages through external providers.
5. Delivery status can be tracked asynchronously.

This makes meeting creation faster and more reliable.

---

# 11. Chat Service

## What is the Chat Service?

The Chat Service manages text communication between meeting participants.

It handles:

- Sending messages.
- Receiving messages.
- Message history.
- File sharing.
- Message timestamps.
- Message delivery.

### Example

Suppose three people are in meeting M101.

User 1 sends:

"Please share the presentation."

The Chat Service receives the message and distributes it to the other meeting participants.

### Chat Architecture

```text
             CLIENT
                |
                v
           CHAT SERVICE
                |
                v
             KAFKA
                |
                v
            CASSANDRA
                |
                v
        MESSAGE DISTRIBUTION
                |
         +------+------+
         |             |
         v             v
       User 2        User 3
```

A persistent connection such as WebSocket can also be used to deliver chat messages immediately.

### File Sharing

Suppose a user uploads a PDF during a meeting.

A common architecture is:

1. Client requests an upload URL.
2. Backend authorizes the upload.
3. Client uploads the file to object storage.
4. Chat Service stores the file metadata and URL.
5. Other participants receive the file-sharing message.

The actual file does not need to pass through Cassandra.

Cassandra stores message records and file metadata, while object storage holds the file bytes.

---

# 12. Recording Service

## What is the Recording Service?

The Recording Service manages meeting recordings.

A meeting can be recorded in two ways:

1. Local Recording.
2. Cloud Recording.

## 12.1 Local Recording

In local recording, the user's device records the meeting media.

The recording is saved on the user's local storage.

### Flow

```text
        CAMERA / MICROPHONE
                 |
                 v
             WEBRTC
                 |
                 v
          LOCAL RECORDER
                 |
                 v
          USER DEVICE STORAGE
```

Advantages:
- Does not require uploading the entire recording to the cloud.
- Can reduce server-side recording infrastructure.
- User controls the local recording file.

Disadvantages:
- Depends on the user's device resources.
- Recording may be lost if the device crashes.
- The user needs sufficient storage.
- Capturing the complete multi-participant meeting requires access to the relevant remote media tracks and mixing logic.

## 12.2 Cloud Recording

In cloud recording, the media infrastructure captures the meeting and stores the recording in cloud object storage.

### Flow

```text
       PARTICIPANTS
             |
             v
          WEBRTC
             |
             v
           SFU
             |
             v
      RECORDING WORKER
             |
             v
       ENCODE / PROCESS
             |
             v
          AWS S3
```

Advantages:
- Recording is stored centrally.
- Users can access it later.
- Does not depend on one participant's device.
- Supports centralized recording management.

Disadvantages:
- Requires server-side compute.
- Consumes storage and bandwidth.
- Requires additional infrastructure.

### Local vs Cloud Recording

| Feature | Local Recording | Cloud Recording |
|---|---|---|
| Storage | User device | Cloud storage |
| Processing | Client-side | Server-side |
| Server Cost | Generally lower | Higher |
| Reliability | Depends on device | Centralized storage |
| Accessibility | Depends on file sharing | Easier centralized access |
| Scalability | Uses client resources | Uses cloud infrastructure |

---

# 13. Media Management and WebRTC Signaling

This is one of the most important components of the entire architecture.

First, understand that WebRTC signaling and actual media transmission are two different things.

## 13.1 What is WebRTC Signaling?

Signaling is the process through which two participants exchange connection information before establishing a WebRTC media connection.

It helps participants discover:
- Which audio/video formats they support.
- How they intend to communicate.
- Which network addresses can be used.
- Which media tracks are available.

The signaling service coordinates this exchange.

**Important:** Signaling is not the actual audio/video transmission.

The media travels through WebRTC connections, generally using SRTP over UDP.

## 13.2 SDP (Session Description Protocol)

SDP stands for Session Description Protocol.

It describes the media capabilities and connection parameters of a WebRTC session.

It can contain information about:

- Audio codecs (e.g., Opus, G.711).
- Video codecs (e.g., VP8, VP9, H.264, AV1).
- Media tracks.
- Encryption parameters.
- Network connection details.

Example:

Participant A wants to start a video call with Participant B.

Participant A creates an SDP Offer.

Participant B receives the offer and generates an SDP Answer.

This allows both parties to agree on the session parameters.

### 13.2.1 Deep Dive: VP8 Video Codec

**VP8** is an open-source, royalty-free video compression format developed by Google and standardized for real-time communications in WebRTC:

1. **Why VP8 is Ideal for Real-Time Video (Zoom / WebRTC):**
   - **Low Latency Encoding & Decoding**: Unlike broadcast video codecs optimized for high compression at the cost of processing delay, VP8 is specifically designed for sub-100ms real-time encoding and decoding.
   - **Packet Loss Resilience**: Internet video calls experience packet loss and jitter. VP8 includes reference frame management (Golden frames, Alternate reference frames) that allows the decoder to recover quickly from lost frames without requiring full keyframe retransmissions.
   - **Temporal Scalability (Simulcast / SVC)**: VP8 natively supports temporal scalability. A single video stream can be encoded into multiple temporal layers (e.g., 7.5 fps, 15 fps, 30 fps). An SFU (Selective Forwarding Unit) can drop higher layers for clients with poor network bandwidth without breaking the video playback.
   - **Universal Browser & Mobile Support**: VP8 is supported out-of-the-box in Chrome, Firefox, Safari, Edge, Android, and iOS WebRTC engines without licensing or royalty fees.

2. **VP8 vs H.264 vs VP9:**
   - **VP8 vs H.264**: H.264 has wider dedicated hardware acceleration on older smartphones, but requires patent licensing fees. VP8 is royalty-free and standard in WebRTC SFU architectures.
   - **VP8 vs VP9/AV1**: VP9 and AV1 provide higher compression efficiency (saving ~30%–50% bandwidth), but require significantly higher CPU compute to encode, making VP8 the go-to default for low-power mobile devices and low-latency group conferences.

## 13.3 ICE (Interactive Connectivity Establishment)

ICE stands for Interactive Connectivity Establishment.

Its job is to discover possible network paths between participants.

The problem:

Users may be behind:
- Home routers.
- Corporate firewalls.
- NAT.
- Restricted networks.

Their devices may not be directly reachable.

ICE helps find a usable connection path.

## 13.4 STUN Server

STUN stands for Session Traversal Utilities for NAT.

A STUN server helps a device discover its public-facing IP address and port as observed from outside its private network.

Example:

```text
        USER DEVICE
             |
             v
          STUN SERVER
             |
             v
     Public IP / Port Details
```

This information helps ICE discover possible direct communication paths.

STUN does not relay the actual media traffic.

## 13.5 TURN Server

TURN stands for Traversal Using Relays around NAT.

Sometimes direct communication is not possible because of restrictive NATs or firewalls.

In such cases, a TURN server relays the media traffic.

```text
      PARTICIPANT A
             |
             v
         TURN SERVER
             |
             v
      PARTICIPANT B
```

TURN is useful when direct peer-to-peer communication fails.

However, relaying media consumes additional server bandwidth.

---

# 14. Complete WebRTC Signaling Process

Suppose Participant A wants to join a meeting with Participant B.

### Step 1: Meeting Join Request

Participant A requests to join meeting M101.

The Meeting Service verifies meeting access.

### Step 2: Signaling Connection

The client connects to the Signaling Service, usually using WebSocket or another signaling transport.

### Step 3: SDP Offer

Participant A creates an SDP Offer describing supported audio and video capabilities.

### Step 4: Offer Exchange

The SDP Offer is sent through the Signaling Service.

### Step 5: SDP Answer

Participant B receives the offer and generates an SDP Answer.

The answer is sent back through signaling.

### Step 6: ICE Candidate Discovery

Both participants gather and exchange ICE candidates.

These candidates describe possible network paths.

### Step 7: STUN / TURN

ICE uses connectivity checks to find a usable route.

STUN assists with NAT discovery.

TURN provides a relay if direct communication cannot be established.

### Step 8: Media Connection

After successful negotiation, the WebRTC media connection is established.

Audio and video begin flowing.

### Complete Flow

```text
       PARTICIPANT A
             |
             v
        SIGNALING SERVER
             |
        SDP OFFER
             |
             v
        PARTICIPANT B
             |
        SDP ANSWER
             |
             v
        SIGNALING SERVER
             |
             v
       ICE CANDIDATE EXCHANGE
             |
         +---+---+
         |       |
         v       v
       STUN     TURN
         |       |
         +---+---+
             |
             v
      WEBRTC CONNECTION
             |
             v
       AUDIO / VIDEO
```

---

# 15. Media Servers: SFU vs MCU

When multiple participants join a meeting, direct peer-to-peer connections become difficult to scale.

For this reason, conferencing platforms commonly use media servers.

Two important types are:

1. SFU (Selective Forwarding Unit).
2. MCU (Multipoint Control Unit).

---

# 16. SFU (Selective Forwarding Unit)

## What is an SFU?

An SFU is a media server that receives media streams from participants and selectively forwards them to other participants.

It generally does not decode, mix and re-encode every video stream.

Instead, it forwards selected media tracks.

### Example

Suppose four participants join a meeting.

- Participant A
- Participant B
- Participant C
- Participant D

Each participant sends their own audio/video stream to the SFU.

The SFU forwards appropriate streams to the other participants.

### Architecture

```text
          Participant A
                 |
                 v
          +-------------+
          |             |
Participant B ---> SFU <--- Participant C
          |             |
          +-------------+
                 |
                 v
          Participant D
```

More clearly:

```text
          A --------\
          B ---------\
          C ----------> SFU
          D ---------/
                      |
          +-----------+-----------+
          |           |           |
          v           v           v
        A, B         C, D       Others
```

Each participant receives selected tracks according to the meeting's subscription policy.

## 16.1 Selective Forwarding

Imagine a participant has a weak internet connection.

They may not be able to receive every participant's high-resolution video.

The SFU can select lower-quality video streams or fewer video tracks.

Example:

```text
Participant A sends:

1080p video
720p video
360p video

             |
             v
            SFU
             |
       +-----+-----+
       |           |
       v           v
  High Bandwidth  Low Bandwidth
     Client          Client
       |               |
       v               v
     1080p            360p
```

This is commonly implemented using Simulcast or Scalable Video Coding (SVC).

### Simulcast

Simulcast means the client sends multiple quality versions of the same video stream.

For example:
- 1080p.
- 720p.
- 360p.

The SFU selects an appropriate version for each receiving participant.

### SVC

SVC stands for Scalable Video Coding.

It encodes video into multiple layers.

A receiver can use a suitable subset of layers depending on its bandwidth and processing capabilities.

## Advantages of SFU

1. Low server-side CPU usage compared with transcoding every stream.
2. Low additional media-processing latency.
3. Supports large meetings.
4. Allows selective stream forwarding.
5. Adapts to different participant bandwidths.

## Disadvantages of SFU

1. Clients may need to decode multiple incoming streams.
2. Receiving many video tracks consumes bandwidth.
3. Client CPU and memory usage can increase.
4. More complex subscription management is required.

### When to Use SFU?

SFU is suitable for:
- Zoom-like meetings.
- Google Meet-like conferences.
- Large interactive video calls.
- Screen-sharing sessions.
- Meetings where participants need to see multiple video feeds.

---

# 17. MCU (Multipoint Control Unit)

## What is an MCU?

An MCU is a media server that receives multiple participant streams, processes them, mixes them and sends a combined output to participants.

Unlike an SFU, an MCU performs server-side media processing.

It can:
- Decode audio/video.
- Mix audio streams.
- Compose multiple videos into one layout.
- Encode a combined output stream.

### Example

Suppose four participants join a conference.

Instead of sending four independent video streams to each participant, the MCU creates a combined video.

```text
       Participant A
              |
       Participant B
              |
       Participant C
              |
       Participant D
              |
              v
          MCU SERVER
              |
        Decode Streams
              |
         Mix Videos
              |
         Mix Audio
              |
         Encode Output
              |
              v
       Combined Stream
              |
              v
          PARTICIPANTS
```

The participants receive a composite stream.

## Advantages of MCU

1. Lower decoding complexity on client devices.
2. Can reduce the number of incoming video streams.
3. Supports centralized video layouts.
4. Useful for devices with limited processing capabilities.

## Disadvantages of MCU

1. High server CPU usage.
2. Requires video decoding and encoding.
3. Introduces additional processing latency.
4. Expensive at large scale.
5. Less flexible when participants want different individual video layouts.

### When to Use MCU?

MCU is suitable for:
- Legacy conferencing systems.
- Low-power client devices.
- Scenarios requiring a centrally composed video layout.
- Broadcast-style conferencing.

---

# 18. SFU vs MCU

| Feature | SFU | MCU |
|---|---|---|
| Full Form | Selective Forwarding Unit | Multipoint Control Unit |
| Main Function | Selectively forwards media tracks | Mixes and transcodes media |
| Video Mixing | Generally No | Yes |
| Audio Mixing | Generally No | Yes |
| Server CPU | Lower | Higher |
| Client CPU | Higher | Lower |
| Client Bandwidth | Depends on selected tracks | Often lower |
| Latency | Generally lower | Additional processing latency |
| Scalability | Suitable for large interactive meetings | More compute-intensive |
| Flexibility | Clients can choose individual streams | Receives a composite stream |

### Important Interview Point

SFU is commonly preferred for modern interactive video conferencing because it avoids the expensive process of mixing and re-encoding every participant's media.

However, SFU is not completely processing-free. It still handles packet routing, encryption-related operations and stream management.

---

# 19. Storage Layer

Our application generates different types of data.

We should not store everything in one database.

Instead, we use Polyglot Persistence.

## What is Polyglot Persistence?

Polyglot Persistence means using different databases or storage technologies for different types of application data.

Each storage system is selected according to its workload.

Our architecture uses:

1. PostgreSQL / MongoDB.
2. Apache Cassandra.
3. AWS S3 / Blob Storage.

---

# 20. Main Database: PostgreSQL / MongoDB

The main database stores structured application data.

Examples:
- User profiles.
- Meeting metadata.
- Permissions.
- Meeting configurations.
- User preferences.
- Meeting schedules.

### Why PostgreSQL?

PostgreSQL is a relational database.

It supports:
- Tables.
- Relationships.
- SQL queries.
- Transactions.
- ACID guarantees.
- Constraints.

Example tables:

```sql
USERS
-----
user_id
name
email

MEETINGS
--------
meeting_id
host_id
meeting_name
created_at

PARTICIPANTS
------------
meeting_id
user_id
role
joined_at
```

PostgreSQL is useful when we need relational data and transactional consistency.

### Why MongoDB?

MongoDB is a document-oriented NoSQL database.

It stores data in flexible BSON documents.

It can be useful when meeting configurations have flexible or nested structures.

Example:

```json
{
  "meeting_id": "M101",
  "host_id": "U101",
  "settings": {
    "screen_sharing": true,
    "chat_enabled": true,
    "recording_enabled": false
  }
}
```

### PostgreSQL vs MongoDB

| Feature | PostgreSQL | MongoDB |
|---|---|---|
| Database Type | Relational | Document-oriented |
| Data Model | Tables and rows | Documents |
| Schema | Structured schema | Flexible document schema |
| Relationships | Strong relational support | Embedded documents and references |
| Transactions | ACID transactions | Multi-document transactions supported |
| Best Fit | Relational and transactional data | Flexible document-oriented data |

We do not necessarily need both. We select one or combine them based on application requirements.

---

# 21. Chat Storage: Apache Cassandra

## Why Cassandra?

In a large video conferencing platform, thousands or millions of chat messages may be generated across active meetings.

Chat is an append-heavy workload.

Cassandra is suitable because it supports:
- High write throughput.
- Horizontal scalability.
- Distributed storage.
- Wide-column data modeling.
- Tunable consistency.

## Why LSM-Tree?

Cassandra uses an LSM-Tree-based storage engine.

Its write path:

```text
        Incoming Message
                |
                v
           Commit Log
                |
                v
            MemTable
                |
                v
           Flush to Disk
                |
                v
             SSTable
                |
                v
            Compaction
```

### Components

**Commit Log:** Records incoming mutations through sequential disk appends.

**MemTable:** Temporarily stores incoming writes in memory.

**SSTable:** Immutable sorted files stored on disk.

**Compaction:** Merges SSTables and reconciles obsolete records and tombstones.

This architecture makes Cassandra efficient for write-heavy chat workloads.

## Example Chat Table

```sql
CREATE TABLE meeting_messages (
    meeting_id UUID,
    message_date DATE,
    message_timestamp TIMESTAMP,
    message_id UUID,
    user_id UUID,
    message_text TEXT,

    PRIMARY KEY (
        (meeting_id, message_date),
        message_timestamp,
        message_id
    )
);
```

### Understanding the Primary Key

Partition Key:

```text
(meeting_id, message_date)
```

Groups messages by meeting and date.

Clustering Columns:

```text
(message_timestamp, message_id)
```

Organizes messages chronologically.

This allows efficient retrieval of messages belonging to a particular meeting and date.

Time bucketing helps prevent unbounded partitions for very active meetings.

---

# 22. Recording Storage: AWS S3 / Blob Storage

## What is Object Storage?

Object storage is a storage system designed to store large amounts of unstructured data as objects.

Examples:
- Video recordings.
- Audio recordings.
- Images.
- Documents.
- Files.

AWS S3 is an object storage service.

### Why Not Store Recordings in PostgreSQL or Cassandra?

Video recordings can be several GB in size.

Traditional databases are generally not the ideal primary storage layer for massive video files.

Object storage is designed to handle large objects efficiently and cost-effectively.

### Architecture

```text
         RECORDING SERVICE
                 |
                 v
           PROCESS VIDEO
                 |
                 v
             UPLOAD
                 |
                 v
              AWS S3
                 |
                 v
          RECORDING STORED
                 |
                 v
          USER DOWNLOADS
```

### Advantages

1. Cost-effective storage.
2. High durability.
3. Large object support.
4. Lifecycle management.
5. Integration with CDN.
6. Easy storage scaling.

The database stores recording metadata and object references.

The actual video file is stored in S3.

Example:

```json
{
  "recording_id": "R101",
  "meeting_id": "M101",
  "storage_url": "s3://meeting-recordings/M101.mp4",
  "status": "completed"
}
```

---

# 23. External Services: Email and SMS Gateways

Our application needs to send meeting invitations and reminders.

Instead of building our own email and SMS infrastructure, we can integrate third-party providers.

Examples:

- Twilio for SMS.
- SendGrid for email.
- Amazon SES for email.

This is similar to applications like Zomato and Uber.

When an order is placed or a ride is booked, the application sends an event to a notification system, which then dispatches an SMS or email through an external provider.

## How Does It Work?

Suppose Kartik creates a meeting and invites 100 participants.

The system needs to send 100 invitations.

We should not block the Meeting Service while waiting for all external providers to respond.

### Architecture

```text
          MEETING SERVICE
                  |
                  v
          NOTIFICATION SERVICE
                  |
                  v
             MESSAGE QUEUE
                  |
          +-------+-------+
          |               |
          v               v
       EMAIL             SMS
       PROVIDER         PROVIDER
          |               |
          v               v
        USERS            USERS
```

### Step-by-Step

1. Host creates a meeting.
2. Meeting Service stores the meeting metadata.
3. Meeting Service publishes a MeetingCreated event.
4. Notification Service consumes the event.
5. It creates notification jobs.
6. Workers send emails and SMS through external APIs.
7. Delivery status is recorded.

### Why Use a Message Queue?

- Decouples meeting creation from notification delivery.
- Handles temporary provider failures.
- Supports retries.
- Supports asynchronous processing.
- Prevents notification traffic from blocking core services.

For reliable delivery, use retry policies, idempotency and a dead-letter queue for messages that repeatedly fail.

---

# 24. End-to-End Flow 1: Joining a Meeting and Establishing Media

Now let's combine all the components.

Suppose Kartik creates a meeting and Rahul wants to join.

## Architecture

```text
         RAHUL (CLIENT)
                |
                v
          API GATEWAY
                |
                v
           AUTH SERVICE
                |
                v
          MEETING SERVICE
                |
                v
         MEETING VALIDATION
                |
                v
        SIGNALING SERVICE
                |
                v
          SDP EXCHANGE
                |
                v
       ICE CANDIDATE EXCHANGE
                |
           +----+----+
           |         |
           v         v
          STUN      TURN
           |         |
           +----+----+
                |
                v
             WEBRTC
                |
                v
              SFU
                |
                v
         OTHER PARTICIPANTS
```

## Step-by-Step

**Step 1: Open Application**

Rahul opens the web, mobile or desktop application.

**Step 2: Authenticate**

The Auth Service validates Rahul's identity and issues a JWT.

**Step 3: Join Meeting**

Rahul sends a request to join meeting M101.

**Step 4: Authorization**

The Meeting Service verifies whether Rahul is allowed to join the meeting.

**Step 5: Participant Registration**

The Meeting Service registers Rahul as a participant.

**Step 6: Signaling Connection**

Rahul establishes a connection with the WebRTC Signaling Service.

**Step 7: SDP Exchange**

Participants exchange SDP offers and answers.

**Step 8: ICE Discovery**

ICE discovers possible network paths using STUN and TURN.

**Step 9: Connect to SFU**

The client establishes its media connection with the selected SFU.

**Step 10: Media Transmission**

Rahul's camera and microphone tracks are sent to the SFU.

The SFU forwards selected media streams to other participants.

Rahul also receives media streams from other participants.

The meeting is now active.

---

# 25. End-to-End Flow 2: In-Meeting Chat and Recording

Suppose three participants are in meeting M101.

Rahul sends a message:

"Can everyone see my screen?"

## Chat Flow

```text
          RAHUL CLIENT
                |
                v
           CHAT SERVICE
                |
                v
          MESSAGE EVENT
                |
                v
              KAFKA
                |
          +-----+-----+
          |           |
          v           v
       CASSANDRA   DISTRIBUTION
          |           |
          |           v
          |       WEBSOCKET
          |           |
          |      +----+----+
          |      |         |
          |      v         v
          |    USER 1    USER 2
          |
          v
       HISTORY
```

### Steps

1. Rahul sends a chat message.
2. Chat Service receives it.
3. The service creates a message event.
4. The event is published to Kafka.
5. Cassandra Consumer persists the message.
6. Distribution workers deliver the message to other participants.
7. WebSocket connections push the message to their clients.
8. The message is available in chat history.

## Recording Flow

Suppose the host enables cloud recording.

```text
       PARTICIPANTS
              |
              v
             SFU
              |
              v
       RECORDING SERVICE
              |
              v
        RECORDING WORKER
              |
              v
        ENCODE / PROCESS
              |
              v
            AWS S3
              |
              v
       RECORDING METADATA
          IN DATABASE
```

### Steps

1. Host enables cloud recording.
2. Meeting Service verifies recording permissions.
3. Recording Service starts a recording worker.
4. The worker captures the relevant audio/video streams.
5. Media is processed and encoded.
6. The final recording is uploaded to S3.
7. Recording metadata is saved in PostgreSQL or MongoDB.
8. Participants can access the recording according to their permissions.

---

# 26. Important Scalability Considerations

A real-time conferencing platform must support thousands or millions of concurrent connections.

Different components have different scaling requirements.

| Component | Scaling Strategy |
|---|---|
| API Gateway | Horizontal scaling |
| Auth Service | Stateless instances and horizontal scaling |
| Meeting Service | Horizontal scaling with shared state |
| Chat Service | Horizontal scaling and Kafka |
| Cassandra | Add nodes to distribute storage and writes |
| WebSocket Signaling | Multiple gateway instances |
| SFU | Distribute meetings across media servers |
| TURN | Deploy geographically distributed relay servers |
| Recording Service | Separate recording workers |
| S3 | Managed object storage scaling |

## Why Should We Scale SFU Independently?

Suppose one SFU handles 50 meetings.

As the number of participants increases, the media bandwidth and packet-processing workload increase.

We can distribute meetings across multiple SFU servers.

```text
            MEETING REQUESTS
                    |
                    v
             MEDIA ROUTER
                    |
          +---------+---------+
          |         |         |
          v         v         v
         SFU 1     SFU 2     SFU 3
          |         |         |
          v         v         v
        Meetings  Meetings  Meetings
```

The Media Router selects an SFU based on:
- Available bandwidth.
- CPU utilization.
- Number of active participants.
- Network proximity.
- Meeting requirements.

A meeting's participants generally need to connect to the appropriate media server or coordinated media cluster.

---

# 27. Important Interview Questions

### Q1. What is the difference between the Control Plane and Media Plane?

Control Plane manages application operations such as authentication, meeting creation and participant management.

Media Plane handles the actual audio/video transmission.

### Q2. Why do we use WebRTC?

WebRTC provides low-latency real-time audio/video communication and supports peer-to-peer media transport.

### Q3. What is the difference between WebRTC and WebSocket?

| WebRTC | WebSocket |
|---|---|
| Primarily used for real-time media communication | Used for real-time bidirectional messaging |
| Supports audio/video | Supports application messages |
| Uses RTP/SRTP for media | Uses WebSocket framing |
| Uses ICE for connectivity | Uses a persistent TCP connection |
| Can use UDP-based media transport | Runs over TCP |

WebSockets are commonly used for signaling and chat, while WebRTC handles the actual media.

### Q4. What is the difference between Signaling and Media Transmission?

Signaling exchanges connection information such as SDP and ICE candidates.

Media transmission carries the actual audio and video packets.

### Q5. Why do we need STUN and TURN?

STUN helps discover public-facing network information and supports NAT traversal.

TURN relays media when a direct connection cannot be established.

### Q6. Why use SFU instead of MCU?

SFU forwards selected media streams without mixing and transcoding every stream.

It generally requires less server-side compute and is suitable for large interactive meetings.

### Q7. What happens if an SFU crashes?

Participants connected to the failed SFU may lose media connections.

Clients should reconnect and establish new media sessions through a healthy SFU.

The system should support media-server health checks and meeting recovery strategies.

### Q8. Why Cassandra for chat?

Cassandra supports high write throughput, distributed storage and horizontally scalable append-heavy workloads.

Its LSM-Tree storage architecture is suitable for continuous message ingestion.

### Q9. Why S3 for recordings?

Video recordings are large binary objects.

S3 provides durable, scalable and cost-effective object storage.

### Q10. Why use a message queue for notifications?

Sending external emails and SMS can take time or fail temporarily.

A message queue decouples notification delivery from meeting creation and supports retries.

### Q11. Why use a load balancer?

It distributes traffic across multiple backend instances, improves availability and enables horizontal scaling.

### Q12. Can WebRTC work without a TURN server?

Yes.

If a direct connection can be established using available ICE candidates, TURN is not required.

TURN is used when direct connectivity fails.

### Q13. Can multiple participants communicate directly without an SFU?

Yes, through a mesh architecture.

However, each participant needs to establish connections with other participants.

For N participants, each participant may need N-1 connections.

The total number of connections is:

N × (N - 1) / 2

For 10 participants:

10 × 9 / 2 = 45 connections.

This becomes expensive as participant count increases.

An SFU reduces the connection complexity because each participant generally maintains one media connection to the SFU.

---

# 28. Final Quick Revision

| Component | Technology | Main Responsibility |
|---|---|---|
| Client | Web / iOS / Android / Desktop | User interface and media capture |
| Local Hardware | Camera / Microphone | Capture audio and video |
| WebRTC | WebRTC APIs | Real-time media transport |
| Client Cache | Local Storage / Memory | Retain session information |
| API Gateway | NGINX / API Gateway | Request routing and rate limiting |
| Load Balancer | AWS ELB / NGINX | Distribute incoming traffic |
| Auth Service | OAuth 2.0 / JWT | Authentication and authorization |
| Meeting Service | Microservice | Meeting and participant management |
| Notification Service | Queue / Workers | Invitations and alerts |
| Chat Service | WebSockets / APIs | In-meeting messaging |
| Recording Service | Recording Workers | Meeting recording |
| Signaling Service | WebSockets | SDP and ICE exchange |
| STUN | STUN Server | NAT discovery |
| TURN | TURN Server | Media relay |
| SFU | Media Server | Selective media forwarding |
| MCU | Media Server | Media mixing and transcoding |
| Main DB | PostgreSQL / MongoDB | User and meeting metadata |
| Chat DB | Cassandra | High-throughput message storage |
| Recording Store | AWS S3 | Store large recording files |
| External Services | Twilio / SendGrid | SMS and email delivery |

---

# 29. Final Takeaway

A real-time video conferencing platform has two major responsibilities.

**1. Control Plane**

Manages everything related to the application:

- User authentication.
- Meeting creation.
- Participant management.
- Chat.
- Notifications.
- Recording metadata.

**2. Media Plane**

Manages everything related to actual communication:

- Camera and microphone capture.
- WebRTC signaling.
- ICE, STUN and TURN.
- Audio/video transmission.
- SFU / MCU media processing.

### Remember the Most Important Distinctions

- WebRTC handles real-time audio/video communication.
- WebSocket is commonly used for signaling and real-time chat.
- SDP describes media session parameters.
- ICE discovers possible connection paths.
- STUN helps with NAT discovery.
- TURN relays media when direct connectivity fails.
- SFU forwards selected media streams.
- MCU mixes and transcodes media streams.
- PostgreSQL / MongoDB stores application metadata.
- Cassandra stores high-volume chat messages.
- S3 stores large recording files.
- Message queues decouple notification delivery from meeting creation.

**Core System Design Principle:**

Separate application management from media transmission. Scale the Control Plane and Media Plane independently because they have very different workloads, resource requirements and latency constraints.

# Uber – System Design (High-Level Design)

## 1. Problem Statement

Design a scalable ride-hailing platform similar to Uber that connects passengers with nearby drivers.

The system should:
- Allow passengers to request rides.
- Find nearby available drivers.
- Match passengers with suitable drivers.
- Calculate estimated prices and arrival times (ETA).
- Allow drivers to accept or reject ride requests.
- Track driver and passenger locations in real time.
- Handle payments and trip history.
- Support dynamic pricing during high demand.
- Scale across multiple geographical regions.

---

# 2. Functional Requirements (FR)

## Customer / Passenger

1. Request a ride by providing source and destination.
2. Select ride type (Uber Go, Premier, XL, etc.).
3. View nearby available drivers.
4. Get estimated arrival time (ETA).
5. Get estimated ride price.
6. Track the driver in real time.
7. Cancel an ongoing request or ride.
8. Make payments.
9. View previous trips.
10. Rate drivers.

## Driver

1. Register and manage driver profile.
2. Go online/offline.
3. Share real-time GPS location.
4. Receive nearby ride requests.
5. Accept or reject ride requests.
6. Navigate to passenger pickup location.
7. Start and complete trips.
8. View earnings and payment history.

## System

1. Efficient driver-passenger matching based on geographical proximity.
2. Calculate optimal routes and ETAs.
3. Handle dynamic/surge pricing.
4. Support millions of users and drivers.
5. Handle location updates continuously.
6. Prevent multiple drivers from accepting the same ride.
7. Maintain trip and payment consistency.

---

# 3. Non-Functional Requirements (NFR)

| Requirement | Explanation |
|---|---|
| High Availability | Ride requests and driver tracking should remain available. |
| Scalability | Handle millions of passengers and drivers. |
| Low Latency | Find nearby drivers and match rides quickly. |
| Fault Tolerance | System should survive individual service/node failures. |
| Reliability | A confirmed trip should not be lost. |
| Consistency | Strong consistency for payments and trip assignment. |
| Eventual Consistency | Small delays in driver location updates are acceptable. |
| Durability | Completed trips and payment records must be preserved. |

### CAP Theorem

CAP stands for:

- C – Consistency
- A – Availability
- P – Partition Tolerance

During a network partition, a distributed system must trade off strong consistency and availability.

For Uber-like systems:

**AP-oriented operations:**
- Driver location updates.
- Nearby driver discovery.
- Driver availability snapshots.
- Location tracking.

These operations can tolerate slightly stale information.

**CP-oriented operations:**
- Payment processing.
- Ride assignment.
- Trip state transitions.
- Financial transactions.

These operations require stronger consistency.

Important: CAP is not a rule that an entire application must be AP or CP. Different services can make different trade-offs.

---

# 4. End-to-End Architecture

## Architecture Diagram

```text
                   PASSENGER APP
                         |
                         |
                    API GATEWAY
                         |
                   LOAD BALANCER
                         |
        +----------------+----------------+
        |                |                |
        v                v                v
   User Service     Demand Service   Payment Service
        |                |                |
        |                v                |
        |          Route Optimizer         |
        |                |                |
        |                v                |
        |         Matching Service         |
        |                |                |
        |          Supply Service          |
        |                |                |
        |                v                |
        |          Driver Service          |
        |                |                |
        +----------------+----------------+
                         |
                    MESSAGE BUS
                       Kafka
                         |
          +--------------+---------------+
          |              |               |
          v              v               v
     Notification   Trip Tracking    Analytics
       Service         Service        Service
          |              |
          |              v
          |         Redis / Cache
          |              |
          |         Driver Locations
          |
          v
     SMS / Email

                         |
                  STORAGE LAYER
                         |
        +----------------+----------------+
        |                |                |
        v                v                v
    PostgreSQL        Redis           Cassandra
    User Data       Live Location     Trip Events
    Payments        Active Trips
    Trip History    Driver Status

                         |
                         v
                  Historical Storage
                    S3 / Data Lake
```

## Main Components

### 1. Client Layer

Two major clients:

**Passenger Application**
- React Native / iOS / Android.
- Requests rides.
- Displays nearby drivers.
- Tracks driver location.
- Makes payments.

**Driver Application**
- Sends GPS location updates.
- Receives ride requests.
- Accepts or rejects rides.
- Updates trip status.
- Displays navigation.

Both clients communicate with backend services through APIs and persistent real-time connections.

### 2. API Gateway

Entry point for incoming client requests.

Responsibilities:

- Request routing to appropriate microservices.
- Authentication and authorization.
- Rate limiting.
- SSL/TLS termination.
- Request validation.
- API versioning.
- DDoS protection.

Example:

```text
POST /api/rides/estimate
       |
       v
  API Gateway
       |
       v
  Demand Service
```

### 3. Load Balancer

Distributes incoming traffic across multiple backend instances.

Example:

```text
                Load Balancer
                      |
          +-----------+-----------+
          |           |           |
          v           v           v
       Server 1    Server 2    Server 3
```

Benefits:
- Prevents one server from receiving all traffic.
- Improves availability.
- Supports horizontal scaling.
- Performs health checks.
- Redirects traffic away from unhealthy instances.

Examples:
- NGINX
- AWS Application Load Balancer
- AWS Network Load Balancer

---

# 5. Microservices Architecture

A microservice is an independently deployable service responsible for a specific business capability.

## 5.1 User Management Service

Handles passenger information.

Responsibilities:
- User registration.
- Login and authentication.
- Profile management.
- User preferences.
- Saved payment methods.

Database: PostgreSQL.

Why SQL?
- Structured data.
- Relationships.
- Transaction support.
- Strong consistency for important account operations.

## 5.2 Driver Management Service

Handles driver-related information.

Responsibilities:
- Driver registration.
- Driver verification.
- Driver profile.
- Vehicle details.
- Driver availability.
- Online/offline status.

Database: PostgreSQL for driver profiles and verification.

Redis can maintain frequently changing driver availability and location data.

## 5.3 Demand Service

Demand Service handles passenger ride requests.

When a passenger requests a ride:

1. Receives source and destination.
2. Identifies requested vehicle category.
3. Requests fare estimation.
4. Requests nearby driver discovery.
5. Sends the request to Matching Service.

Example:

```http
POST /api/rides/estimate

{
  "customerId": "U101",
  "source": {
    "lat": 28.6139,
    "lng": 77.2090
  },
  "destination": {
    "lat": 28.5355,
    "lng": 77.3910
  },
  "cabType": "UberGo"
}
```

Response:

```json
{
  "estimatedFare": 250,
  "eta": 5,
  "nearbyDrivers": 8
}
```

## 5.4 Supply Service

Supply Service handles the available driver pool.

Responsibilities:
- Maintain available drivers.
- Receive driver location updates.
- Maintain online/offline status.
- Provide nearby drivers to Matching Service.
- Remove unavailable drivers from the matching pool.

Example:

```text
Driver goes online
       |
       v
Supply Service
       |
       v
Update driver location
       |
       v
Redis / Geospatial Index
       |
       v
Available Driver Pool
```

## 5.5 Matching Service

One of the most important services.

Its job is to find the most suitable driver for a passenger.

Matching considers:

- Driver proximity.
- Driver availability.
- Estimated arrival time.
- Vehicle category.
- Driver acceptance rate.
- Traffic conditions.
- Driver-passenger compatibility.

### Matching Workflow

```text
Passenger requests ride
          |
          v
    Demand Service
          |
          v
   Matching Service
          |
          v
  Find nearby drivers
          |
          v
  Filter available drivers
          |
          v
 Calculate ETA and ranking
          |
          v
 Select suitable driver
          |
          v
 Send ride request
          |
          v
 Driver accepts / rejects
          |
          v
 Notify passenger
```

### Important: Driver Assignment

Two passengers might attempt to get the same driver simultaneously.

Therefore, driver assignment must be atomic.

Example:

```sql
UPDATE drivers
SET status = 'BUSY'
WHERE driver_id = 'D101'
AND status = 'AVAILABLE';
```

Check the number of affected rows.

- 1 row updated: Assignment succeeded.
- 0 rows updated: Driver was already assigned or unavailable.

Use database transactions, conditional writes, or distributed coordination depending on the architecture.

A ride should not be assigned to two passengers.

---

# 6. APIs and Event-Driven Communication

## Passenger APIs

### 1. EstimateRide

```http
POST /api/rides/estimate
```

Request:

```json
{
  "customerId": "U101",
  "source": "Delhi",
  "destination": "Noida",
  "cabType": "UberGo"
}
```

Response:

```json
{
  "estimatedETA": 5,
  "estimatedPrice": 250,
  "nearbyDrivers": 8
}
```

### 2. RequestRide

```http
POST /api/rides/request
```

Request:

```json
{
  "customerId": "U101",
  "source": "Delhi",
  "destination": "Noida",
  "cabType": "UberGo",
  "paymentMode": "UPI"
}
```

Response:

```json
{
  "rideId": "R101",
  "status": "SEARCHING"
}
```

### 3. CancelRide

```http
POST /api/rides/R101/cancel
```

### 4. TrackRide

```http
GET /api/rides/R101/location
```

### 5. RideHistory

```http
GET /api/users/U101/rides
```

## Driver APIs

### 1. UpdateLocation

```http
POST /api/drivers/location
```

Request:

```json
{
  "driverId": "D101",
  "latitude": 28.6139,
  "longitude": 77.2090,
  "timestamp": 1795000000
}
```

### 2. RequestTrip

```http
POST /api/drivers/ride-request
```

### 3. AcceptRide

```http
POST /api/rides/R101/accept
```

### 4. RejectRide

```http
POST /api/rides/R101/reject
```

### 5. StartTrip

```http
POST /api/rides/R101/start
```

### 6. EndTrip

```http
POST /api/rides/R101/end
```

## Event-Driven Communication

Instead of making every service wait for another service to finish, asynchronous events can be published through Kafka.

Example:

```text
Matching Service
       |
       v
   Kafka Topic
    RideFound
       |
       +-----------> Notification Service
       |
       +-----------> Trip Service
       |
       +-----------> Analytics Service
```

Important events:

- RideRequested
- DriverFound
- RideAccepted
- RideRejected
- DriverArrived
- TripStarted
- TripCompleted
- PaymentProcessed

Kafka provides durable event storage, partitioning, replay, and asynchronous processing.

---

# 7. Trip State Machine

A ride follows a predefined lifecycle.

```text
                 INITIATED
                     |
                     v
                SEARCHING
                     |
             Driver Found
                     |
                     v
                 ACCEPTED
                     |
                     v
              DRIVER ARRIVING
                     |
                     v
               DRIVER ARRIVED
                     |
                     v
                PICKUP WAIT
                     |
                     v
                IN PROGRESS
                     |
                     v
                  ENDED
                     |
                     v
             PAYMENT PROCESSING
                     |
                     v
                 COMPLETED
```

### Alternative States

```text
SEARCHING -------> CANCELLED
ACCEPTED --------> CANCELLED
DRIVER ARRIVING -> CANCELLED
SEARCHING -------> NO DRIVER FOUND
ACCEPTED --------> DRIVER REJECTED
```

### Explanation

| State | Meaning |
|---|---|
| Initiated | Passenger creates ride request. |
| Searching | System searches for available drivers. |
| Accepted | A driver accepts the request. |
| Driver Arriving | Driver navigates to pickup. |
| Driver Arrived | Driver reaches pickup location. |
| Pickup Wait | Passenger is waiting for pickup. |
| In Progress | Trip has started. |
| Ended | Driver completes the trip. |
| Completed | Payment and trip finalization are complete. |
| Cancelled | Passenger or driver cancels the ride. |
| No Driver Found | No suitable driver accepts the request. |

Important:
- Use a state machine to prevent invalid transitions.
- Use optimistic locking or conditional updates.
- Store state transitions durably.
- Use idempotency keys to prevent duplicate operations.

For example, a completed trip must not be charged twice if the EndTrip API is retried.

---

# 8. Database Design – Polyglot Persistence

Polyglot persistence means using different databases for different workloads rather than forcing everything into one database.

## 8.1 User Database – PostgreSQL

Stores structured and relational information.

Tables:

### Users

| user_id | name | email |
|---|---|---|
| U101 | Kartik | kartik@example.com |

### Drivers

| driver_id | name | vehicle_id | status |
|---|---|---|---|
| D101 | Driver A | V101 | AVAILABLE |

### Payments

| payment_id | ride_id | amount | status |
|---|---|---|---|
| P101 | R101 | 250 | SUCCESS |

Why PostgreSQL?

- ACID transactions.
- Strong consistency.
- Foreign key relationships.
- Structured data.
- Reliable payment and account operations.

## 8.2 Driver Location – Redis

Driver locations change frequently.

Example:

```text
D101 -> (28.6139, 77.2090)
D102 -> (28.6200, 77.2100)
D103 -> (28.6300, 77.2200)
```

Redis is an in-memory database.

Why Redis?

- Very low read/write latency.
- Supports geospatial indexing.
- Supports expiration (TTL).
- Supports atomic operations.
- Suitable for frequently changing data.

### Redis GEO Commands

Add a driver:

```redis
GEOADD drivers:delhi 77.2090 28.6139 D101
```

Find drivers within 5 km:

```redis
GEOSEARCH drivers:delhi
FROMMEMBER D101
BYRADIUS 5 km
WITHDIST
ASC
```

Redis stores longitude first, then latitude.

Driver location updates overwrite the previous location in the live-location index.

Historical location tracking, if required, should be stored separately.

## 8.3 Live Trips – Redis + Durable Database

Redis:

- Active trip lookup.
- Current trip status cache.
- Frequently accessed driver/passenger information.
- Live location.

PostgreSQL or another durable database:

- Authoritative trip record.
- Assignment details.
- Financial information.
- Important trip state transitions.

Redis is not the permanent source of truth for critical trip records.

## 8.4 Trip Events – Cassandra

Cassandra is suitable for high-throughput, append-heavy event storage.

Example:

```text
RideRequested
DriverAssigned
DriverArrived
TripStarted
TripCompleted
```

Why Cassandra?

- High write throughput.
- Horizontal scalability.
- Distributed architecture.
- Write-optimized LSM-tree storage.
- Tunable consistency.

## 8.5 Historical Trips – PostgreSQL

Historical trip data is read frequently for:

- Passenger trip history.
- Driver trip history.
- Invoices.
- Revenue reports.
- Filtering trips by date.

SQL is useful because of relational queries and indexing.

## 8.6 Logging and Analytics – DynamoDB / Data Lake

Stores semi-structured events and application logs.

Examples:

```json
{
  "event": "RIDE_COMPLETED",
  "rideId": "R101",
  "driverId": "D101",
  "duration": 1800,
  "fare": 250
}
```

For large-scale analytics, events can also be stored in object storage such as Amazon S3 and processed using Spark or other analytical systems.

### Database Summary

| Data | Storage | Reason |
|---|---|---|
| Users | PostgreSQL | Relational and transactional |
| Drivers | PostgreSQL | Structured profile data |
| Driver Locations | Redis | Fast geospatial operations |
| Driver Availability | Redis + DB | Fast lookup and durable state |
| Active Trips | Redis + PostgreSQL | Fast access and durable records |
| Trip Events | Cassandra / Kafka | High write throughput |
| Historical Trips | PostgreSQL | Relational queries |
| Payments | PostgreSQL | ACID transactions |
| Logs / Analytics | Data Lake / DynamoDB | Large-scale event data |

---

# 9. Redis and Caching

Caching stores frequently accessed data in a faster storage layer.

Instead of repeatedly querying the primary database, the application retrieves frequently needed information from Redis.

### Example

Without caching:

```text
Passenger
    |
    v
Matching Service
    |
    v
PostgreSQL
    |
    v
Fetch driver information
```

With caching:

```text
Passenger
    |
    v
Matching Service
    |
    v
   Redis
    |
    +---- Cache HIT ----> Return data
    |
    +---- Cache MISS ---> Database
```

### Cache Use Cases

- Nearby driver locations.
- Driver availability.
- Active trip details.
- Frequently accessed user information.
- ETA and route information where appropriate.

### Cache Expiration (TTL)

Driver location data should have a short expiration time.

For example:

```text
Driver sends location every 2 seconds.

Redis TTL = 10 seconds.

If the driver stops sending updates,
the location eventually expires.
```

This prevents stale driver locations from being treated as active.

---

# 10. Real-Time Location Tracking

This is one of the most important parts of Uber's architecture.

Drivers continuously send their GPS coordinates to the backend.

### Workflow

```text
Driver Mobile App
        |
        | GPS Coordinates
        v
Location Tracking Service
        |
        v
    API Gateway
        |
        v
   Location Service
        |
        v
       Redis
        |
        v
  Update Geospatial Index
        |
        v
  Passenger Tracking App
```

### Communication Protocol

HTTP polling is inefficient for continuous real-time updates.

Possible alternatives:

- WebSockets: Persistent, bidirectional communication.
- gRPC streaming: Efficient service-to-service streaming.
- MQTT: Lightweight messaging protocol.
- HTTP: Suitable for simpler periodic location updates.

The actual choice depends on the client and infrastructure.

### Why Not Continuously Query the Database?

Suppose 5 million drivers send location updates every 2 seconds.

\[
\frac{5,000,000}{2}=2,500,000
\]

That means 2.5 million location updates per second.

A traditional relational database is not the ideal destination for every transient GPS update.

Use Redis or a dedicated distributed location infrastructure for live coordinates, with asynchronous persistence when historical tracking is required.

---

# 11. Geospatial Indexing – Finding Nearby Drivers

A normal database index is designed for searching values such as:

```text
user_id = U101
```

But Uber needs to search geographically:

```text
Find all available drivers within 5 km
of latitude 28.6139 and longitude 77.2090.
```

This requires geospatial indexing.

There are multiple approaches.

## 11.1 Geohashing

Geohash converts two-dimensional geographical coordinates into a one-dimensional string.

Example:

```text
Latitude + Longitude
        |
        v
     Geohash
        |
        v
   Geographic Cell
```

Nearby geographical coordinates generally share common geohash prefixes.

Example:

```text
Delhi location -> ttn...
Nearby location -> ttn...
```

This makes geographical lookup easier using indexed keys.

Important:
Geohash cell boundaries can cause nearby points to fall into different cells.

Therefore, search the target cell and relevant neighboring cells.

## 11.2 Quadtrees

A Quadtree is a spatial data structure that recursively divides a two-dimensional region into four smaller quadrants.

Example:

```text
+-----------------------+
|           |           |
|    NW     |    NE     |
|           |           |
|-----------+-----------|
|           |           |
|    SW     |    SE     |
|           |           |
+-----------------------+
```

If a region contains too many drivers, divide it into smaller regions.

If a region has very few drivers, it may not need further subdivision.

Advantages:
- Handles dense and sparse areas.
- Reduces unnecessary geographical searches.
- Supports adaptive spatial partitioning.

## 11.3 Space-Filling Curves – Hilbert Curve

A Hilbert Curve maps two-dimensional geographical coordinates into a one-dimensional value.

The idea:

```text
2D Coordinates
      |
      v
Hilbert Curve
      |
      v
1D Index
      |
      v
Database / Distributed Index
```

Why?

A traditional geographical search works in two dimensions.

Converting coordinates into one-dimensional keys makes it easier to:
- Index geographical regions.
- Partition spatial data.
- Distribute geographical ranges.
- Perform locality-aware queries.

The Hilbert Curve tries to preserve spatial locality.

Nearby geographical points tend to have nearby Hilbert values, although this is not guaranteed for every pair of points.

### Why Use These Techniques?

| Technique | Main Purpose |
|---|---|
| Geohash | Encode geographical coordinates into strings |
| Quadtree | Dynamically subdivide geographical regions |
| Hilbert Curve | Map 2D spatial data to 1D keys |
| Redis GEO | Perform fast geospatial queries |
| S2 / H3 | Hierarchical global geographical indexing |

---

# 12. Driver Matching and Route Optimization

Finding nearby drivers is not the same as selecting the best driver.

The matching system has two major stages.

### Stage 1: Candidate Discovery

Find drivers geographically close to the passenger.

Example:

```text
Passenger Location
       |
       v
Geospatial Search
       |
       v
Nearby Drivers

D101 -> 1 km
D102 -> 2 km
D103 -> 3 km
D104 -> 4 km
```

### Stage 2: Driver Ranking

Calculate a score based on:

- ETA.
- Distance.
- Availability.
- Vehicle category.
- Driver acceptance probability.
- Traffic conditions.

Example:

| Driver | Distance | ETA |
|---|---:|---:|
| D101 | 1 km | 5 min |
| D102 | 2 km | 3 min |
| D103 | 3 km | 8 min |

D102 may be selected even though D101 is geographically closer.

Why?

Because the road route and traffic conditions make D102 faster.

### Route Optimization

A Maps / Routing Service calculates:

- Road distance.
- Traffic-aware travel time.
- Pickup ETA.
- Destination ETA.
- Best available route.

The shortest geographical distance is not always the fastest driving route.

---

# 13. Consistent Hashing

Consistent hashing is used to distribute data or requests across multiple nodes.

It is especially useful when the number of servers changes dynamically.

### Normal Hashing Problem

Suppose:

```text
Hash(key) % 3
```

There are three servers:

```text
Server 1
Server 2
Server 3
```

When a fourth server is added, the modulo changes.

Many keys get assigned to different servers.

This causes massive redistribution.

### Consistent Hashing Solution

Consistent hashing maps both servers and keys onto a circular hash ring.

```text
              Server A
                 |
         .---------------.
       /                   \
      /                     \
 Server D                 Server B
      \                     /
       \                   /
         '---------------'
                 |
              Server C
```

Each server is assigned a position on the ring.

A key is hashed onto the same ring.

The key is assigned to the first server encountered when moving clockwise.

### Virtual Nodes

A physical server can have multiple positions on the ring.

These positions are called virtual nodes.

Benefits:
- Better load distribution.
- Easier server addition/removal.
- Reduced data redistribution.
- Better handling of uneven node capacity.

### Where Is It Useful in Uber?

- Partitioning location data.
- Distributing geographically keyed data.
- Assigning ownership of spatial partitions.
- Routing requests to responsible processing nodes.

Important:

Consistent hashing does NOT solve race conditions.

Race conditions in ride assignment require atomic operations, locks, transactions, or conditional writes.

---

# 14. Gossip Protocol

Gossip is a distributed communication protocol in which nodes periodically exchange information with other nodes.

Example:

```text
Server A ---> Server B
    |             |
    v             v
Server C <--- Server D
```

Suppose a node fails.

Other nodes gradually learn about its failure through gossip messages.

Uses:
- Node membership information.
- Failure detection.
- Cluster state propagation.
- Distributed coordination metadata.

Benefits:
- Decentralized communication.
- No single central coordinator required.
- Supports large distributed clusters.
- Eventually spreads information across nodes.

Important:

Gossip provides eventually consistent cluster membership information. It is not a substitute for strong consistency in payment or ride assignment.

---

# 15. Fault Tolerance, Replication and Redundancy

A distributed system must continue operating even when individual nodes fail.

## Replication

Replication means maintaining multiple copies of data.

Example:

```text
             Primary Node
                  |
          Replication
                  |
          +-------+-------+
          |               |
          v               v
       Replica 1       Replica 2
```

If the primary node fails, a replica may be promoted.

Benefits:
- Higher availability.
- Better read scalability.
- Improved durability.
- Reduced single points of failure.

## Redundancy

Redundancy means having additional resources available to take over when something fails.

Examples:
- Multiple API servers.
- Multiple database replicas.
- Multiple Kafka brokers.
- Multiple availability zones.
- Multiple regional deployments.

## Fault Tolerance Techniques

1. Replication.
2. Health checks.
3. Automatic failover.
4. Retry with exponential backoff.
5. Circuit breakers.
6. Timeouts.
7. Dead-letter queues.
8. Multi-AZ deployment.
9. Backups and disaster recovery.

### Important: Idempotency

If a request is retried, it should not execute the same operation twice.

Example:

A passenger makes a payment.

The payment service processes it, but the response gets lost.

The client retries the request.

Without idempotency, the passenger could be charged twice.

Use an idempotency key:

```text
Idempotency-Key: payment-R101
```

The payment service checks whether the operation has already been processed.

---

# 16. Dynamic Pricing / Surge Pricing

Uber uses demand and supply information to determine pricing.

Example:

```text
High Demand + Low Supply
          |
          v
    Surge Pricing
          |
          v
    Higher Fare
```

### Example

Normal conditions:

```text
Available Drivers = 100
Ride Requests = 50

Supply > Demand
Normal Pricing
```

Surge conditions:

```text
Available Drivers = 20
Ride Requests = 200

Demand > Supply
Higher Pricing
```

### Surge Pricing Factors

- Number of ride requests.
- Available drivers.
- Geographic area.
- Weather.
- Traffic.
- Events.
- Time of day.

### Architecture

```text
Ride Requests
      |
      v
Demand Service
      |
      +----------+
      |          |
      v          v
Supply Data   Demand Data
      |          |
      +----------+
           |
           v
    Pricing Service
           |
           v
   Calculate Surge
           |
           v
   Estimated Fare
```

The pricing service can maintain demand/supply metrics for individual geographical zones.

---

# 17. Location-Based Partitioning

Uber operates across different geographical regions.

It makes sense to partition location-related data geographically.

Example:

```text
             Global System
                  |
       +----------+----------+
       |          |          |
       v          v          v
     Delhi     Mumbai     Bangalore
       |          |          |
       v          v          v
    Cluster    Cluster    Cluster
```

Benefits:
- Lower latency.
- Regional traffic isolation.
- Easier scaling.
- Smaller search spaces.
- Reduced cross-region communication.

For example, a Delhi passenger should normally search for drivers in the Delhi geographical region rather than querying drivers worldwide.

### Handling Regional Boundaries

A driver near the boundary of two regions might be relevant to passengers in either region.

Possible solutions:
- Query neighboring partitions.
- Replicate boundary location information.
- Use hierarchical spatial indexes.
- Route requests based on geographical proximity.

---

# 18. Scaling and Hot Partitions

A hot partition occurs when too many requests or writes target the same partition.

Example:

A major cricket stadium event ends.

Thousands of passengers request rides from the same location.

The geographical partition becomes overloaded.

### Solutions

1. Split highly populated geographical regions.
2. Use smaller spatial cells in dense areas.
3. Distribute processing across multiple nodes.
4. Use caching for frequently requested data.
5. Apply load shedding during extreme traffic.
6. Use Kafka to absorb traffic spikes.
7. Add more partitions or virtual nodes where appropriate.

Dense and sparse regions should not necessarily use identical partition sizes.

Dense areas need smaller geographical cells to distribute traffic more evenly.

Sparse areas can use larger cells to avoid unnecessary partition overhead.

---

# 19. Capacity Estimation

The following numbers are illustrative assumptions for system-design calculations, not verified Uber production statistics.

Assume:

- 100 million daily active passengers.
- 5 million active drivers.
- 2 million persistent connections.
- Each active driver sends one location update every 2 seconds.
- Each location update contains approximately 30 bytes of raw payload.

### Location Updates Per Second

\[
QPS = \frac{5,000,000}{2}
\]

\[
QPS = 2,500,000
\]

Approximately 2.5 million location updates per second.

### Raw Location Payload Throughput

\[
2,500,000 \times 30 = 75,000,000
\]

Approximately 75 MB/second of raw payload.

This excludes protocol overhead, metadata, replication and indexing costs.

### Daily Location Updates

\[
2,500,000 \times 86,400
\]

\[
= 216 \text{ billion updates/day}
\]

This illustrates why location updates need a highly scalable, distributed ingestion and processing architecture.

### Ride Throughput

Assume 5 billion rides per year:

\[
\frac{5,000,000,000}{365 \times 24 \times 3600}
\]

\[
\approx 158 \text{ rides/second}
\]

This is the average rate, not peak throughput.

Actual capacity planning must account for regional traffic spikes and peak demand.

---

# 20. Complete Ride Request Flow

Now combine all the components.

## Step 1: Passenger Requests a Ride

Passenger enters:

```text
Source: Delhi
Destination: Noida
Cab: UberGo
```

Request goes to:

```text
Passenger App
      |
      v
 API Gateway
      |
      v
 Demand Service
```

## Step 2: Estimate Fare and ETA

Demand Service calls:

- Pricing Service.
- Maps Service.
- Supply Service.

The system calculates:

- Estimated fare.
- Estimated arrival time.
- Nearby available drivers.

## Step 3: Find Nearby Drivers

Supply Service queries Redis or the geographical indexing infrastructure.

```text
Passenger Coordinates
         |
         v
  Geospatial Search
         |
         v
   Nearby Drivers
```

## Step 4: Driver Matching

Matching Service ranks the candidate drivers.

It selects a suitable driver and sends a ride request.

## Step 5: Driver Accepts

Driver receives a notification.

If the driver accepts:

```text
Driver App
    |
    v
Matching Service
    |
    v
Atomic Assignment
    |
    v
Trip Service
    |
    v
Ride Accepted
```

If the driver rejects or times out, the system tries another eligible driver.

## Step 6: Driver Pickup

Driver navigates to the passenger.

Location Tracking Service continuously receives GPS updates.

Passenger sees the driver's live location.

## Step 7: Trip Starts

Driver picks up the passenger.

Trip state changes:

```text
DRIVER ARRIVED
       |
       v
   IN PROGRESS
```

## Step 8: Trip Ends

Driver drops the passenger.

Trip Service:
- Calculates final fare.
- Updates trip status.
- Initiates payment.
- Generates trip receipt.
- Sends notifications.

## Step 9: Payment

Payment Service processes the transaction through an external payment gateway.

Payment details are persisted in the transactional database.

## Step 10: Trip History

Passenger and driver can retrieve the completed trip from historical trip storage.

---

# 21. Message Bus – Kafka

Kafka is a distributed event streaming platform.

It decouples microservices and allows asynchronous communication.

### Without Kafka

```text
Demand Service
      |
      v
Notification Service
      |
      v
Analytics Service
      |
      v
Trip Service
```

If Analytics Service is slow, it may affect synchronous processing.

### With Kafka

```text
             Demand Service
                    |
                    v
                Kafka Topic
                    |
          +---------+---------+
          |         |         |
          v         v         v
    Notification  Analytics  Trip
      Service     Service   Service
```

Advantages:
- Asynchronous communication.
- High throughput.
- Durable event storage.
- Consumer groups.
- Replay capability.
- Decoupling of services.

Example topics:

```text
ride-requested
driver-location-updated
driver-accepted
trip-started
trip-completed
payment-processed
```

Important:

Kafka is useful for durable events and asynchronous workflows. It should not automatically become the synchronous path for every latency-sensitive location lookup.

---

# 22. Payment Service

Payment is a critical component because financial operations require strong correctness guarantees.

### Workflow

```text
Trip Completed
      |
      v
Payment Service
      |
      v
Payment Gateway
      |
      v
Bank / UPI Provider
      |
      v
Payment Result
      |
      v
Update Payment DB
      |
      v
Notify Passenger
```

Important concepts:

- ACID transactions.
- Idempotency.
- Payment status tracking.
- Retries.
- Reconciliation.
- Refund handling.
- Webhook verification.

Payment states:

```text
PENDING
   |
   v
PROCESSING
   |
   +------> SUCCESS
   |
   +------> FAILED
   |
   +------> REFUNDED
```

Do not rely only on a successful HTTP response from a payment provider. Persist and reconcile payment outcomes.

---

# 23. Notification Service

Sends updates to passengers and drivers.

Examples:

- Driver found.
- Driver accepted.
- Driver arriving.
- Driver arrived.
- Trip started.
- Trip completed.
- Payment successful.

Communication methods:

- Push notifications (FCM / APNs).
- WebSockets.
- SMS.
- Email.

External integrations can include providers such as Twilio or SendGrid.

Use Kafka or another asynchronous queue to avoid blocking ride creation while waiting for external notification providers.

---

# 24. Important Design Patterns

| Pattern | Where Used | Purpose |
|---|---|---|
| Microservices | Backend | Independent business services |
| API Gateway | Entry point | Routing and security |
| Load Balancing | Traffic distribution | Horizontal scaling |
| Caching | Redis | Reduce database reads |
| Pub/Sub | Kafka | Async communication |
| Geospatial Indexing | Driver discovery | Find nearby drivers |
| Consistent Hashing | Distributed partitioning | Reduce redistribution |
| Replication | Databases | Availability and durability |
| Circuit Breaker | Service calls | Prevent cascading failures |
| Idempotency | Payments / rides | Prevent duplicate operations |
| State Machine | Trip lifecycle | Valid state transitions |
| CQRS | Read-heavy workloads | Separate read/write models |

---

# 25. What Can Fail? Failure Scenarios

| Failure | Solution |
|---|---|
| Redis node fails | Replication and failover |
| Kafka broker fails | Replicated partitions |
| Driver stops sending location | TTL and stale-location detection |
| Matching service fails | Retry and service replicas |
| Payment gateway times out | Idempotent retry and reconciliation |
| Driver rejects ride | Find another driver |
| Duplicate ride request | Idempotency key |
| Two passengers get same driver | Atomic conditional assignment |
| Regional outage | Failover and disaster recovery |
| Notification provider fails | Retry and alternate provider |

---

# 26. Important Interview Discussion Points

### 1. Why Redis instead of PostgreSQL for driver locations?

Driver coordinates change frequently.

Redis provides low-latency in-memory access and geospatial commands.

PostgreSQL remains useful for durable driver profiles and important business records.

### 2. Why Cassandra for trip events?

Cassandra supports high write throughput and horizontal scaling.

It is suitable for append-heavy event workloads.

### 3. Why not store everything in Redis?

Redis is primarily an in-memory data store.

Keeping every historical ride and financial record in Redis would be expensive and would not replace the need for durable transactional storage.

### 4. Why use Kafka?

To decouple services, buffer traffic spikes, persist events and allow asynchronous processing.

### 5. Why use geospatial indexing?

Because finding nearby drivers requires geographical range queries rather than simple exact-value lookups.

### 6. Why use consistent hashing?

To distribute keys across nodes while minimizing redistribution when nodes are added or removed.

### 7. How do we prevent two passengers from booking the same driver?

Use atomic assignment through conditional updates, transactions or distributed coordination.

### 8. How do we handle millions of location updates?

Use geographically partitioned location services, in-memory geospatial indexes, distributed ingestion and asynchronous processing.

### 9. How do we handle surge pricing?

Compare demand and available supply within geographical zones and calculate dynamic pricing.

### 10. Why use multiple databases?

Different workloads have different requirements:

- SQL for transactions.
- Redis for low-latency state.
- Cassandra for high-volume writes.
- Object storage/data lakes for large historical datasets.

---

# 27. Whiteboard Image Reference

The following image is the Uber system design reference used for these notes:

![Uber System Design](https://assets.leetcode.com/static_assets/others/Uber.png)

### Explanation of the Image

The diagram contains several important architectural concepts.

**1. Top Workflow**

The top row illustrates the complete ride lifecycle:

1. Passenger requests a ride.
2. Demand Service finds available drivers.
3. Supply Service identifies driver availability.
4. Driver accepts the ride.
5. Trip information is created.
6. Driver picks up and drops off the passenger.

**2. Left Side – Backend APIs**

Shows the main customer and driver APIs:

- EstimateRide.
- RequestRide.
- RideFound.
- RequestTrip.
- AcceptRide.
- DenyRide.
- StartTrip.
- EndTrip.

These represent the communication between passenger/driver applications and backend services.

**3. Middle – Trip State Machine**

Shows how a ride moves through different states:

- Initiated.
- Driver Demanded.
- Driver Found / Accepting.
- Accepted.
- Customer Pickup Waiting.
- Started / On Road.
- Ended.
- Suspended.

The key idea is that the ride lifecycle is explicitly managed rather than being a collection of unrelated API calls.

**4. Right Side – Microservices Architecture**

Shows the major backend components:

- User Management Service.
- Driver Management Service.
- Location Tracking Service.
- Maps Service.
- Rating Service.
- Predictive Surge Pricing.
- Fraud Detection.
- Demand Service.
- Supply Service.
- Matching Service.
- Trip Tracking Service.

The Message Bus connects services and enables event-driven communication.

**5. Rightmost – Cache and Databases**

Shows separate storage areas for:

- Users DB.
- Drivers DB.
- Live Trips.
- Historical Trips.
- Logging and Analytics.

The important concept is polyglot persistence: choosing storage based on the type of workload.

**6. Bottom – Spatial Indexing**

Shows the Space-Filling Curve / Hilbert Curve concept.

It maps two-dimensional geographical coordinates into one-dimensional index values.

Dense areas contain more locations and may require finer-grained spatial partitioning, while sparse areas can use larger partitions.

**7. Bottom Right – Distributed System Concepts**

Shows:

- Consistent Hashing.
- Gossip Protocol.
- Easy node addition/removal.
- Virtual Nodes.
- Distributed state sharing.

These techniques help build and operate a distributed geographical infrastructure.

---

# 28. Final Architecture Summary

Remember the following flow:

```text
PASSENGER REQUEST
       |
       v
   API GATEWAY
       |
       v
  DEMAND SERVICE
       |
       +-------> PRICING SERVICE
       |
       +-------> MAPS SERVICE
       |
       v
  MATCHING SERVICE
       |
       v
   SUPPLY SERVICE
       |
       v
   REDIS GEO
       |
       v
  NEARBY DRIVERS
       |
       v
 DRIVER ACCEPTANCE
       |
       v
    TRIP SERVICE
       |
       v
 LOCATION TRACKING
       |
       v
    TRIP ENDED
       |
       v
  PAYMENT SERVICE
       |
       v
   NOTIFICATION
       |
       v
  TRIP HISTORY
```

## Concepts to Remember

| Concept | Remember |
|---|---|
| Microservices | Separate services by business responsibility |
| API Gateway | Entry point for requests |
| Load Balancer | Distributes incoming traffic |
| Redis | Fast in-memory cache and geospatial index |
| PostgreSQL | Transactional and relational data |
| Cassandra | High-throughput distributed writes |
| Kafka | Durable asynchronous event streaming |
| Geohash | Geographic coordinates to indexed strings |
| Quadtree | Recursively divides geographical regions |
| Hilbert Curve | Maps 2D coordinates to 1D keys |
| Consistent Hashing | Distributes keys across nodes |
| Gossip | Shares cluster membership information |
| Replication | Maintains multiple data copies |
| State Machine | Controls trip lifecycle |
| Idempotency | Prevents duplicate operations |
| Surge Pricing | Balances demand and supply |

**Core takeaway:** Uber is not just a CRUD application. Its most challenging engineering problems are real-time geospatial search, high-volume location ingestion, low-latency driver matching, distributed coordination, and reliable trip/payment processing.
