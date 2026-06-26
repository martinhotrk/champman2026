CREATE TABLE `clubs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`shortName` varchar(50) NOT NULL,
	`state` varchar(2) NOT NULL,
	`marketValue` decimal(10,2),
	`avgAge` decimal(4,1),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `clubs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `matches` (
	`id` int AUTO_INCREMENT NOT NULL,
	`seasonId` int NOT NULL,
	`round` int NOT NULL,
	`homeClubId` int NOT NULL,
	`awayClubId` int NOT NULL,
	`homeGoals` int,
	`awayGoals` int,
	`status` enum('scheduled','playing','completed') DEFAULT 'scheduled',
	`narrative` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `matches_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `players` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`position` varchar(50) NOT NULL,
	`nationality` varchar(100) NOT NULL,
	`age` int NOT NULL,
	`clubId` int,
	`marketValue` decimal(10,2),
	`pace` int NOT NULL DEFAULT 50,
	`shooting` int NOT NULL DEFAULT 50,
	`passing` int NOT NULL DEFAULT 50,
	`dribbling` int NOT NULL DEFAULT 50,
	`defense` int NOT NULL DEFAULT 50,
	`physical` int NOT NULL DEFAULT 50,
	`isInternational` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `players_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `seasons` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`clubId` int NOT NULL,
	`year` int NOT NULL,
	`currentRound` int NOT NULL DEFAULT 0,
	`budget` decimal(15,2) DEFAULT '0',
	`status` enum('active','completed','paused') DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `seasons_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `standings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`seasonId` int NOT NULL,
	`clubId` int NOT NULL,
	`position` int,
	`played` int NOT NULL DEFAULT 0,
	`wins` int NOT NULL DEFAULT 0,
	`draws` int NOT NULL DEFAULT 0,
	`losses` int NOT NULL DEFAULT 0,
	`goalsFor` int NOT NULL DEFAULT 0,
	`goalsAgainst` int NOT NULL DEFAULT 0,
	`goalDifference` int NOT NULL DEFAULT 0,
	`points` int NOT NULL DEFAULT 0,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `standings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tactics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`seasonId` int NOT NULL,
	`matchId` int,
	`formation` varchar(20) NOT NULL,
	`lineup` json,
	`tactics` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tactics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `transfers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`seasonId` int NOT NULL,
	`playerId` int NOT NULL,
	`fromClubId` int,
	`toClubId` int NOT NULL,
	`transferType` enum('buy','sell','loan') NOT NULL,
	`fee` decimal(10,2),
	`status` enum('pending','completed','rejected') DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`completedAt` timestamp,
	CONSTRAINT `transfers_id` PRIMARY KEY(`id`)
);
