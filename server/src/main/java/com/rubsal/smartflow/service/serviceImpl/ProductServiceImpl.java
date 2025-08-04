package com.rubsal.smartflow.service.serviceImpl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.rubsal.smartflow.model.SfCategory;
import com.rubsal.smartflow.model.SfProduct;
import com.rubsal.smartflow.repository.ProductRepo;
import com.rubsal.smartflow.service.ProductService;
import com.rubsal.smartflow.utils.Constants;
import com.rubsal.smartflow.utils.General;

import lombok.AllArgsConstructor;
@Service("ProductService")
@AllArgsConstructor
public class ProductServiceImpl implements ProductService{
    private final ProductRepo productRepo;
    private final General general;
    @Override
    public String createProduct(SfProduct req){
        try{
            productRepo.save(req);
            return general.buildResponseOutput(Constants.SUCCESS, Constants.TRANSACTION_SUCCESSFUL).toString();

        }catch(Exception ex){
        return general.buildResponseOutput(Constants.FAIL, ex.getMessage()).toString();

        }
    }
    // @Override
    // public String getallByCategory(Integer id){
    //     List<SfCategory> category=categoryRepo.findAllById(id);
    //     return general.buildResponseObject(category).toString();

    // }

    
}
