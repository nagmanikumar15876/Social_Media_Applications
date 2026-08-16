package com.nagmani.service;

import com.nagmani.model.*;
import java.util.List;

public interface EducationService {
    Branch createBranch(Branch branch);
    Semester createSemester(Semester semester, Long branchId);
    Subject createSubject(Subject subject, Long semesterId);

    List<Branch> getAllBranches();
    List<Semester> getSemestersByBranch(Long branchId);
    List<Subject> getSubjectsBySemester(Long semesterId);

    Resource submitResource(Resource resource, Long subjectId, User user);
    Resource directUploadResource(Resource resource, Long subjectId, User admin);
    List<Resource> getApprovedResources(Long subjectId);

    List<Resource> getPendingResources();
    Resource approveResource(Long resourceId, User admin);
    Resource rejectResource(Long resourceId, User admin);
    void deleteResource(Long resourceId);
}