-- CreateTable
CREATE TABLE `medicamentos` (
    `gtin` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `laboratorio` VARCHAR(191) NOT NULL,
    `imagemCaixa` VARCHAR(191) NOT NULL,
    `imagemCodigoBarras` VARCHAR(191) NOT NULL,
    `precoMin` DOUBLE NOT NULL,
    `precoMed` DOUBLE NOT NULL,
    `precoMax` DOUBLE NOT NULL,
    `idProduto` INTEGER,
    `registro` VARCHAR(191),
    `bula` VARCHAR(191),
    `criacao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modificacao` DATETIME(3) NOT NULL,
    `status` ENUM('INATIVO', 'ATIVO') NOT NULL DEFAULT 'ATIVO',

    INDEX `medicamentos.nome_idProduto_registro_index`(`nome`, `idProduto`, `registro`),
    PRIMARY KEY (`gtin`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
