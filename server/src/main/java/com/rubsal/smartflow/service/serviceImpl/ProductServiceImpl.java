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
    @Override
    public String updateProduct(SfProduct req){
        try{
        List<SfProduct> local=productRepo.findAllById(req.getId());
        System.out.println("Osama JAn 35"+local.size());
        if (local.size()>0) {
            ;
            req.setBranchId(local.get(0).getBranchId());
            req.setBusinessId(local.get(0).getBusinessId());
        }

            productRepo.save(req);
            return general.buildResponseOutput(Constants.SUCCESS, Constants.TRANSACTION_SUCCESSFUL).toString();

        }catch(Exception ex){
        return general.buildResponseOutput(Constants.FAIL, ex.getMessage()).toString();

        }
    }
    @Override
    public List<SfProduct> getallByCategory(Integer id){
        List<SfProduct> local=productRepo.findAllByCategoryId(id);
        return local;

    }
    @Override
    public List<SfProduct> gatAllProduct(Integer id){
        List<SfProduct> products=productRepo.findAllByBusinessId(id);
        System.out.println("Osama Heere"+products.size());
        return products;

    }
    @Override
    public List<SfProduct> getById(Integer id){
        List<SfProduct> local=productRepo.findAllById(id);
        System.out.println("OSama Here "+local.size());
        return local;

    }

    
}
