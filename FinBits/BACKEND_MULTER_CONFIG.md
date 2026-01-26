# Backend Multer Configuration untuk Target Wants

## Issue
Frontend mengirim file dengan key `item_image` tapi backend tidak menerima dengan benar.

## Solution
Pastikan multer middleware di backend dikonfigurasi dengan field name `item_image`:

### Untuk route ADD (/finance/wants/add):
```javascript
router.post('/add', 
  authenticateToken, 
  upload.single('item_image'),  // ← Field name harus 'item_image'
  wantsController.addWant
);
```

### Untuk route EDIT (/finance/wants/edit/:want_id):
```javascript
router.put('/edit/:want_id', 
  authenticateToken, 
  upload.single('item_image'),  // ← Field name harus 'item_image'
  wantsController.updateWant
);
```

## Multer Configuration Example:
```javascript
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/wants/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'want-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('File type not allowed'));
    }
  }
});

module.exports = upload;
```

## Frontend Flow:
1. User upload image di AddWants/EditWants
2. FormData dikirim dengan key `item_image`
3. Backend menerima di `req.file`
4. Backend menyimpan path ke database di field `image_url`
5. GET request mengembalikan `image_url` dengan path file

## Testing:
1. Add wants dengan image → Check console logs
2. Verify FormData contents di browser DevTools Network tab
3. Check backend logs untuk melihat apakah file diterima
4. Verify database apakah `image_url` tersimpan dengan benar
