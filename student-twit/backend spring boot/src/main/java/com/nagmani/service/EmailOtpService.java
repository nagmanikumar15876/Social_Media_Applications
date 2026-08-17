package com.nagmani.service;

import com.nagmani.exception.UserException;
import com.nagmani.model.User;
import com.nagmani.repository.UserRepository;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Base64;

@Service
public class EmailOtpService {

    private static final int OTP_EXPIRY_MINUTES = 10;
    private static final int MAX_OTP_ATTEMPTS = 5;
    private static final int RESEND_COOLDOWN_SECONDS = 60;

    private final UserRepository userRepository;
    private final JavaMailSender mailSender;

    private final SecureRandom secureRandom =
            new SecureRandom();

    public EmailOtpService(
            UserRepository userRepository,
            JavaMailSender mailSender
    ) {
        this.userRepository = userRepository;
        this.mailSender = mailSender;
    }

    private String generateOtp() {

        return String.format(
                "%06d",
                secureRandom.nextInt(1_000_000)
        );
    }

    private String hashOtp(String otp) {

        try {

            MessageDigest digest =
                    MessageDigest.getInstance("SHA-256");

            byte[] hash =
                    digest.digest(
                            otp.getBytes(
                                    StandardCharsets.UTF_8
                            )
                    );

            return Base64.getEncoder()
                    .encodeToString(hash);

        } catch (Exception e) {

            throw new IllegalStateException(
                    "Unable to hash OTP",
                    e
            );
        }
    }

    @Transactional
    public void sendOtp(User user)
            throws UserException {

        if (user.isEmailVerified()) {

            throw new UserException(
                    "Email is already verified"
            );
        }

        LocalDateTime now =
                LocalDateTime.now();

        if (user.getLastOtpSentAt() != null) {

            long seconds =
                    Duration.between(
                            user.getLastOtpSentAt(),
                            now
                    ).getSeconds();

            if (seconds < RESEND_COOLDOWN_SECONDS) {

                long remaining =
                        RESEND_COOLDOWN_SECONDS -
                                seconds;

                throw new UserException(
                        "Please wait " +
                                remaining +
                                " seconds before requesting another OTP"
                );
            }
        }

        String otp = generateOtp();

        /*
         * Store only hashed OTP.
         */
        user.setEmailOtpHash(
                hashOtp(otp)
        );

        user.setEmailOtpExpiry(
                now.plusMinutes(
                        OTP_EXPIRY_MINUTES
                )
        );

        user.setEmailOtpAttempts(0);
        user.setLastOtpSentAt(now);

        userRepository.save(user);

        sendEmail(
                user.getEmail(),
                user.getFullName(),
                otp
        );
    }

    private void sendEmail(
            String email,
            String fullName,
            String otp
    ) {

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setTo(email);

        message.setSubject(
                "CampusConnect - College Email Verification"
        );

        message.setText(
                "Hello " + fullName + ",\n\n" +

                        "Welcome to CampusConnect.\n\n" +

                        "Your email verification OTP is:\n\n" +

                        otp + "\n\n" +

                        "This OTP will expire in " +
                        OTP_EXPIRY_MINUTES +
                        " minutes.\n\n" +

                        "You have a maximum of " +
                        MAX_OTP_ATTEMPTS +
                        " attempts.\n\n" +

                        "Please do not share this OTP with anyone.\n\n" +

                        "Regards,\n" +
                        "CampusConnect Team"
        );

        mailSender.send(message);
    }

    @Transactional
    public void verifyOtp(
            User user,
            String otp
    ) throws UserException {

        if (user.isEmailVerified()) {

            throw new UserException(
                    "Email is already verified"
            );
        }

        if (user.getEmailOtpHash() == null ||
                user.getEmailOtpExpiry() == null) {

            throw new UserException(
                    "No active OTP found. Please request a new OTP."
            );
        }

        if (user.getEmailOtpExpiry()
                .isBefore(LocalDateTime.now())) {

            clearOtp(user);
            userRepository.save(user);

            throw new UserException(
                    "OTP has expired. Please request a new OTP."
            );
        }

        if (user.getEmailOtpAttempts()
                >= MAX_OTP_ATTEMPTS) {

            clearOtp(user);
            userRepository.save(user);

            throw new UserException(
                    "Too many incorrect attempts. Please request a new OTP."
            );
        }

        if (otp == null ||
                !otp.matches("\\d{6}")) {

            throw new UserException(
                    "OTP must contain exactly 6 digits"
            );
        }

        String submittedHash =
                hashOtp(otp);

        boolean matches =
                MessageDigest.isEqual(
                        submittedHash.getBytes(
                                StandardCharsets.UTF_8
                        ),
                        user.getEmailOtpHash()
                                .getBytes(
                                        StandardCharsets.UTF_8
                                )
                );

        if (!matches) {

            user.setEmailOtpAttempts(
                    user.getEmailOtpAttempts() + 1
            );

            userRepository.save(user);

            int remaining =
                    MAX_OTP_ATTEMPTS -
                            user.getEmailOtpAttempts();

            throw new UserException(
                    "Invalid OTP. " +
                            Math.max(remaining, 0) +
                            " attempts remaining."
            );
        }

        /*
         * Successful verification.
         */
        user.setEmailVerified(true);

        clearOtp(user);

        userRepository.save(user);
    }

    private void clearOtp(User user) {

        user.setEmailOtpHash(null);
        user.setEmailOtpExpiry(null);
        user.setEmailOtpAttempts(0);
    }
}