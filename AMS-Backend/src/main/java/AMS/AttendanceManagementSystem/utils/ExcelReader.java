package AMS.AttendanceManagementSystem.utils;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.springframework.web.multipart.MultipartFile;

public class ExcelReader {

    public static String getExcelSheetName(MultipartFile file) {
        try (InputStream is = file.getInputStream(); Workbook workbook = WorkbookFactory.create(is)) {
            return workbook.getSheetAt(0).getSheetName();
        } catch (Exception e) {
            throw new RuntimeException("Failed to read sheet name: " + e.getMessage());
        }
    }

    public static List<Map<String, String>> readExcelSheet(MultipartFile file, String sheetName) {
    	if(file.isEmpty()) {
    		throw new RuntimeException("Uploaded file is empty. Please upload a valid Excel file.");
    	}
        
        if(!isValidExcelFile(file)) {
        	 throw new RuntimeException("Invalid file format! Please upload an Excel file (.xls or .xlsx)");
        }

        List<Map<String, String>> dataList = new ArrayList<>();

        try (InputStream is = file.getInputStream(); Workbook workbook = WorkbookFactory.create(is)) {
            Sheet sheet = workbook.getSheet(sheetName);
            if (sheet == null) {
                throw new RuntimeException("Sheet not found: " + sheetName);
            }

            Iterator<Row> rows = sheet.iterator();
            Map<Integer, String> columnMapping = new HashMap<>();

            // Read header row
            if (rows.hasNext()) {
                Row headerRow = rows.next();
                for (Cell cell : headerRow) {
                    columnMapping.put(cell.getColumnIndex(), cell.getStringCellValue().toLowerCase().trim());
                }
            }

            // Read data rows
            while (rows.hasNext()) {
                Row row = rows.next();
                Map<String, String> rowData = new HashMap<>();

                for (Cell cell : row) {
                    String columnName = columnMapping.get(cell.getColumnIndex());
                    if (columnName != null) {
                        rowData.put(columnName, getCellValue(cell));
                    }
                }
                dataList.add(rowData);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to process Excel file: " + e.getMessage());
        }

        return dataList;
    }

    private static String getCellValue(Cell cell) {
        if (cell == null) return "";
        switch (cell.getCellType()) {
            case STRING: return cell.getStringCellValue().trim();
            case NUMERIC: return String.valueOf((long) cell.getNumericCellValue());
            case BOOLEAN: return String.valueOf(cell.getBooleanCellValue());
            default: return "";
        }
    }

    private static boolean isValidExcelFile(MultipartFile file) {
	     String contentType = file.getContentType();
	     return contentType != null &&
	            (contentType.equals("application/vnd.ms-excel") || // For .xls
	             contentType.equals("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")); // For .xlsx
	 }
    
}
