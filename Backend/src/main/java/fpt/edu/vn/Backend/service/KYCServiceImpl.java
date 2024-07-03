package fpt.edu.vn.Backend.service;

import com.google.zxing.*;
import com.google.zxing.common.HybridBinarizer;
import fpt.edu.vn.Backend.DTO.CitizenCardDTO;
import fpt.edu.vn.Backend.DTO.internalDTO.CitizenCardFrontFace;
import fpt.edu.vn.Backend.DTO.internalDTO.citizencardBackImage.CitizenCardBackFace;
import fpt.edu.vn.Backend.DTO.request.KycRequestDTO;
import fpt.edu.vn.Backend.exception.InvalidInputException;
import fpt.edu.vn.Backend.pojo.Account;
import fpt.edu.vn.Backend.pojo.CitizenCard;
import fpt.edu.vn.Backend.repository.AccountRepos;
import fpt.edu.vn.Backend.repository.KYCRepos;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

@Service
public class KYCServiceImpl implements KYCService {
    private static final Logger log = LoggerFactory.getLogger(KYCServiceImpl.class);
    private KYCRepos kycRepos;
    private AccountRepos accountRepos;
    @Value("${FPT_AI_API_KEY}")
    private  String API_KEY_FRONT_FACE ;

    public KYCServiceImpl(KYCRepos kycRepos, AccountRepos accountRepos) {
        this.kycRepos = kycRepos;
        this.accountRepos = accountRepos;
    }

    public BufferedImage multipartToBufferedImage(MultipartFile multipart) throws IOException {

        InputStream is = multipart.getInputStream();
        return ImageIO.read(is);
    }

    public String parseDate(String dateString) {
        // Adjusted pattern to match the input string format
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        LocalDate date = LocalDate.parse(dateString, formatter);

        DateTimeFormatter outputFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        String formattedDate = date.format(outputFormatter);

        System.out.println(formattedDate);  // Outputs: 2004-05-07
        return formattedDate;
    }

    public boolean validateImage(MultipartFile imageFile) throws IOException {
        // Check if the image file size is less than or equal to 5 MB
        final long maxFileSize = 5 * 1024 * 1024; // 5 MB in bytes
        if (imageFile.getSize() > maxFileSize) {
            throw new InvalidInputException("Image file size is too large. Maximum allowed size is 5 MB.");
        }

        // Convert MultipartFile to BufferedImage to check resolution
        BufferedImage image = multipartToBufferedImage(imageFile);
        if (image == null) {
            log.info("Failed to convert image file to BufferedImage.");
            return false;
        }


        // Check if the image resolution is at least 640x480 pixels
        if (image.getWidth() < 640 || image.getHeight() < 480) {
            log.info("Image resolution is below the minimum requirement of 640x480 pixels.");
            throw new InvalidInputException("Image resolution is below the minimum requirement of 640x480 pixels.");
        }

        return true; // Image passes all validations
    }
    public CitizenCardFrontFace verifyFrontFaceImage(MultipartFile fronfaceImage) {
        MultipartBodyBuilder bodyBuilder = new MultipartBodyBuilder();
        try {

            bodyBuilder.part("image", fronfaceImage.getBytes())
                    .header("Content-Disposition", "form-data; name=image; filename=\"" + fronfaceImage.getOriginalFilename() + "\"");

            WebClient client = WebClient.builder()
                    .baseUrl("https://api.fpt.ai/vision/idr/vnm")
                    .defaultHeader("api-key", API_KEY_FRONT_FACE)
                    .build();

            CitizenCardFrontFace response = client.post()
                    .contentType(MediaType.MULTIPART_FORM_DATA)
                    .body(BodyInserters.fromMultipartData(bodyBuilder.build()))
                    .retrieve()
                    .bodyToMono(CitizenCardFrontFace.class)
                    .block();
            return response;
        } catch (Exception e) {
            log.info("Error: {}", e.getMessage());
        }

        return null;
    }

