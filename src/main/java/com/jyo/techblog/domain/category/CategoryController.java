package com.jyo.techblog.domain.category;

import com.jyo.techblog.domain.category.dto.CategoryRequest;
import com.jyo.techblog.domain.category.dto.CategoryResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    /**
     * 모든 카테고리 목록 (공개)
     */
    @GetMapping
    public ResponseEntity<List<CategoryResponse>> getCategories() {
        return ResponseEntity.ok(categoryService.getCategories());
    }

    /**
     * 카테고리 생성 (ADMIN 전용)
     */
    @PostMapping
    public ResponseEntity<CategoryResponse> createCategory(
            Authentication authentication,
            @Valid @RequestBody CategoryRequest request
    ) {
        if (!isAdmin(authentication)) {
            throw new AccessDeniedException("카테고리 생성 권한이 없습니다.");
        }

        CategoryResponse response = categoryService.createCategory(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * 카테고리 수정 (ADMIN 전용)
     */
    @PutMapping("/{id}")
    public ResponseEntity<CategoryResponse> updateCategory(
            Authentication authentication,
            @PathVariable Long id,
            @Valid @RequestBody CategoryRequest request
    ) {
        if (!isAdmin(authentication)) {
            throw new AccessDeniedException("카테고리 수정 권한이 없습니다.");
        }

        CategoryResponse response = categoryService.updateCategory(id, request);
        return ResponseEntity.ok(response);
    }

    /**
     * 카테고리 삭제 (ADMIN 전용)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(
            Authentication authentication,
            @PathVariable Long id
    ) {
        if (!isAdmin(authentication)) {
            throw new AccessDeniedException("카테고리 삭제 권한이 없습니다.");
        }

        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }

    private boolean isAdmin(Authentication authentication) {
        return authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(auth -> auth.equals("ROLE_ADMIN"));
    }
}
