import { jsPDF } from 'jspdf';
import { AchievementLevel } from '../types/game';

export interface CertificateRenderData {
  studentName: string;
  className: string;
  groupName?: string;
  achievementLevel: AchievementLevel;
  finalScore: number;
  completionDate: string;
}

function drawArchipelagoSilhouette(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.save();
  ctx.globalAlpha = 0.055;
  ctx.fillStyle = '#0B1D3A';

  const drawIsland = (points: Array<[number, number]>) => {
    if (points.length === 0) return;
    ctx.beginPath();
    ctx.moveTo(points[0][0] * w, points[0][1] * h);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i][0] * w, points[i][1] * h);
    }
    ctx.closePath();
    ctx.fill();
  };

  // Sumatra
  drawIsland([
    [0.14, 0.34], [0.19, 0.36], [0.27, 0.49], [0.31, 0.60], [0.28, 0.63], [0.21, 0.51], [0.13, 0.38],
  ]);
  // Java
  drawIsland([
    [0.32, 0.64], [0.43, 0.65], [0.48, 0.67], [0.47, 0.70], [0.34, 0.68],
  ]);
  // Bali & Nusa Tenggara
  drawIsland([[0.49, 0.67], [0.53, 0.67], [0.53, 0.69], [0.49, 0.69]]);
  drawIsland([[0.55, 0.68], [0.64, 0.67], [0.64, 0.70], [0.55, 0.70]]);
  // Kalimantan
  drawIsland([
    [0.37, 0.37], [0.46, 0.33], [0.51, 0.41], [0.48, 0.54], [0.39, 0.55], [0.35, 0.46],
  ]);
  // Sulawesi
  drawIsland([
    [0.54, 0.41], [0.61, 0.40], [0.60, 0.46], [0.57, 0.49], [0.59, 0.57], [0.54, 0.58], [0.52, 0.48],
  ]);
  // Papua
  drawIsland([
    [0.72, 0.46], [0.80, 0.48], [0.87, 0.52], [0.87, 0.64], [0.78, 0.60], [0.71, 0.53],
  ]);

  ctx.restore();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): number {
  const words = text.split(' ');
  let line = '';
  let currentY = y;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      ctx.fillText(line.trim(), x, currentY);
      line = words[n] + ' ';
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  if (line.trim()) {
    ctx.fillText(line.trim(), x, currentY);
  }
  return currentY;
}

