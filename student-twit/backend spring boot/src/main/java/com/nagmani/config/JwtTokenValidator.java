package com.nagmani.config;

import java.io.IOException;
import java.util.List;

import javax.crypto.SecretKey;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class JwtTokenValidator
		extends OncePerRequestFilter {

	@Override
	protected void doFilterInternal(
			HttpServletRequest request,
			HttpServletResponse response,
			FilterChain filterChain
	) throws ServletException, IOException {

		/*
		 * Authentication endpoints don't need JWT.
		 */
		String uri =
				request.getRequestURI();

		if (uri.startsWith("/auth/")) {

			filterChain.doFilter(
					request,
					response
			);

			return;
		}

		String header =
				request.getHeader(
						JwtConstant.JWT_HEADER
				);

		/*
		 * No JWT:
		 * continue. Spring Security will decide
		 * whether this endpoint needs authentication.
		 */
		if (header == null ||
				header.isBlank()) {

			filterChain.doFilter(
					request,
					response
			);

			return;
		}

		/*
		 * Only process Bearer tokens.
		 */
		if (!header.startsWith("Bearer ")) {

			filterChain.doFilter(
					request,
					response
			);

			return;
		}

		String jwt =
				header.substring(7).trim();

		if (jwt.isEmpty()) {

			filterChain.doFilter(
					request,
					response
			);

			return;
		}

		try {

			SecretKey key =
					Keys.hmacShaKeyFor(
							JwtConstant.SECRET_KEY
									.getBytes()
					);

			Claims claims =
					Jwts.parserBuilder()
							.setSigningKey(key)
							.build()
							.parseClaimsJws(jwt)
							.getBody();

			String email =
					claims.get(
							"email",
							String.class
					);

			String authoritiesString =
					claims.get(
							"authorities",
							String.class
					);

			if (email != null &&
					!email.isBlank()) {

				List<GrantedAuthority> authorities =
						AuthorityUtils
								.commaSeparatedStringToAuthorityList(
										authoritiesString == null
												? ""
												: authoritiesString
								);

				Authentication authentication =
						new UsernamePasswordAuthenticationToken(
								email,
								null,
								authorities
						);

				SecurityContextHolder
						.getContext()
						.setAuthentication(
								authentication
						);
			}

		} catch (Exception e) {

			/*
			 * Invalid/expired JWT.
			 *
			 * Clear authentication and continue.
			 * Protected endpoints will subsequently
			 * return 401/403 through Spring Security.
			 */
			SecurityContextHolder
					.clearContext();
		}

		filterChain.doFilter(
				request,
				response
		);
	}
}