    public CitizenCardBackFace verifyBackFaceImage(MultipartFile backFaceImage) {
        MultipartBodyBuilder bodyBuilder = new MultipartBodyBuilder();
        try {

            bodyBuilder.part("image", backFaceImage.getBytes())
                    .header("Content-Disposition", "form-data; name=image; filename=\"" + backFaceImage.getOriginalFilename() + "\"");

            WebClient client = WebClient.builder()
                    .baseUrl("https://api.fpt.ai/vision/idr/vnm")
                    .defaultHeader("api-key", API_KEY_FRONT_FACE)
                    .build();

            CitizenCardBackFace response = client.post()
                    .contentType(MediaType.MULTIPART_FORM_DATA)
                    .body(BodyInserters.fromMultipartData(bodyBuilder.build()))
                    .retrieve()
                    .bodyToMono(CitizenCardBackFace.class)
                    .block();
            return response;
        } catch (Exception e) {
            log.info("Error: {}", e.getMessage());
        }

        return null;
    }

    @Override
    public CitizenCardDTO verifyKyc(KycRequestDTO kycRequestDTO, Authentication authentication) throws IOException {

        if(!validateImage(kycRequestDTO.getFrontImage())){
            return null;
        }
        if(!validateImage(kycRequestDTO.getBackImage())){
            return null;
        }
        if(!validateImage(kycRequestDTO.getBackImage())){
            return null;
        }
        BufferedImage image = null;
        BinaryBitmap bitmap = null;
        Result result = null;
        try {
            image = multipartToBufferedImage(kycRequestDTO.getFrontImage());
            int[] pixels = image.getRGB(0, 0, image.getWidth(), image.getHeight(), null, 0, image.getWidth());
            RGBLuminanceSource source = new RGBLuminanceSource(image.getWidth(), image.getHeight(), pixels);
            bitmap = new BinaryBitmap(new HybridBinarizer(source));
        } catch (IOException e) {
            e.printStackTrace();
            log.info("Error reading image");
        }
        if (bitmap == null)
            return null;
        MultiFormatReader barcodeReader = new MultiFormatReader();
        try {
            result = barcodeReader.decode(bitmap);
        } catch (NotFoundException e) {
            log.info("Barcode not found");
            e.printStackTrace();
        }
        String decodedText = result. getText();
        log.info("Decoded text: {}", decodedText);
        if (!decodedText.isEmpty()) {
            if(kycRepos.findByCardId(decodedText.strip().split("\\|")[0]) != null){
                log.info("Card ID already exists");
                throw new InvalidInputException("Citizen card already exists, please try again with a different card ID.");
            }
            CitizenCardFrontFace  cardFrontFace = verifyFrontFaceImage(kycRequestDTO.getFrontImage());

            CitizenCardBackFace cardBackFace = verifyBackFaceImage(kycRequestDTO.getBackImage());
            if(cardFrontFace == null || cardBackFace == null){
                log.info("Error verifying image");
                return null;
            }
            if(!cardFrontFace.getData().get(0).getId().equalsIgnoreCase(cardBackFace.getData().get(0).getMrzDetails().getId()))
                throw new InvalidInputException("Citizen card ID does not match, please try again with a different card ID.");
            String[] parts = decodedText.split("\\|");
            CitizenCard citizenCard = new CitizenCard();
            citizenCard.setCardId(cardFrontFace.getData().get(0).getId());
            citizenCard.setFullName(cardFrontFace.getData().get(0).getName());
            citizenCard.setBirthday(LocalDate.parse(parseDate(cardFrontFace.getData().get(0).getDob())));
            citizenCard.setAddress(cardFrontFace.getData().get(0).getAddress());
            citizenCard.setGender(cardFrontFace.getData().get(0).getSex().equalsIgnoreCase("Nam"));
            Optional<Account> account = accountRepos.findByEmail(authentication.getName());
            if (account.isPresent()) {
                citizenCard.setAccount(account.get());
            } else {
                log.info("Account not found");
            }
            log.info("Citizen card: {}", citizenCard);
            kycRepos.save(citizenCard);
        }
        return null;
    }

}