export function renderCertificateCanvas(data: CertificateRenderData): HTMLCanvasElement {
  const width = 2380;
  const height = 1684; // A4 Landscape proportion
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  // Crisp academic cream-white paper background
  ctx.fillStyle = '#FCFBF7';
  ctx.fillRect(0, 0, width, height);

  // Subtle archipelago background illustration
  drawArchipelagoSilhouette(ctx, width, height);

  // Deep Navy outer frame
  ctx.strokeStyle = '#0A1931';
  ctx.lineWidth = 28;
  ctx.strokeRect(42, 42, width - 84, height - 84);

  // Warm Gold inner double border
  ctx.strokeStyle = '#C9962B';
  ctx.lineWidth = 6;
  ctx.strokeRect(76, 76, width - 152, height - 152);

  ctx.strokeStyle = '#D9B152';
  ctx.lineWidth = 2;
  ctx.strokeRect(92, 92, width - 184, height - 184);

  // Indonesian Red & White ceremonial accent ribbon at top center
  const ribbonW = 420;
  const ribbonX = (width - ribbonW) / 2;
  ctx.fillStyle = '#C81E2B';
  ctx.fillRect(ribbonX, 56, ribbonW, 14);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(ribbonX, 70, ribbonW, 14);
  ctx.strokeStyle = '#C9962B';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(ribbonX, 56, ribbonW, 28);

  // Corner gold medallions
  const corners: Array<[number, number]> = [
    [92, 92],
    [width - 92, 92],
    [92, height - 92],
    [width - 92, height - 92],
  ];
  corners.forEach(([cx, cy]) => {
    ctx.fillStyle = '#0A1931';
    ctx.beginPath();
    ctx.arc(cx, cy, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#C9962B';
    ctx.lineWidth = 4;
    ctx.stroke();
  });

  ctx.textAlign = 'center';

  // Top Header Kicker
  ctx.fillStyle = '#8F6413';
  ctx.font = '600 26px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText('NATIONAL UNITY TASK FORCE  ·  INDONESIA', width / 2, 185);

  // Main Certificate Title
  ctx.fillStyle = '#0A1931';
  ctx.font = '700 84px "Fraunces", Georgia, serif';
  ctx.fillText('CERTIFICATE OF ACHIEVEMENT', width / 2, 290);

  // Gold horizontal divider
  ctx.strokeStyle = '#C9962B';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 260, 330);
  ctx.lineTo(width / 2 + 260, 330);
  ctx.stroke();

  // Presentation line
  ctx.fillStyle = '#475569';
  ctx.font = '500 32px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText('This certificate is proudly presented to', width / 2, 415);

  // Student Full Name
  ctx.fillStyle = '#0A1931';
  ctx.font = '700 78px "Fraunces", Georgia, serif';
  ctx.fillText(data.studentName, width / 2, 520);

  // Class / Group subtitle
  const classLabel = data.groupName
    ? `Class ${data.className}  ·  ${data.groupName}`
    : `Class ${data.className}`;
  ctx.fillStyle = '#64748B';
  ctx.font = '500 28px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText(classLabel, width / 2, 576);

  // Name underline
  ctx.strokeStyle = '#CBD5E1';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 420, 610);
  ctx.lineTo(width / 2 + 420, 610);
  ctx.stroke();

  // Recognition paragraph 1
  ctx.fillStyle = '#1E293B';
  ctx.font = '600 33px "Plus Jakarta Sans", system-ui, sans-serif';
  const nextY = wrapText(
    ctx,
    'In recognition of successfully completing the Indonesia: The Unity Mission – The National Integration Challenge.',
    width / 2,
    690,
    1660,
    48
  );

  // Recognition paragraph 2
  ctx.fillStyle = '#334155';
  ctx.font = '400 29px "Plus Jakarta Sans", system-ui, sans-serif';
  wrapText(
    ctx,
    'The student has demonstrated knowledge, critical thinking, problem-solving, and understanding of the importance of diversity, tolerance, and national integration in Indonesian society.',
    width / 2,
    nextY + 70,
    1720,
    45
  );

  // Three Performance Metadata Columns
  const boxY = 950;
  const boxW = 1680;
  const boxX = (width - boxW) / 2;
  ctx.fillStyle = '#F3F5F9';
  ctx.fillRect(boxX, boxY, boxW, 170);
  ctx.strokeStyle = '#D5DCE6';
  ctx.lineWidth = 2;
  ctx.strokeRect(boxX, boxY, boxW, 170);

  const colCenters = [boxX + boxW * 0.2, boxX + boxW * 0.5, boxX + boxW * 0.8];

  // Vertical column dividers
  ctx.beginPath();
  ctx.moveTo(boxX + boxW * 0.36, boxY + 26);
  ctx.lineTo(boxX + boxW * 0.36, boxY + 144);
  ctx.moveTo(boxX + boxW * 0.64, boxY + 26);
  ctx.lineTo(boxX + boxW * 0.64, boxY + 144);
  ctx.stroke();

  ctx.fillStyle = '#64748B';
  ctx.font = '600 22px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText('ACHIEVEMENT LEVEL', colCenters[0], boxY + 56);
  ctx.fillText('FINAL SCORE', colCenters[1], boxY + 56);
  ctx.fillText('DATE OF COMPLETION', colCenters[2], boxY + 56);

  ctx.fillStyle = '#C81E2B';
  ctx.font = '700 36px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText(data.achievementLevel, colCenters[0], boxY + 116);

  ctx.fillStyle = '#0A1931';
  ctx.font = '700 42px "IBM Plex Mono", monospace';
  ctx.fillText(`${data.finalScore}/100`, colCenters[1], boxY + 118);

  ctx.fillStyle = '#0A1931';
  ctx.font = '600 32px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText(data.completionDate, colCenters[2], boxY + 115);

  // Closing Statement
  ctx.fillStyle = '#8F6413';
  ctx.font = 'italic 600 34px "Fraunces", Georgia, serif';
  ctx.fillText(
    '“Diversity Makes Us Different. Unity Makes Us Strong.”',
    width / 2,
    1245
  );

  // Gold Academic Seal (Center-Bottom)
  const sealX = width / 2;
  const sealY = 1410;
  ctx.beginPath();
  ctx.arc(sealX, sealY, 84, 0, Math.PI * 2);
  ctx.fillStyle = '#0A1931';
  ctx.fill();
  ctx.lineWidth = 6;
  ctx.strokeStyle = '#C9962B';
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(sealX, sealY, 68, 0, Math.PI * 2);
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#F4D078';
  ctx.stroke();

  ctx.fillStyle = '#F4D078';
  ctx.font = '700 20px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText('BHINNEKA', sealX, sealY - 12);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 22px "Fraunces", Georgia, serif';
  ctx.fillText('UNITY', sealX, sealY + 16);
  ctx.fillStyle = '#F4D078';
  ctx.font = '600 17px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText('GRADE 9', sealX, sealY + 42);

  // Footer labels (Left & Right — no fake signature!)
  ctx.textAlign = 'left';
  ctx.fillStyle = '#0A1931';
  ctx.font = '700 26px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText('SOCIAL STUDIES – GRADE 9', 175, 1435);

  ctx.textAlign = 'right';
  ctx.fillText('THE UNITY MISSION', width - 175, 1435);

  return canvas;
}

export function downloadCertificatePNG(data: CertificateRenderData): void {
  const canvas = renderCertificateCanvas(data);
  const url = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  const safeName = data.studentName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  link.download = `unity-mission-certificate-${safeName || 'student'}.png`;
  link.href = url;
  link.click();
}

export function downloadCertificatePDF(data: CertificateRenderData): void {
  const canvas = renderCertificateCanvas(data);
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });
  pdf.addImage(imgData, 'PNG', 0, 0, 297, 210);
  const safeName = data.studentName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  pdf.save(`unity-mission-certificate-${safeName || 'student'}.pdf`);
}
