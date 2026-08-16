package com.nagmani.service;

import com.nagmani.enums.ResourceStatus;
import com.nagmani.model.*;
import com.nagmani.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class EducationServiceImplementation implements EducationService {

    @Autowired private BranchRepository branchRepository;
    @Autowired private SemesterRepository semesterRepository;
    @Autowired private SubjectRepository subjectRepository;
    @Autowired private ResourceRepository resourceRepository;

    @Override
    public Branch createBranch(Branch branch) {
        return branchRepository.save(branch);
    }

    @Override
    public Semester createSemester(Semester semester, Long branchId) {
        Branch branch = branchRepository.findById(branchId)
                .orElseThrow(() -> new RuntimeException("Branch not found with ID: " + branchId));
        semester.setBranch(branch);
        return semesterRepository.save(semester);
    }

    @Override
    public Subject createSubject(Subject subject, Long semesterId) {
        Semester semester = semesterRepository.findById(semesterId)
                .orElseThrow(() -> new RuntimeException("Semester not found with ID: " + semesterId));
        subject.setSemester(semester);
        return subjectRepository.save(subject);
    }

    @Override
    public List<Branch> getAllBranches() {
        return branchRepository.findAll();
    }

    @Override
    public List<Semester> getSemestersByBranch(Long branchId) {
        return semesterRepository.findByBranchIdOrderBySemesterNumberAsc(branchId);
    }

    @Override
    public List<Subject> getSubjectsBySemester(Long semesterId) {
        return subjectRepository.findBySemesterId(semesterId);
    }

    @Override
    public Resource submitResource(Resource resource, Long subjectId, User user) {
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new RuntimeException("Subject not found with ID: " + subjectId));

        resource.setSubject(subject);
        resource.setUploadedBy(user);
        resource.setStatus(ResourceStatus.PENDING);
        resource.setCreatedAt(LocalDateTime.now());
        return resourceRepository.save(resource);
    }

    @Override
    public Resource directUploadResource(Resource resource, Long subjectId, User admin) {
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new RuntimeException("Subject not found with ID: " + subjectId));

        resource.setSubject(subject);
        resource.setUploadedBy(admin);
        resource.setStatus(ResourceStatus.APPROVED);
        resource.setApprovedBy(admin);
        resource.setCreatedAt(LocalDateTime.now());
        resource.setApprovedAt(LocalDateTime.now());
        return resourceRepository.save(resource);
    }

    @Override
    public List<Resource> getApprovedResources(Long subjectId) {
        return resourceRepository.findBySubjectIdAndStatusOrderByCreatedAtDesc(subjectId, ResourceStatus.APPROVED);
    }

    @Override
    public List<Resource> getPendingResources() {
        return resourceRepository.findByStatusOrderByCreatedAtDesc(ResourceStatus.PENDING);
    }

    @Override
    public Resource approveResource(Long resourceId, User admin) {
        Resource resource = resourceRepository.findById(resourceId)
                .orElseThrow(() -> new RuntimeException("Resource not found with ID: " + resourceId));

        resource.setStatus(ResourceStatus.APPROVED);
        resource.setApprovedBy(admin);
        resource.setApprovedAt(LocalDateTime.now());
        return resourceRepository.save(resource);
    }

    @Override
    public Resource rejectResource(Long resourceId, User admin) {
        Resource resource = resourceRepository.findById(resourceId)
                .orElseThrow(() -> new RuntimeException("Resource not found with ID: " + resourceId));

        resource.setStatus(ResourceStatus.REJECTED);
        resource.setApprovedBy(admin);
        return resourceRepository.save(resource);
    }

    @Override
    public void deleteResource(Long resourceId) {
        Resource resource = resourceRepository.findById(resourceId)
                .orElseThrow(() -> new RuntimeException("Resource not found with ID: " + resourceId));
        resourceRepository.delete(resource);
    }
}