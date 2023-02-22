# short url generator

This is a URL shortening service implemented with [Next.js](https://nextjs.org/), [Prisma](https://www.prisma.io/), and [MySQL](https://www.mysql.com/).
- [demo](https://jiar-shortner.vercel.app/)

## Pre-environment setup
- [Install Node.js](https://nodejs.org/en/download/)
- Setup Database
    
    Creating a MySQL server and creating a ShortUrl table.
```sql
CREATE TABLE `ShortUrl` (
  `id` varchar(255) NOT NULL,
  `title` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `description` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `imageUrl` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `targetUrl` varchar(8182) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `visits` int DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
```


## Installing

How to Download and Launch the Project.

1. Open your terminal and ```clone``` this project.
```bash
git clone https://github.com/PhivosJiar/short-url-generator.git 
```
2. Open the project and download the Node packages.
```bash
npm i
```
3. Create a ```.env``` file and enter the environment variables.
```env
DATABASE_URL="YOUR_DATABASE_CONNECT_URL"
NEXT_PUBLIC_HOST="http://localhost:3000" or your host
```
4. Start the project.
```bash 
npm run dev
```

## Features
1. Generate a shortened URL upon user input of a long URL.
2. Customize the display of the link preview.
![](https://i.imgur.com/x9zWBqX.png)

	Effect demonstration:
	![](https://i.imgur.com/Qy0SqX9.png)
3. User-friendly redirection prompt to prevent phishing attacks.
![](https://i.imgur.com/eNsBA95.png)

4. Keep track of the number of visits to the shortened link.
![](https://i.imgur.com/VVFUvT1.png)
