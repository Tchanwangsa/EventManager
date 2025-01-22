-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 18, 2024 at 06:35 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `event-manager`
--

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `EventId` int(11) NOT NULL,
  `EventName` varchar(100) NOT NULL,
  `EventDateTime` datetime NOT NULL,
  `EventDateTimeEnd` datetime NOT NULL,
  `Status` tinyint(1) NOT NULL,
  `StoreTotal` int(11) NOT NULL,
  `NumberOfSeats` int(11) NOT NULL,
  `NumberOfRows` int(11) NOT NULL,
  `NumberOfCols` int(11) NOT NULL,
  `NumberofTables` int(11) NOT NULL,
  `EventLocation` varchar(100) NOT NULL,
  `Province` varchar(100) NOT NULL,
  `created_date` datetime NOT NULL,
  `updated_date` datetime NOT NULL,
  `created_at` varchar(100) NOT NULL,
  `updated_at` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_thai_520_w2;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`EventId`, `EventName`, `EventDateTime`, `EventDateTimeEnd`, `Status`, `StoreTotal`, `NumberOfSeats`, `NumberOfRows`, `NumberOfCols`, `NumberofTables`, `EventLocation`, `Province`, `created_date`, `updated_date`, `created_at`, `updated_at`) VALUES
(33, 'testevent1', '2024-07-31 18:18:00', '2024-07-31 18:18:00', 0, 10, 2, 4, 4, 5, 'location', 'Bangkok', '2024-07-12 18:18:51', '2024-07-15 19:36:47', '', ''),
(36, 'testevent2', '2024-07-12 22:41:00', '2024-07-12 22:41:00', 1, 50, 10, 10, 4, 5, 'location', 'Chiang Mai', '2024-07-12 22:41:16', '2024-07-15 16:59:16', '', ''),
(37, 'testevent3', '2024-07-19 00:28:00', '2024-07-19 00:28:00', 1, 50, 3, 9, 5, 17, 'abc', 'Pattaya', '2024-07-13 00:29:11', '2024-07-15 16:59:22', '', ''),
(38, 'testevent4', '2024-07-15 11:33:00', '2024-07-15 11:33:00', 1, 100, 8, 3, 10, 13, 'thailand', 'Chiang Mai', '2024-07-13 11:33:44', '2024-07-15 16:59:30', '', ''),
(41, 'testcreate', '2024-07-17 10:50:00', '2024-07-17 11:50:00', 1, 100, 8, 5, 4, 13, 'abvc', 'Bangkok', '2024-07-15 20:55:05', '0000-00-00 00:00:00', '', ''),
(45, 'testcreate', '2024-07-17 14:50:00', '2024-07-17 15:50:00', 1, 10, 10, 2, 2, 1, 'thailand', 'Bangkok', '2024-07-16 11:52:11', '0000-00-00 00:00:00', '', ''),
(46, 'testcreate2', '2024-07-17 14:50:00', '2024-07-17 15:50:00', 1, 10, 10, 2, 2, 1, 'thailand', 'Bangkok', '2024-07-16 14:41:27', '0000-00-00 00:00:00', '', ''),
(47, 'testnew', '2024-07-18 16:30:00', '2024-07-18 17:30:00', 1, 30, 8, 3, 3, 4, 'location', 'Bangkok', '2024-07-16 16:29:31', '0000-00-00 00:00:00', '', '');

-- --------------------------------------------------------

--
-- Stand-in structure for view `general`
-- (See below for the actual view)
--
CREATE TABLE `general` (
`EventId` int(11)
,`EventName` varchar(100)
,`TableId` int(11)
,`TableName` varchar(50)
,`SeatId` int(11)
,`StoreName` int(11)
,`Seat` int(11)
,`ReserveSeat` int(11)
);

-- --------------------------------------------------------

--
-- Table structure for table `seats`
--

