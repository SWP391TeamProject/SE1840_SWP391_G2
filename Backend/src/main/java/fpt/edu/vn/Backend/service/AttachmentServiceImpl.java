package fpt.edu.vn.Backend.service;

import com.azure.storage.blob.BlobContainerClient;
import com.azure.storage.blob.BlobServiceClient;
import com.azure.storage.blob.BlobServiceClientBuilder;
import com.azure.storage.blob.sas.BlobContainerSasPermission;
import com.azure.storage.blob.sas.BlobServiceSasSignatureValues;
import com.azure.storage.blob.specialized.BlockBlobClient;
import fpt.edu.vn.Backend.DTO.AttachmentDTO;
import fpt.edu.vn.Backend.exception.ResourceNotFoundException;
import fpt.edu.vn.Backend.pojo.*;
import fpt.edu.vn.Backend.repository.*;
import org.apache.tika.mime.MimeType;
import org.apache.tika.mime.MimeTypeException;
import org.apache.tika.mime.MimeTypes;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.time.OffsetDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class AttachmentServiceImpl implements AttachmentService {
    private final AttachmentRepos attachmentRepository;
    private final BlobContainerClient blobContainerClient;
    private final AccountRepos accountRepos;

    private final ItemRepos itemRepository;

    private final ConsignmentDetailRepos consignmentDetailRepos;
    @Autowired
    private AuctionSessionRepos auctionRepos;
    @Autowired
    private BlogPostRepos blogPostRepos;
    @Autowired
    public AttachmentServiceImpl(AttachmentRepos attachmentRepository, AccountRepos accountRepos, ConsignmentDetailRepos consignmentDetailRepos,ItemRepos itemRepository) {
        this.attachmentRepository = attachmentRepository;
        this.accountRepos = accountRepos;
        this.itemRepository = itemRepository;

        String connectStr = System.getenv("AZURE_STORAGE_CONNECTION_STRING");
        if (connectStr != null && !connectStr.isEmpty()) {
            BlobServiceClient blobServiceClient = new BlobServiceClientBuilder()
                    .connectionString(connectStr)
                    .buildClient();
            blobContainerClient = blobServiceClient.getBlobContainerClient("attachments");
            blobContainerClient.createIfNotExists();
        } else {
            blobContainerClient = null;
        }
        this.consignmentDetailRepos = consignmentDetailRepos;
    }

    @Override
    public @NotNull AttachmentDTO mapEntityToDTO(@NotNull Attachment attachment, @NotNull AttachmentDTO attachmentDTO) {
        attachmentDTO.setAttachmentId(attachment.getAttachmentId());
        if (attachment.getLink() != null) {
            attachmentDTO.setLink(attachment.getLink());
        } else {
            attachmentDTO.setLink("");
        }
        attachmentDTO.setCreateDate(attachment.getCreateDate());
        attachmentDTO.setUpdateDate(attachment.getUpdateDate());
        return attachmentDTO;
    }

    @Override
    public @NotNull Attachment mapDTOToEntity(@NotNull AttachmentDTO attachmentDTO, @NotNull Attachment attachment) {
        attachment.setAttachmentId(attachmentDTO.getAttachmentId());
        attachment.setUpdateDate(attachmentDTO.getUpdateDate());
        attachment.setLink(attachmentDTO.getLink());
        attachment.setCreateDate(attachmentDTO.getCreateDate());
        return attachment;
    }



    @Override
    public @NotNull AttachmentDTO uploadAttachment(@NotNull MultipartFile file) throws IOException {
        MimeTypes mimeTypes = MimeTypes.getDefaultMimeTypes();
        MimeType mimeType;
        try {
            mimeType = mimeTypes.forName(file.getContentType());
        } catch (MimeTypeException e) {
            throw new IOException(e);
        }
        String blobId = UUID.randomUUID() + mimeType.getExtension();

        BlockBlobClient blobClient = blobContainerClient.getBlobClient(blobId).getBlockBlobClient();

        // Convert InputStream to ByteArrayInputStream
        byte[] bytes = file.getBytes();
        ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(bytes);

        blobClient.upload(byteArrayInputStream, bytes.length, true);

        Attachment attachment = new Attachment();
        attachment.setBlobId(blobId);
        attachment.setLink(blobClient.getBlobUrl());
        attachmentRepository.save(attachment);
        return mapEntityToDTO(attachment);
    }




    @Override
    public @Nullable AttachmentDTO getAttachmentById(int id) {
        return attachmentRepository.findById(id).map(this::mapEntityToDTO).orElse(null);
    }

    @Override
    public boolean deleteAttachment(int attachmentId) {
        Attachment a = attachmentRepository.deleteByAttachmentId(attachmentId);
        if (a != null) {
            BlockBlobClient blobClient = blobContainerClient.getBlobClient(a.getBlobId()).getBlockBlobClient();
            return blobClient.deleteIfExists();
        }
        return false;
    }

    @Override
    public @NotNull AttachmentDTO uploadAccountAttachment(@NotNull MultipartFile file, int accountId) throws IOException {
        Optional<Account> optionalAccount = accountRepos.findById(accountId);

        if (optionalAccount.isEmpty()) {
            throw new ResourceNotFoundException("Account with id " + accountId + " does not exist");
        }
        Account account = optionalAccount.get();

        MimeTypes mimeTypes = MimeTypes.getDefaultMimeTypes();
        MimeType mimeType;
        try {
            mimeType = mimeTypes.forName(file.getContentType());
        } catch (MimeTypeException e) {
            throw new ResourceNotFoundException(e);
        }
        String blobId = accountId + "/" + UUID.randomUUID() + mimeType.getExtension();

        BlockBlobClient blobClient = blobContainerClient.getBlobClient(blobId).getBlockBlobClient();

        // Convert InputStream to ByteArrayInputStream
        byte[] bytes = file.getBytes();
        ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(bytes);

        blobClient.upload(byteArrayInputStream, bytes.length, true);

        Attachment attachment = new Attachment();
        attachment.setBlobId(blobId);
        attachment.setLink(blobClient.getBlobUrl());
        attachment.setAccount(account);
        attachmentRepository.save(attachment);
        return mapEntityToDTO(attachment);
    }

    @Override
    public @NotNull AttachmentDTO uploadConsignmentDetailAttachment(@NotNull MultipartFile file, int consignmentDetailId) {
        Optional<ConsignmentDetail> optionalConsignmentDetail = consignmentDetailRepos.findById(consignmentDetailId);
        if (optionalConsignmentDetail.isEmpty()) {
            throw new ResourceNotFoundException("ConsignmentDetail with id " + consignmentDetailId + " does not exist");
        }
        ConsignmentDetail consignmentDetail = optionalConsignmentDetail.get();

        MimeTypes mimeTypes = MimeTypes.getDefaultMimeTypes();
        MimeType mimeType;
        try {
            mimeType = mimeTypes.forName(file.getContentType());
        } catch (MimeTypeException e) {
            throw new RuntimeException(e);
        }


        String blobId = consignmentDetail.getAccount().getAccountId()+"/consignment-detail/"+UUID.randomUUID() + mimeType.getExtension();

        BlockBlobClient blobClient = blobContainerClient.getBlobClient(blobId).getBlockBlobClient();

        // Convert InputStream to ByteArrayInputStream
        byte[] bytes ;
        try {
            bytes = file.getBytes();
        }catch (IOException e) {
            throw new RuntimeException(e);
        }
        ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(bytes);

        blobClient.upload(byteArrayInputStream, bytes.length, true);

        Attachment attachment = new Attachment();
        attachment.setBlobId(blobId);
        attachment.setLink(blobClient.getBlobUrl());
        attachment.setConsignmentDetail(consignmentDetail);
        attachmentRepository.save(attachment);
        return mapEntityToDTO(attachment);
    }

    @Override
    public @NotNull AttachmentDTO uploadItemAttachment(@NotNull MultipartFile file, Integer itemId) throws IOException {
        // Get the Item object from the itemId
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item with id " + itemId + " does not exist"));

        // Generate a unique blobId for the file
        MimeTypes mimeTypes = MimeTypes.getDefaultMimeTypes();
        MimeType mimeType;
        try {
            mimeType = mimeTypes.forName(file.getContentType());
        } catch (MimeTypeException e) {
            throw new IOException(e);
        }
        String blobId = item.getOwner().getAccountId() + "/item-image/" + UUID.randomUUID() + mimeType.getExtension();

        // Get a BlockBlobClient for the blob with this blobId and upload the file
        BlockBlobClient blobClient = blobContainerClient.getBlobClient(blobId).getBlockBlobClient();
        byte[] bytes = file.getBytes();
        ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(bytes);
        blobClient.upload(byteArrayInputStream, bytes.length, true);

        // Create a new Attachment object, set its properties, and save it to the database
        Attachment attachment = new Attachment();
        attachment.setBlobId(blobId);
        attachment.setLink(blobClient.getBlobUrl());
        attachment.setItem(item);
        attachmentRepository.save(attachment);

        // Map the Attachment entity to an AttachmentDTO and return it
        return mapEntityToDTO(attachment);
    }
    @Override
    public @NotNull AttachmentDTO uploadBlogAttachment(@NotNull MultipartFile file, Integer blogId) throws IOException {
        // Get the Item object from the itemId
        BlogPost blog = blogPostRepos.findById(blogId)
                .orElseThrow(() -> new ResourceNotFoundException("Blog with id " + blogId + " does not exist"));

        // Generate a unique blobId for the file
        MimeTypes mimeTypes = MimeTypes.getDefaultMimeTypes();
        MimeType mimeType;
        try {
            mimeType = mimeTypes.forName(file.getContentType());
        } catch (MimeTypeException e) {
            throw new IOException(e);
        }
        String blobId = blog.getAuthor().getAccountId() + "/blog-image/" + UUID.randomUUID() + mimeType.getExtension();

        // Get a BlockBlobClient for the blob with this blobId and upload the file
        BlockBlobClient blobClient = blobContainerClient.getBlobClient(blobId).getBlockBlobClient();
        byte[] bytes = file.getBytes();
        ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(bytes);
        blobClient.upload(byteArrayInputStream, bytes.length, true);

        // Create a new Attachment object, set its properties, and save it to the database
        Attachment attachment = new Attachment();
        attachment.setBlobId(blobId);
        attachment.setLink(blobClient.getBlobUrl());
        attachment.setBlogPost(blog);
        attachment=attachmentRepository.save(attachment);

        // Map the Attachment entity to an AttachmentDTO and return it
        return mapEntityToDTO(attachment);
    }
    @Override
    public @NotNull AttachmentDTO uploadAuctionAttachment(@NotNull MultipartFile file, Integer auctionId) throws IOException {
        // Get the Item object from the itemId
        AuctionSession auction = auctionRepos.findById(auctionId)
                .orElseThrow(() -> new ResourceNotFoundException("Auction with id " + auctionId + " does not exist"));
        // Generate a unique blobId for the file
        MimeTypes mimeTypes = MimeTypes.getDefaultMimeTypes();
        MimeType mimeType;
        try {
            mimeType = mimeTypes.forName(file.getContentType());
        } catch (MimeTypeException e) {
            throw new IOException(e);
        }
        String blobId = auction.getAuctionSessionId()+ "/auction-image/" + UUID.randomUUID() + mimeType.getExtension();

        // Get a BlockBlobClient for the blob with this blobId and upload the file
        BlockBlobClient blobClient = blobContainerClient.getBlobClient(blobId).getBlockBlobClient();
        byte[] bytes = file.getBytes();
        ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(bytes);
        blobClient.upload(byteArrayInputStream, bytes.length, true);

        // Create a new Attachment object, set its properties, and save it to the database
        Attachment attachment = new Attachment();
        attachment.setBlobId(blobId);
        attachment.setLink(blobClient.getBlobUrl());
        attachment.setAuctionSession(auction);
        attachment=attachmentRepository.save(attachment);

        // Map the Attachment entity to an AttachmentDTO and return it
        return mapEntityToDTO(attachment);
    }
}

