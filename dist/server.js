const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 777;
const DATA_FILE = path.join(__dirname, 'maniler.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function readManiler() {
  const data = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(data);
}

function writeManiler(maniler) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(maniler, null, 2), 'utf-8');
}

// Rastgele mani getir
app.get('/api/mani', (req, res) => {
  const maniler = readManiler();
  if (maniler.length === 0) {
    return res.status(404).json({ error: 'Henüz mani yok, ilk maniyi sen ekle!' });
  }
  const rastgele = maniler[Math.floor(Math.random() * maniler.length)];
  res.json({ mani: rastgele.mani, rumuz: rastgele.rumuz || 'anonim', toplam: maniler.length });
});

// Yeni mani ekle
app.post('/api/mani', (req, res) => {
  const { mani, rumuz } = req.body;
  if (!mani || mani.trim().length < 10) {
    return res.status(400).json({ error: 'Mani en az 10 karakter olmalı!' });
  }
  if (mani.trim().length > 500) {
    return res.status(400).json({ error: 'Mani en fazla 500 karakter olabilir!' });
  }
  const temizRumuz = (rumuz || '').trim().slice(0, 30) || 'anonim';
  const maniler = readManiler();
  maniler.push({ mani: mani.trim(), rumuz: temizRumuz });
  writeManiler(maniler);
  res.json({ mesaj: 'Mani eklendi!', toplam: maniler.length });
});

// Toplam mani sayısı
app.get('/api/sayac', (req, res) => {
  const maniler = readManiler();
  res.json({ toplam: maniler.length });
});

app.listen(PORT, () => {
  console.log('Mani Cek calisiyor: port ' + PORT);
});
