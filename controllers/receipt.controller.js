import { Receipt } from "../models/Receipt.model.js";
import PDFDocument from "pdfkit";
import QRCode from "qrcode";
/* ==========================================================================
   CREATE RECEIPT
   ========================================================================== */
export const createReceipt = async (req, res) => {
  try {
    const { name, email, phone, amount, currency, receiptNumber, notes } = req.body;

    // Validation
    if (!name || !email || !phone || !amount || !currency || !receiptNumber) {
      return res.status(400).json({ message: "Tous les champs obligatoires doivent être remplis." });
    }

    const newReceipt = await Receipt.create({
      name,
      email,
      phone,
      amount,
      currency,
      receiptNumber,
      notes,
      date: new Date(),
    });

    res.status(201).json({
      message: "Reçu enregistré avec succès.",
      receipt: newReceipt,
    });

  } catch (error) {
    console.error("Create Receipt Error:", error);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
};

/* ==========================================================================
   GET ALL RECEIPTS
   ========================================================================== */
export const getAllReceipts = async (req, res) => {
  try {
    const receipts = await Receipt.find();

    res.status(200).json({
      count: receipts.length,
      receipts,
    });

  } catch (error) {
    console.error("Get All Receipts Error:", error);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
};
export const getAll = async (req, res) => {
  try {
    const receipts = await Receipt.find();

    res.status(200).json({
      count: receipts.length,
      receipts,
    });

  } catch (error) {
    console.error("Get All Receipts Error:", error);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
};

/* ==========================================================================
   GET RECEIPT BY ID
   ========================================================================== */
export const getReceiptById = async (req, res) => {
  try {
    const { id } = req.params;
    const receipt = await Receipt.findById(id);

    if (!receipt) {
      return res.status(404).json({ message: "Reçu introuvable." });
    }

    res.status(200).json(receipt);

  } catch (error) {
    console.error("Get Receipt By ID Error:", error);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
};





/* ==========================================================================
   PRINT PROFESSIONAL RECTANGLE TICKET WITH QR ON RIGHT AND STYLING
   ========================================================================== */
export const printReceipt = async (req, res) => {
  try {
    const { id } = req.params;
    const receipt = await Receipt.findById(id);

    if (!receipt) {
      return res.status(404).json({ message: "Reçu introuvable." });
    }

    const filename = `ticket_${receipt.receiptNumber}.pdf`;
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${filename}"`
    );

    const doc = new PDFDocument({
      size: [500, 300], // Rectangle ticket
      margin: 20,
      info: {
        Title: `Ticket ${receipt.receiptNumber}`,
        Author: "W-Web with Jeancy",
      },
    });

    doc.pipe(res);

    /* ----------------------------------------------------------------------
       1. RED BACKGROUND
       ---------------------------------------------------------------------- */
    doc.rect(0, 0, doc.page.width, doc.page.height).fill("#B71C1C");

    /* ----------------------------------------------------------------------
       2. HEADER: LOGO + TITLE
       ---------------------------------------------------------------------- */
    try {
      const logoPath = "jeancy24sur.com.png"; // Your logo path
      doc.image(logoPath, 20, 20, { width: 70 });
    } catch (err) {
      console.warn("Logo not found, skipping logo.");
    }

    doc.fillColor("#ffffff")
      .font("Helvetica-Bold")
      .fontSize(18)
      .text("BIENVENUE À LA FORMATION", 0, 30, { align: "center" });

    doc.moveDown(0.5);

    doc.font("Helvetica")
      .fontSize(10)
      .text("W-Web with Jeancy • Formation en Programmation", {
        align: "center",
      });

    doc.moveDown(2);

    /* ----------------------------------------------------------------------
       3. GOLDEN DOTTED LINE
       ---------------------------------------------------------------------- */
    doc.strokeColor("#FFD700")
      .lineWidth(1)
      .moveTo(20, doc.y)
      .lineTo(doc.page.width - 20, doc.y)
      .dash(5, { space: 3 })
      .stroke()
      .undash();

    doc.moveDown(1);

    /* ----------------------------------------------------------------------
       4. RECTANGLE FOR TICKET DETAILS
       ---------------------------------------------------------------------- */
    const rectX = 20;
    const rectY = doc.y;
    const rectWidth = 460;
    const rectHeight = 130;

    doc.roundedRect(rectX, rectY, rectWidth, rectHeight, 10)
      .strokeColor("#FFD700")
      .lineWidth(2)
      .stroke();

    /* ----------------------------------------------------------------------
       5. PARTICIPANT INFO
       ---------------------------------------------------------------------- */
    doc.fillColor("#FFD700")
      .font("Helvetica-Bold")
      .fontSize(12)
      .text("Nom du participant :", rectX + 10, rectY + 10);
      

    doc.fillColor("#ffffff")
      .font("Helvetica")
      .text(receipt.name, rectX + 150, rectY + 10);

    doc.fillColor("#FFD700")
      .font("Helvetica-Bold")
      .text("Numéro du ticket :", rectX + 10, rectY + 35);

    doc.fillColor("#ffffff")
      .font("Helvetica")
      .text(receipt.receiptNumber, rectX + 150, rectY + 35);

    /* ----------------------------------------------------------------------
       6. WELCOME MESSAGE
       ---------------------------------------------------------------------- */
    doc.fillColor("#FFD700")
      .font("Helvetica-Bold")
      .fontSize(12)
      .text(
        "Bienvenue ! Devenez programmeur dans un clin d'œil et apprenez les différents langages de programmation avec Jeancy Mpoyi !",
        rectX + 10,
        rectY + 70,
        { width: 280 }
      );

    /* ----------------------------------------------------------------------
       7. QR CODE ON RIGHT
       ---------------------------------------------------------------------- */
    const qrData = "https://jeancy24sur.com/"; // Official webpage
    const qrImageData = await QRCode.toDataURL(qrData);

    doc.image(qrImageData, rectX + 300, rectY + 30, {
      width: 120,
      height: 120,
    });

    /* ----------------------------------------------------------------------
       8. ADD ADDITIONAL DOTTED LINES
       ---------------------------------------------------------------------- */
    doc.strokeColor("#FFD700")
      .lineWidth(0.8)
      .dash(3, { space: 2 });

    // Horizontal dotted line under rectangle
    doc.moveTo(rectX + 10, rectY + rectHeight + 5)
      .lineTo(rectX + rectWidth - 10, rectY + rectHeight + 5)
      .stroke();

    doc.undash();

    /* ----------------------------------------------------------------------
       9. FOOTER
       ---------------------------------------------------------------------- */
    doc.fillColor("#ffffff")
      .fontSize(10)
      .font("Helvetica-Oblique")
      .text(
        "Merci pour votre confiance.Cash: (CDF:10.000",
        rectX,
        rectY + rectHeight + 15,
        { align: "center", width: rectWidth }
      )
      .text(
        "W-Web with Jeancy • Développons l'avenir ensemble: (CDF:10.000)",
        rectX,
        rectY + rectHeight + 30,
        { align: "center", width: rectWidth }
      );

    doc.end();
  } catch (error) {
    console.error("Print Ticket Error:", error);
    res.status(500).json({ message: "Erreur lors de l'impression du ticket." });
  }
};




// Print all receipts professionally


// Print all receipts with fixed positions
export const printAllReceipts = async (req, res) => {
  try {
    const receipts = await Receipt.find().sort({ createdAt: -1 });

    if (!receipts || receipts.length === 0) {
      return res.status(404).json({ message: "Aucun reçu trouvé." });
    }

    const filename = `tickets_all.pdf`;
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${filename}"`
    );

    const doc = new PDFDocument({
      size: [500, 300],
      margin: 20,
      info: {
        Title: "Tickets de formation",
        Author: "W-Web with Jeancy",
      },
    });

    doc.pipe(res);

    const rectWidth = 460;
    const rectHeight = 140;
    const rectX = 20;
    const padding = 15;

    for (let i = 0; i < receipts.length; i++) {
      const receipt = receipts[i];

      // Background
      doc.rect(0, 0, doc.page.width, doc.page.height).fill("#B71C1C");

      // Header: Logo + Title
      try {
        const logoPath = "jeancy24sur.com.png";
        doc.image(logoPath, rectX, rectX, { width: 60 });
      } catch {}

      doc.fillColor("#ffffff")
        .font("Helvetica-Bold")
        .fontSize(18)
        .text("BIENVENUE À LA FORMATION", 0, 25, { align: "center" });

      doc.moveDown(0.5);

      doc.font("Helvetica")
        .fontSize(10)
        .text("W-Web with Jeancy • Formation en Programmation", {
          align: "center",
        });

      doc.moveDown(1.5);

      // Golden dotted separator
      doc.strokeColor("#FFD700")
        .lineWidth(1)
        .moveTo(rectX, doc.y)
        .lineTo(doc.page.width - rectX, doc.y)
        .dash(5, { space: 3 })
        .stroke()
        .undash();

      // Rectangle for ticket details
      const rectY = doc.y + padding;
      doc.roundedRect(rectX, rectY, rectWidth, rectHeight, 10)
        .strokeColor("#FFD700")
        .lineWidth(2)
        .stroke();

      // Participant info
      doc.fillColor("#FFD700")
        .font("Helvetica-Bold")
        .fontSize(12)
        .text("Nom du participant :", rectX + padding, rectY + padding);

      doc.fillColor("#ffffff")
        .font("Helvetica")
        .text(receipt.name, rectX + 150, rectY + padding);

      doc.fillColor("#FFD700")
        .font("Helvetica-Bold")
        .text("Numéro du ticket :", rectX + padding, rectY + 35);

      doc.fillColor("#ffffff")
        .font("Helvetica")
        .text(receipt.receiptNumber, rectX + 150, rectY + 35);

      // Welcome message
      doc.fillColor("#FFD700")
        .font("Helvetica-Bold")
        .fontSize(12)
        .text(
          "Bienvenue ! Devenez programmeur dans un clin d'œil et apprenez les différents langages de programmation avec Jeancy Mpoyi !",
          rectX + padding,
          rectY + 70,
          { width: 280 }
        );

      // QR code on right
      const qrData = "https://jeancy24sur.com/";
      const qrImageData = await QRCode.toDataURL(qrData);

      doc.image(qrImageData, rectX + 300, rectY + 30, {
        width: 120,
        height: 120,
      });

      // Additional dotted line below rectangle
      doc.strokeColor("#FFD700")
        .lineWidth(0.8)
        .dash(3, { space: 2 })
        .moveTo(rectX + 10, rectY + rectHeight + 5)
        .lineTo(rectX + rectWidth - 10, rectY + rectHeight + 5)
        .stroke()
        .undash();

      // Footer
      doc.fillColor("#ffffff")
        .fontSize(10)
        .font("Helvetica-Oblique")
        .text(
          "Merci pour votre confiance.",
          rectX,
          rectY + rectHeight + 15,
          { align: "center", width: rectWidth }
        )
        .text(
          "W-Web with Jeancy • Développons l'avenir ensemble (CDF:10.000)",
          rectX,
          rectY + rectHeight + 30,
          { align: "center", width: rectWidth }
        );

      // Add new page if not last receipt
      if (i < receipts.length - 1) doc.addPage();
    }

    doc.end();
  } catch (error) {
    console.error("Print All Tickets Error:", error);
    res.status(500).json({ message: "Erreur lors de l'impression des tickets." });
  }
};

