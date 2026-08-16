package com.nagmani.config;

import java.io.IOException;
import java.util.List;
import javax.crypto.SecretKey;
import org.springframework.security.authentication.BadCredentialsException;
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

public class JwtTokenValidator extends OncePerRequestFilter {

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {

		String jwt = request.getHeader(JwtConstant.JWT_HEADER); // "Authorization"

		if (jwt != null) {
			try {
				jwt = jwt.substring(7); // Remove "Bearer "
				SecretKey key = Keys.hmacShaKeyFor(JwtConstant.SECRET_KEY.getBytes());
				Claims claims = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(jwt).getBody();

				String email = String.valueOf(claims.get("email"));
				String authoritiesString = String.valueOf(claims.get("authorities")); // e.g., "ROLE_ADMIN"

				System.out.println("FRONTEND API REQUEST MADE BY: " + email);
				System.out.println("AUTHORITIES SPRING SECURITY SEES: " + authoritiesString);
				List<GrantedAuthority> auths = AuthorityUtils.commaSeparatedStringToAuthorityList(authoritiesString);

				Authentication authentication = new UsernamePasswordAuthenticationToken(email, null, auths);

				// Spring Security now officially knows this request belongs to an ADMIN
				SecurityContextHolder.getContext().setAuthentication(authentication);

			} catch (Exception e) {
				throw new BadCredentialsException("Invalid token... from jwt validator");
			}
		}

		filterChain.doFilter(request, response);
	}
}