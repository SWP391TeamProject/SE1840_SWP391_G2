package fpt.edu.vn.Backend.DTO.request;

import fpt.edu.vn.Backend.pojo.AuctionItem;
import fpt.edu.vn.Backend.pojo.Item;
import org.springframework.web.multipart.MultipartFile;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

public class CreateAuctionSessionRequestDTO implements Serializable {
    private int auctionSessionId;
    private String title;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String status;
    private LocalDateTime createDate;
    private LocalDateTime updateDate;

    private List<MultipartFile> files;

    private List<Item> items;

}
