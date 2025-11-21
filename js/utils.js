// js/utils.js
// 🛠️ UTILITIES: ฟังก์ชันกลางสำหรับ Export, Formatting และ File Management

// --- 1. Formatting Tools ---

export function formatCurrency(num) {
    if (num === undefined || num === null || isNaN(num)) return "0.00";
    return num.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function formatDate(dateString) {
    const date = dateString ? new Date(dateString) : new Date();
    return date.toLocaleDateString('th-TH', {
        year: 'numeric', month: 'long', day: 'numeric'
    });
}

export function generateUUID() {
    return 'proj_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// --- 2. Export Tools (PDF, Image, Print) ---

// ฟังก์ชัน Print
export function printContent(elementId = 'output-section') {
    window.print(); // ใช้ CSS @media print จัดการการแสดงผล
}

// ฟังก์ชัน Export เป็น PDF (ต้องมี jspdf loaded ในหน้า HTML)
export async function exportToPDF(elementId, fileName = 'quotation.pdf') {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'a4');
    const element = document.getElementById(elementId);
    
    if (!element) return alert("ไม่พบส่วนข้อมูลที่จะพิมพ์");

    // ซ่อนปุ่มต่างๆ ก่อนจับภาพ
    const buttons = element.querySelectorAll('button, .no-print');
    buttons.forEach(b => b.style.display = 'none');

    try {
        await doc.html(element, {
            callback: function (doc) {
                doc.save(fileName);
                // คืนค่าปุ่มกลับมา
                buttons.forEach(b => b.style.display = '');
            },
            x: 10,
            y: 10,
            width: 190, // A4 width - margins
            windowWidth: 1024 // Virtual window width
        });
    } catch (error) {
        console.error("PDF Export Error:", error);
        alert("เกิดข้อผิดพลาดในการสร้าง PDF: " + error.message);
        buttons.forEach(b => b.style.display = '');
    }
}

// ฟังก์ชัน Export เป็นรูปภาพ (ต้องมี html2canvas loaded)
export function exportToImage(elementId, fileName = 'quotation.png') {
    const element = document.getElementById(elementId);
    if (!element) return;

    const buttons = element.querySelectorAll('button, .no-print');
    buttons.forEach(b => b.style.display = 'none');

    html2canvas(element).then(canvas => {
        const link = document.createElement('a');
        link.download = fileName;
        link.href = canvas.toDataURL();
        link.click();
        buttons.forEach(b => b.style.display = '');
    });
}

// --- 3. Project File Management (Save/Load) ---

// บันทึกโปรเจกต์เป็นไฟล์ JSON
export function saveProjectToFile(data, filename = 'project_data.json') {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    
    URL.revokeObjectURL(url);
}

// โหลดโปรเจกต์จากไฟล์ JSON (Return Promise)
export function loadProjectFromFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                resolve(data);
            } catch (e) {
                reject("รูปแบบไฟล์ไม่ถูกต้อง");
            }
        };
        reader.onerror = () => reject("อ่านไฟล์ไม่สำเร็จ");
        reader.readAsText(file);
    });
}