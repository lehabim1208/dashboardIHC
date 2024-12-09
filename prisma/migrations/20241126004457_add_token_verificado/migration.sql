/*
  Warnings:

  - You are about to drop the `usuarios` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `usuarios`;

-- CreateTable
CREATE TABLE `usuario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(255) NOT NULL,
    `apellidos` VARCHAR(255) NOT NULL,
    `correo` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `fecha_creacion` TIMESTAMP(0) NULL,
    `verificado` BOOLEAN NULL DEFAULT false,

    UNIQUE INDEX `correo`(`correo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
