const express = require('express');
const cors = require('cors');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { execFile } = require('child_process');
const { PDFDocument } = require('pdf-lib');
const docx = require('docx');
const mammoth = require('mammoth');
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');

const app = express();
const PORT = process.env.PORT || 3000;

// Directories
const DATA_DIR = path.join(__dirname, 'data');
const UPLOADS_DIR = path.join(__dirname, 'uploads');
const CONVERTED_DIR = path.join(__dirname, 'converted');
const DB_FILE = path.join(DATA_DIR, 'db.json');

[DATA_DIR, UPLOADS_DIR, CONVERTED_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Initial Database seed
function loadDb() {
  if (!fs.existsSync(DB_FILE)) {
    const initialDb = {
      tasks: [
        { id: uuidv4(), title: 'Review Q4 design assets', priority: 'High', description: 'Prepare vector stickers & ribbons', completed: false, createdAt: new Date().toISOString() },
        { id: uuidv4(), title: 'Export stationery print mockups', priority: 'Medium', description: 'Check CMYK 300dpi profiles', completed: false, createdAt: new Date().toISOString() },
        { id: uuidv4(), title: 'Update Notion workspace theme', priority: 'Low', description: 'Botanical linen palette synchronization', completed: false, createdAt: new Date().toISOString() },
        { id: uuidv4(), title: 'Send feedback to sashcreativehub', priority: 'Done', description: 'Reference slides appreciation', completed: true, createdAt: new Date().toISOString() },
        { id: uuidv4(), title: 'Desktop inspiration moodboard', priority: 'Medium', description: 'Pressed petals & vintage stamps', completed: false, createdAt: new Date().toISOString() }
      ],
      links: [
        { id: uuidv4(), title: 'OmniDesk Core Repo', desc: 'Source code & releases', url: 'https://github.com', tag: '★ 142 stars', badge: 'v1.4', icon: 'github' },
        { id: uuidv4(), title: 'Assets & Design Vault', desc: 'Cloud drive print assets', url: 'https://drive.google.com', tag: '18.4 GB', badge: 'Shared', icon: 'drive' },
        { id: uuidv4(), title: 'Workspace & Sprints', desc: 'Notion board & specs', url: 'https://notion.so', tag: 'Sprint 42', badge: 'Updated', icon: 'notion' },
        { id: uuidv4(), title: 'Figma Design System', desc: 'Components & tokens', url: 'https://figma.com', tag: 'v2.1 Master', badge: 'UI Kit', icon: 'figma' }
      ],
      events: [
        { id: uuidv4(), title: 'Morning Botanical Sketching', time: '09:00 - 10:30', tag: 'Creative', note: 'Pressed flora studies' },
        { id: uuidv4(), title: 'Design Review & Sync', time: '11:00 - 12:00', tag: 'Meeting', note: 'Dashboard components critique' },
        { id: uuidv4(), title: 'Asset Production & Export', time: '14:00 - 16:30', tag: 'Focus', note: 'Batch format packaging' }
      ]
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2));
    return initialDb;
  }
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch (err) {
    console.error('Error reading db.json, returning defaults', err);
    return { tasks: [], links: [], events: [] };
  }
}

function saveDb(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/converted', express.static(CONVERTED_DIR));

// Configure Multer for Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `${basename}-${Date.now()}${ext}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 30 * 1024 * 1024 } // 30MB
});

/* ==========================================================================
   CONVERTER API (Images, PDF, Word DOCX, Text)
   ========================================================================== */
