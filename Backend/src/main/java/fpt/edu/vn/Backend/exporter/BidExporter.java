package fpt.edu.vn.Backend.exporter;

import fpt.edu.vn.Backend.DTO.BidDTO;
import fpt.edu.vn.Backend.DTO.BidDTO;
import fpt.edu.vn.Backend.exception.ResourceNotFoundException;
import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

public class BidExporter {

    private XSSFWorkbook workbook;
    private XSSFSheet sheet;
    private List<BidDTO> bidDTOS;


    public BidExporter(List<BidDTO> BidDTOS) {
        this.bidDTOS = BidDTOS;
        workbook = new XSSFWorkbook();
    }


    private void writeHeaderLine() {
        sheet = workbook.createSheet("Bids");

        Row row = sheet.createRow(0);

        CellStyle style = workbook.createCellStyle();
        XSSFFont font = workbook.createFont();
        font.setBold(true);
        font.setFontHeight(16);
        style.setFont(font);
        int columnCount = 0;
        createCell(row, columnCount++, "Bid ID", style);
        createCell(row, columnCount++, "Status", style);
        createCell(row, columnCount++, "Amount", style);
        createCell(row, columnCount++, "Auction ID", style);
        createCell(row, columnCount++, "Item ID", style);
        createCell(row, columnCount++, "Account ID", style);
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

        for (BidDTO bid : bidDTOS) {
            Row row = sheet.createRow(rowCount++);
            int columnCount = 0;

            createCell(row, columnCount++, bid.getBidId(), style);
            createCell(row, columnCount++, bid.getPayment().getStatus().toString(), style);
            createCell(row, columnCount++, bid.getPayment().getAmount().toString(), style);
            createCell(row, columnCount++, bid.getAuctionItemId().getAuctionSessionId().toString(), style);
            createCell(row, columnCount++, bid.getAuctionItemId().getItemId().toString(), style);
            createCell(row, columnCount++, bid.getPayment().getAccountId(), style);

        }
    }

    public ByteArrayOutputStream  export() throws IOException {
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            writeHeaderLine();
            writeDataLines();

            workbook.write(outputStream);
            return outputStream;
        } catch (Exception e) {
            throw new ResourceNotFoundException("Error exporting data to Excel file: " + e.getMessage());
        } finally {
            workbook.close();
        }
    }
}
