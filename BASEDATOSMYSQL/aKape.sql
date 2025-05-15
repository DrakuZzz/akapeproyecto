CREATE DATABASE  IF NOT EXISTS `akape` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `akape`;
-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: akape
-- ------------------------------------------------------
-- Server version	8.0.42-0ubuntu0.24.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `carrito`
--

DROP TABLE IF EXISTS `carrito`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carrito` (
  `Idclient` int NOT NULL,
  `Idproducto` int NOT NULL,
  `Cantidad` int DEFAULT NULL,
  PRIMARY KEY (`Idclient`,`Idproducto`),
  KEY `Idproducto` (`Idproducto`),
  CONSTRAINT `carrito_ibfk_1` FOREIGN KEY (`Idclient`) REFERENCES `cliente` (`Idclient`),
  CONSTRAINT `carrito_ibfk_2` FOREIGN KEY (`Idproducto`) REFERENCES `producto` (`Idproducto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carrito`
--

LOCK TABLES `carrito` WRITE;
/*!40000 ALTER TABLE `carrito` DISABLE KEYS */;
/*!40000 ALTER TABLE `carrito` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cliente`
--

DROP TABLE IF EXISTS `cliente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cliente` (
  `Idclient` int NOT NULL AUTO_INCREMENT,
  `Email` varchar(100) NOT NULL,
  `First_Name` varchar(50) DEFAULT NULL,
  `Paterno` varchar(50) DEFAULT NULL,
  `Materno` varchar(50) DEFAULT NULL,
  `Telefono` char(20) DEFAULT NULL,
  `Estado` varchar(100) DEFAULT NULL,
  `Ciudad` varchar(100) DEFAULT NULL,
  `Colonia` varchar(100) DEFAULT NULL,
  `Direccion` varchar(500) DEFAULT NULL,
  `CP` varchar(6) DEFAULT NULL,
  `Pais` varchar(50) DEFAULT 'México',
  `Descripcion` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`Idclient`),
  KEY `Email` (`Email`),
  CONSTRAINT `cliente_ibfk_1` FOREIGN KEY (`Email`) REFERENCES `usuario` (`Email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cliente`
--

LOCK TABLES `cliente` WRITE;
/*!40000 ALTER TABLE `cliente` DISABLE KEYS */;
INSERT INTO `cliente` VALUES (1,'david.ramirez75@unach.mx','David',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'México',NULL),(2,'deadlocker6@gmail.com','Charly','Ramirez','','9611553483','Chiapas','Tuxtla Gutierrez','Niño de Atocha','Calle Miguel Alemán Valdés','29037','México','Entre un terreno baldío y un edificio blanco'),(3,'david0905.rtf@gmail.com','David','Ramirez','Hernandez','9611553483',NULL,NULL,NULL,NULL,NULL,'México',NULL);
/*!40000 ALTER TABLE `cliente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comentarios`
--

DROP TABLE IF EXISTS `comentarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comentarios` (
  `idcom` int NOT NULL AUTO_INCREMENT,
  `Idclient` int NOT NULL,
  `Idproducto` int NOT NULL,
  `comentario` text NOT NULL,
  `estrellas` int DEFAULT NULL,
  `fecha` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idcom`),
  KEY `Idclient` (`Idclient`),
  KEY `Idproducto` (`Idproducto`),
  CONSTRAINT `comentarios_ibfk_1` FOREIGN KEY (`Idclient`) REFERENCES `cliente` (`Idclient`),
  CONSTRAINT `comentarios_ibfk_2` FOREIGN KEY (`Idproducto`) REFERENCES `producto` (`Idproducto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comentarios`
--

LOCK TABLES `comentarios` WRITE;
/*!40000 ALTER TABLE `comentarios` DISABLE KEYS */;
/*!40000 ALTER TABLE `comentarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comententrega`
--

DROP TABLE IF EXISTS `comententrega`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comententrega` (
  `idcom` int NOT NULL AUTO_INCREMENT,
  `Idorden` int NOT NULL,
  `Ordenestado` tinyint(1) DEFAULT '1',
  `comentario` text,
  PRIMARY KEY (`idcom`),
  KEY `Idorden` (`Idorden`),
  CONSTRAINT `comententrega_ibfk_1` FOREIGN KEY (`Idorden`) REFERENCES `orden` (`Idorden`),
  CONSTRAINT `comententrega_chk_1` CHECK ((`Ordenestado` in (1,2)))
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comententrega`
--

LOCK TABLES `comententrega` WRITE;
/*!40000 ALTER TABLE `comententrega` DISABLE KEYS */;
INSERT INTO `comententrega` VALUES (1,1,1,'Pedido enviado con fecha 14/05/2025'),(2,1,2,'Pedido entregado hoymismo');
/*!40000 ALTER TABLE `comententrega` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detalle_orden`
--

DROP TABLE IF EXISTS `detalle_orden`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detalle_orden` (
  `Idorden` int NOT NULL,
  `Idproducto` int NOT NULL,
  `Cantidad` int DEFAULT NULL,
  `Precio` decimal(11,2) DEFAULT NULL,
  `Subtotal` decimal(11,2) DEFAULT NULL,
  PRIMARY KEY (`Idorden`,`Idproducto`),
  KEY `Idproducto` (`Idproducto`),
  CONSTRAINT `detalle_orden_ibfk_1` FOREIGN KEY (`Idorden`) REFERENCES `orden` (`Idorden`),
  CONSTRAINT `detalle_orden_ibfk_2` FOREIGN KEY (`Idproducto`) REFERENCES `producto` (`Idproducto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detalle_orden`
--

LOCK TABLES `detalle_orden` WRITE;
/*!40000 ALTER TABLE `detalle_orden` DISABLE KEYS */;
INSERT INTO `detalle_orden` VALUES (1,1,2,280.00,560.00);
/*!40000 ALTER TABLE `detalle_orden` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventario`
--

DROP TABLE IF EXISTS `inventario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventario` (
  `Idproducto` int NOT NULL,
  `Cantstock` int DEFAULT NULL,
  PRIMARY KEY (`Idproducto`),
  CONSTRAINT `inventario_ibfk_1` FOREIGN KEY (`Idproducto`) REFERENCES `producto` (`Idproducto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventario`
--

LOCK TABLES `inventario` WRITE;
/*!40000 ALTER TABLE `inventario` DISABLE KEYS */;
INSERT INTO `inventario` VALUES (1,98),(2,60),(3,80),(4,50),(5,70),(6,200),(7,40),(8,120),(9,90),(10,160),(11,150),(12,140),(13,50),(14,180),(15,80),(16,190),(17,200),(18,170),(19,100),(20,120),(21,60),(22,80),(23,140),(24,240),(25,220);
/*!40000 ALTER TABLE `inventario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orden`
--

DROP TABLE IF EXISTS `orden`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orden` (
  `Idorden` int NOT NULL AUTO_INCREMENT,
  `Idclient` int DEFAULT NULL,
  `Fechaorden` datetime DEFAULT CURRENT_TIMESTAMP,
  `Fechaenvio` date DEFAULT NULL,
  `Fechaentrega` date DEFAULT NULL,
  `Ordenestado` tinyint(1) DEFAULT '0',
  `Total` decimal(11,2) DEFAULT NULL,
  `Tipopago` varchar(20) NOT NULL,
  `ultimos_digitos` varchar(4) DEFAULT NULL,
  PRIMARY KEY (`Idorden`),
  KEY `Idclient` (`Idclient`),
  CONSTRAINT `orden_ibfk_1` FOREIGN KEY (`Idclient`) REFERENCES `cliente` (`Idclient`),
  CONSTRAINT `orden_chk_1` CHECK ((`Ordenestado` in (0,1,2)))
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orden`
--

LOCK TABLES `orden` WRITE;
/*!40000 ALTER TABLE `orden` DISABLE KEYS */;
INSERT INTO `orden` VALUES (1,2,'2025-05-14 18:09:51','2025-05-14','2025-05-14',2,570.00,'Tarjeta de crédito','456');
/*!40000 ALTER TABLE `orden` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `producto`
--

DROP TABLE IF EXISTS `producto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `producto` (
  `Idproducto` int NOT NULL AUTO_INCREMENT,
  `Estado` tinyint(1) DEFAULT '1',
  `Nombre` varchar(100) DEFAULT NULL,
  `Precio` decimal(11,2) DEFAULT NULL,
  `Unidad` char(20) DEFAULT NULL,
  `Categoria` varchar(60) DEFAULT NULL,
  `Descripcion` text,
  `Imagen` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`Idproducto`),
  CONSTRAINT `producto_chk_1` CHECK ((`Estado` in (0,1)))
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `producto`
--

LOCK TABLES `producto` WRITE;
/*!40000 ALTER TABLE `producto` DISABLE KEYS */;
INSERT INTO `producto` VALUES (1,1,'Café Orgánico “Tradiciones” 1 Kg',280.00,'kg','Café en grano','Café orgánico de Chiapas, tueste medio, 100% arábica. Molido o en grano a tu elección. Cultivado por comunidades indígenas Tzotziles y Tzeltales en los Altos de Chiapas (Chenalhó, Pantelhó, Oxchuc, Cancuc, Tenejapa), es una mezcla suave, orgánica y libre de químicos, elaborada con granos seleccionados bajo principios de comercio justo. Como chiapanecos orgullosos de nuestras raíces y sabores, queremos compartir contigo el auténtico aroma de nuestra tierra, para que disfrutes momentos especiales con quienes más quieres.','images/productos/1747017737283-744932695.png'),(2,1,'Café Orgánico “Tradiciones Con Canela” 500 g',160.00,'bolsa 500g','Café en grano','Café Orgánico “Tradiciones con Canela” de Chiapas, 500 g, molido o en grano a tu elección. Una mezcla suave con un toque de canela, cultivada por comunidades indígenas Tzotziles y Tzeltales en los Altos de Chiapas (Chenalhó, Pantelhó, Oxchuc, Cancuc, Tenejapa). Libre de químicos, orgánico y de comercio justo, este café refleja el sabor auténtico de nuestra tierra. Como chiapanecos, queremos compartir contigo lo mejor de nuestra tradición para que disfrutes momentos únicos y llenos de aroma.','images/productos/1747017775298-823178112.png'),(3,1,'Café Orgánico “Tradiciones Con Cacao” 1 Kg',300.00,'kg','Café en grano','Café Orgánico “Tradiciones con Cacao” de Chiapas, 1 kg, molido o en grano a tu elección. Mezcla suave con un toque natural de cacao, cultivado por productores Tzotziles y Tzeltales en los Altos de Chiapas (Chenalhó, Pantelhó, Oxchuc, Cancuc, Tenejapa). Orgánico, libre de químicos y bajo prácticas de comercio justo, este café refleja la riqueza de nuestra tierra. Como chiapanecos, te invitamos a disfrutar su sabor único y compartir momentos especiales llenos de tradición y aroma.','images/productos/1747017819171-718524439.png'),(4,1,'Café Orgánico “Gourmet” 1 Kg',320.00,'kg','Café en grano','Café Orgánico “Gourmet” de Chiapas, 1 kg en grano, elaborado con granos 100% arábica cultivados a 1400 msnm en Jaltenango de la Paz. Esta selección gourmet, de calidad de exportación, ofrece un aroma intenso, acidez brillante y un perfil de sabor con notas a caramelo, chocolate oscuro y nuez. De cuerpo ligero y sedoso, es ideal para prensa francesa, espresso o molino integrado. Proceso lavado, 100% natural y sostenible, sin químicos ni pesticidas. Disfruta hasta 125 tazas de una experiencia cafetera excepcional, cultivada con orgullo en tierras chiapanecas.','images/productos/1747017862627-943465541.png'),(5,1,'Café Orgánico “Tradiciones Con Cacao” 500 g',170.00,'bolsa 500g','Café en grano','Café Orgánico “Tradiciones con Cacao” de Chiapas, 500 g, molido o en grano a tu elección. Mezcla suave con un toque natural de cacao, ideal para regalo. Cultivado por comunidades indígenas Tzotziles y Tzeltales en los Altos de Chiapas (Chenalhó, Pantelhó, Oxchuc, Cancuc, Tenejapa), es un café orgánico, libre de químicos y de comercio justo. Como orgullosos chiapanecos, compartimos contigo el sabor auténtico de nuestra tierra para que vivas momentos especiales llenos de tradición y aroma.','images/productos/1747017929191-443775203.png'),(6,1,'Café macchiato',45.00,'taza','Bebida caliente','Café Macchiato: espresso intenso elaborado con granos chiapanecos, coronado con un delicado toque de leche espumada. Una bebida equilibrada que combina la fuerza del café puro con la suavidad cremosa de la leche. Ideal para disfrutar solo o acompañado de un pan artesanal o galletas caseras, en cualquier momento del día.','images/productos/1747017960028-224866238.png'),(7,1,'Café con licor',60.00,'taza','Bebida caliente','¡Nada mejor que un café acompañado con tu licor favorito! Lo mejor es que tú decides qué toque especial darle a tu café.\nEl Café con licor es una bebida deliciosa que combina el café con un toque de licor, como el whisky o el ron. La adición de licor aporta ese toque distintivo e ideal mientras que el Colcafé Intenso te llena de energía y te ayuda a despertar todos tus sentidos.','images/productos/1747017985191-576186163.png'),(8,1,'Smothiee',50.00,'vaso','Bebida fría','Refrescante bebida natural elaborada con frutas tropicales de la región como mango, plátano o maracuyá, mezcladas con hielo y un toque de miel. Una opción saludable, vibrante y deliciosa para disfrutar en días calurosos y llenarte de energía con el sabor auténtico del trópico.','images/productos/1747018011648-991179865.png'),(9,1,'Café con leche evaporada',48.00,'taza','Bebida caliente','Café robusto con leche evaporada, una combinación que ofrece textura sedosa y un sabor ligeramente dulce. Inspirado en las preparaciones tradicionales de los hogares chiapanecos, es una bebida reconfortante que evoca calidez, tradición y el sabor auténtico de casa.','images/productos/1747018046601-864671314.png'),(10,1,'Donas',25.00,'pieza','Café en grano','Esponjosas donas glaseadas con vainilla o chocolate, horneadas a diario para garantizar frescura y sabor. El acompañamiento ideal para un café de olla, un latte o cualquier momento que merezca un dulce toque artesanal.','images/productos/1747018067232-796422114.png'),(11,1,'Rollos de canela',30.00,'pieza','Café en grano','Pan suave y esponjoso, enrollado con canela y azúcar, horneado hasta dorar y cubierto con un delicado glaseado. Perfecto para acompañar el café orgánico “Tradiciones con Canela” y disfrutar un momento cálido y lleno de sabor tradicional.','images/productos/1747018092230-708887534.png'),(12,1,'Pastelitos',35.00,'pieza','Café en grano','Mini delicias esponjosas de chocolate, vainilla o fresa, decoradas a mano con cuidado. Perfectas para compartir, regalar o disfrutar junto a un café moka y consentirte con un toque dulce en cualquier momento del día.','images/productos/1747018115336-708725667.png'),(13,1,'Café con helado',55.00,'vaso','Bebida fría','Café frío vertido sobre una bola de helado artesanal de vainilla, creando un delicioso contraste entre el amargor del café y la dulzura cremosa del helado. Una experiencia refrescante y sofisticada, ideal para los amantes del café con un toque dulce.','images/productos/1747018137672-441518240.png'),(14,1,'Café con leche',40.00,'taza','Bebida caliente','Clásico reconfortante elaborado con café chiapaneco y leche caliente en la proporción ideal. Suave, cremoso y lleno de sabor, es perfecto para quienes buscan una bebida cálida y equilibrada, sin perder el carácter auténtico del café. Ideal para cualquier momento del día, ya sea para comenzar la mañana con calma o acompañar una charla tranquila.','images/productos/1747018356580-559810316.png'),(15,1,'Café con leche de almendra',50.00,'taza','Bebida caliente','Opción vegana elaborada con leche de almendra tostada, que aporta un sutil matiz a nuez al café. Sin lácteos, ligera y deliciosa, conserva todo el sabor y aroma del café chiapaneco, ideal para quienes buscan una alternativa vegetal sin sacrificar calidad ni disfrute.','images/productos/1747018380062-499214590.png'),(16,1,'Café expreso',35.00,'taza','Bebida caliente','La esencia pura del grano chiapaneco: un café corto, intenso y con una cremosa capa dorada. Perfecto para los puristas que buscan una experiencia auténtica y valoran los sabores profundos y ricos que solo el café de Chiapas puede ofrecer.','images/productos/1747018413901-853373905.png'),(17,1,'Café americano',38.00,'taza','Bebida caliente','El espresso alargado con agua caliente es una versión suave pero aromática del espresso. Al diluirlo con agua caliente, se reduce su intensidad sin perder sabor. Perfecto para acompañar postres como rollos de canela, ya que equilibra su dulzor sin dominarlo. Ideal para quienes prefieren un café más ligero, pero con carácter.','images/productos/1747018498542-252769338.png'),(18,1,'Capuchino',45.00,'taza','Bebida caliente','Un espresso fuerte, leche vaporizada y espuma en capas perfectamente equilibradas, decorado con canela o cacao. Ideal para mañanas lluviosas en Chiapas, esta bebida reconfortante te envuelve en calidez y sabor, perfecta para disfrutar lentamente en cualquier momento del día.','images/productos/1747018521547-26485397.png'),(19,1,'Moka',50.00,'taza','Bebida caliente','Fusión de café orgánico chiapaneco, chocolate artesanal y leche vaporizada, creando una bebida rica y reconfortante. Un verdadero tributo a los sabores locales, destacando el cacao de la región para ofrecer una experiencia única y deliciosa que honra las tradiciones de Chiapas.','images/productos/1747018542575-854740335.png'),(20,1,'Latte',45.00,'taza','Bebida caliente','Espresso combinado con una generosa cantidad de leche vaporizada, creando una textura suave y sedosa. Perfecto para acompañar con pastelitos o pan dulce, ideal para disfrutar de un momento relajante y lleno de sabor.','images/productos/1747018562807-895935920.png'),(21,1,'Frappé',55.00,'vaso','Bebida fría','Café chiapaneco licuado con hielo, crema batida y sirope, creando una bebida fría, energética y refrescante. Ideal para el clima cálido, combina el sabor intenso del café con la suavidad de la crema y el toque dulce del sirope. Perfecto para revitalizarte durante el día.','images/productos/1747018585932-288772638.png'),(22,1,'Café helado',48.00,'vaso','Bebida fría','Café negro o con leche servido sobre hielo, una opción refrescante que conserva todo el perfil de sabor característico del café chiapaneco. Añade un toque de canela para realzar su aroma y darle un giro especial a esta bebida perfecta para cualquier momento cálido.','images/productos/1747018607109-324432611.png'),(23,1,'Café de olla',42.00,'taza','Bebida caliente','Elaborado con piloncillo, canela y clavo, infusionado en barro para resaltar sus sabores auténticos. Esta bebida tradicional chiapaneca evoca las raíces ancestrales de la región, ofreciendo una experiencia cálida y reconfortante que conecta con la cultura y tradición local.','images/productos/1747018627631-471509622.png'),(24,1,'Pan',20.00,'pieza','Café en grano','Hecho diariamente con harina local, este pan se ofrece en variedades como pan de yema o con ajonjolí. Su textura suave y esponjosa lo convierte en el acompañamiento perfecto para mojar en café, brindando una experiencia deliciosa y tradicional en cada bocado.','images/productos/1747018650315-141146071.png'),(25,1,'Galletas',15.00,'pieza','Café en grano','Galletas caseras de mantequilla o chispas de chocolate, crujientes y horneadas al momento. El acompañamiento clásico para un espresso o té, perfectas para disfrutar en cualquier ocasión con su sabor fresco y delicioso.','images/productos/1747018670367-392872717.png');
/*!40000 ALTER TABLE `producto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `Email` varchar(50) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `Admin` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`Email`),
  UNIQUE KEY `Email` (`Email`),
  CONSTRAINT `usuario_chk_1` CHECK ((`Admin` in (0,1,3)))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES ('david.ramirez75@unach.mx','$2a$10$xSHty9JGH7UV/VwFZn/KKOzhH4K2I4/dXaP0dIcVsnhiiBnzlAFPe',1),('david0905.rtf@gmail.com','$2a$10$Tcs4JQMsod0GNxJ/jzfx4OHPr0nP/iw46heX2XSNBEewIkICqtd8a',3),('deadlocker6@gmail.com','$2a$10$ehMElf1JRgIBaYsQKpr7a.oCBsUzhYiu1Zj2LKqjm5CnYpk26l846',0);
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'akape'
--

--
-- Dumping routines for database 'akape'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-14 18:55:40
