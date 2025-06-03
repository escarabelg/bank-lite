## Backend


### Application Features
- Create client account

- Update client details

- Delete client account

- List all clients

- Get client details by ID

- Make a deposit

- Make a withdrawal

- View client transaction history


### Getting started

If you don’t have Docker installed: https://docs.docker.com/get-started/get-docker/

1. Clone the project
```
git clone https://github.com/escarabelg/bank-lite.git
```

2. Fetch dependencies
```
npm install
```

3. use the `.env.example` by cloning to `.env`

4. Run the project
```
npm run docker:up

```
5. Execute the migration
```
npm run docker:apply:migrations
```

#### Optional
- See the Swagger documentation http://localhost:3000/docs
- Unit tests `npm run test:unit`
- e2e tests `npm run test:e2e`


### Notes
If you encounter a Prisma compilation error after making changes, especially if you haven't had a chance to test on Windows, check the updated Prisma documentation to verify the correct target for Windows. It might need to be set to native if it isn't already.
```
binaryTargets = ["native", "linux-musl-openssl-3.0.x"]
```