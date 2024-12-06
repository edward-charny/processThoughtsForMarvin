import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileDownloadService {
  saveToJson(filename: string, source: any[]): void {
    try {
      const jsonData = JSON.stringify(source, null, 2);
      this.downloadFile(
        jsonData, 
        'application/json', 
        filename + '.json'
      );
      console.log('Successfully prepared for download');
    } catch (error) {
      console.error('Error preparing JSON:', error);
    }
  }

  saveToCSV(filename: string, source: any[]): void {
    try {
      if (!source || source.length === 0) {
        console.error('Source array is empty or undefined');
        return;
      }

      const headers = Object.keys(source[0]);
      let csvContent = headers.join(',') + '\n';
      
      source.forEach(item => {
        const row = headers.map(header => {
          const value = item[header]?.toString() || '';
          if (value.includes(',') || value.includes('"') || value.includes('\n')) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        });
        csvContent += row.join(',') + '\n';
      });

      this.downloadFile(
        csvContent, 
        'text/csv;charset=utf-8;',
        filename.endsWith('.csv') ? filename : `${filename}.csv`
      );
      console.log(`Data successfully prepared for CSV download as ${filename}`);
    } catch (error) {
      console.error('Error preparing CSV:', error);
    }
  }

  private downloadFile(content: string, type: string, filename: string): void {
    const blob = new Blob([content], { type });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
} 