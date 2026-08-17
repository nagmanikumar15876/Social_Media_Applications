package com.nagmani.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.nagmani.enums.UserRole;
import com.nagmani.model.User;
import com.nagmani.repository.UserRepository;

@Service
public class CustomeUserDetailsServiceImplementation
		implements UserDetailsService {

	private final UserRepository userRepository;

	public CustomeUserDetailsServiceImplementation(
			UserRepository userRepository
	) {
		this.userRepository = userRepository;
	}

	/*
	 * Normal email/password login.
	 */
	@Override
	public UserDetails loadUserByUsername(
			String username
	) throws UsernameNotFoundException {

		User user =
				userRepository.findByEmail(
						username
				);

		if (user == null) {

			throw new UsernameNotFoundException(
					"User not found with email " +
							username
			);
		}

		if (user.isLogin_with_google()) {

			throw new UsernameNotFoundException(
					"Please use Google login"
			);
		}

		if (!user.isEmailVerified()) {

			throw new UsernameNotFoundException(
					"Please verify your college email first"
			);
		}

		return buildUserDetails(user);
	}

	/*
	 * Google login.
	 */
	public UserDetails loadUserByUsernameForGoogle(
			String username
	) throws UsernameNotFoundException {

		User user =
				userRepository.findByEmail(
						username
				);

		if (user == null) {

			throw new UsernameNotFoundException(
					"User not found with email " +
							username
			);
		}

		return buildUserDetails(user);
	}

	private UserDetails buildUserDetails(
			User user
	) {

		UserRole role =
				user.getRole();

		if (role == null) {
			role = UserRole.ROLE_USER;
		}

		List<GrantedAuthority> authorities =
				new ArrayList<>();

		authorities.add(
				new SimpleGrantedAuthority(
						role.name()
				)
		);

		return new org.springframework.security.core.userdetails.User(
				user.getEmail(),
				user.getPassword(),
				authorities
		);
	}
}