CREATE TABLE `seats` (
  `SeatId` int(11) NOT NULL,
  `StoreId` int(11) NOT NULL,
  `Seat` int(11) NOT NULL,
  `ReserveSeat` int(11) NOT NULL,
  `TableId` int(11) NOT NULL,
  `create-date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_thai_520_w2;

--
-- Dumping data for table `seats`
--

INSERT INTO `seats` (`SeatId`, `StoreId`, `Seat`, `ReserveSeat`, `TableId`, `create-date`) VALUES
(24, 6, 2, 0, 57, '2024-07-17 22:03:56'),
(32, 13, 2, 0, 57, '2024-07-18 11:09:20');

-- --------------------------------------------------------

--
-- Table structure for table `stores`
--

CREATE TABLE `stores` (
  `StoreId` int(11) NOT NULL,
  `StoreName` varchar(100) NOT NULL,
  `Province` varchar(100) NOT NULL,
  `People` int(11) NOT NULL,
  `reserved` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_thai_520_w2;

--
-- Dumping data for table `stores`
--

INSERT INTO `stores` (`StoreId`, `StoreName`, `Province`, `People`, `reserved`) VALUES
(4, 'สินรุ่งเรือง', 'อำนาจเจริญ', 2, 0),
(5, 'อำนาจโภคภัณฑ์', 'อำนาจเจริญ', 2, 0),
(6, 'วันประเสริฐซุปเปอร์มาร์ท', 'อำนาจเจริญ', 2, 1),
(7, 'เกียรตินุชจรินทร์', 'อำนาจเจริญ', 2, 0),
(8, 'ทางเข้าน้ำปลีก', 'อำนาจเจริญ', 2, 0),
(9, 'ศรีพัชริน', 'อำนาจเจริญ', 2, 0),
(10, 'บุญช่วยพานิช', 'อำนาจเจริญ', 2, 0),
(11, 'จิตรทวี', 'อำนาจเจริญ', 2, 0),
(12, 'จึงเชียงฮวด', 'อำนาจเจริญ', 2, 0),
(13, 'พนาพนัส', 'อำนาจเจริญ', 2, 1),
(14, 'คล่องประเสริฐ', 'อำนาจเจริญ', 2, 0),
(15, 'อานนท์', 'อำนาจเจริญ', 2, 0),
(16, 'บุญประสพพาณิชย์', 'อำนาจเจริญ', 2, 0),
(17, 'ธีระวัชร', 'อำนาจเจริญ', 2, 0);

-- --------------------------------------------------------

--
-- Stand-in structure for view `table-details`
-- (See below for the actual view)
--
CREATE TABLE `table-details` (
`EventId` int(11)
,`TableId` int(11)
,`TableName` varchar(50)
,`Status` tinyint(1)
,`TotalSeat` decimal(32,0)
,`TotalReserveSeat` decimal(32,0)
,`FreeSeats` decimal(33,0)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `table-display`
-- (See below for the actual view)
--
CREATE TABLE `table-display` (
`TableId` int(11)
,`TableName` varchar(50)
,`StoreId` int(11)
,`StoreName` varchar(100)
,`SeatId` int(11)
,`Seats` decimal(32,0)
,`ReserveSeats` decimal(32,0)
);

-- --------------------------------------------------------

--
-- Table structure for table `tables`
--

CREATE TABLE `tables` (
  `TableId` int(11) NOT NULL,
  `TableName` varchar(50) NOT NULL,
  `Nickname` varchar(50) DEFAULT NULL,
  `Status` tinyint(1) NOT NULL DEFAULT 1,
  `EventId` int(11) NOT NULL,
  `create-date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_thai_520_w2;

--
-- Dumping data for table `tables`
--

INSERT INTO `tables` (`TableId`, `TableName`, `Nickname`, `Status`, `EventId`, `create-date`) VALUES
(57, 'A1', NULL, 1, 45, '2024-07-16 11:52:11'),
(58, 'A2', NULL, 1, 45, '2024-07-16 11:52:11'),
(59, 'B1', NULL, 1, 45, '2024-07-16 11:52:11'),
(60, 'B2', NULL, 1, 45, '2024-07-16 11:52:11'),
(61, 'A1', NULL, 1, 46, '2024-07-16 14:41:27'),
(62, 'A2', NULL, 1, 46, '2024-07-16 14:41:27'),
(63, 'B1', NULL, 1, 46, '2024-07-16 14:41:27'),
(64, 'B2', NULL, 1, 46, '2024-07-16 14:41:27'),
(65, 'A1', NULL, 1, 47, '2024-07-16 16:29:31'),
(66, 'A2', NULL, 1, 47, '2024-07-16 16:29:31'),
(67, 'A3', NULL, 1, 47, '2024-07-16 16:29:31'),
(68, 'B1', NULL, 1, 47, '2024-07-16 16:29:31'),
(69, 'B2', NULL, 1, 47, '2024-07-16 16:29:31'),
(70, 'B3', NULL, 1, 47, '2024-07-16 16:29:31'),
(71, 'C1', NULL, 1, 47, '2024-07-16 16:29:31'),
(72, 'C2', NULL, 1, 47, '2024-07-16 16:29:31'),
(73, 'C3', NULL, 1, 47, '2024-07-16 16:29:31');

-- --------------------------------------------------------

--
-- Structure for view `general`
--
DROP TABLE IF EXISTS `general`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `general`  AS SELECT DISTINCT `e`.`EventId` AS `EventId`, `e`.`EventName` AS `EventName`, `tb`.`TableId` AS `TableId`, `tb`.`TableName` AS `TableName`, `s`.`SeatId` AS `SeatId`, `s`.`StoreId` AS `StoreName`, `s`.`Seat` AS `Seat`, `s`.`ReserveSeat` AS `ReserveSeat` FROM ((`events` `e` left join `tables` `tb` on(`e`.`EventId` = `tb`.`EventId`)) left join `seats` `s` on(`tb`.`TableId` = `s`.`TableId`)) ;

-- --------------------------------------------------------

--
-- Structure for view `table-details`
--
DROP TABLE IF EXISTS `table-details`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `table-details`  AS SELECT `t`.`EventId` AS `EventId`, `t`.`TableId` AS `TableId`, `t`.`TableName` AS `TableName`, `t`.`Status` AS `Status`, CASE WHEN sum(`s`.`Seat`) is null THEN 0 ELSE sum(`s`.`Seat`) END AS `TotalSeat`, CASE WHEN sum(`s`.`ReserveSeat`) is null THEN 0 ELSE sum(`s`.`ReserveSeat`) END AS `TotalReserveSeat`, `e`.`NumberOfSeats`- CASE WHEN sum(`s`.`Seat`) is null THEN 0 ELSE sum(`s`.`Seat`) END AS `FreeSeats` FROM ((`tables` `t` left join `seats` `s` on(`t`.`TableId` = `s`.`TableId`)) left join `events` `e` on(`t`.`EventId` = `e`.`EventId`)) GROUP BY `t`.`EventId`, `t`.`TableId`, `t`.`TableName`, `t`.`Status`, `e`.`NumberOfSeats` ;

-- --------------------------------------------------------

--
-- Structure for view `table-display`
--
DROP TABLE IF EXISTS `table-display`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `table-display`  AS SELECT `t`.`TableId` AS `TableId`, `t`.`TableName` AS `TableName`, `s`.`StoreId` AS `StoreId`, `st`.`StoreName` AS `StoreName`, `s`.`SeatId` AS `SeatId`, CASE WHEN sum(`s`.`Seat`) is null THEN 0 ELSE sum(`s`.`Seat`) END AS `Seats`, CASE WHEN sum(`s`.`ReserveSeat`) is null THEN 0 ELSE sum(`s`.`ReserveSeat`) END AS `ReserveSeats` FROM ((`tables` `t` left join `seats` `s` on(`t`.`TableId` = `s`.`TableId`)) left join `stores` `st` on(`s`.`StoreId` = `st`.`StoreId`)) GROUP BY `t`.`TableId`, `s`.`StoreId` HAVING `s`.`StoreId` is not null ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`EventId`);

--
-- Indexes for table `seats`
--
ALTER TABLE `seats`
  ADD PRIMARY KEY (`SeatId`);

--
-- Indexes for table `stores`
--
ALTER TABLE `stores`
  ADD PRIMARY KEY (`StoreId`);

--
-- Indexes for table `tables`
--
ALTER TABLE `tables`
  ADD PRIMARY KEY (`TableId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `EventId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT for table `seats`
--
ALTER TABLE `seats`
  MODIFY `SeatId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `stores`
--
ALTER TABLE `stores`
  MODIFY `StoreId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `tables`
--
ALTER TABLE `tables`
  MODIFY `TableId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=74;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
