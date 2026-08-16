package com.nagmani.controller;

import com.nagmani.model.*;
import com.nagmani.service.EducationService;
import com.nagmani.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin/education")
@PreAuthorize("hasRole('ADMIN')")
public class AdminEducationController {

    @Autowired private EducationService educationService;
    @Autowired private UserService userService;

    @PostMapping("/branches")
    public ResponseEntity<Branch> createBranch(@RequestBody Branch branch) {
        return ResponseEntity.ok(educationService.createBranch(branch));
    }

    @PostMapping("/branches/{branchId}/semesters")
    public ResponseEntity<Semester> createSemester(@PathVariable Long branchId, @RequestBody Semester semester) {
        return ResponseEntity.ok(educationService.createSemester(semester, branchId));
    }

    @PostMapping("/semesters/{semesterId}/subjects")
    public ResponseEntity<Subject> createSubject(@PathVariable Long semesterId, @RequestBody Subject subject) {
        return ResponseEntity.ok(educationService.createSubject(subject, semesterId));
    }

    @PostMapping("/subjects/{subjectId}/resources")
    public ResponseEntity<Resource> addResourceDirectly(
            @PathVariable Long subjectId,
            @RequestBody Resource resource,
            @RequestHeader("Authorization") String jwt) throws Exception {
        User admin = userService.findUserProfileByJwt(jwt);
        return ResponseEntity.ok(educationService.directUploadResource(resource, subjectId, admin));
    }

    @GetMapping("/resources/pending")
    public ResponseEntity<List<Resource>> getPendingResources() {
        return ResponseEntity.ok(educationService.getPendingResources());
    }

    @PutMapping("/resources/{resourceId}/approve")
    public ResponseEntity<Resource> approveResource(
            @PathVariable Long resourceId,
            @RequestHeader("Authorization") String jwt) throws Exception {
        User admin = userService.findUserProfileByJwt(jwt);
        return ResponseEntity.ok(educationService.approveResource(resourceId, admin));
    }

    @PutMapping("/resources/{resourceId}/reject")
    public ResponseEntity<Resource> rejectResource(
            @PathVariable Long resourceId,
            @RequestHeader("Authorization") String jwt) throws Exception {
        User admin = userService.findUserProfileByJwt(jwt);
        return ResponseEntity.ok(educationService.rejectResource(resourceId, admin));
    }

    @DeleteMapping("/resources/{resourceId}")
    public ResponseEntity<String> deleteResource(@PathVariable Long resourceId) {
        educationService.deleteResource(resourceId);
        return ResponseEntity.ok("Resource deleted successfully");
    }
}