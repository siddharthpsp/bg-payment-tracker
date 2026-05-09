CREATE TABLE `tracker_states` (
	`userId` int NOT NULL,
	`invoicesJson` mediumtext NOT NULL,
	`bgsJson` mediumtext NOT NULL,
	`paymentHistoryJson` mediumtext NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tracker_states_userId` PRIMARY KEY(`userId`)
);
