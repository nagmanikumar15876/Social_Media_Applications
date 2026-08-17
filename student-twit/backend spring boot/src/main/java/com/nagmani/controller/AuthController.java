package com.nagmani.controller;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;

import com.nagmani.config.JwtProvider;
import com.nagmani.enums.UserRole;
import com.nagmani.exception.UserException;
import com.nagmani.model.User;
import com.nagmani.model.Varification;
import com.nagmani.repository.UserRepository;
import com.nagmani.request.LoginRequest;
import com.nagmani.request.LoginWithGooleRequest;
import com.nagmani.response.AuthResponse;
import com.nagmani.service.CustomeUserDetailsServiceImplementation;
import com.nagmani.service.EmailOtpService;

import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Value;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.security.core.userdetails.UserDetails;

import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;
import java.util.UUID;

@RestController
@RequestMapping("/auth")
@Tag(
		name = "Authentication Management",
		description = "Endpoints for user authentication and authorization"
)
public class AuthController {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final JwtProvider jwtProvider;
	private final CustomeUserDetailsServiceImplementation customUserDetails;
	private final EmailOtpService emailOtpService;

	@Value("${app.college.email-domain}")
	private String collegeEmailDomain;

	public AuthController(
			UserRepository userRepository,
			PasswordEncoder passwordEncoder,
			JwtProvider jwtProvider,
			CustomeUserDetailsServiceImplementation customUserDetails,
			EmailOtpService emailOtpService
	) {

		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
		this.jwtProvider = jwtProvider;
		this.customUserDetails = customUserDetails;
		this.emailOtpService = emailOtpService;
	}

	// ==========================================================
	// SIGNUP
	// ==========================================================

	@PostMapping("/signup")
	public ResponseEntity<String> createUserHandler(
			@Valid @RequestBody User user
	) throws UserException {

		String email =
				normalizeEmail(user.getEmail());

		String password =
				user.getPassword();

		String fullName =
				user.getFullName();

		if (fullName == null ||
				fullName.isBlank()) {

			throw new UserException(
					"Full name is required"
			);
		}

		if (password == null ||
				password.isBlank()) {

			throw new UserException(
					"Password is required"
			);
		}

		if (password.length() < 8) {

			throw new UserException(
					"Password must contain at least 8 characters"
			);
		}

		/*
		 * College-only registration.
		 */
		if (!isCollegeEmail(email)) {

			throw new UserException(
					"Only college email addresses are allowed"
			);
		}

		User existingUser =
				userRepository.findByEmail(email);

		/*
		 * Existing unverified account:
		 * send OTP again.
		 */
		if (existingUser != null) {

			if (!existingUser.isEmailVerified()) {

				emailOtpService.sendOtp(
						existingUser
				);

				return ResponseEntity.ok(
						"Account exists but is not verified. " +
								"A new OTP has been sent."
				);
			}

			throw new UserException(
					"Email is already used with another account"
			);
		}

		User createdUser =
				new User();

		createdUser.setFullName(
				fullName.trim()
		);

		createdUser.setEmail(email);

		createdUser.setPassword(
				passwordEncoder.encode(password)
		);

		createdUser.setBirthDate(
				user.getBirthDate()
		);

		/*
		 * NEVER accept role from frontend.
		 */
		createdUser.setRole(
				UserRole.ROLE_USER
		);

		createdUser.setEmailVerified(false);

		createdUser.setLogin_with_google(false);

		/*
		 * Existing premium verification.
		 */
		createdUser.setVerification(
				new Varification()
		);

		User savedUser =
				userRepository.save(createdUser);

		/*
		 * Send OTP.
		 */
		emailOtpService.sendOtp(savedUser);

		/*
		 * IMPORTANT:
		 * Signup does NOT create JWT.
		 */
		return ResponseEntity.ok(
				"Registration successful. " +
						"OTP sent to your college email."
		);
	}

	// ==========================================================
	// VERIFY OTP
	// ==========================================================

	@PostMapping("/verify-otp")
	public ResponseEntity<String> verifyOtp(
			@RequestParam String email,
			@RequestParam String otp
	) throws UserException {

		User user =
				userRepository.findByEmail(
						normalizeEmail(email)
				);

		if (user == null) {

			throw new UserException(
					"User not found"
			);
		}

		emailOtpService.verifyOtp(
				user,
				otp
		);

		return ResponseEntity.ok(
				"College email verified successfully. " +
						"You can now sign in."
		);
	}

	// ==========================================================
	// RESEND OTP
	// ==========================================================

	@PostMapping("/resend-otp")
	public ResponseEntity<String> resendOtp(
			@RequestParam String email
	) throws UserException {

		User user =
				userRepository.findByEmail(
						normalizeEmail(email)
				);

		if (user == null) {

			throw new UserException(
					"User not found"
			);
		}

		emailOtpService.sendOtp(user);

		return ResponseEntity.ok(
				"A new OTP has been sent to your college email."
		);
	}

	// ==========================================================
	// NORMAL SIGNIN
	// ==========================================================

	@PostMapping("/signin")
	public ResponseEntity<AuthResponse> signin(
			@RequestBody LoginRequest loginRequest
	) {

		String username =
				normalizeEmail(
						loginRequest.getEmail()
				);

		String password =
				loginRequest.getPassword();

		if (password == null ||
				password.isBlank()) {

			throw new BadCredentialsException(
					"Password is required"
			);
		}

		Authentication authentication =
				authenticate(
						username,
						password
				);

		SecurityContextHolder
				.getContext()
				.setAuthentication(authentication);

		/*
		 * JWT IS CREATED HERE.
		 */
		String token =
				jwtProvider.generateToken(
						authentication
				);

		AuthResponse response =
				new AuthResponse();

		response.setStatus(true);
		response.setJwt(token);

		return new ResponseEntity<>(
				response,
				HttpStatus.OK
		);
	}

