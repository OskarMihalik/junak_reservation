

# monorepo
install pnpm https://pnpm.io/installation
```
pnpm install
```

# frontend
```
cd apps/next
pnpm run dev
```

# backend
```
cd apps/fastify-api
pnpm run dev
```
backend is running on http://localhost:3939

## DB and ORM

### when you change or add entity
```
npx mikro-orm-esm schema:drop --run
npx mikro-orm-esm schema:create --run
```
or 
```
# first check what gets generated
npx mikro-orm-esm schema:update --dump

# and when its fine, sync the schema
npx mikro-orm-esm schema:update --run
```

### Migrations 
not needed now

# DB
```
docker compose up
```

# Routes
- **/** - The home page where users can navigate to Register or Login  
  <img src="./images/homePage.PNG" alt="Home Page" width="300" height="200">


- **/auth/login** - Login page for user authentication  
  <img src="./images/loginPage.PNG" alt="Login Page" width="300" height="300">


- **/auth/register** - Registration page for new users  
  <img src="./images/registerPage.PNG" alt="Register Page" width="300" height="400">


- **/user** - User dashboard to browse the calendar of planned schedules and join terms  
  <img src="./images/userPage.PNG" alt="User Page" width="400" height="200">  
  <img src="./images/userPageMobile.PNG" alt="User Page Mobile" width="200" height="400">


- **/user/sub** - Page for users to order a subscription

  <img src="./images/userSub.PNG" alt="User Subscription Page" width="200" height="250">


- **/admin** - Admin dashboard to view the calendar, terms

  <img src="./images/adminPage.PNG" alt="Admin Page" width="400" height="200">


- **/admin/sub** - Admin page to review and manage pending subscriptions (approve/revoke)

  <img src="./images/adminSub.PNG" alt="Admin Subscriptions Page" width="500" height="200">


- **/admin/createSchedule** - Admin page to plan schedules for upcoming weeks, set capacity, time intervals, and duration
  
  <img src="./images/adminSchedule.PNG" alt="Admin Schedule Creation Page" width="500" height="200">
