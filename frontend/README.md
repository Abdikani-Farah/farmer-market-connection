# Farmer Market Connection

Farmer Market Connection waa MERN application isku xirta beeraleyda, iibsadayaasha, iyo maamulka suuqa. Waxay ka dhigtaa iibinta wax-soo-saarka beeraha mid sahlan, laga bilaabo soo-gelinta badeecadda ilaa delivery iyo xaqiijinta lacag-bixinta.

## Project Workflow

1. **Register iyo Login**
   - User-ku wuxuu sameystaa account isagoo ah Farmer, Buyer, ama Admin.
   - JWT ayaa ilaalisa bogagga iyo API-yada u gaarka ah role kasta.

2. **Farmer: Farm iyo Products**
   - Farmer-ku wuxuu sameystaa ama cusboonaysiiyaa farm profile-kiisa.
   - Wuxuu ku daraa agricultural products: magac, category, qiime, quantity, location, harvest date, description, iyo sawir.

3. **Buyer: Browse iyo Order**
   - Buyer-ku wuxuu raadiyaa ama filter-gareeyaa products iyo farms.
   - Wuxuu arkaa product details kadibna sameeyaa order request.
   - Buyer-ku wuxuu doortaa EVC Plus, SAAD, ama e-Dahab sida payment method.

4. **Payment Verification**
   - Buyer-ku wuxuu lacagta ugu diraa farmer-ka mobile wallet-kiisa.
   - Wuxuu geliyaa lambarka mobile wallet-ka iyo transaction reference-ka.
   - Farmer-ku wuxuu xaqiijiyaa payment-ka; kadib payment status-ku wuxuu noqdaa **PAID**.

5. **Order Fulfillment**
   - Farmer-ku wuu aqbali karaa ama diidi karaa order request-ka.
   - Order-ku wuxuu maraa: `PENDING` → `ACCEPTED` → `PROCESSING` → `READY FOR DELIVERY` → `OUT FOR DELIVERY` → `DELIVERED` → `COMPLETED`.
   - Buyer-ku wuxuu la socdaa status-ka dalabkiisa, xaqiijin karaa inuu helay, kana tagi karaa review.

6. **Admin Management**
   - Admin-ku wuxuu maamulaa users, farms, products, categories, iyo orders.
   - Admin-ku wuxuu arkaa dashboard statistics iyo guud ahaan waxqabadka platform-ka.

## Team

Mashruucan waxaa dhisay:

- Abdikani Farah Ali
- Salad Ibrahim Mohamed
- Abdijaliil Mohamed Abdulle

## Frontend Setup

```bash
npm install
npm run dev
```

Frontend-ka wuxaa ku dhisnay React, Vite, Tailwind CSS, Axios, iyo React Router.
