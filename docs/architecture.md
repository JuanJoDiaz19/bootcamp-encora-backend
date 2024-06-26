# FitNest Architecture

FitNest is an e-commerce platform for the sale of sports items focused on user experience, security and scalability.

[View on Eraser![](https://app.eraser.io/workspace/Smr1odjpd5NXTXXE4zmJ/preview?elements=p3PCQQLXNVxll8zLIQB5Yg&type=embed)](https://app.eraser.io/workspace/Smr1odjpd5NXTXXE4zmJ?elements=p3PCQQLXNVxll8zLIQB5Yg)

## Frontend
- **Framework**: NextJS desplegado en Vercel.
- **Product Images**:
    - Image reading through AWS S3 public access, managed by presigned URLs for extra security.
    - Overwriting permissions only for administrators after authentication.
- **CDN**: CloudFront to improve performance and security (HTTPS, latency, DDoS protection).

## Backend
- **Framework**: NestJS monolith
- **Architecture**: NestJS monolith deployed in ECS (autoscaling) and accessed through API Gateway with the following security measures:
    - **API Gateway**: Rate limiting and Web Application Firewall (WAF) implementation to prevent DDoS and other threats.
    - **ECS**: Autoscaling configured for horizontal scalling depending on usage.
    - **IAM Roles**: Roles with the minimum necessary permissions (least privilege principle) for all resources used by the application.

## Database
- **PostgreSQL**: RDS instance for transactional data storage.
- **Redis**: Used as caching layer with the following configurations:
    - **Authentication**: Redis AUTH configuration to protect access.
    - **TLS**: Used to encrypt data in-transit.
    - **Expiration Policy**: `allkeys-lfu` or `allkeys-lru`.

## Storage
- **S3 Bucket**:
    - Public reading access through presigned URL's to improve security.
    - Overwriting through authentication for administrators.
- **CDN**: CloudFront to distribute static content for additional benefits like security and performance.

## Continuos Integration
Github actions in front and backend to do the following:
  - **Testing**: Unit and integration tests execution in every push and pull request to the `main` branch.
  - **Linting and Formatting**: Code standards verification and automatic formatting to keep code quality.

## Continuos Deployment
### Frontend
- Deployed to vercel with a secure injection of the `API` environment variable, which stores the domain or IP address of the backend.

### Backend
#### Image Building
- The NestJS image has a dependency on a `.env` file (not included in the image for security) which contains the environment variables required by NestJS to connect to the DB and other services.
- Image publication to the public registry [Github Packages](https://ghcr.io).
#### ECS Deployment
- **Secrets injection**: Uso de secretos de Github Actions para crear el archivo `.env`  e inyectarlo en el contenedor durante el despliegue.
- **Security configuration**: Security Groups and IAM with minimum necessary permissions.
- **Monitoring and Logging**:
    - **CloudWatch**: Amazon CloudWatch configuration for monitoring, and, ECS containers and RDS logging.
    - **Alerts**: Alert configuration for critical events like latency increase, application errors or resource saturation.
    - **Logs de tareas ECS**: Send ECS logs to CloudWatch to easy access and analysis.
