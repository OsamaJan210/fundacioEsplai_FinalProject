package com.rubsal.smartflow.service;

import com.rubsal.smartflow.model.SfCategory;

public interface CategoryService {
    
    public String createCategory(SfCategory req);
    public String gatAllCategory();
    public String getById(Integer id);


}
