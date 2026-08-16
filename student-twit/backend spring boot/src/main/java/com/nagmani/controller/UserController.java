package com.nagmani.controller;

import java.util.List;

import com.nagmani.model.Club;
import com.nagmani.model.Like;
import com.nagmani.model.Twit;
import com.nagmani.repository.ClubRepository;
import com.nagmani.repository.LikeRepository;
import com.nagmani.repository.TwitRepository;
import com.nagmani.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.nagmani.dto.UserDto;
import com.nagmani.dto.mapper.UserDtoMapper;
import com.nagmani.exception.UserException;
import com.nagmani.model.User;
import com.nagmani.service.UserService;
import com.nagmani.util.UserUtil;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/users")
@Tag(name="User Management", description = "Endpoints for managing user profiles and information")
public class UserController {

    private UserService userService;
	@Autowired
	private UserRepository userRepository;

	@Autowired
	private ClubRepository clubRepository;

	@Autowired
	private TwitRepository twitRepository; // Add this! (Or MessageRepository if you called it that)

	@Autowired
	private LikeRepository likeRepository; // Add this!
	
	public UserController(UserService userService) {
		this.userService=userService;
	}
	
	@GetMapping("/profile")
	 @Operation(
	            summary = "Get user profile details",
	            description = "REST API to fetch user's profile details based on a jwt"
	    )
	public ResponseEntity<UserDto> getUserProfileHandler(@RequestHeader("Authorization") String jwt) 
			throws UserException{

		User user=userService.findUserProfileByJwt(jwt);
		user.setPassword(null);
		user.setReq_user(true);
		UserDto userDto=UserDtoMapper.toUserDto(user);
		userDto.setReq_user(true);
		return new ResponseEntity<>(userDto,HttpStatus.ACCEPTED);
	}
	
	@GetMapping("/{userId}")
	public ResponseEntity<UserDto> getUserByIdHandler(@PathVariable Long userId, 
			@RequestHeader("Authorization") String jwt) 
			throws UserException{
		
		User reqUser=userService.findUserProfileByJwt(jwt);
		
		User user=userService.findUserById(userId);
		
//		user.setReq_user(UserUtil.isReqUser(reqUser, user));
		
		UserDto userDto=UserDtoMapper.toUserDto(user);
		userDto.setReq_user(UserUtil.isReqUser(reqUser, user));
		userDto.setFollowed(UserUtil.isFollowedByReqUser(reqUser, user));
		return new ResponseEntity<>(userDto,HttpStatus.ACCEPTED);
	}
	
	@GetMapping("/search")
	public ResponseEntity<List<UserDto>> searchUserHandler(@RequestParam String query, 
			@RequestHeader("Authorization") String jwt) 
			throws UserException{
		
		User reqUser=userService.findUserProfileByJwt(jwt);
		
		List<User> users=userService.searchUser(query);
		
//		user.setReq_user(UserUtil.isReqUser(reqUser, user));
		
		List<UserDto> userDtos=UserDtoMapper.toUserDtos(users);
		
		return new ResponseEntity<>(userDtos,HttpStatus.ACCEPTED);
	}
	
	@PutMapping("/update")
	public ResponseEntity<UserDto> updateUserHandler(@RequestBody User req, 
			@RequestHeader("Authorization") String jwt) 
			throws UserException{

		System.out.println("update user  "+req);
		User user=userService.findUserProfileByJwt(jwt);
		
		User updatedUser=userService.updateUser(user.getId(), req);
		updatedUser.setPassword(null);
		UserDto userDto=UserDtoMapper.toUserDto(user);
		userDto.setReq_user(true);
		return new ResponseEntity<>(userDto,HttpStatus.ACCEPTED);
	}
	
	@PutMapping("/{userId}/follow")
	public ResponseEntity<UserDto> followUserHandler(@PathVariable Long userId, @RequestHeader("Authorization") String jwt) 
			throws UserException{
		
		User user=userService.findUserProfileByJwt(jwt);
		
		User updatedUser=userService.followUser(userId, user);
		UserDto userDto=UserDtoMapper.toUserDto(updatedUser);
		userDto.setFollowed(UserUtil.isFollowedByReqUser(user, updatedUser));
		return new ResponseEntity<>(userDto,HttpStatus.ACCEPTED);
	}




	@GetMapping("/admin/all")
	public ResponseEntity<List<User>> getAllUsersForAdmin(@RequestHeader("Authorization") String jwt) throws Exception {

		// First, verify the user making this request is the Admin
		User reqUser = userService.findUserProfileByJwt(jwt);
		boolean isAdmin = reqUser.getRole() != null && reqUser.getRole().toString().equals("ROLE_ADMIN");

		if (!isAdmin) {
			throw new Exception("Only the Admin can view the master user list.");
		}

		// Return the list of all users
		List<User> allUsers = userRepository.findAll();
		return new ResponseEntity<>(allUsers, HttpStatus.OK);
	}

	@DeleteMapping("/admin/{userId}/delete")
	public ResponseEntity<String> deleteUserByAdmin(@PathVariable Long userId, @RequestHeader("Authorization") String jwt) throws Exception {

		User reqUser = userService.findUserProfileByJwt(jwt);
		boolean isAdmin = reqUser.getRole() != null && reqUser.getRole().toString().equals("ROLE_ADMIN");

		if (!isAdmin) {
			throw new Exception("Only the Admin can delete users.");
		}

		User userToDelete = userRepository.findById(userId)
				.orElseThrow(() -> new Exception("User not found"));

		// --- 1. INSTANTLY Detach from Clubs using our new custom queries ---
		clubRepository.removePresidentRole(userId);
		clubRepository.removeVicePresidentRole(userId);

		// --- 2. Delete the user (MySQL will handle their tweets/likes automatically) ---
		userRepository.delete(userToDelete);

		return new ResponseEntity<>("User deleted successfully", HttpStatus.OK);
	}
}