app.post('/api/convert', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    const targetFormat = (req.body.targetFormat || 'webp').toLowerCase().trim();
    const originalPath = req.file.path;
    const originalName = req.file.originalname;
    const originalExt = path.extname(originalName).toLowerCase();
    const baseName = path.parse(originalName).name.replace(/[^a-zA-Z0-9_-]/g, '_');
    const outputFilename = `${baseName}-converted-${Date.now()}.${targetFormat}`;
    const outputPath = path.join(CONVERTED_DIR, outputFilename);

    const originalStats = fs.statSync(originalPath);
    const originalSize = originalStats.size;

    // Helper: Wrap plain text in a stylish Word DOCX document
    const createDocxFromText = async (text, outPath) => {
      const { Document, Packer, Paragraph, TextRun, HeadingLevel } = docx;
      const paragraphs = text.split(/\r?\n/).map(line => {
        if (!line.trim()) {
          return new Paragraph({ text: '' });
        }
        return new Paragraph({
          children: [
            new TextRun({
              text: line,
              size: 24, // 12pt
              font: 'Plus Jakarta Sans'
            })
          ],
          spacing: { after: 120 }
        });
      });

      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({
              text: originalName,
              heading: HeadingLevel.TITLE,
              spacing: { after: 200 }
            }),
            ...paragraphs
          ]
        }]
      });

      const buffer = await Packer.toBuffer(doc);
      fs.writeFileSync(outPath, buffer);
    };

    // Helper: Wrap text in a neat PDF document using pdf-lib
    const createPdfFromText = async (text, outPath) => {
      const { StandardFonts, rgb } = require('pdf-lib');
      const pdfDoc = await PDFDocument.create();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      const margin = 50;
      const fontSize = 11;
      const lineHeight = 16;
      const pageWidth = 595.28; // A4
      const pageHeight = 841.89;
      const usableWidth = pageWidth - margin * 2;

      let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
      let y = pageHeight - margin;

      // Title
      currentPage.drawText(originalName, {
        x: margin,
        y: y,
        size: 16,
        font: boldFont,
        color: rgb(0.43, 0.15, 0.20) // Deep burgundy theme
      });
      y -= 30;

      // Divider line
      currentPage.drawLine({
        start: { x: margin, y: y },
        end: { x: pageWidth - margin, y: y },
        thickness: 1,
        color: rgb(0.85, 0.80, 0.80)
      });
      y -= 20;

      const lines = text.split(/\r?\n/);
      for (const rawLine of lines) {
        // Break long lines if needed
        const words = rawLine.split(' ');
        let currentLine = '';

        for (const word of words) {
          const testLine = currentLine ? `${currentLine} ${word}` : word;
          const textWidth = font.widthOfTextAtSize(testLine, fontSize);
          if (textWidth > usableWidth && currentLine) {
            if (y < margin + 20) {
              currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
              y = pageHeight - margin;
            }
            currentPage.drawText(currentLine, { x: margin, y, size: fontSize, font, color: rgb(0.18, 0.11, 0.12) });
            y -= lineHeight;
            currentLine = word;
          } else {
            currentLine = testLine;
          }
        }

        if (currentLine) {
          if (y < margin + 20) {
            currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
            y = pageHeight - margin;
          }
          currentPage.drawText(currentLine, { x: margin, y, size: fontSize, font, color: rgb(0.18, 0.11, 0.12) });
          y -= lineHeight;
        }
      }

      const pdfBytes = await pdfDoc.save();
      fs.writeFileSync(outPath, pdfBytes);
    };

    // Helper: Convert Image to PDF
    const createImageToPdf = async (imagePath, outPath) => {
      const pdfDoc = await PDFDocument.create();
      // Ensure image is converted to png or jpeg buffer for pdf-lib embedding
      const pngBuffer = await sharp(imagePath).png().toBuffer();
      const embeddedImage = await pdfDoc.embedPng(pngBuffer);
      const imgDims = embeddedImage.scale(1);

      // Fit inside A4 or use image dimensions with margins
      const pageWidth = imgDims.width + 80;
      const pageHeight = imgDims.height + 80;
      const page = pdfDoc.addPage([pageWidth, pageHeight]);

      page.drawImage(embeddedImage, {
        x: 40,
        y: 40,
        width: imgDims.width,
        height: imgDims.height,
      });

      const pdfBytes = await pdfDoc.save();
      fs.writeFileSync(outPath, pdfBytes);
    };

    // 1. CONVERT TO PDF
    if (targetFormat === 'pdf') {
      if (['.png', '.jpg', '.jpeg', '.webp', '.tiff', '.avif', '.gif'].includes(originalExt)) {
        await createImageToPdf(originalPath, outputPath);
      } else if (originalExt === '.docx') {
        const docxBuffer = fs.readFileSync(originalPath);
        const textResult = await mammoth.extractRawText({ buffer: docxBuffer });
        await createPdfFromText(textResult.value, outputPath);
      } else if (['.txt', '.md', '.json', '.csv'].includes(originalExt)) {
        const textContent = fs.readFileSync(originalPath, 'utf8');
        await createPdfFromText(textContent, outputPath);
      } else {
        throw new Error(`Converting ${originalExt} to PDF is not supported.`);
      }
    }
    // 2. CONVERT TO WORD (.DOCX)
    else if (targetFormat === 'docx' || targetFormat === 'doc') {
      if (originalExt === '.pdf') {
        // High-fidelity layout conversion using pdf2docx
        const pythonScript = path.join(__dirname, 'convert_pdf.py');
        const runPythonConversion = () => new Promise((resolve, reject) => {
          execFile('python', [pythonScript, originalPath, outputPath], (error, stdout, stderr) => {
            if (error) {
              console.warn('pdf2docx failed, fallback to text extractor:', stderr || error.message);
              resolve(false);
            } else {
              resolve(true);
            }
          });
        });

        const pythonSuccess = await runPythonConversion();
        if (!pythonSuccess || !fs.existsSync(outputPath)) {
          // Fallback extraction
          const pdfData = new Uint8Array(fs.readFileSync(originalPath));
          const pdfDoc = await pdfjsLib.getDocument({
            data: pdfData,
            useSystemFonts: true,
            disableFontFace: true
          }).promise;

          let fullText = '';
          for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
            const page = await pdfDoc.getPage(pageNum);
            const content = await page.getTextContent();
            let lastY, text = '';
            for (let item of content.items) {
              if (lastY == item.transform[5] || !lastY) {
                text += item.str + ' ';
              } else {
                text += '\n' + item.str + ' ';
              }
              lastY = item.transform[5];
            }
            fullText += text + '\n\n';
          }
          await createDocxFromText(fullText.trim() || `Document: ${originalName}`, outputPath);
        }
      } else if (['.txt', '.md', '.json', '.csv'].includes(originalExt)) {
        const textContent = fs.readFileSync(originalPath, 'utf8');
        await createDocxFromText(textContent, outputPath);
      } else if (['.png', '.jpg', '.jpeg', '.webp'].includes(originalExt)) {
        // Embed image directly into Word docx
        const { Document, Packer, Paragraph, ImageRun } = docx;
        const imgBuffer = fs.readFileSync(originalPath);
        const metadata = await sharp(originalPath).metadata();
        const maxW = 500;
        const scale = metadata.width > maxW ? maxW / metadata.width : 1;
        const doc = new Document({
          sections: [{
            children: [
              new Paragraph({ text: `Imported Asset: ${originalName}` }),
              new Paragraph({
                children: [
                  new ImageRun({
                    data: imgBuffer,
                    transformation: {
                      width: Math.round(metadata.width * scale),
                      height: Math.round(metadata.height * scale)
                    }
                  })
                ]
              })
            ]
          }]
        });
        const buffer = await Packer.toBuffer(doc);
        fs.writeFileSync(outputPath, buffer);
      } else {
        throw new Error(`Converting ${originalExt} to Word DOCX is not supported.`);
      }
    }
    // 3. CONVERT WORD TO TEXT / JSON / CSV
    else if (originalExt === '.docx' && targetFormat === 'txt') {
      const docxBuffer = fs.readFileSync(originalPath);
      const textResult = await mammoth.extractRawText({ buffer: docxBuffer });
      fs.writeFileSync(outputPath, textResult.value, 'utf8');
    }
    // 4. IMAGE CONVERSIONS (Sharp)
    else if (['webp', 'png', 'jpg', 'jpeg', 'avif', 'tiff'].includes(targetFormat)) {
      let transformer = sharp(originalPath);
      if (targetFormat === 'webp') {
        transformer = transformer.webp({ quality: 85 });
      } else if (targetFormat === 'png') {
        transformer = transformer.png({ compressionLevel: 8 });
      } else if (targetFormat === 'jpg' || targetFormat === 'jpeg') {
        transformer = transformer.jpeg({ quality: 85, mozjpeg: true });
      } else if (targetFormat === 'avif') {
        transformer = transformer.avif({ quality: 75 });
      } else if (targetFormat === 'tiff') {
        transformer = transformer.tiff({ compression: 'lzw' });
      }
      await transformer.toFile(outputPath);
    }
    else {
      fs.unlinkSync(originalPath);
      return res.status(400).json({ error: `Conversion from ${originalExt} to ${targetFormat} is not supported.` });
    }

    const convertedStats = fs.statSync(outputPath);
    const convertedSize = convertedStats.size;

    // Clean up temporary upload
    try { fs.unlinkSync(originalPath); } catch (e) {}

    const reductionPercent = originalSize > convertedSize 
      ? Math.round(((originalSize - convertedSize) / originalSize) * 100)
      : 0;

    res.json({
      success: true,
      originalName,
      originalSize,
      convertedName: outputFilename,
      convertedSize,
      reductionPercent,
      downloadUrl: `/converted/${outputFilename}`,
      format: targetFormat
    });
  } catch (err) {
    console.error('Conversion error:', err);
    res.status(500).json({ error: 'File conversion failed: ' + err.message });
  }
});

