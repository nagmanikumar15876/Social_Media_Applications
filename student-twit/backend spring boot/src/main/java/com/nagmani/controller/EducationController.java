package com.nagmani.controller;

import com.nagmani.model.*;
import com.nagmani.service.EducationService;
import com.nagmani.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/education")
public class EducationController {

    @Autowired private EducationService educationService;
    @Autowired private UserService userService;

    @GetMapping("/branches")
    public ResponseEntity<List<Branch>> getBranches() {
        return ResponseEntity.ok(educationService.getAllBranches());
    }

    @GetMapping("/branches/{branchId}/semesters")
    public ResponseEntity<List<Semester>> getSemesters(@PathVariable Long branchId) {
        return ResponseEntity.ok(educationService.getSemestersByBranch(branchId));
    }

    @GetMapping("/semesters/{semesterId}/subjects")
    public ResponseEntity<List<Subject>> getSubjects(@PathVariable Long semesterId) {
        return ResponseEntity.ok(educationService.getSubjectsBySemester(semesterId));
    }

    @GetMapping("/subjects/{subjectId}/resources")
    public ResponseEntity<List<Resource>> getApprovedResources(@PathVariable Long subjectId) {
        return ResponseEntity.ok(educationService.getApprovedResources(subjectId));
    }

    @PostMapping("/subjects/{subjectId}/resources/submit")
    public ResponseEntity<Resource> submitResource(
            @PathVariable Long subjectId,
            @RequestBody Resource resource,
            @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserProfileByJwt(jwt);
        return ResponseEntity.ok(educationService.submitResource(resource, subjectId, user));
    }
}