package fpt.edu.vn.Backend.service;

import com.google.zxing.*;
import com.google.zxing.common.HybridBinarizer;
import fpt.edu.vn.Backend.DTO.CitizenCardDTO;
import fpt.edu.vn.Backend.DTO.request.KycRequestDTO;
import fpt.edu.vn.Backend.pojo.Account;
import fpt.edu.vn.Backend.pojo.CitizenCard;
import fpt.edu.vn.Backend.repository.AccountRepos;
import fpt.edu.vn.Backend.repository.KYCRepos;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

@Service
public class KYCServiceImpl implements KYCService{
    private static final Logger log = LoggerFactory.getLogger(KYCServiceImpl.class);
    @Autowired
    private KYCRepos kycRepos;
    @Autowired
    private AccountRepos accountRepos;

    public BufferedImage multipartToBufferedImage(MultipartFile multipart) throws IOException {

        InputStream is = multipart.getInputStream();
        return ImageIO.read(is);
    }

    public String parseDate(String dateString) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("ddMMyyyy");
        LocalDate date = LocalDate.parse(dateString, formatter);

        DateTimeFormatter outputFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        String formattedDate = date.format(outputFormatter);

        System.out.println(formattedDate);  // Outputs: 2004-05-07
        return formattedDate;
    }

    @Override
    public CitizenCardDTO verifyKyc(KycRequestDTO kycRequestDTO, Authentication authentication) {
        MultiFormatReader multiFormatReader = new MultiFormatReader();

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

        // Use the decoded text from the barcode
        String decodedText = result.getText();
        log.info("Decoded text: {}", decodedText);
        String[] parts = decodedText.split("\\|");
        CitizenCard citizenCard = new CitizenCard();
        citizenCard.setCardId(parts[0]);
        log.info("Card ID: {}", parts[0]);
        citizenCard.setFullName(parts[2]);
        log.info("Full name: {}", parts[2]);
        citizenCard.setBirthday(LocalDate.parse(parseDate(parts[3])));
        log.info("Birthday: {}", parts[3]);
        citizenCard.setAddress(parts[5]);
        log.info("Address: {}", parts[5]);
        citizenCard.setGender(parts[4].equalsIgnoreCase("Nam"));
        ;

        Optional<Account> account = accountRepos.findByEmail(authentication.getName());

        if (account.isPresent()) {
            citizenCard.setAccount(account.get());
        } else {
            log.info("Account not found");
        }

        log.info("Citizen card: {}", citizenCard);
kycRepos.save(citizenCard);
        // Your existing code...

        return null;
    }

}