/* ==========================================================================
   TASKS API
   ========================================================================== */
app.get('/api/tasks', (req, res) => {
  const db = loadDb();
  res.json(db.tasks || []);
});

app.post('/api/tasks', (req, res) => {
  const db = loadDb();
  const { title, priority, description } = req.body;
  if (!title) return res.status(400).json({ error: 'Title required' });

  const newTask = {
    id: uuidv4(),
    title,
    priority: priority || 'Medium',
    description: description || 'Added to stationery canvas',
    completed: false,
    createdAt: new Date().toISOString()
  };

  db.tasks.unshift(newTask);
  saveDb(db);
  res.json(newTask);
});

app.patch('/api/tasks/:id', (req, res) => {
  const db = loadDb();
  const task = db.tasks.find(t => t.id === req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });

  if (typeof req.body.completed === 'boolean') task.completed = req.body.completed;
  if (req.body.title) task.title = req.body.title;
  if (req.body.priority) task.priority = req.body.priority;
  if (req.body.description !== undefined) task.description = req.body.description;

  saveDb(db);
  res.json(task);
});

app.delete('/api/tasks/:id', (req, res) => {
  const db = loadDb();
  const index = db.tasks.findIndex(t => t.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Task not found' });

  db.tasks.splice(index, 1);
  saveDb(db);
  res.json({ success: true });
});

/* ==========================================================================
   LINKS API
   ========================================================================== */
app.get('/api/links', (req, res) => {
  const db = loadDb();
  res.json(db.links || []);
});

app.post('/api/links', (req, res) => {
  const db = loadDb();
  const { title, desc, url, tag, badge } = req.body;
  if (!title || !url) return res.status(400).json({ error: 'Title and URL required' });

  const newLink = {
    id: uuidv4(),
    title,
    desc: desc || 'Custom bookmark',
    url,
    tag: tag || 'Personal',
    badge: badge || 'Active',
    icon: 'link'
  };

  db.links.push(newLink);
  saveDb(db);
  res.json(newLink);
});

app.delete('/api/links/:id', (req, res) => {
  const db = loadDb();
  db.links = db.links.filter(l => l.id !== req.params.id);
  saveDb(db);
  res.json({ success: true });
});

/* ==========================================================================
   SCHEDULE EVENTS API
   ========================================================================== */
app.get('/api/events', (req, res) => {
  const db = loadDb();
  res.json(db.events || []);
});

app.post('/api/events', (req, res) => {
  const db = loadDb();
  const { title, time, tag, note } = req.body;
  if (!title) return res.status(400).json({ error: 'Title required' });

  const newEvent = {
    id: uuidv4(),
    title,
    time: time || 'Today',
    tag: tag || 'Event',
    note: note || ''
  };

  db.events.push(newEvent);
  saveDb(db);
  res.json(newEvent);
});

app.delete('/api/events/:id', (req, res) => {
  const db = loadDb();
  db.events = db.events.filter(e => e.id !== req.params.id);
  saveDb(db);
  res.json({ success: true });
});

// Serve Index fallback
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api') && !req.path.startsWith('/converted')) {
    return res.sendFile(path.join(__dirname, 'public', 'index.html'));
  }
  next();
});

app.listen(PORT, () => {
  console.log(`🌸 Asa's Essentials Dashboard running live at http://localhost:${PORT}`);
});
