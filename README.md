# Farmer Market Connection

## Fariin ku socota dadka daawanaya

Ku soo dhowaada **Farmer Market Connection**. Mashruucan waxaa loo sameeyay in uu si fudud isugu xiro beeraleyda iyo dadka doonaya inay iibsadaan wax-soo-saarka beeraha.

- Haddii aad tahay **Farmer**, waxaad ku dari kartaa beertaada iyo badeecooyinka aad iibinayso.
- Haddii aad tahay **Buyer**, waxaad raadin kartaa wax-soo-saar cusub, dalban kartaa, la socon kartaa delivery-ga, kuna bixin kartaa mobile wallet.
- Haddii aad tahay **Admin**, waxaad maamuli kartaa users, farms, products, categories, iyo orders.

Ujeeddada mashruucu waa in beeraleydu si sahlan u helaan suuq, buyers-kuna ay helaan dalag cusub oo laga keenay beeraley la yaqaan. Hoos waxaa ku qoran sida system-ku u shaqeeyo iyo sida loo bilaabo.

## Technology

- **Frontend:** React, Vite, Tailwind CSS, Axios, React Router
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Security:** JWT iyo bcrypt
- **Images:** Multer local uploads

## Project Structure

```text
farmer-market-connection/
├── backend/     # Express API, MongoDB models, controllers, routes
├── frontend/    # React + Vite user interface
└── README.md
```

## Frontend ↔ Backend Connection

Frontend-ku wuxuu Axios ugu xirmaa backend-ka iyadoo la adeegsanayo `VITE_API_URL`.

```env
# frontend/.env
VITE_API_URL=http://localhost:9003/api
```

Backend-ku wuxuu aqbalaa frontend-ka ku qoran `CLIENT_URL`.

```env
# backend/.env
PORT=9003
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=use_a_long_random_secret
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Ha gelin `.env` Git; isticmaal [backend/.env.example](backend/.env.example) sida template.

## Run the Project

Fur laba terminal.

```bash
# Terminal 1: backend
cd backend
npm install
npm run dev
```

```bash
# Terminal 2: frontend
cd frontend
npm install
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:9003/api`
- Health check: `http://localhost:9003/api/health`

## Project Workflow

1. **Register iyo Login**
   - Public registration-ku wuxuu u furan yahay Buyer iyo Farmer.
   - Admin accounts waa in maamulka platform-ka sameeyaa.
   - JWT ayaa ilaalisa bogagga iyo API-yada u gaarka ah role kasta.

2. **Farmer: Farm iyo Products**
   - Farmer-ku wuxuu sameystaa ama cusboonaysiiyaa farm profile-kiisa.
   - Wuxuu ku daraa products: magac, category, qiime, quantity, location, harvest date, description, iyo sawir.

3. **Buyer: Browse iyo Order**
   - Buyer-ku wuxuu raadiyaa products iyo farms.
   - Wuxuu arkaa product details kadibna sameeyaa order request.

4. **Payment**
   - Farmer-ku marka hore ayuu aqbalaa order-ka.
   - Buyer-ku wuxuu doortaa EVC Plus, SAAD, ama e-Dahab, kadibna geliyaa mobile number iyo transaction reference.
   - Farmer-ku wuxuu xaqiijiyaa transfer-ka; payment status-ku wuxuu noqdaa **PAID**.

5. **Order Fulfillment**
   - Order-ku wuxuu maraa:
     `PENDING` → `ACCEPTED` → `PROCESSING` → `READY_FOR_DELIVERY` → `OUT_FOR_DELIVERY` → `DELIVERED` → `COMPLETED`.
   - Stock-ga hal mar ayuu yaraadaa marka order la aqbalo, wuxuuna soo noqdaa haddii order la diido ama la cancel-gareeyo.

6. **Admin Management**
   - Admin-ku wuxuu maamulaa users, farms, products, categories, iyo orders.
   - Admin-ku wuxuu arkaa dashboard statistics iyo waxqabadka guud ee platform-ka.

## Main API Groups

| API route | Shaqada |
| --- | --- |
| `/api/auth` | Register, login, profile, iyo JWT authentication |
| `/api/products` | Product listing, create, edit, delete, iyo image upload |
| `/api/farms` | Farm profiles iyo verification |
| `/api/orders` | Orders, status updates, iyo payment confirmation |
| `/api/categories` | Product categories |
| `/api/reviews` | Buyer reviews ee farmer-ka |
| `/api/admin` | Admin dashboard iyo management |

## Team

Mashruucan waxaa dhisay:

- Abdikani Farah Ali
- Salad Ibrahim Mohamed
- Abdijaliil Mohamed Abdulle
