-- CreateTable
CREATE TABLE "UserModel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "phone" TEXT,
    "hashpassword" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'User',
    "avatar" TEXT,
    "isActive" BOOLEAN NOT NULL,
    "role" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "FirstLevelCategory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "alias" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "SecondLevelCategory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "alias" TEXT NOT NULL,
    "firstLevelId" TEXT NOT NULL,
    CONSTRAINT "SecondLevelCategory_firstLevelId_fkey" FOREIGN KEY ("firstLevelId") REFERENCES "FirstLevelCategory" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Favorite" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "modelId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Favorite_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "ModelDevice" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserModel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ModelDevice" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "alias" TEXT NOT NULL,
    "image" TEXT,
    "Description" TEXT,
    "secondCategoryId" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    CONSTRAINT "ModelDevice_secondCategoryId_fkey" FOREIGN KEY ("secondCategoryId") REFERENCES "SecondLevelCategory" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "ModelDevice_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "pictures" TEXT,
    "comment" TEXT NOT NULL,
    "writtenById" TEXT NOT NULL,
    "modelDeviceId" TEXT NOT NULL,
    CONSTRAINT "Comment_writtenById_fkey" FOREIGN KEY ("writtenById") REFERENCES "UserModel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Comment_modelDeviceId_fkey" FOREIGN KEY ("modelDeviceId") REFERENCES "ModelDevice" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "Rating" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "number" INTEGER NOT NULL,
    "writtenById" TEXT NOT NULL,
    "modelDeviceId" TEXT NOT NULL,
    CONSTRAINT "Rating_writtenById_fkey" FOREIGN KEY ("writtenById") REFERENCES "UserModel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Rating_modelDeviceId_fkey" FOREIGN KEY ("modelDeviceId") REFERENCES "ModelDevice" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "Brand" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "BrandOnSecondCategory" (
    "brandId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    PRIMARY KEY ("brandId", "categoryId"),
    CONSTRAINT "BrandOnSecondCategory_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "BrandOnSecondCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "SecondLevelCategory" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "UserModel_email_key" ON "UserModel"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserModel_login_key" ON "UserModel"("login");

-- CreateIndex
CREATE UNIQUE INDEX "UserModel_phone_key" ON "UserModel"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "SecondLevelCategory_name_key" ON "SecondLevelCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ModelDevice_name_key" ON "ModelDevice"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ModelDevice_alias_key" ON "ModelDevice"("alias");

-- CreateIndex
CREATE UNIQUE INDEX "Brand_name_key" ON "Brand"("name");
