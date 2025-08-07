package com.rubsal.smartflow.service;

import java.util.List;

import com.rubsal.smartflow.model.SfCategory;
import com.rubsal.smartflow.model.SfProduct;

public interface ProductService {
        public String createProduct(SfProduct req);
        public String updateProduct(SfProduct req);
        public List<SfProduct> getallByCategory(Integer id);
        public List<SfProduct> getById(Integer id);
        public List<SfProduct> gatAllProduct(Integer businessId);


}