	private Authentication authenticate(
			String username,
			String password
	) {

		UserDetails userDetails =
				customUserDetails
						.loadUserByUsername(
								username
						);

		if (!passwordEncoder.matches(
				password,
				userDetails.getPassword()
		)) {

			throw new BadCredentialsException(
					"Invalid username or password"
			);
		}

		return new UsernamePasswordAuthenticationToken(
				userDetails,
				null,
				userDetails.getAuthorities()
		);
	}

	// ==========================================================
	// GOOGLE LOGIN
	// ==========================================================

	@PostMapping("/signin/google")
	public ResponseEntity<AuthResponse> googleLogin(
			@RequestBody LoginWithGooleRequest request
	) throws GeneralSecurityException, IOException {

		User googleUser =
				validateGoogleIdToken(request);

		String email =
				normalizeEmail(
						googleUser.getEmail()
				);

		User existingUser =
				userRepository.findByEmail(email);

		if (existingUser == null) {

			existingUser =
					new User();

			existingUser.setEmail(email);

			existingUser.setFullName(
					googleUser.getFullName()
			);

			existingUser.setImage(
					googleUser.getImage()
			);

			existingUser.setLogin_with_google(true);

			/*
			 * No normal password login for Google account.
			 */
			existingUser.setPassword(
					passwordEncoder.encode(
							UUID.randomUUID()
									.toString()
					)
			);

			existingUser.setRole(
					UserRole.ROLE_USER
			);

			/*
			 * Google has already authenticated
			 * ownership of the Google email.
			 */
			existingUser.setEmailVerified(true);

			existingUser.setVerification(
					new Varification()
			);

			existingUser =
					userRepository.save(
							existingUser
					);

		} else {

			/*
			 * Don't silently turn password account
			 * into Google account.
			 */
			if (!existingUser.isLogin_with_google()) {

				throw new BadCredentialsException(
						"An account already exists with this email. " +
								"Please sign in using email and password."
				);
			}

			existingUser.setEmailVerified(true);

			userRepository.save(existingUser);
		}

		/*
		 * Get the real role from database.
		 */
		UserDetails userDetails =
				customUserDetails
						.loadUserByUsernameForGoogle(
								email
						);

		Authentication authentication =
				new UsernamePasswordAuthenticationToken(
						userDetails,
						null,
						userDetails.getAuthorities()
				);

		SecurityContextHolder
				.getContext()
				.setAuthentication(
						authentication
				);

		/*
		 * Google login ALSO receives JWT.
		 */
		String token =
				jwtProvider.generateToken(
						authentication
				);

		AuthResponse response =
				new AuthResponse();

		response.setStatus(true);
		response.setJwt(token);

		return ResponseEntity.ok(response);
	}

	// ==========================================================
	// GOOGLE TOKEN VALIDATION
	// ==========================================================

	private User validateGoogleIdToken(
			LoginWithGooleRequest request
	) throws GeneralSecurityException, IOException {

		if (request.getCredential() == null ||
				request.getCredential().isBlank()) {

			throw new BadCredentialsException(
					"Google credential is required"
			);
		}

		if (request.getClientId() == null ||
				request.getClientId().isBlank()) {

			throw new BadCredentialsException(
					"Google client ID is required"
			);
		}

		HttpTransport transport =
				new NetHttpTransport();

		JacksonFactory jsonFactory =
				JacksonFactory.getDefaultInstance();

		GoogleIdTokenVerifier verifier =
				new GoogleIdTokenVerifier.Builder(
						transport,
						jsonFactory
				)
						.setAudience(
								Collections.singletonList(
										request.getClientId()
								)
						)
						.build();

		GoogleIdToken token =
				verifier.verify(
						request.getCredential()
				);

		if (token == null) {

			throw new BadCredentialsException(
					"Invalid Google ID token"
			);
		}

		Payload payload =
				token.getPayload();

		String email =
				payload.getEmail();

		boolean emailVerified =
				Boolean.TRUE.equals(
						payload.getEmailVerified()
				);

		if (!emailVerified) {

			throw new BadCredentialsException(
					"Google email is not verified"
			);
		}

		email =
				normalizeEmail(email);

		/*
		 * GOOGLE LOGIN IS ALSO COLLEGE ONLY.
		 */
		if (!isCollegeEmail(email)) {

			throw new BadCredentialsException(
					"Only college Google accounts are allowed"
			);
		}

		User user =
				new User();

		user.setEmail(email);

		user.setFullName(
				(String) payload.get("name")
		);

		user.setImage(
				(String) payload.get("picture")
		);

		user.setPassword(
				payload.getSubject()
		);

		return user;
	}

	// ==========================================================
	// HELPERS
	// ==========================================================

	private String normalizeEmail(
			String email
	) {

		if (email == null ||
				email.isBlank()) {

			throw new BadCredentialsException(
					"Email is required"
			);
		}

		return email
				.trim()
				.toLowerCase();
	}

	private boolean isCollegeEmail(
			String email
	) {

		return email != null &&
				email.toLowerCase()
						.endsWith(
								collegeEmailDomain
										.toLowerCase()
						);
	}
}