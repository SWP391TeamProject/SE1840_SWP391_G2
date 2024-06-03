package fpt.edu.vn.Backend.exporter;

import fpt.edu.vn.Backend.DTO.ItemDTO;
import fpt.edu.vn.Backend.exception.ResourceNotFoundException;
import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.util.List;

public class ItemExporter {

    private XSSFWorkbook workbook;
    private XSSFSheet sheet;
    private List<ItemDTO> listItems;

    public ItemExporter(List<ItemDTO> listItems) {
        this.listItems = listItems;
        workbook = new XSSFWorkbook();
    }


    private void writeHeaderLine() {
        sheet = workbook.createSheet("Items");

        Row row = sheet.createRow(0);

        CellStyle style = workbook.createCellStyle();
        XSSFFont font = workbook.createFont();
        font.setBold(true);
        font.setFontHeight(16);
        style.setFont(font);
        int columnCount = 0;
        createCell(row, columnCount++, "Item ID", style);
        createCell(row, columnCount++, "Category", style);
        createCell(row, columnCount++, "Name", style);
        createCell(row, columnCount++, "Reserve Price", style);
        createCell(row, columnCount++, "Buy In Price", style);
        createCell(row, columnCount++, "Status", style);
        createCell(row, columnCount++, "Owner", style);
        createCell(row, columnCount++, "Order ID", style);
        createCell(row, columnCount++, "Create Date", style);
        createCell(row, columnCount++, "Update Date", style);
    }

    private void createCell(Row row, int columnCount, Object value, CellStyle style) {
        sheet.autoSizeColumn(columnCount);
        Cell cell = row.createCell(columnCount);
        if (value instanceof Integer) {
            cell.setCellValue((Integer) value);
        } else if (value instanceof Boolean) {
            cell.setCellValue((Boolean) value);
        } else {
            cell.setCellValue((String) value);
        }
        cell.setCellStyle(style);
    }

    private void writeDataLines() {
        int rowCount = 1;

        CellStyle style = workbook.createCellStyle();
        XSSFFont font = workbook.createFont();
        font.setFontHeight(14);
        style.setFont(font);

        for (ItemDTO item : listItems) {
            Row row = sheet.createRow(rowCount++);
            int columnCount = 0;

            createCell(row, columnCount++, item.getItemId(), style);
            createCell(row, columnCount++, item.getCategory().getName(), style);
            createCell(row, columnCount++, item.getName(), style);
            createCell(row, columnCount++, item.getReservePrice().toString(), style);
            createCell(row, columnCount++, item.getBuyInPrice().toString(), style);
            createCell(row, columnCount++, item.getStatus().toString(), style);
            createCell(row, columnCount++, item.getOrderId(), style);
            createCell(row, columnCount++, item.getCreateDate().toString(), style);
            createCell(row, columnCount++, item.getUpdateDate().toString(), style);


        }
    }

    public void export(HttpServletResponse response) {
        try {
            writeHeaderLine();
            writeDataLines();

            ServletOutputStream outputStream = response.getOutputStream();
            workbook.write(outputStream);
            workbook.close();

            outputStream.close();
        } catch (Exception e) {
            throw new ResourceNotFoundException("Error exporting data to Excel file: " + e.getMessage());
        }
    }
}
