package com.nagmani.config;

import java.util.Collection;
import java.util.Date;
import java.util.HashSet;
import javax.crypto.SecretKey;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

@Component
public class JwtProvider {

	static SecretKey key = Keys.hmacShaKeyFor(JwtConstant.SECRET_KEY.getBytes());

	public static String generateToken(Authentication auth) {
		Collection<? extends GrantedAuthority> authorities = auth.getAuthorities();
		String roles = populateAuthorities(authorities);

		String jwt = Jwts.builder()
				.setIssuedAt(new Date())
				.setExpiration(new Date(new Date().getTime() + 864000000)) // 10 days
				.claim("email", auth.getName())
				.claim("authorities", roles) // <-- THIS IS CRITICAL: Embeds ROLE_ADMIN into the token
				.signWith(key)
				.compact();
		return jwt;
	}

	public static String getEmailFromJwtToken(String jwt) {
		jwt = jwt.substring(7); // Remove "Bearer "
		Claims claims = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(jwt).getBody();
		return String.valueOf(claims.get("email"));
	}

	public static String populateAuthorities(Collection<? extends GrantedAuthority> collection) {
		HashSet<String> auths = new HashSet<>();
		for (GrantedAuthority authority : collection) {
			auths.add(authority.getAuthority());
		}
		return String.join(",", auths);
	}
}