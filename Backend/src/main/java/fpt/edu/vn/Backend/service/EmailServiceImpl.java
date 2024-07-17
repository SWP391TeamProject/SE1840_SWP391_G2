package fpt.edu.vn.Backend.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;

public class EmailServiceImpl extends JavaMailSenderImpl implements EmailService {
    private final JavaMailSender mailSender;

    public EmailServiceImpl(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }
    @Override
    public void sendAuctionCancellationEmail(String to, String depositAmount) throws MessagingException, MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setTo(to);
        helper.setSubject("Important Update Regarding Our Auction Event");

        String content = "<p>Dear Valued Customer,</p>"
                + "<p>We regret to inform you that due to unforeseen circumstances, we have had to cancel our upcoming auction event.</p>"
                + "<p>We sincerely apologize for any inconvenience this may cause and appreciate your understanding. "
                + "We will be issuing a refund of your deposit of <strong>" + depositAmount + "</strong> promptly.</p>"
                + "<p>Thank you for your continued support. If you have any questions or need further assistance, please do not hesitate to contact us.</p>"
                + "<p>Warm regards,</p>"
                + "<p>Ben Dover<br>CEO<br>Biddify<br></p>";

        helper.setText(content, true);
        super.send(message);
    }


    @Override
    public void send(MimeMessage mimeMessage) throws MailException {
        super.send(mimeMessage);
    }
}
