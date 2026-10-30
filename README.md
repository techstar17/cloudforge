# CloudForge

A learning project connecting a React interface to an Express API for registration, login and file uploads to Amazon S3.

## Request flow

1. The user registers; the API hashes the password with bcrypt.
2. Login returns a JWT valid for one hour.
3. The frontend sends a selected file and bearer token to `POST /upload`.
4. The API validates the token and uploads the file to S3 using the AWS SDK.

## Repository layout

| Path | Purpose |
| --- | --- |
| `frontend/` | React/Vite client |
| `backend/server.js` | Express routes, authentication and S3 upload |
| `backend/package.json` | API dependencies |
| `frontend/package.json` | Client scripts and dependencies |

## Local setup

Use a recent Node.js 22 release and npm. The API expects these environment variables in an untracked `backend/.env` file:

```dotenv
AWS_REGION=your-aws-region
AWS_BUCKET_NAME=your-existing-bucket
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
JWT_SECRET=your-long-random-secret
```

Use a dedicated development bucket and credentials restricted to the needed S3 actions. Never commit real credentials. S3 usage can incur charges.

Start the API:

```sh
cd backend
npm ci
node server.js
```

In a second terminal:

```sh
cd frontend
npm ci
npm run dev
```

The client currently uses `http://localhost:5000` as its API address. Open the URL printed by Vite, register, log in, then upload a small test file.

## API routes

| Route | Behaviour |
| --- | --- |
| `GET /` | Basic API status |
| `POST /register` | Register using email/password |
| `POST /login` | Return a JWT |
| `POST /upload` | Authenticated multipart upload; field name `file`; limit 10 MiB |

## Current limitations

- Users are held in memory and disappear when the API restarts.
- The frontend stores the JWT in browser localStorage.
- The upload response constructs an S3 object URL; it does not grant public access or create a presigned URL. A private bucket can return Access Denied when that link is opened.
- Database persistence, rate limiting, stronger input validation, restricted CORS, deployment configuration and automated tests remain to be implemented.
- No live deployment or production-security claim is made.

The [Terraform repository](https://github.com/techstar17/cloudforge-terraform-infra) is a separate infrastructure lab. Its bootstrap script starts host Nginx; it does not deploy this application.
