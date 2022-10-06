const { initializeApp } = require("firebase/app");
const {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} = require("firebase/storage");
const { ProductImgs } = require("../models/ProductImgs.model");
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  appId: process.env.FIREBASE_APP_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);

const uploadProductImgs = async (imgs, productId) => {
  const imgsPromises = imgs.map(async (img) => {
    const [originalName, ext] = img.originalname.split(".");
    const filename = `products/${productId}/${originalName}-${Date.now()}.${ext}`;
    const imgRef = ref(storage, filename);
    const result = await uploadBytes(imgRef, img.buffer);
    await ProductImgs.create({
      productId,
      imgUrl: result.metadata.fullPath,
    });
  });

  await Promise.all(imgsPromises);
};

const getProductImgsUrls = async (products) => {
  const productsWithImgsPromises = products.map(async (product) => {
    const productsImgsPromises = product.productImgs.map(async (productImg) => {
      const imgRef = ref(storage, productImg.imgUrl);
      const imgUrl = await getDownloadURL(imgRef);

      productImg.imgUrl = imgUrl;
      return productImg;
    });
    const productImgs = await Promise.all(productsImgsPromises);
    products.productImgs = productImgs;
    return product;
  });

  return await Promise.all(productsWithImgsPromises);
};

module.exports = { storage, getProductImgsUrls, uploadProductImgs };
