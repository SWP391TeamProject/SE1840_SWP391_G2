//package fpt.edu.vn.Backend.oauth2.security;
//
//import java.text.ParseException;
//import java.util.Objects;
//import javax.crypto.spec.SecretKeySpec;
//
//import com.nimbusds.jose.JOSEException;
//import fpt.edu.vn.Backend.DTO.request.IntrospectRequest;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
//import org.springframework.security.oauth2.jwt.Jwt;
//import org.springframework.security.oauth2.jwt.JwtDecoder;
//import org.springframework.security.oauth2.jwt.JwtException;
//import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
//import org.springframework.stereotype.Component;
//
//@Component
//public class CustomJwtDecoder implements JwtDecoder {
//    @Value("${jwt.signerKey}")//dang loi cho nay
//    private String signerKey;
//
//    @Autowired
//    private TokenProvider tokenProvider;
//
//    private NimbusJwtDecoder nimbusJwtDecoder = null;
//
//    @Override
//    public Jwt decode(String token) throws JwtException {
//
//        try {
//            var response = tokenProvider.introspect(
//                    IntrospectRequest.builder().token(token).build());
//
//            if (!response.isValid()) throw new JwtException("Token invalid");
//        } catch (JOSEException | ParseException e) {
//            throw new JwtException(e.getMessage());
//        }
//
//        if (Objects.isNull(nimbusJwtDecoder)) {
//            SecretKeySpec secretKeySpec = new SecretKeySpec(signerKey.getBytes(), "HS512");
//            nimbusJwtDecoder = NimbusJwtDecoder.withSecretKey(secretKeySpec)
//                    .macAlgorithm(MacAlgorithm.HS512)
//                    .build();
//        }
//
//        return nimbusJwtDecoder.decode(token);
//    }
//}
